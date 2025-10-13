// /resources/js/04_3_item.js
// 슬라이드 상세 보기 + 수정/저장 + 삭제/체크박스 제어 (벤더 API 호출 제거 + 저장 후 슬라이드 유지/재로딩)
document.addEventListener('DOMContentLoaded', () => {                               // DOM이 준비되면 실행
  const tableBody = document.querySelector('.table tbody');                         // 목록 테이블 바디
  const detail = document.querySelector('#slide-detail');                           // 상세 슬라이드 엘리먼트
  if (!detail) { /* 상세 영역이 없으면 아래 로직 일부는 스킵됨 */ }                  // 상세 영역이 없으면 종료

  const titleEl = detail?.querySelector('.silde-title h2');                         // 상세/수정 제목
  const nf = new Intl.NumberFormat();                                               // 숫자 포맷터(천단위 콤마)
  const ctx = (typeof contextPath === 'string') ? contextPath : '';                 // JSP 주입 contextPath
  const saveUrl = `${ctx}/item/save`;                                               // 저장 엔드포인트
  const detailApi = `${ctx}/item/detail`;                                           // 상세 조회 엔드포인트

  // ---------- 유틸 ----------
  const text = (el) => (el ? el.textContent.trim() : '');                           // 엘리먼트 텍스트 안전 추출
  const setHTML = (el, html) => { if (el) el.innerHTML = html; };                   // innerHTML 세터
  const safe = (v) => (v ?? '').toString();                                         // null/undefined 방지
  const setCellText = (tr, idx, val) => {                                           // tr의 td[idx]에 텍스트 설정
    const td = tr?.children?.[idx];
    if (td) td.textContent = safe(val);
  };

  // ---------- 거래처 ID 로드 (공통 함수) ----------
  async function loadAndDisplayClientIds(itemId) {                                  // 거래처 ID 목록을 API로 가져와서 표시
    console.log('[DEBUG] loadAndDisplayClientIds 호출됨, itemId:', itemId);         // 디버그: 함수 호출 확인
    try {
      const url = `${ctx}/item/${encodeURIComponent(itemId)}/clients`;
      console.log('[DEBUG] 거래처 API URL:', url);                                   // 디버그: 요청 URL 확인
      
      const res2 = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });
      
      console.log('[DEBUG] 거래처 API 응답 상태:', res2.status, res2.ok);            // 디버그: 응답 상태 확인
      
      if (res2.ok) {
        const arr = await res2.json();                                              // [{client_id:"C1", item_id:"..."}...]
        console.log('[DEBUG] 거래처 데이터:', arr);                                   // 디버그: 받은 데이터 확인
        
        const ids = Array.isArray(arr)
          ? arr.map(x => x.client_id || x.clientId).filter(Boolean)
          : [];
        console.log('[DEBUG] 추출된 거래처 ID들:', ids);                              // 디버그: 추출된 ID 확인
        
        const clientIdEl = document.getElementById('d-clientId');
        console.log('[DEBUG] d-clientId 엘리먼트:', clientIdEl);                     // 디버그: 엘리먼트 존재 확인
        
        if (clientIdEl) {
          clientIdEl.textContent = ids.join(', ');                                  // 콤마로 구분하여 표시
          console.log('[DEBUG] 거래처 ID 표시 완료:', ids.join(', '));               // 디버그: 표시 완료
        } else {
          console.error('[DEBUG] d-clientId 엘리먼트를 찾을 수 없음!');
        }
      } else {
        console.error('[DEBUG] 거래처 API 응답 실패:', res2.status);
        const clientIdEl = document.getElementById('d-clientId');
        if (clientIdEl) clientIdEl.textContent = '';
      }
    } catch (e2) {
      console.error('[DEBUG] 거래처 로드 중 에러:', e2);
      const clientIdEl = document.getElementById('d-clientId');
      if (clientIdEl) clientIdEl.textContent = '';
    }
  }

  // ---------- 상세 값 채우기 ----------
  async function fillItemDetail(slide, data) {                                      // 상세 슬라이드에 데이터 주입
    if (!slide) return;
    data = data || {};
    const idLines = slide.querySelectorAll('.slide-id');                            // "품목 ID:", "품목 이름:"
    if (idLines[0]) idLines[0].innerHTML = `품목 ID: <span id="d-itemId">${safe(data.item_id)}</span>`;     // 품목 ID
    if (idLines[1]) idLines[1].innerHTML = `품목 이름: <span id="d-itemName">${safe(data.item_name)}</span>`;// 품목 이름

    const tr = slide.querySelector('.slide-tb table tbody tr');                     // 상세 테이블 첫 행
    if (tr) { setCellText(tr,0,''); setCellText(tr,1,''); setCellText(tr,2,''); setCellText(tr,3,''); setCellText(tr,4,''); } // 초기화
    setHTML(slide.querySelector('#d-clientId'), safe(data.client_id || data.vendor_id || ''));             // 거래처 ID(표시 전용)
    // setHTML(slide.querySelector('#d-clientName'), safe(data.client_name || data.vendor_name || ''));    // 거래처 이름(표시 전용)
    setHTML(slide.querySelector('#d-itemDiv'), safe(data.item_div));                                       // 구분
    setHTML(slide.querySelector('#d-itemPrice'), (data.item_price != null) ? nf.format(data.item_price) : ''); // 단가
    setHTML(slide.querySelector('#d-itemUnit'), safe(data.item_unit));                                     // 단위

    // ----- 거래처 ID 목록 로드 후 표시 -----
    if (data.item_id) {                                                             // item_id가 있을 때만
      await loadAndDisplayClientIds(data.item_id);                                  // 거래처 정보 로드 및 표시
    }
  }

  // ---------- 상태/버튼 ----------
  const btnEdit  = detail?.querySelector('.slide-btn[value="수정"], .slide-btn[value="저장"]');             // 수정/저장 버튼
  const btnClose = detail?.querySelector('.close-btn.slide-btn');                                           // 취소 버튼
  const state = { mode: 'view', backup: {} };                                                              // 상태/백업
  let allowClose = false;                                                                                  // 외부 닫힘 차단 플래그

  // ---------- 외부 클릭/ESC로 닫힘 방지 ----------
  document.addEventListener('click', (e) => {                                                              // 문서 클릭 캡쳐
    if (!detail?.classList.contains('open')) return;                                                       // 슬라이드 열릴 때만
    if (!detail.contains(e.target)) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); } // 외부 클릭 차단
  }, true);
  document.addEventListener('keydown', (e) => {                                                            // ESC 차단
    if (detail?.classList.contains('open') && (e.key === 'Escape' || e.key === 'Esc')) {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    }
  }, true);
  if (detail) {
    new MutationObserver((muts) => {                                                                       // 강제 열림 유지
      muts.forEach(m => { if (m.attributeName === 'class') { if (!detail.classList.contains('open') && !allowClose) detail.classList.add('open'); } });
    }).observe(detail, { attributes: true, attributeFilter: ['class'] });
  }

  // ---------- 수정 모드 진입 (벤더 API 호출 제거) ----------
  function enterEdit() {                                                                                   // 수정 모드로 전환
    if (!detail) return;
    if (state.mode === 'edit') return;                                                                     // 중복 방지
    state.mode = 'edit';                                                                                   // 상태 변경
    if (titleEl) titleEl.textContent = '품목 수정';                                                        // 제목 변경

    state.backup = {                                                                                       // 현 표시값 백업
      itemId:   text(detail.querySelector('#d-itemId')),
      itemName: text(detail.querySelector('#d-itemName')),
      clientId: text(detail.querySelector('#d-clientId')),
      clientName: text(detail.querySelector('#d-clientName')),
      itemDiv:  text(detail.querySelector('#d-itemDiv')),
      itemPrice: text(detail.querySelector('#d-itemPrice')).replace(/,/g,''),
      itemUnit: text(detail.querySelector('#d-itemUnit'))
    };

    // 이름 입력
    // (단가만 수정 가능 요구사항) => 입력창을 만들지 않고 그대로 텍스트 유지
    setHTML(detail.querySelector('#d-itemName'), state.backup.itemName);

    // 벤더는 드롭다운 대신 텍스트 입력(표시/편집만, 전송은 안 함)
    // setHTML(detail.querySelector('#d-clientId'),
    //   `<input type="text" id="e-vendorId" value="${state.backup.clientId}" placeholder="거래처ID(전송안함)">`); // 거래처ID 입력
    setHTML(detail.querySelector('#d-clientId'), `${state.backup.clientId}`);                              // 거래처 ID는 수정 불가 (입력창 생성 제거)
    // 거래처명도 수정 불가로 텍스트 유지
    setHTML(detail.querySelector('#d-clientName'), state.backup.clientName);

    // 구분/단위도 수정 불가로 텍스트 유지
    setHTML(detail.querySelector('#d-itemDiv'), state.backup.itemDiv);                                     // 구분 입력(비활성: 텍스트 유지)
    setHTML(detail.querySelector('#d-itemUnit'), state.backup.itemUnit);                                   // 단위 입력(비활성: 텍스트 유지)

    // 단가만 입력 가능
    setHTML(detail.querySelector('#d-itemPrice'),
      `<input type="number" id="e-unitPrice" min="0" step="1" value="${state.backup.itemPrice || 0}">`);   // 단가 입력
    detail.querySelector('#e-unitPrice')?.focus();                                                          // 포커스

    if (btnEdit) btnEdit.value = '저장';                                                                   // 버튼 표시 변경
  }

  // ---------- 수정 모드 종료 ----------
  function exitEdit(restore) {                                                                             // 수정 종료
    if (!detail) return;
    if (state.mode !== 'edit') return;                                                                     // 수정 아닐 때 무시
    state.mode = 'view';                                                                                   // 상태 변경
    if (titleEl) titleEl.textContent = '품목 상세';                                                        // 제목 복귀

    if (restore) {                                                                                         // 복구 모드면 백업 복원
      setHTML(detail.querySelector('#d-itemName'), state.backup.itemName);
      setHTML(detail.querySelector('#d-clientId'), state.backup.clientId);
      setHTML(detail.querySelector('#d-clientName'), state.backup.clientName);
      setHTML(detail.querySelector('#d-itemDiv'), state.backup.itemDiv);
      setHTML(detail.querySelector('#d-itemPrice'), state.backup.itemPrice);
      setHTML(detail.querySelector('#d-itemUnit'), state.backup.itemUnit);
    } else {                                                                                                // 아니면 입력값 확정 반영
      // 단가만 반영
      const vPrice = detail.querySelector('#e-unitPrice')?.value || '';
      setHTML(detail.querySelector('#d-itemPrice'), (vPrice ? Number(vPrice).toLocaleString() : ''));

      // 나머지는 수정 불가이므로 백업값 유지
      setHTML(detail.querySelector('#d-itemName'), state.backup.itemName);
      setHTML(detail.querySelector('#d-clientId'), state.backup.clientId);                                  // 거래처 ID는 수정 불가(백업값 유지)
      setHTML(detail.querySelector('#d-clientName'), state.backup.clientName);
      setHTML(detail.querySelector('#d-itemDiv'), state.backup.itemDiv);
      setHTML(detail.querySelector('#d-itemUnit'), state.backup.itemUnit);
    }
    if (btnEdit) btnEdit.value = '수정';                                                                    // 버튼 복귀
  }

  // ---------- 상세 다시 열기(저장 후 재사용) ----------
  async function openDetail(itemId) {
    const url = `${detailApi}?item_id=${encodeURIComponent(itemId)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    const raw = await res.text();
    if (!res.ok) throw new Error(`detail ${res.status}`);
    const data = raw ? JSON.parse(raw) : {};
    await fillItemDetail(detail, data);                                                                     // 거래처 정보도 함께 로드
    detail.classList.add('open');
    state.mode = 'view';
    if (titleEl) titleEl.textContent = '품목 상세';
    if (btnEdit) btnEdit.value = '수정';
    return data;
  }

  // ---------- 테이블 행 갱신 ----------
  function updateTableRow(itemId, dto) {
    const tr = document.querySelector(`.table tbody tr[data-id="${itemId}"]`);
    if (!tr) return;
    const tds = tr.querySelectorAll('td'); // [체크박스, ID, 이름, 구분, 단가, 단위]
    if (tds[1]) tds[1].textContent = dto.item_id ?? itemId;
    if (tds[2]) tds[2].textContent = dto.item_name ?? '';
    if (tds[3]) tds[3].textContent = dto.item_div ?? '';
    if (tds[4]) tds[4].textContent = (dto.item_price != null) ? Number(dto.item_price).toLocaleString() : '';
    if (tds[5]) tds[5].textContent = dto.item_unit ?? '';
  }

  // ---------- 저장(서버 요구 5개 파라미터로 POST) ----------
  async function saveEdit() {                                                                               // 저장 실행
    if (!detail) return;
    const itemId    = text(detail.querySelector('#d-itemId'));                                             // PK

    // (단가만 수정) => 다른 값은 화면 텍스트(백업과 동일)에서 읽음
    const itemName  = text(detail.querySelector('#d-itemName')) || '';                                     // 필수
    const itemDiv   = text(detail.querySelector('#d-itemDiv')) || '';                                      // 구분
    const unit      = text(detail.querySelector('#d-itemUnit')) || '';                                     // 단위

    // 단가는 입력값 우선, 없으면 표시 텍스트(콤마 제거)
    const unitPrice =
      detail.querySelector('#e-unitPrice')?.value?.trim() ||
      text(detail.querySelector('#d-itemPrice')).replace(/,/g,'') || '';

    if (!itemName) { alert('품목 이름을 입력하세요.'); return; }                                           // 필수 체크

    const body = new URLSearchParams();                                                                     // x-www-form-urlencoded
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

      // 컨트롤러가 ItemDTO를 JSON으로 반환한다고 가정(그렇지 않으면 아래 openDetail로 최신 상태 보장)
      const saved = raw ? JSON.parse(raw) : {
        item_id: itemId,
        item_name: itemName,
        item_div: itemDiv,
        item_price: Number(unitPrice||0),
        item_unit: unit
      };

      // 상세 최신으로 재로딩 + 슬라이드 유지
      const fresh = await openDetail(saved.item_id || itemId);
      // 목록 행도 최신 값 반영
      updateTableRow(saved.item_id || itemId, fresh);

      alert('저장되었습니다.');
    } catch (e) {
      console.error('save error', e);
      alert('저장 중 오류가 발생했습니다.');
    }
  }

  // ---------- 버튼 이벤트 ----------
  if (btnEdit) {                                                                                            // 수정/저장 버튼
    btnEdit.addEventListener('click', () => {                                                               // 클릭
      if (btnEdit.value === '수정') enterEdit();                                                            // 수정 진입
      else saveEdit();                                                                                      // 저장
    });
  }

  if (btnClose) {                                                                                           // 취소 버튼
    btnClose.addEventListener('click', () => {                                                              // 클릭
      if (state.mode === 'edit') {                                                                          // 수정 중
        if (!confirm('수정을 취소하시겠습니까? 변경 내용은 저장되지 않습니다.')) return;                       // 확인
        exitEdit(true);                                                                                     // 복구
      }
      allowClose = true;                                                                                    // 닫힘 허용
      detail.classList.remove('open');                                                                      // 슬라이드 닫기
      setTimeout(() => { allowClose = false; }, 0);                                                         // 플래그 복구
    });
  }

  // ---------- 행 클릭 시 상세 열기 ----------
  if (tableBody) {                                                                                          // 테이블 존재 시
    tableBody.addEventListener('click', async (evt) => {                                                    // 클릭 이벤트
      const row = evt.target.closest('tr');                                                                 // 클릭된 행
      if (!row) return;                                                                                     // 없으면 종료
      const td = evt.target.closest('td');                                                                  // 클릭 셀
      const idx = td ? Array.from(row.cells).indexOf(td) : -1;                                              // 셀 인덱스
      if (idx === 0) return;                                                                                // 체크박스 열 무시

      const itemId = row.dataset.id;                                                                        // data-id → 품목ID
      if (!itemId) { console.warn('data-id(품목 ID)가 없습니다.'); return; }                                  // 방어

      const url = `${detailApi}?item_id=${encodeURIComponent(itemId)}`;                                     // 상세 요청 URL
      try {
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });                        // 요청
        const raw = await res.text();                                                                       // 수신
        if (!res.ok) throw new Error(`HTTP ${res.status}`);                                                 // 상태 체크
        const data = raw ? JSON.parse(raw) : {};                                                            // 파싱
        await fillItemDetail(detail, data);                                                                 // 표시 (거래처 정보도 함께 로드)

        detail.classList.add('open');                                                                       // 열기
        if (state.mode === 'edit') exitEdit(true);                                                          // 수정 중이면 복원
      } catch (e) {
        console.error('상세 로드 실패:', e);                                                                // 콘솔
        alert('상세 정보를 불러오는 중 오류가 발생했습니다.');                                                 // 사용자 안내
      }
    });
  }

  // ---------- 체크박스 전체 선택/동기화/삭제 ----------
  (function setupCheckAndDelete(){
    const chkAll = document.getElementById('chkAll');                                                        // 전체 선택 체크박스
    const btnDel = document.getElementById('btnDelete');                                                     // 삭제 버튼

    if (chkAll) {                                                                                            // 전체 선택 토글
      chkAll.addEventListener('change', () => {
        document.querySelectorAll('tbody .rowChk').forEach(n => { if (!n.disabled) n.checked = chkAll.checked; });
      });
    }

    document.addEventListener('change', (e) => {                                                             // 개별 체크 → 전체 동기화
      const t = e.target;
      if (t?.classList?.contains('rowChk')) {
        const rows = document.querySelectorAll('tbody .rowChk:not(:disabled)');                              // 전체 수
        const checked = document.querySelectorAll('tbody .rowChk:not(:disabled):checked');                   // 체크 수
        if (chkAll && rows.length) chkAll.checked = (rows.length === checked.length);                        // 모두 체크 시 전체도 체크
      }
    });

    if (btnDel) {                                                                                            // 삭제 처리
      btnDel.addEventListener('click', () => {
        const checks = document.querySelectorAll('tbody .rowChk:checked');                                   // 선택된 행
        if (!checks.length) { alert('삭제할 항목을 선택하세요.'); return; }                                     // 없으면 중단

        const ids = [];                                                                                      // 삭제 ID 모음
        checks.forEach(chk => {
          const tr = chk.closest('tr');                                                                      // 해당 행
          if (!tr || tr.getAttribute('aria-hidden') === 'true') return;                                      // 더미 행 제외
          const tds = tr.querySelectorAll('td');                                                             // 셀들
          if (tds.length >= 2) {
            const idVal = (tds[1].textContent || '').replace(/\u00A0/g,' ').trim();                          // 두 번째 셀(ID)
            if (idVal) ids.push(idVal);                                                                      // 수집
          }
        });

        if (!ids.length) { alert('선택된 행에서 품목 ID를 찾지 못했습니다.'); return; }                         // 방어
        if (!confirm(ids.length + '건 삭제하시겠습니까?')) return;                                              // 확인

        const form = document.getElementById('deleteForm');                                                  // 삭제 폼
        const idField = document.getElementById('deleteIds');                                                // hidden(ids)
        if (!form || !idField) { alert('삭제 폼/필드를 찾을 수 없습니다.'); return; }                           // 방어

        idField.value = ids.join(',');                                                                       // 콤마 결합
        form.submit();                                                                                       // 제출
      });
    }
  })();                                                                                                      // 즉시 실행
}); // DOMContentLoaded 끝

// ---------- [등록 폼] 거래처 목록 로드 + 스크롤 select 구성 ----------
// (기존 주석 유지 원칙에 따라 새로운 섹션으로 추가)
document.addEventListener('DOMContentLoaded', async () => {
  const formSlide = document.getElementById('slide-input');                                                  // 등록 슬라이드
  const selectEl = document.getElementById('vendorId');                                                      // 거래처 select(size)
  const filterEl = document.getElementById('vendorFilter');                                                  // 검색 필터
  if (!formSlide || !selectEl) return;

  const ctx = (typeof contextPath === 'string') ? contextPath : '';                                          // JSP 주입 contextPath
  // 서버 API 엔드포인트 가정: /client/list → [{client_id:"C1", client_name:"상호"}, ...]
  const clientApi = `${ctx}/client/list`;                                                                    // 거래처 목록 API

  let rawClients = [];                                                                                       // 전체 원본 목록
  let viewClients = [];                                                                                      // 필터 후 목록

  // 옵션 렌더링
  function renderOptions(items){
    const frag = document.createDocumentFragment();
    items.forEach(c => {
      const opt = document.createElement('option');
      const cid = c.client_id || c.clientId || '';                                                           // 서버 키 변동 허용
      const cnm = c.client_name || c.clientName || '';
      opt.value = cid;
      opt.textContent = cnm ? `${cid} — ${cnm}` : cid;                                                        // "ID — 이름" 형태
      frag.appendChild(opt);
    });
    selectEl.innerHTML = '';
    selectEl.appendChild(frag);
  }

  // 필터링 (ID/이름 포함 검색)
  function applyFilter(keyword){
    if (!keyword) {
      viewClients = rawClients.slice();
    } else {
      const kw = keyword.trim().toLowerCase();
      viewClients = rawClients.filter(c => {
        const cid = (c.client_id || c.clientId || '').toLowerCase();
        const cnm = (c.client_name || c.clientName || '').toLowerCase();
        return cid.includes(kw) || cnm.includes(kw);
      });
    }
    renderOptions(viewClients);
  }

  try {
    const res = await fetch(clientApi, { headers: { 'Accept': 'application/json' }});
    if (!res.ok) throw new Error(`client list ${res.status}`);
    const data = await res.json();

    // 배열 형태 보장 및 기본키 정규화
    rawClients = Array.isArray(data) ? data : [];
    viewClients = rawClients.slice();

    // 렌더
    renderOptions(viewClients);

    // 필터 이벤트
    if (filterEl) filterEl.addEventListener('input', () => applyFilter(filterEl.value));
  } catch (e) {
    console.error('[등록슬라이드] 거래처 로드 실패:', e);
    selectEl.innerHTML = '<option value="">거래처 목록을 불러오지 못했습니다</option>';
  }
});
