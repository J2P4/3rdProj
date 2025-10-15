// /resources/js/04_2_client.js (JSP 구조에 맞춘 적용 가능 버전)
document.addEventListener('DOMContentLoaded', () => {
  // ===== 공통 DOM =====
  const tableBody = document.querySelector('.table tbody');
  const detail = document.getElementById('slide-detail');
  const titleEl = detail?.querySelector('.silde-title h2');

  const ctx = (typeof contextPath === 'string') ? contextPath : '';
  const detailApi = `${ctx}/client/detail`;
  const saveUrl   = `${ctx}/client/update`;

  // ===== 유틸 =====
  const text = (el) => (el ? el.textContent.trim() : '');
  const setHTML = (el, html) => { if (el) el.innerHTML = html; };
  const qs  = (sel) => document.querySelector(sel);
  const qsd = (sel) => detail?.querySelector(sel);

  // ===== 상세 영역 반영 =====
  async function fillClientDetail(slide, data) {
    if (!slide) return;
    const d = data || {};

    // 상단 라벨
    setHTML(qsd('#d-client_id'),   d.client_id ?? '');
    setHTML(qsd('#d-client_name'), d.client_name ?? '');

    // 표 셀
    setHTML(qsd('#d-client_id_cell'),   d.client_id ?? '');
    setHTML(qsd('#d-client_name_cell'), d.client_name ?? '');
    setHTML(qsd('#d-client_tel_cell'),  d.client_tel ?? '');
    setHTML(qsd('#d-worker_id_cell'),   d.worker_id ?? '');
  }

  // ===== 상태 =====
  const state = { mode: 'view', backup: {} };

  // ===== 수정 모드 진입 =====
  function enterEdit() {
    if (!detail || state.mode === 'edit') return;
    state.mode = 'edit';
    if (titleEl) titleEl.textContent = '거래처 수정';

    state.backup = {
      client_id:   text(qsd('#d-client_id')),
      client_name: text(qsd('#d-client_name')),
      client_tel:  text(qsd('#d-client_tel_cell')),
      worker_id:   text(qsd('#d-worker_id_cell')),
    };

    // 상단 ID/이름은 그대로 표시, 편집은 테이블 셀에서만
    setHTML(qsd('#d-client_id_cell'),
      `<input type="text" id="e-client_id" value="${state.backup.client_id}" readonly>`
    );
    setHTML(qsd('#d-client_name_cell'),
      `<input type="text" id="e-client_name" value="${state.backup.client_name}">`
    );
    setHTML(qsd('#d-client_tel_cell'),
      `<input type="text" id="e-client_tel" value="${state.backup.client_tel}" placeholder="010-0000-0000">`
    );
    setHTML(qsd('#d-worker_id_cell'),
      `<input type="text" id="e-worker_id" value="${state.backup.worker_id}">`
    );

    // 버튼 텍스트
    const btnEdit = document.getElementById('btnEdit');
    if (btnEdit) btnEdit.value = '저장';
    qsd('#e-client_name')?.focus();
  }

  // ===== 수정 모드 종료 =====
  function exitEdit(restore) {
    if (!detail || state.mode !== 'edit') return;
    state.mode = 'view';
    if (titleEl) titleEl.textContent = '거래처 상세';

    if (restore) {
      // 백업 복귀
      setHTML(qsd('#d-client_id_cell'),   state.backup.client_id);
      setHTML(qsd('#d-client_name_cell'), state.backup.client_name);
      setHTML(qsd('#d-client_tel_cell'),  state.backup.client_tel);
      setHTML(qsd('#d-worker_id_cell'),   state.backup.worker_id);
    } else {
      // 입력값을 반영 (상단 라벨도 동기화)
      const vId   = qsd('#e-client_id')?.value?.trim()   ?? '';
      const vNm   = qsd('#e-client_name')?.value?.trim() ?? '';
      const vTel  = qsd('#e-client_tel')?.value?.trim()  ?? '';
      const vWkr  = qsd('#e-worker_id')?.value?.trim()   ?? '';

      setHTML(qsd('#d-client_id_cell'),   vId);
      setHTML(qsd('#d-client_name_cell'), vNm);
      setHTML(qsd('#d-client_tel_cell'),  vTel);
      setHTML(qsd('#d-worker_id_cell'),   vWkr);

      setHTML(qsd('#d-client_id'),   vId);
      setHTML(qsd('#d-client_name'), vNm);
    }

    const btnEdit = document.getElementById('btnEdit');
    if (btnEdit) btnEdit.value = '수정';
  }

  // ===== 상세 다시 열기(저장 후 최신화) =====
  async function openDetail(client_id) {
    const url = `${detailApi}?client_id=${encodeURIComponent(client_id)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    const raw = await res.text();
    if (!res.ok) throw new Error(`detail ${res.status}`);
    const data = raw ? JSON.parse(raw) : {};
    await fillClientDetail(detail, data);
    detail.classList.add('open');
    state.mode = 'view';
    if (titleEl) titleEl.textContent = '거래처 상세';
    const btnEdit = document.getElementById('btnEdit');
    if (btnEdit) btnEdit.value = '수정';
    return data;
  }

  // ===== 목록 행 갱신 =====
  function updateTableRow(client_id, dto) {
    const tr = document.querySelector(`.table tbody tr[data-id="${client_id}"]`);
    if (!tr) return;
    const tds = tr.querySelectorAll('td'); // [chk, id, name, tel, worker]
    if (tds[1]) tds[1].textContent = dto.client_id ?? client_id;
    if (tds[2]) tds[2].textContent = dto.client_name ?? '';
    if (tds[3]) tds[3].textContent = dto.client_tel ?? '';
    if (tds[4]) tds[4].textContent = dto.worker_id ?? '';
  }

  // ===== 저장 =====
	async function saveEdit() {
	  if (!detail) return;
	
	  const client_id   = (qsd('#e-client_id')?.value ?? text(qsd('#d-client_id'))).trim();
	  const client_name = (qsd('#e-client_name')?.value ?? text(qsd('#d-client_name'))).trim();
	  const client_tel  = (qsd('#e-client_tel')?.value ?? text(qsd('#d-client_tel_cell'))).trim();
	  const worker_id   = (qsd('#e-worker_id')?.value ?? text(qsd('#d-worker_id_cell'))).trim();
	
	  if (!client_id)   { alert('거래처 ID가 없습니다.'); return; }
	  if (!client_name) { alert('거래처 이름을 입력하세요.'); return; }
	
	  const body = new URLSearchParams();
	  body.set('client_id',   client_id);
	  body.set('client_name', client_name);
	  body.set('client_tel',  client_tel);
	  body.set('worker_id',   worker_id);
	
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
	
	    const saved = raw ? JSON.parse(raw) : { client_id, client_name, client_tel, worker_id };
	
	    const fresh = await openDetail(saved.client_id || client_id);
	    updateTableRow(saved.client_id || client_id, fresh);
	
	    alert('저장되었습니다.');
	  } catch (e) {
	    console.error('update error', e);
	    alert('저장 중 오류가 발생했습니다.');
	  }
	}

  // ===== 버튼 이벤트 =====
  const btnEdit  = document.getElementById('btnEdit');
  const btnClose = document.getElementById('btnCloseDetail');

  if (btnEdit) {
    btnEdit.addEventListener('click', () => {
      if (btnEdit.value === '수정') enterEdit();
      else saveEdit();
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

      const client_id = row.dataset.id;
      if (!client_id) { console.warn('data-id(거래처 ID) 없음'); return; }

      try {
        await openDetail(client_id);
        if (state.mode === 'edit') exitEdit(true);
      } catch (e) {
        console.error('상세 로드 실패:', e);
        alert('상세 정보를 불러오는 중 오류가 발생했습니다.');
      }
    });
  }

  // ===== 체크박스 전체선택/삭제 (JSP 구조 유지) =====
  (function setupCheckAndDelete(){
    const chkAll = document.getElementById('chkAll');
    const btnDel = document.getElementById('btnDelete');

    if (chkAll) {
      chkAll.addEventListener('change', () => {
        document.querySelectorAll('tbody .rowChk').forEach(n => { if (!n.disabled) n.checked = chkAll.checked; });
      });
    }

    document.addEventListener('change', (e) => {
      const t = e.target;
      if (t?.classList?.contains('rowChk')) {
        const rows = document.querySelectorAll('tbody .rowChk:not(:disabled)');
        const checked = document.querySelectorAll('tbody .rowChk:not(:disabled):checked');
        if (chkAll && rows.length) chkAll.checked = (rows.length === checked.length);
      }
    });

    if (btnDel) {
      btnDel.addEventListener('click', () => {
        const checks = document.querySelectorAll('tbody .rowChk:checked');
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

        if (!ids.length) { alert('선택된 행에서 거래처 ID를 찾지 못했습니다.'); return; }
        if (!confirm(ids.length + '건 삭제하시겠습니까?')) return;

        const form = document.getElementById('deleteForm');
        const idField = document.getElementById('deleteIds');
        if (!form || !idField) { alert('삭제 폼/필드를 찾을 수 없습니다.'); return; }

        idField.value = ids.join(',');
        form.submit();
      });
    }
  })();
});
