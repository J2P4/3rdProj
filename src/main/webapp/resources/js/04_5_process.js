// /resources/js/04_2_process.js
document.addEventListener('DOMContentLoaded', () => {
  // ===== 공통 DOM =====
  const tableBody  = document.querySelector('.table tbody');
  const detail     = document.getElementById('slide-detail');
  const slideInput = document.getElementById('slide-input');
  const titleEl    = detail?.querySelector('.silde-title h2');

  const ctx = (typeof contextPath === 'string') ? contextPath : '';
  const detailApi = `${ctx}/processlist/detail`;  // 컨트롤러 고정
  const saveUrl   = `${ctx}/processlist/update`;  // TODO: 백엔드 규약 확정 시 확장

  // ===== 유틸 =====
  const text   = (el) => (el ? el.textContent.trim() : '');
  const setHTML = (el, html) => { if (el) el.innerHTML = html; };
  const qs     = (sel, root=document) => root.querySelector(sel);
  const qsa    = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const fmt    = (v) => (v ?? '');
  const fmtDate= (v) => (v ? String(v).slice(0,10) : '');

  // ===== 상세 영역 채우기 (배열/단건 모두 지원) =====
  async function fillprocessDetail(slide, payload = {}) {
    if (!slide) return;

    const arr  = Array.isArray(payload) ? payload : [payload];
    const head = arr[0] || {};

    // 키 표준화 (매퍼 selectprocessOne의 다양한 표기 흡수)
    const norm = {
      process_id:              head.process_id ?? head.id ?? '',
      process_payment_date:    head.process_payment_date ?? head.process_payment_day ?? '',
      process_payment_duedate: head.process_payment_duedate ?? head.process_payment_due_date ?? '',
      process_receive_date:    head.process_receive_date ?? head.process_receivement_date ?? '',
      process_receive_duedate: head.process_receive_duedate ?? head.process_receive_due_date ?? '',
      process_amount:          head.process_amount ?? '',
      process_date:            head.process_date ?? '',
      worker_id:             head.worker_id ?? '',
      item_id:               head.item_id ?? head.item_item ?? '' // item_item 대응
    };

    // 상단 발주 ID
    setHTML(qs('#d-process_id_head', slide), fmt(norm.process_id));

    // 9개 요약 필드
    setHTML(qs('#d-process_payment_date', slide),    fmt(norm.process_payment_date));
    setHTML(qs('#d-process_payment_duedate', slide), fmt(norm.process_payment_duedate));
    setHTML(qs('#d-process_receive_date', slide),    fmt(norm.process_receive_date));
    setHTML(qs('#d-process_receive_duedate', slide), fmt(norm.process_receive_duedate));
    setHTML(qs('#d-process_amount', slide),          fmt(norm.process_amount));
    setHTML(qs('#d-process_date', slide),            fmt(norm.process_date));
    setHTML(qs('#d-worker_id', slide),             fmt(norm.worker_id));
    setHTML(qs('#d-item_id', slide),               fmt(norm.item_id));

    // 품목 라인 렌더 (여러 건)
    const linesTbody = qs('#d-lines', slide);
    if (linesTbody) {
      linesTbody.innerHTML = arr.map(row => {
        const item_id = row.item_id ?? row.item_item ?? '';
        const amount  = row.process_amount ?? '';
        const odate   = row.process_date ?? '';
        return `<tr>
          <td>${fmt(item_id)}</td>
          <td>${fmt(amount)}</td>
          <td>${fmtDate(odate)}</td>
        </tr>`;
      }).join('');
    }
  }

  // ===== 상태 =====
  const state = { mode: 'view', backup: {} };

  function enterEdit() {
    if (!detail || state.mode === 'edit') return;
    state.mode = 'edit';
    if (titleEl) titleEl.textContent = '발주 수정';
    state.backup = {};
  }

  function exitEdit(/*restore*/) {
    if (!detail || state.mode !== 'edit') return;
    state.mode = 'view';
    if (titleEl) titleEl.textContent = '발주 상세';
  }

  // ===== 상세 열기 =====
  async function openDetail(process_id) {
    // 컨트롤러는 process_id 파라미터를 요구함 (List<processDTO> 반환)
    const url = `${detailApi}?process_id=${encodeURIComponent(process_id)}`;

    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const raw = await res.text();
      if (!res.ok) throw new Error(`detail ${res.status}: ${raw || ''}`);
      let data = raw ? JSON.parse(raw) : {};

      // 방어: 단건이면 객체, 다건이면 배열 → fill에서 모두 처리
      await fillprocessDetail(detail, data);
    } catch (e) {
      // 최소한 ID만이라도 표시
      await fillprocessDetail(detail, [{ process_id }]);
      console.warn('detail 폴백 표시:', e);
    }

    detail.classList.add('open');
    state.mode = 'view';
    if (titleEl) titleEl.textContent = '발주 상세';
    return { process_id };
  }

  // ===== 목록 행 갱신 (필요시) =====
  function updateTableRow(process_id, dto) {
    const rows = qsa('.table tbody tr');
    const tr = rows.find(r => (r.cells?.[1]?.textContent || '').trim() === String(process_id));
    if (!tr) return;
    const tds = tr.querySelectorAll('td'); // [chk, id, item, qty, client, worker, date]
    if (tds[1]) tds[1].textContent = dto.process_id ?? process_id;
    if (tds[2]) tds[2].textContent = dto.item_id ?? tds[2].textContent;
    if (tds[3]) tds[3].textContent = dto.process_amount ?? tds[3].textContent;
    if (tds[4]) tds[4].textContent = dto.client_id ?? tds[4].textContent;
    if (tds[5]) tds[5].textContent = dto.worker_id ?? tds[5].textContent;
    if (tds[6]) tds[6].textContent = fmtDate(dto.process_date) || tds[6].textContent;
  }

  // ===== 저장 (추후 확장 대비) =====
  async function saveEdit() {
    if (!detail) return;
    const process_id = text(qs('#d-process_id_head', detail));
    if (!process_id) { alert('발주 ID가 없습니다.'); return; }

    const body = new URLSearchParams();
    body.set('process_id', process_id);

    try {
      const res = await fetch(saveUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Accept': 'application/json'
        },
        body: body.toString()
      });
      const raw = await res.text();
      if (!res.ok) throw new Error(`update ${res.status}: ${raw}`);
      const saved = raw ? JSON.parse(raw) : { process_id };
      const fresh = await openDetail(saved.process_id || process_id);
      updateTableRow(saved.process_id || process_id, fresh);
      alert('저장되었습니다.');
    } catch (e) {
      console.error('update error', e);
      alert('저장 중 오류가 발생했습니다.');
    }
  }

  // ===== 버튼 이벤트(상세) =====
  const btnEdit  = document.querySelector('#slide-detail .slide-btn[value="수정"]');
  const btnClose = document.querySelector('#slide-detail .close-btn.slide-btn');

  if (btnEdit) {
    btnEdit.addEventListener('click', () => {
      if (state.mode === 'edit') saveEdit();
      else enterEdit();
    });
  }
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      if (state.mode === 'edit') {
        if (!confirm('수정을 취소하시겠습니까? 변경 내용은 저장되지 않습니다.')) return;
        exitEdit(true);
      }
      detail.classList.remove('open');
    });
  }

  // ===== 행 클릭 시 상세 열기 =====
  if (tableBody) {
    tableBody.addEventListener('click', async (evt) => {
      const row = evt.target.closest('tr');
      if (!row) return;
      const td = evt.target.closest('td');
      const idx = td ? Array.from(row.cells).indexOf(td) : -1;
      if (idx === 0) return; // 체크박스 열 무시

      // 2번째 셀에서 ID 추출
      const idCell = row.cells?.[1];
      const process_id = idCell ? idCell.textContent.replace(/\u00A0/g,' ').trim() : '';
      if (!process_id) { console.warn('목록 행에서 발주 ID를 찾지 못했습니다.'); return; }

      try {
        await openDetail(process_id);
        if (state.mode === 'edit') exitEdit(true);
      } catch (e) {
        console.error('상세 로드 실패:', e);
        alert('상세 정보를 불러오는 중 오류가 발생했습니다.');
      }
    });
  }

  // ===== 체크박스 전체선택/삭제(알림만) =====
  (function setupCheckAndDelete(){
    const chkAll = document.getElementById('chkAll');
    const btnDel = document.querySelector('.btm-btn.del');

    if (chkAll) {
      chkAll.addEventListener('change', () => {
        qsa('tbody input[name="rowChk"]').forEach(n => { if (!n.disabled) n.checked = chkAll.checked; });
      });
    }

    document.addEventListener('change', (e) => {
      const t = e.target;
      if (t?.name === 'rowChk') {
        const rows = qsa('tbody input[name="rowChk"]:not(:disabled)');
        const checked = qsa('tbody input[name="rowChk"]:not(:disabled):checked');
        if (chkAll && rows.length) chkAll.checked = (rows.length === checked.length);
      }
    });

    if (btnDel) {
      btnDel.addEventListener('click', () => {
        const checks = qsa('tbody input[name="rowChk"]:checked');
        if (!checks.length) { alert('삭제할 항목을 선택하세요.'); return; }

        const ids = [];
        checks.forEach(chk => {
          const tr = chk.closest('tr');
          if (!tr || tr.getAttribute('aria-hidden') === 'true') return;
          const tds = tr.querySelectorAll('td');
          if (tds.length >= 2) {
            const idVal = (tds[1].textContent || '').replace(/\u00A0/g,' ').trim();
            if (idVal) ids.push(idVal);
          }
        });

        if (!ids.length) { alert('선택된 행에서 발주 ID를 찾지 못했습니다.'); return; }
        if (!confirm(ids.length + '건 삭제하시겠습니까?')) return;

        // 삭제 API 연결 전 안내
        alert('선택된 ID: ' + ids.join(',') + '\n삭제 API 연결은 백엔드 확정 후 연동하세요.');
      });
    }
  })();

  // ===== 신규 등록 슬라이드 열고 닫기 (마크업만) =====
  const btnNew = document.querySelector('.btm-btn.new');
  if (btnNew && slideInput) {
    btnNew.addEventListener('click', () => slideInput.classList.add('open'));
  }
  const btnCancel = qs('#slide-input .close-btn');
  if (btnCancel && slideInput) {
    btnCancel.addEventListener('click', () => slideInput.classList.remove('open'));
  }
});
