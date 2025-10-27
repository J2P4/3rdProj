// /resources/js/04_3_item.js
// 목록 → 상세 슬라이드, 상세 수정/저장, 등록 슬라이드, 삭제/체크박스
document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('.table tbody');
  const detail = document.querySelector('#slide-detail');
  const titleEl = detail ? detail.querySelector('.silde-title h2') : null;
  const nf = new Intl.NumberFormat();
  const ctx = (typeof contextPath === 'string') ? contextPath : '';
  const saveUrl = ctx + '/item/save';
  const detailApi = ctx + '/item/detail';

  const text = (el) => (el ? (el.textContent || '').trim() : '');
  const setHTML = (el, html) => { if (el) el.innerHTML = html; };
  const safe = (v) => (v == null ? '' : String(v));

  async function loadAndDisplayClientIds(itemId) {
    try {
      const url = ctx + '/item/' + encodeURIComponent(itemId) + '/clients';
      const res2 = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res2.ok) throw new Error('HTTP ' + res2.status);
      const arr = await res2.json();
      const ids = Array.isArray(arr)
        ? arr.map(function (x) { return x.client_id || x.clientId || x.CLIENT_ID; }).filter(Boolean)
        : [];
      const clientIdEl = document.getElementById('d-clientId');
      if (clientIdEl) clientIdEl.textContent = ids.join(', ');
    } catch (e) {
      const clientIdEl = document.getElementById('d-clientId');
      if (clientIdEl) clientIdEl.textContent = '';
    }
  }

  async function fillItemDetail(slide, data) {
    if (!slide) return;
    data = data || {};
    const idLines = slide.querySelectorAll('.slide-id');
    if (idLines[0]) idLines[0].innerHTML = '품목 ID: <span id="d-itemId">' + safe(data.item_id) + '</span>';
    if (idLines[1]) idLines[1].innerHTML = '품목 이름: <span id="d-itemName">' + safe(data.item_name) + '</span>';

    setHTML(slide.querySelector('#d-clientId'), safe(data.client_id || data.vendor_id || ''));
    setHTML(slide.querySelector('#d-itemDiv'), safe(data.item_div));
    setHTML(slide.querySelector('#d-itemPrice'), (data.item_price != null) ? nf.format(data.item_price) : '');
    setHTML(slide.querySelector('#d-itemUnit'), safe(data.item_unit));

    if (data.item_id) await loadAndDisplayClientIds(data.item_id);
  }

  const btnEdit  = detail ? detail.querySelector('.slide-btn[value="수정"], .slide-btn[value="저장"]') : null;
  const btnClose = detail ? detail.querySelector('.close-btn.slide-btn') : null;
  const state = { mode: 'view', backup: {} };
  let allowClose = false;










  
  
  // item_min / item_max 검증: item_max가 item_min보다 작으면 제출 차단
(function attachPriceRangeValidation(){
  const searchForm = document.querySelector('form.panel'); // 품목 검색 폼
  if (!searchForm) return;

  searchForm.addEventListener('submit', function(e){
    const minInput = searchForm.querySelector('[name="item_min"]');
    const maxInput = searchForm.querySelector('[name="item_max"]');
    if (!minInput || !maxInput) return;

    const rawMin = (minInput.value || '').trim();
    const rawMax = (maxInput.value || '').trim();
    if (rawMin === '' || rawMax === '') return; // 비어있으면 검증 안함(서버에서 더 엄격하게 검증 권장)

    // 숫자 형식 정리(콤마 제거) 및 파싱
    const toNum = s => {
      const cleaned = String(s).replace(/[^\d.-]/g, '');
      return cleaned === '' ? NaN : Number(cleaned);
    };
    const minVal = toNum(rawMin);
    const maxVal = toNum(rawMax);

    if (isNaN(minVal) || isNaN(maxVal)) {
      alert('단가는 숫자로 입력하세요.');
      e.preventDefault();
      (isNaN(minVal) ? minInput : maxInput).focus();
      return;
    }

    if (maxVal < minVal) {
      alert('최대 단가는 최소 단가보다 작을 수 없습니다.');
      e.preventDefault();
      maxInput.focus();
      return;
    }
  });
})();
  
  
  
  
  
  
  
  
  
  
  
  

  // -----------------------------
  // 외부(공용) X/취소 클릭 캡처: dataset.allowClose 플래그 설정
  // (common.js 같은 공용 스크립트가 먼저 open 클래스를 제거하더라도
  //  이 플래그가 있으면 MutationObserver가 재오픈을 막게 함)
  // -----------------------------
  document.addEventListener('click', function(e) {
    try {
      const tgt = e.target;
      if (!tgt) return;
      // 닫기 버튼 후보: .slide-close-btn, .close-btn, 또는 data-slide-close 속성이 있는 것
      const closeBtn = tgt.closest && (tgt.closest('.slide-close-btn') || tgt.closest('.close-btn') || tgt.closest('[data-slide-close]'));
      if (!closeBtn) return;
      const slide = closeBtn.closest && closeBtn.closest('.slide');
      if (!slide) return;
      // 외부에서 닫는 시도임을 표시
      slide.dataset.allowClose = 'true';
      // 안전하게 짧은 시간 후 플래그 제거
      setTimeout(() => { try { delete slide.dataset.allowClose; } catch(_){} }, 500);
    } catch (err) {
      // 무시
    }
  }, true); // 캡처 단계로 등록해서 common.js의 핸들러보다 먼저 실행되게 함

  // 상세 슬라이드 바깥 닫힘 방지
  document.addEventListener('click', (e) => {
    if (!detail || !detail.classList.contains('open')) return;
    if (!detail.contains(e.target)) {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    }
  }, true);

  document.addEventListener('keydown', (e) => {
    if (!detail || !detail.classList.contains('open')) return;
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    }
  }, true);

  if (detail) {
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.attributeName === 'class') {
          // dataset.allowClose 체크하여 외부에서 닫는 경우 재오픈을 막음
          const domAllow = detail && detail.dataset && detail.dataset.allowClose === 'true';
          const allow = (typeof allowClose !== 'undefined' && allowClose) || domAllow;
          if (!detail.classList.contains('open') && !allow) detail.classList.add('open');
        }
      });
    }).observe(detail, { attributes: true, attributeFilter: ['class'] });
  }

  // 수정 모드 진입
  function enterEdit() {
    if (!detail || state.mode === 'edit') return;
    state.mode = 'edit';
    if (titleEl) titleEl.textContent = '품목 수정';

    state.backup = {
      itemId:   text(detail.querySelector('#d-itemId')),
      itemName: text(detail.querySelector('#d-itemName')),
      clientId: text(detail.querySelector('#d-clientId')),
      itemDiv:  text(detail.querySelector('#d-itemDiv')),
      itemPrice: text(detail.querySelector('#d-itemPrice')).replace(/,/g,''),
      itemUnit: text(detail.querySelector('#d-itemUnit'))
    };

    // 품목명/구분/단위는 읽기만, 단가는 입력 가능
    setHTML(detail.querySelector('#d-itemName'), state.backup.itemName);
    setHTML(detail.querySelector('#d-itemDiv'), state.backup.itemDiv);
    setHTML(detail.querySelector('#d-itemUnit'), state.backup.itemUnit);
    setHTML(detail.querySelector('#d-itemPrice'),
      '<input type="number" id="e-unitPrice" min="0" step="1" value="' + (state.backup.itemPrice || 0) + '">' );

    // 거래처 ID: 수정 가능하도록 <select id="vendorId">로 교체 후 목록 로드
    setHTML(detail.querySelector('#d-clientId'),
      '<select id="vendorId"></select>'
    );

    // 거래처 목록 로드 (JSON 엔드포인트 사용)
    (async function loadClientsForEdit(){
      try {
        const res = await fetch(ctx + '/api/clients', { headers: { 'Accept':'application/json' } });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        const arr = Array.isArray(data) ? data
                  : (Array.isArray(data.list) ? data.list
                  : (Array.isArray(data.data) ? data.data : []));
        const sel = detail.querySelector('#vendorId');
        if (!sel) return;
        const frag = document.createDocumentFragment();
        arr.forEach(function(c){
          const cid = c.client_id || c.clientId || c.CLIENT_ID || '';
          const opt = document.createElement('option');
          opt.value = cid;
          opt.textContent = cid;
          if (cid && cid === state.backup.clientId) opt.selected = true;
          frag.appendChild(opt);
        });
        sel.innerHTML = '';
        sel.appendChild(frag);
      } catch (e) {
        console.error('거래처 목록 로드 실패(수정):', e);
        const sel = detail.querySelector('#vendorId');
        if (sel) {
          sel.innerHTML = '<option value="">(거래처 로드 실패)</option>';
        }
      }
    })();

    const priceInput = detail.querySelector('#e-unitPrice');
    if (priceInput) priceInput.focus();

    if (btnEdit) btnEdit.value = '저장';
  }

  // 수정 모드 종료
  function exitEdit(restore) {
    if (!detail || state.mode !== 'edit') return;
    state.mode = 'view';
    if (titleEl) titleEl.textContent = '품목 상세';

    if (restore) {
      setHTML(detail.querySelector('#d-itemName'), state.backup.itemName);
      setHTML(detail.querySelector('#d-clientId'), state.backup.clientId);
      setHTML(detail.querySelector('#d-itemDiv'), state.backup.itemDiv);
      setHTML(detail.querySelector('#d-itemPrice'), state.backup.itemPrice);
      setHTML(detail.querySelector('#d-itemUnit'), state.backup.itemUnit);
    } else {
      const vPriceEl = detail.querySelector('#e-unitPrice');
      const vPrice = vPriceEl ? vPriceEl.value : '';
      const vendorSel = detail.querySelector('#vendorId');
      const vClientId = vendorSel ? vendorSel.value : state.backup.clientId;

      setHTML(detail.querySelector('#d-itemPrice'), (vPrice ? Number(vPrice).toLocaleString() : ''));
      setHTML(detail.querySelector('#d-itemName'), state.backup.itemName);
      setHTML(detail.querySelector('#d-clientId'), vClientId);
      setHTML(detail.querySelector('#d-itemDiv'), state.backup.itemDiv);
      setHTML(detail.querySelector('#d-itemUnit'), state.backup.itemUnit);
    }
    if (btnEdit) btnEdit.value = '수정';
  }

  // 상세 다시 열기
  async function openDetail(itemId) {
    const url = detailApi + '?item_id=' + encodeURIComponent(itemId);
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    const raw = await res.text();
    if (!res.ok) throw new Error('detail ' + res.status);
    const data = raw ? JSON.parse(raw) : {};
    await fillItemDetail(detail, data);
    detail.classList.add('open');
    state.mode = 'view';
    if (titleEl) titleEl.textContent = '품목 상세';
    if (btnEdit) btnEdit.value = '수정';
    return data;
  }

  // 목록의 행 갱신
  function updateTableRow(itemId, dto) {
    const tr = document.querySelector('.table tbody tr[data-id="' + itemId + '"]');
    if (!tr) return;
    const tds = tr.querySelectorAll('td'); // [체크박스, ID, 이름, 구분, 단가, 단위]
    if (tds[1]) tds[1].textContent = (dto.item_id != null ? dto.item_id : itemId);
    if (tds[2]) tds[2].textContent = dto.item_name != null ? dto.item_name : '';
    if (tds[3]) tds[3].textContent = dto.item_div  != null ? dto.item_div  : '';
    if (tds[4]) tds[4].textContent = (dto.item_price != null) ? Number(dto.item_price).toLocaleString() : '';
    if (tds[5]) tds[5].textContent = dto.item_unit != null ? dto.item_unit : '';
  }

  // 상세의 저장 버튼 동작
  async function saveEdit() {
    if (!detail) return;

    const itemId    = text(detail.querySelector('#d-itemId'));
    const itemName  = text(detail.querySelector('#d-itemName')) || '';
    const itemDiv   = text(detail.querySelector('#d-itemDiv')) || '';
    const unit      = text(detail.querySelector('#d-itemUnit')) || '';
    const unitPrice = (function(){
      const inp = detail.querySelector('#e-unitPrice');
      if (inp && typeof inp.value === 'string') return inp.value.trim();
      const span = text(detail.querySelector('#d-itemPrice')).replace(/,/g,'');
      return span || '';
    })();

    // 수정 UI에서 만들어둔 select
    const vendorSel = detail.querySelector('#vendorId');
    const vendorId  = vendorSel ? (vendorSel.value || '') : text(detail.querySelector('#d-clientId')) || '';

    if (!itemName) { alert('품목 이름을 입력하세요.'); return; }

    const body = new URLSearchParams();
    body.set('item_id',   itemId);
    body.set('item_name', itemName);
    body.set('item_div',  itemDiv);
    body.set('item_price', unitPrice);
    body.set('item_unit',  unit);
    // ★ 거래처 ID 포함
    if (vendorId) body.set('client_id', vendorId);

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
      if (!res.ok) throw new Error('save ' + res.status + ': ' + raw);

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
      allowClose = true;
      // detail DOM 플래그도 설정 (common.js에서 직접 class를 제거할 때도 일관성 유지)
      try { if (detail) detail.dataset.allowClose = 'true'; } catch(_) {}
      detail.classList.remove('open');
      setTimeout(function(){
        allowClose = false;
        try { if (detail) delete detail.dataset.allowClose; } catch(_) {}
      }, 0);
    });
  }

  // 행 클릭 시 상세 열기
  if (tableBody) {
    tableBody.addEventListener('click', async (evt) => {
      const row = evt.target.closest('tr');
      if (!row) return;
      const td = evt.target.closest('td');
      const idx = td ? Array.prototype.indexOf.call(row.cells, td) : -1;
      if (idx === 0) return;

      const itemId = row.getAttribute('data-id');
      if (!itemId) { console.warn('data-id(품목 ID)가 없습니다.'); return; }

      const url = detailApi + '?item_id=' + encodeURIComponent(itemId);
      try {
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        const raw = await res.text();
        if (!res.ok) throw new Error('HTTP ' + res.status);
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

  // 체크박스 & 삭제
  (function setupCheckAndDelete(){
    const chkAll = document.getElementById('chkAll');
    const btnDel = document.getElementById('btnDelete');

    if (chkAll) {
      chkAll.addEventListener('change', () => {
        const rows = document.querySelectorAll('tbody .rowChk');
        for (var i=0;i<rows.length;i++) {
          if (!rows[i].disabled) rows[i].checked = chkAll.checked;
        }
      });
    }

    document.addEventListener('change', (e) => {
      const t = e.target;
      if (t && t.classList && t.classList.contains('rowChk')) {
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
        for (var i=0;i<checks.length;i++) {
          const tr = checks[i].closest('tr');
          if (!tr || tr.getAttribute('aria-hidden') === 'true') continue;
          const tds = tr.querySelectorAll('td');
          if (tds.length >= 2) {
            const idVal = (tds[1].textContent || '').replace(/\u00A0/g,' ').trim();
            if (idVal) ids.push(idVal);
          }
        }

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
});

// ──────────────────────────────────────────────
// 등록 슬라이드: 거래처 목록 로드 + 등록 저장
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const formSlide = document.getElementById('slide-input');
  const selectEl  = document.getElementById('vendorId');
  if (!formSlide || !selectEl) return;

  const ctx = (typeof contextPath === 'string') ? contextPath : '';
  const clientApi = ctx + '/api/clients';

  function renderOptions(items){
    const frag = document.createDocumentFragment();
    items.forEach(function(c){
      const cid = c.client_id || c.clientId || c.CLIENT_ID || '';
      const opt = document.createElement('option');
      opt.value = cid;
      opt.textContent = cid; // 요청대로 ID만 보여줌
      frag.appendChild(opt);
    });
    selectEl.innerHTML = '';
    selectEl.appendChild(frag);
  }

  try {
    const res = await fetch(clientApi, { headers: { 'Accept':'application/json' }, credentials: 'same-origin' });
    if (!res.ok) throw new Error('client list ' + res.status);
    const ct = res.headers.get('content-type') || '';
    if (ct.indexOf('application/json') < 0) throw new Error('JSON 아님');

    const data = await res.json();
    var arr = [];
    if (Object.prototype.toString.call(data) === '[object Array]') arr = data;
    else if (Object.prototype.toString.call(data.list) === '[object Array]') arr = data.list;
    else if (Object.prototype.toString.call(data.data) === '[object Array]') arr = data.data;
    renderOptions(arr);
  } catch (e) {
    console.error('[등록슬라이드] 거래처 로드 실패:', e);
    selectEl.innerHTML = '<option value="">(거래처 로드 실패)</option>';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const regForm = document.getElementById('item-register-form');
  if (!regForm) return;

  const ctx     = (typeof contextPath === 'string') ? contextPath : '';
  const saveUrl = ctx + '/item/save';

  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const itemName  = (document.getElementById('itemName') && document.getElementById('itemName').value ? document.getElementById('itemName').value : '').trim();
    const itemDivEl = document.querySelector('select[name="itemDiv"]');
    const itemDiv   = itemDivEl ? itemDivEl.value : '';
    const unitPrice = (document.getElementById('unitPrice') && document.getElementById('unitPrice').value ? document.getElementById('unitPrice').value : '').trim();
    const unitEl    = document.querySelector('#unit, select[name="itemunit"]');
    const unit      = unitEl ? (unitEl.value || '').trim() : '';
    const vendorSel = document.getElementById('vendorId');
    const vendorId  = vendorSel ? vendorSel.value : '';

    if (!itemName) { alert('품목 이름을 입력하세요.'); return; }
    if (!itemDiv)  { alert('구분을 선택하세요.'); return; }
    if (unitPrice === '' || Number(unitPrice) < 0) { alert('단가를 올바르게 입력하세요.'); return; }
    if (!unit)     { alert('단위를 선택/입력하세요.'); return; }
    if (!vendorId) { alert('거래처를 선택하세요.'); return; }

    const body = new URLSearchParams();
    body.set('item_name',  itemName);
    body.set('item_div',   itemDiv);
    body.set('item_price', unitPrice);
    body.set('item_unit',  unit);
    // ★ 신규 등록 시에도 거래처 ID 포함하여 서버로 보냄
    body.set('client_id',  vendorId);

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
      if (!res.ok) throw new Error('save ' + res.status + ': ' + raw);

      alert('등록되었습니다.');
      location.reload();
    } catch (err) {
      console.error('[등록] 저장 오류:', err);
      alert('저장 중 오류가 발생했습니다.');
    }
  });
});
