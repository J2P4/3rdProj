// /resources/js/04_2_client.js  (JSP 수정 없이 동작하는 버전)
document.addEventListener('DOMContentLoaded', () => {
  // ===== 공통 DOM =====
  const tableBody  = document.querySelector('.table tbody');
  const detail     = document.getElementById('slide-detail');
  const slideInput = document.getElementById('slide-input');
  const titleEl    = detail?.querySelector('.silde-title h2');

  const ctx = (typeof contextPath === 'string') ? contextPath : '';
  const detailApi = `${ctx}/client/detail`;
  const saveUrl   = `${ctx}/client/update`;

  // ===== 유틸 =====
  const text   = (el) => (el ? el.textContent.trim() : '');
  const setHTML = (el, html) => { if (el) el.innerHTML = html; };
  const qs     = (sel, root=document) => root.querySelector(sel);
  const qsa    = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // ===== 상세 영역 채우기 =====
  async function fillClientDetail(slide, d = {}) {
    if (!slide) return;
    setHTML(qs('#d-client_id', slide),   d.client_id ?? '');
    setHTML(qs('#d-client_name', slide), d.client_name ?? '');

    setHTML(qs('#d-client_id_cell', slide),   d.client_id ?? '');
    setHTML(qs('#d-client_name_cell', slide), d.client_name ?? '');
    setHTML(qs('#d-client_tel_cell', slide),  d.client_tel ?? '');
    setHTML(qs('#d-worker_id_cell', slide),   d.worker_id ?? '');
  }

  // ===== 상태 =====
  const state = { mode: 'view', backup: {} };

  // ===== 수정 모드 진입/종료 =====
  function enterEdit() {
    if (!detail || state.mode === 'edit') return;
    state.mode = 'edit';
    if (titleEl) titleEl.textContent = '거래처 수정';

    state.backup = {
      client_id:   text(qs('#d-client_id', detail)),
      client_name: text(qs('#d-client_name', detail)),
      client_tel:  text(qs('#d-client_tel_cell', detail)),
      worker_id:   text(qs('#d-worker_id_cell', detail)),
    };

    setHTML(qs('#d-client_id_cell', detail),
      `<input type="text" id="e-client_id" value="${state.backup.client_id}" readonly>`
    );
    setHTML(qs('#d-client_name_cell', detail),
      `<input type="text" id="e-client_name" value="${state.backup.client_name}">`
    );
    setHTML(qs('#d-client_tel_cell', detail),
      `<input type="text" id="e-client_tel" value="${state.backup.client_tel}" placeholder="010-0000-0000">`
    );
    setHTML(qs('#d-worker_id_cell', detail),
      `<input type="text" id="e-worker_id" value="${state.backup.worker_id}">`
    );

    const btnEdit = document.getElementById('btnEdit');
    if (btnEdit) btnEdit.value = '저장';
    qs('#e-client_name', detail)?.focus();
  }

  function exitEdit(restore) {
    if (!detail || state.mode !== 'edit') return;
    state.mode = 'view';
    if (titleEl) titleEl.textContent = '거래처 상세';

    if (restore) {
      setHTML(qs('#d-client_id_cell', detail),   state.backup.client_id);
      setHTML(qs('#d-client_name_cell', detail), state.backup.client_name);
      setHTML(qs('#d-client_tel_cell', detail),  state.backup.client_tel);
      setHTML(qs('#d-worker_id_cell', detail),   state.backup.worker_id);
    } else {
      const vId  = qs('#e-client_id', detail)?.value?.trim()  ?? '';
      const vNm  = qs('#e-client_name', detail)?.value?.trim()?? '';
      const vTel = qs('#e-client_tel', detail)?.value?.trim() ?? '';
      const vWkr = qs('#e-worker_id', detail)?.value?.trim()  ?? '';

      setHTML(qs('#d-client_id_cell', detail),   vId);
      setHTML(qs('#d-client_name_cell', detail), vNm);
      setHTML(qs('#d-client_tel_cell', detail),  vTel);
      setHTML(qs('#d-worker_id_cell', detail),   vWkr);

      setHTML(qs('#d-client_id', detail),   vId);
      setHTML(qs('#d-client_name', detail), vNm);
    }

    const btnEdit = document.getElementById('btnEdit');
    if (btnEdit) btnEdit.value = '수정';
  }

  // ===== 상세 열기 =====
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

  // ===== 상세 저장 =====
  async function saveEdit() {
    if (!detail) return;

    const client_id   = (qs('#e-client_id',   detail)?.value ?? text(qs('#d-client_id', detail))).trim();
    const client_name = (qs('#e-client_name', detail)?.value ?? text(qs('#d-client_name', detail))).trim();
    const client_tel  = (qs('#e-client_tel',  detail)?.value ?? text(qs('#d-client_tel_cell', detail))).trim();
    const worker_id   = (qs('#e-worker_id',   detail)?.value ?? text(qs('#d-worker_id_cell', detail))).trim();

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

  // ===== 버튼 이벤트(상세) =====
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
      if (idx === 0) return; // 체크박스 열은 무시

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

  // ===== 체크박스 전체선택/삭제 =====
  (function setupCheckAndDelete(){
    const chkAll = document.getElementById('chkAll');
    const btnDel = document.getElementById('btnDelete');

    if (chkAll) {
      chkAll.addEventListener('change', () => {
        qsa('tbody .rowChk').forEach(n => { if (!n.disabled) n.checked = chkAll.checked; });
      });
    }

    document.addEventListener('change', (e) => {
      const t = e.target;
      if (t?.classList?.contains('rowChk')) {
        const rows = qsa('tbody .rowChk:not(:disabled)');
        const checked = qsa('tbody .rowChk:not(:disabled):checked');
        if (chkAll && rows.length) chkAll.checked = (rows.length === checked.length);
      }
    });

    if (btnDel) {
      btnDel.addEventListener('click', () => {
        const checks = qsa('tbody .rowChk:checked');
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
  const insertForm = document.getElementById('client-insert-form');

  if (btnCreate && insertForm) {
    btnCreate.addEventListener('click', () => {
      const name  = qs('input[name="client_name"]', slideInput)?.value?.trim() ?? '';
      const cc    = qs('select[name="countryCode"]', slideInput)?.value?.trim() ?? '';
      // id 중복 문제가 있어도 name으로 안전하게 선택
      const t1Inp = qs('input[name="client_tel1"]', slideInput);
      const t2Inp = qs('input[name="client_tel2"]', slideInput);
      const t1    = t1Inp?.value?.trim() ?? '';
      const t2    = t2Inp?.value?.trim() ?? '';
      const worker = qs('input[name="worker_id"]', slideInput)?.value?.trim() ?? '';

      // 필수값 검증
      if (!name) { alert('거래처 이름을 입력하세요.'); qs('input[name="client_name"]', slideInput)?.focus(); return; }
      const numOnly = /^[0-9]+$/;
      if (!t1 || !numOnly.test(t1)) { alert('전화번호(중간)는 숫자만 입력하세요.'); t1Inp?.focus(); return; }
      if (!t2 || !numOnly.test(t2)) { alert('전화번호(끝자리)는 숫자만 입력하세요.'); t2Inp?.focus(); return; }

      // client_tel hidden 동적 생성/세팅
      const finalTel = `${cc}-${t1}-${t2}`;
      let hid = qs('input[name="client_tel"]', insertForm);
      if (!hid) {
        hid = document.createElement('input');
        hid.type = 'hidden';
        hid.name = 'client_tel';
        insertForm.appendChild(hid);
      }
      hid.value = finalTel;

      // 중복제출 방지
      btnCreate.disabled = true;
      try {
        insertForm.submit(); // 서버로 POST (CLIENT_ID는 비워둠 → DB 트리거가 자동 생성)
      } finally {
        // 제출 후 페이지 전환이 일반적이지만, 혹시 실패 시 대비
        btnCreate.disabled = false;
      }
    });
  }
});
