// /resources/js/04_2_order.js  (JSP 수정 없이 동작하는 버전)
document.addEventListener('DOMContentLoaded', () => {
  // ===== 공통 DOM =====
  const tableBody  = document.querySelector('.table tbody');
  const detail     = document.getElementById('slide-detail');
  const slideInput = document.getElementById('slide-input');
  const titleEl    = detail?.querySelector('.silde-title h2');

  const ctx = (typeof contextPath === 'string') ? contextPath : '';
  // const detailApi = `${ctx}/order/detail`;
  // const saveUrl   = `${ctx}/order/update`;
  // FIX:
  const detailApi = `${ctx}/po/detail`;      // 목록 앵커(/po/detail?id=)와 정합
  const saveUrl   = `${ctx}/order/update`;   // 기존 유지(백엔드 규약 확정 후 조정)

  // ===== 유틸 =====
  const text   = (el) => (el ? el.textContent.trim() : '');
  const setHTML = (el, html) => { if (el) el.innerHTML = html; };
  const qs     = (sel, root=document) => root.querySelector(sel);
  const qsa    = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // ===== 상세 영역 채우기 =====
  // async function fillorderDetail(slide, d = {}) {
  //   if (!slide) return;
  //   setHTML(qs('#d-order_id', slide),   d.order_id ?? '');
  //   setHTML(qs('#d-order_name', slide), d.order_name ?? '');
  //   setHTML(qs('#d-order_id_cell', slide),   d.order_id ?? '');
  //   setHTML(qs('#d-order_name_cell', slide), d.order_name ?? '');
  //   setHTML(qs('#d-order_tel_cell', slide),  d.order_tel ?? '');
  //   setHTML(qs('#d-worker_id_cell', slide),   d.worker_id ?? '');
  // }
  // FIX: 현재 상세 슬라이드엔 타깃 id가 없으므로 첫 번째 .slide-id에 "발주 ID: 값"만 주입
  async function fillorderDetail(slide, d = {}) {
    if (!slide) return;
    const idBox = qs('.slide-id', slide);
    if (idBox) {
      const base = idBox.textContent.split(':')[0] || '발주 ID';
      idBox.textContent = `${base}: ${d.order_id ?? ''}`;
    }
  }

  // ===== 상태 =====
  const state = { mode: 'view', backup: {} };

  // ===== 수정 모드 진입/종료 =====
  function enterEdit() {
    if (!detail || state.mode === 'edit') return;
    state.mode = 'edit';
    if (titleEl) titleEl.textContent = '거래처 수정'; // 텍스트만 변경(마크업 유지)

    // 현재 입력 타깃이 없어 시각적 변환은 보수적으로 유지(필요 시 타깃 추가되면 확장)
    // 백업만 구성
    state.backup = {};
  }

  function exitEdit(/*restore*/) {
    if (!detail || state.mode !== 'edit') return;
    state.mode = 'view';
    if (titleEl) titleEl.textContent = '발주 상세';
  }

  // ===== 상세 열기 =====
  async function openDetail(order_id) {
    // const url = `${detailApi}?order_id=${encodeURIComponent(order_id)}`;
    // FIX: 목록 앵커 패턴과 동일하게 ?id= 사용
    const url = `${detailApi}?id=${encodeURIComponent(order_id)}`;

    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const raw = await res.text();
      if (!res.ok) throw new Error(`detail ${res.status}`);
      const data = raw ? JSON.parse(raw) : {};
      await fillorderDetail(detail, { order_id: data.order_id ?? order_id });
    } catch (e) {
      // JSON 미지원/에러 시에도 슬라이드만 열고 ID만 표시
      await fillorderDetail(detail, { order_id });
    }
    detail.classList.add('open');
    state.mode = 'view';
    if (titleEl) titleEl.textContent = '발주 상세';

    // const btnEdit = document.getElementById('btnEdit');
    // if (btnEdit) btnEdit.value = '수정';
    // FIX: 현재 마크업 버튼을 찾지 못해도 무시(아래 공통 바인딩에서 처리)
    return { order_id };
  }

  // ===== 목록 행 갱신 =====
  function updateTableRow(order_id, dto) {
    // const tr = document.querySelector(`.table tbody tr[data-id="${order_id}"]`);
    // FIX: data-id가 없으므로 2번째 셀 텍스트 매칭으로 대체(보수적)
    const rows = qsa('.table tbody tr');
    const tr = rows.find(r => (r.cells?.[1]?.textContent || '').trim() === String(order_id));
    if (!tr) return;
    const tds = tr.querySelectorAll('td'); // [chk, id, name, qty, client, worker, date]
    if (tds[1]) tds[1].textContent = dto.order_id ?? order_id;
    if (tds[2]) tds[2].textContent = dto.item_id ?? tds[2].textContent;
    if (tds[3]) tds[3].textContent = dto.order_amount ?? tds[3].textContent;
    if (tds[4]) tds[4].textContent = dto.client_id ?? tds[4].textContent;
    if (tds[5]) tds[5].textContent = dto.worker_id ?? tds[5].textContent;
  }

  // ===== 상세 저장 =====
  async function saveEdit() {
    if (!detail) return;

    // 현재 편집 입력칸이 없어 일단 ID만 유지 저장(백엔드 규약 확정 시 확장)
    const order_id = (text(qs('.slide-id', detail)).split(':')[1] || '').trim();

    if (!order_id) { alert('발주 ID가 없습니다.'); return; }

    const body = new URLSearchParams();
    body.set('order_id', order_id);

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

      const saved = raw ? JSON.parse(raw) : { order_id };
      const fresh = await openDetail(saved.order_id || order_id);
      updateTableRow(saved.order_id || order_id, fresh);
      alert('저장되었습니다.');
    } catch (e) {
      console.error('update error', e);
      alert('저장 중 오류가 발생했습니다.');
    }
  }

  // ===== 버튼 이벤트(상세) =====
  // const btnEdit  = document.getElementById('btnEdit');
  // const btnClose = document.getElementById('btnCloseDetail');
  // FIX: 현재 마크업(클래스/값) 기반으로 바인딩
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
      if (idx === 0) return; // 체크박스 열은 무시

      // const order_id = row.dataset.id;
      // FIX: 2번째 셀에서 ID 추출
      const idCell = row.cells?.[1];
      const order_id = idCell ? idCell.textContent.replace(/\u00A0/g,' ').trim() : '';
      if (!order_id) { console.warn('목록 행에서 발주 ID를 찾지 못했습니다.'); return; }

      try {
        await openDetail(order_id);
        if (state.mode === 'edit') exitEdit(true);
      } catch (e) {
        console.error('상세 로드 실패:', e);
        alert('상세 정보를 불러오는 중 오류가 발생했습니다.');
      }
    });
  }

  // ===== 체크박스 전체선택/삭제 =====
  (function setupCheckAndDelete(){
    const chkAll = document.getElementById('chkAll');
    // const btnDel = document.getElementById('btnDelete');
    // FIX: JSP 하단 버튼은 .btm-btn.del
    const btnDel = document.querySelector('.btm-btn.del');

    if (chkAll) {
      chkAll.addEventListener('change', () => {
        // qsa('tbody .rowChk').forEach(n => { if (!n.disabled) n.checked = chkAll.checked; });
        // FIX: name="rowChk" 기준
        qsa('tbody input[name="rowChk"]').forEach(n => { if (!n.disabled) n.checked = chkAll.checked; });
      });
    }

    document.addEventListener('change', (e) => {
      const t = e.target;
      // if (t?.classList?.contains('rowChk')) { ... }
      // FIX:
      if (t?.name === 'rowChk') {
        const rows = qsa('tbody input[name="rowChk"]:not(:disabled)');
        const checked = qsa('tbody input[name="rowChk"]:not(:disabled):checked');
        if (chkAll && rows.length) chkAll.checked = (rows.length === checked.length);
      }
    });

    if (btnDel) {
      btnDel.addEventListener('click', () => {
        // const checks = qsa('tbody .rowChk:checked');
        // FIX:
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

        // const form = document.getElementById('deleteForm');
        // const idField = document.getElementById('deleteIds');
        // if (!form || !idField) { alert('삭제 폼/필드를 찾을 수 없습니다.'); return; }
        // idField.value = ids.join(',');
        // form.submit();

        // FIX: 현재 삭제 폼이 없으므로 폴백(백엔드 확정 시 위 주석 해제)
        alert('선택된 ID: ' + ids.join(',') + '\n삭제 API 연결은 백엔드 확정 후 연동하세요.');
      });
    }
  })();

  // ======= [신규 등록] JSP 수정 없이 동작하도록 추가 =======
  // 신규 버튼: class="btm-btn new"
  const btnNew = document.querySelector('.btm-btn.new');
  if (btnNew && slideInput) {
    btnNew.addEventListener('click', () => slideInput.classList.add('open'));
  }

  // 취소 버튼: #slide-input 내부 class="close-btn"
  const btnCancel = qs('#slide-input .close-btn');
  if (btnCancel && slideInput) {
    btnCancel.addEventListener('click', () => slideInput.classList.remove('open'));
  }

  // 등록 버튼: #slide-input 내부 value="등록" 인 버튼
  const btnCreate = qs('#slide-input .slide-btn[value="등록"]');
  const insertForm = document.getElementById('order-insert-form');

  if (btnCreate && insertForm) {
    btnCreate.addEventListener('click', () => {
      const name  = qs('input[name="order_name"]', slideInput)?.value?.trim() ?? '';
      const cc    = qs('select[name="countryCode"]', slideInput)?.value?.trim() ?? '';
      // id 중복 문제가 있어도 name으로 안전하게 선택
      const t1Inp = qs('input[name="order_tel1"]', slideInput);
      const t2Inp = qs('input[name="order_tel2"]', slideInput);
      const t1    = t1Inp?.value?.trim() ?? '';
      const t2    = t2Inp?.value?.trim() ?? '';
      const worker = qs('input[name="worker_id"]', slideInput)?.value?.trim() ?? '';

      // 필수값 검증
      if (!name) { alert('거래처 이름을 입력하세요.'); qs('input[name="order_name"]', slideInput)?.focus(); return; }
      const numOnly = /^[0-9]+$/;
      if (!t1 || !numOnly.test(t1)) { alert('전화번호(중간)는 숫자만 입력하세요.'); t1Inp?.focus(); return; }
      if (!t2 || !numOnly.test(t2)) { alert('전화번호(끝자리)는 숫자만 입력하세요.'); t2Inp?.focus(); return; }

      // order_tel hidden 동적 생성/세팅
      const finalTel = `${cc}-${t1}-${t2}`;
      let hid = qs('input[name="order_tel"]', insertForm);
      if (!hid) {
        hid = document.createElement('input');
        hid.type = 'hidden';
        hid.name = 'order_tel';
        insertForm.appendChild(hid);
      }
      hid.value = finalTel;

      // 중복제출 방지
      btnCreate.disabled = true;
      try {
        insertForm.submit(); // 서버로 POST (order_ID는 비워둠 → DB 트리거가 자동 생성)
      } finally {
        // 제출 후 페이지 전환이 일반적이지만, 혹시 실패 시 대비
        btnCreate.disabled = false;
      }
    });
  }
});
