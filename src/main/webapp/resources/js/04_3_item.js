// /resources/js/04_3_item.js
// 슬라이드 상세 보기 + 수정/저장 + 삭제/체크박스 제어 (저장 후 슬라이드 유지/재로딩)
document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('.table tbody');
  const detail = document.querySelector('#slide-detail');
  const titleEl = detail?.querySelector('.silde-title h2');
  const nf = new Intl.NumberFormat();
  const ctx = (typeof contextPath === 'string') ? contextPath : '';
  const saveUrl = `${ctx}/item/save`;
  const detailApi = `${ctx}/item/detail`;

  // 공통 유틸
  const text = (el) => (el ? el.textContent.trim() : '');
  const setHTML = (el, html) => { if (el) el.innerHTML = html; };
  const safe = (v) => (v ?? '').toString();
  const setCellText = (tr, idx, val) => { const td = tr?.children?.[idx]; if (td) td.textContent = safe(val); };

  // 거래처 ID 로드(상세)
  async function loadAndDisplayClientIds(itemId) {
    try {
      const url = `${ctx}/item/${encodeURIComponent(itemId)}/clients`;
      const res2 = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (res2.ok) {
        const arr = await res2.json();
        const ids = Array.isArray(arr)
          ? arr.map(x => x.client_id || x.clientId || x.CLIENT_ID).filter(Boolean)
          : [];
        const clientIdEl = document.getElementById('d-clientId');
        if (clientIdEl) clientIdEl.textContent = ids.join(', ');
      } else {
        const clientIdEl = document.getElementById('d-clientId');
        if (clientIdEl) clientIdEl.textContent = '';
      }
    } catch {
      const clientIdEl = document.getElementById('d-clientId');
      if (clientIdEl) clientIdEl.textContent = '';
    }
  }

  // 상세 값 채우기
  async function fillItemDetail(slide, data) {
    if (!slide) return;
    data = data || {};
    const idLines = slide.querySelectorAll('.slide-id');
    if (idLines[0]) idLines[0].innerHTML = `품목 ID: <span id="d-itemId">${safe(data.item_id)}</span>`;
    if (idLines[1]) idLines[1].innerHTML = `품목 이름: <span id="d-itemName">${safe(data.item_name)}</span>`;

    const tr = slide.querySelector('.slide-tb table tbody tr');
    if (tr) { setCellText(tr,0,''); setCellText(tr,1,''); setCellText(tr,2,''); setCellText(tr,3,''); setCellText(tr,4,''); }
    setHTML(slide.querySelector('#d-clientId'), safe(data.client_id || data.vendor_id || ''));
    setHTML(slide.querySelector('#d-itemDiv'), safe(data.item_div));
    setHTML(slide.querySelector('#d-itemPrice'), (data.item_price != null) ? nf.format(data.item_price) : '');
    setHTML(slide.querySelector('#d-itemUnit'), safe(data.item_unit));

    if (data.item_id) await loadAndDisplayClientIds(data.item_id);
  }

  // 상태/버튼
  const btnEdit  = detail?.querySelector('.slide-btn[value="수정"], .slide-btn[value="저장"]');
  const btnClose = detail?.querySelector('.close-btn.slide-btn');
  const state = { mode: 'view', backup: {} };
  let allowClose = false;

  // 외부 닫힘/ESC 방지
  document.addEventListener('click', (e) => {
    if (!detail?.classList.contains('open')) return;
    if (!detail.contains(e.target)) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); }
  }, true);
  document.addEventListener('keydown', (e) => {
    if (detail?.classList.contains('open') && (e.key === 'Escape' || e.key === 'Esc')) {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    }
  }, true);
  if (detail) {
    new MutationObserver((muts) => {
      muts.forEach(m => {
        if (m.attributeName === 'class') {
          if (!detail.classList.contains('open') && !allowClose) detail.classList.add('open');
        }
      });
    }).observe(detail, { attributes: true, attributeFilter: ['class'] });
  }

  // 수정 모드
  function enterEdit() {
    if (!detail || state.mode === 'edit') return;
    state.mode = 'edit';
    if (titleEl) titleEl.textContent = '품목 수정';

    state.backup = {
      itemId:   text(detail.querySelector('#d-itemId')),
      itemName: text(detail.querySelector('#d-itemName')),
      clientId: text(detail.querySelector('#d-clientId')),
      clientName: text(detail.querySelector('#d-clientName')),
      itemDiv:  text(detail.querySelector('#d-itemDiv')),
      itemPrice: text(detail.querySelector('#d-itemPrice')).replace(/,/g,''),
      itemUnit: text(detail.querySelector('#d-itemUnit'))
    };

    setHTML(detail.querySelector('#d-itemName'), state.backup.itemName);
    setHTML(detail.querySelector('#d-clientId'), `${state.backup.clientId}`);
    setHTML(detail.querySelector('#d-clientName'), state.backup.clientName);
    setHTML(detail.querySelector('#d-itemDiv'), state.backup.itemDiv);
    setHTML(detail.querySelector('#d-itemUnit'), state.backup.itemUnit);

    setHTML(detail.querySelector('#d-itemPrice'),
      `<input type="number" id="e-unitPrice" min="0" step="1" value="${state.backup.itemPrice || 0}">`);
    detail.querySelector('#e-unitPrice')?.focus();

    if (btnEdit) btnEdit.value = '저장';
  }

  function exitEdit(restore) {
    if (!detail || state.mode !== 'edit') return;
    state.mode = 'view';
    if (titleEl) titleEl.textContent = '품목 상세';

    if (restore) {
      setHTML(detail.querySelector('#d-itemName'), state.backup.itemName);
      setHTML(detail.querySelector('#d-clientId'), state.backup.clientId);
      setHTML(detail.querySelector('#d-clientName'), state.backup.clientName);
      setHTML(detail.querySelector('#d-itemDiv'), state.backup.itemDiv);
      setHTML(detail.querySelector('#d-itemPrice'), state.backup.itemPrice);
      setHTML(detail.querySelector('#d-itemUnit'), state.backup.itemUnit);
    } else {
      const vPrice = detail.querySelector('#e-unitPrice')?.value || '';
      setHTML(detail.querySelector('#d-itemPrice'), (vPrice ? Number(vPrice).toLocaleString() : ''));
      setHTML(detail.querySelector('#d-itemName'), state.backup.itemName);
      setHTML(detail.querySelector('#d-clientId'), state.backup.clientId);
      setHTML(detail.querySelector('#d-clientName'), state.backup.clientName);
      setHTML(detail.querySelector('#d-itemDiv'), state.backup.itemDiv);
      setHTML(detail.querySelector('#d-itemUnit'), state.backup.itemUnit);
    }
    if (btnEdit) btnEdit.value = '수정';
  }

  // 상세 재로딩
  async function openDetail(itemId) {
    const url = `${detailApi}?item_id=${encodeURIComponent(itemId)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    const raw = await res.text();
    if (!res.ok) throw new Error(`detail ${res.status}`);
    const data = raw ? JSON.parse(raw) : {};
    await fillItemDetail(detail, data);
    detail.classList.add('open');
    state.mode = 'view';
    if (titleEl) titleEl.textContent = '품목 상세';
    if (btnEdit) btnEdit.value = '수정';
    return data;
  }

  // 테이블 행 갱신
  function updateTableRow(itemId, dto) {
    const tr = document.querySelector(`.table tbody tr[data-id="${itemId}"]`);
    if (!tr) return;
    const tds = tr.querySelectorAll('td');
    if (tds[1]) tds[1].textContent = dto.item_id ?? itemId;
    if (tds[2]) tds[2].textContent = dto.item_name ?? '';
    if (tds[3]) tds[3].textContent = dto.item_div ?? '';
    if (tds[4]) tds[4].textContent = (dto.item_price != null) ? Number(dto.item_price).toLocaleString() : '';
    if (tds[5]) tds[5].textContent = dto.item_unit ?? '';
  }

  // 저장
  async function saveEdit() {
    if (!detail) return;
    const itemId    = text(detail.querySelector('#d-itemId'));
    const itemName  = text(detail.querySelector('#d-itemName')) || '';
    const itemDiv   = text(detail.querySelector('#d-itemDiv')) || '';
    const unit      = text(detail.querySelector('#d-itemUnit')) || '';
    const unitPrice =
      detail.querySelector('#e-unitPrice')?.value?.trim() ||
      text(detail.querySelector('#d-itemPrice')).replace(/,/g,'') || '';

    if (!itemName) { alert('품목 이름을 입력하세요.'); return; }

    const body = new URLSearchParams();
    body.set('item_id',   itemId);
    body.set('item_name', itemName);
    body.set('item_div',  itemDiv);
    body.set('item_price', unitPrice);
    body.set('item_unit',  unit);

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
      if (!res.ok) throw new Error(`save ${res.status}: ${raw}`);

      const saved = raw ? JSON.parse(raw) : {
        item_id: itemId, item_name: itemName, item_div: itemDiv,
        item_price: Number(unitPrice||0), item_unit: unit
      };

      const fresh = await openDetail(saved.item_id || itemId);
      updateTableRow(saved.item_id || itemId, fresh);
      alert('저장되었습니다.');
    } catch (e) {
      console.error('save error', e);
      alert('저장 중 오류가 발생했습니다.');
    }
  }

  // 버튼 이벤트
  if (btnEdit) btnEdit.addEventListener('click', () => {
    if (btnEdit.value === '수정') enterEdit();
    else saveEdit();
  });

  if (btnClose) btnClose.addEventListener('click', () => {
    if (state.mode === 'edit') {
      if (!confirm('수정을 취소하시겠습니까? 변경 내용은 저장되지 않습니다.')) return;
      exitEdit(true);
    }
    allowClose = true;
    detail.classList.remove('open');
    setTimeout(() => { allowClose = false; }, 0);
  });

  // 행 클릭 → 상세
  if (tableBody) {
    tableBody.addEventListener('click', async (evt) => {
      const row = evt.target.closest('tr');
      if (!row) return;
      const td = evt.target.closest('td');
      const idx = td ? Array.from(row.cells).indexOf(td) : -1;
      if (idx === 0) return;

      const itemId = row.dataset.id;
      if (!itemId) { console.warn('data-id(품목 ID)가 없습니다.'); return; }

      const url = `${detailApi}?item_id=${encodeURIComponent(itemId)}`;
      try {
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        const raw = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = raw ? JSON.parse(raw) : {};
        await fillItemDetail(detail, data);
        detail.classList.add('open');
        if (state.mode === 'edit') exitEdit(true);
      } catch (e) {
        console.error('상세 로드 실패:', e);
        alert('상세 정보를 불러오는 중 오류가 발생했습니다.');
      }
    });
  }

  // 체크박스/삭제
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

        if (!ids.length) { alert('선택된 행에서 품목 ID를 찾지 못했습니다.'); return; }
        if (!confirm(ids.length + '건 삭제하시겠습니까?')) return;

        const form = document.getElementById('deleteForm');
        const idField = document.getElementById('deleteIds');
        if (!form || !idField) { alert('삭제 폼/필드를 찾을 수 없습니다.'); return; }

        idField.value = ids.join(',');
        form.submit();
      });
    }
  })();
}); // DOMContentLoaded 끝

// ---------- [등록 폼] 거래처 목록 로드 + 스크롤 select 구성 ----------
document.addEventListener('DOMContentLoaded', async () => {
  const formSlide = document.getElementById('slide-input');
  const selectEl = document.getElementById('vendorId');
  const filterEl = document.getElementById('vendorFilter');
  if (!formSlide || !selectEl) return;

  const ctx = (typeof contextPath === 'string') ? contextPath : '';
  const clientApi = `${ctx}/client/list`; // 같은 경로, Accept로 JSON 라우팅

  let rawClients = [];
  let viewClients = [];

  function renderOptions(items){
    const frag = document.createDocumentFragment();
    items.forEach(c => {
      const cid = c.client_id || c.clientId || c.CLIENT_ID || '';
      const cnm = c.client_name || c.clientName || c.CLIENT_NAME || '';
      const opt = document.createElement('option');
      opt.value = cid;
      opt.textContent = cnm ? `${cid} — ${cnm}` : cid;
      frag.appendChild(opt);
    });
    selectEl.innerHTML = '';
    selectEl.appendChild(frag);
  }

  function applyFilter(keyword){
    if (!keyword) {
      viewClients = rawClients.slice();
    } else {
      const kw = keyword.trim().toLowerCase();
      viewClients = rawClients.filter(c => {
        const cid = (c.client_id || c.clientId || c.CLIENT_ID || '').toLowerCase();
        const cnm = (c.client_name || c.clientName || c.CLIENT_NAME || '').toLowerCase();
        return cid.includes(kw) || cnm.includes(kw);
      });
    }
    renderOptions(viewClients);
  }

  try {
    const res = await fetch(clientApi, {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin'
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`client list ${res.status} ${res.statusText} :: ${txt.slice(0,200)}`);
    }

    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
      const txt = await res.text();
      console.error('[등록슬라이드] JSON 아님. content-type:', ct, 'body:', txt.slice(0,300));
      throw new Error('JSON이 아님(리다이렉트/HTML 가능성)');
    }

    const data = await res.json();
    let arr = [];
    if (Array.isArray(data)) arr = data;
    else if (Array.isArray(data.list)) arr = data.list;
    else if (Array.isArray(data.data)) arr = data.data;
    else throw new Error('알 수 없는 응답 구조');

    rawClients = arr;
    viewClients = rawClients.slice();
    renderOptions(viewClients);

    if (filterEl) filterEl.addEventListener('input', () => applyFilter(filterEl.value));
  } catch (e) {
    console.error('[등록슬라이드] 거래처 로드 실패:', e);
    selectEl.innerHTML = '<option value="">거래처 목록을 불러오지 못했습니다</option>';
  }
});
