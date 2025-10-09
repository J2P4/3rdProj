// /resources/js/common2.js
// 공용 common.js 이후에 로드되는 "페이지 전용 확장 스크립트"

document.addEventListener('DOMContentLoaded', () => {
    // 유틸리티 함수
    const $  = (sel, root=document) => root.querySelector(sel);
    const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel)); // Array.from 유지 (호환성 고려)

    // 슬라이드 토글
    function openSlide(id){ const el = document.getElementById(id); if (el) el.classList.add('open'); }
    function closeSlide(id){ const el = document.getElementById(id); if (el) el.classList.remove('open'); }

    // ===== 모드 관리: view / edit / create =====
    const titleEl   = $('#slide-input .silde-title h2');
    const submitBtn = $('#slide-input .slide-btn:not(.close-btn)'); // "수정"/"저장"
    const saveForm  = $('#slideSaveForm');
    let mode = 'view';

    function applyMode() {
        // 편집 가능한 필드 목록
        const editableIds = ['itemName','vendorId','itemDiv','unitPrice','unit'];

        // ★ 개선 사항 1: 모드에 따라 필드 활성화/비활성화
        editableIds.forEach(id=>{
            const el = document.getElementById(id);
            // VIEW 모드일 때만 disabled=true (비활성화) 설정
            if (el) el.disabled = (mode === 'view');
        });

        // 표시용 itemIdView는 항상 읽기 전용 유지
        const itemIdView = document.getElementById('itemIdView');
        if (itemIdView) itemIdView.readOnly = true;

        // 타이틀 및 버튼 텍스트 설정
        if (mode === 'view') {
            if (titleEl) titleEl.textContent = '품목 상세';
            if (submitBtn) submitBtn.value = '수정';
        } else if (mode === 'edit') {
            if (titleEl) titleL.textContent = '품목 수정';
            if (submitBtn) submitBtn.value = '저장';
        } else if (mode === 'create') {
            if (titleEl) titleEl.textContent = '품목 등록';
            if (submitBtn) submitBtn.value = '저장';
        }
    }
    function setViewMode(){ mode = 'view'; applyMode(); }
    function setEditMode(){ mode = 'edit'; applyMode(); }
    function setCreateMode(){ mode = 'create'; applyMode(); }

    // 초기 상태 설정
    setViewMode();

    // ===== 신규 버튼 → 등록 모드 =====
    (function bindNewBtn(){
        const newBtn = $('.btm-btn.new');
        if (!newBtn) return;
        if (newBtn._bound_common2_) return; 
        newBtn._bound_common2_ = true;

        newBtn.addEventListener('click', () => {
            // 입력 필드 초기화
            ['id','version','itemName','itemDiv','unitPrice','unit'].forEach(id=>{
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            const itemIdView = document.getElementById('itemIdView');
            if (itemIdView) itemIdView.value = '';
            
            setCreateMode(); // 타이틀: 품목 등록 / 버튼: 저장
            openSlide('slide-input');
        });
    })();

    // ===== 행 클릭 → 상세 모드 (DB에서 값 불러와서 채우고 열기) ※ thead가 아닌 tbody에만 =====
    (function bindRowClick(){
        const tbody = document.querySelector('.table table');
        if (!tbody) return;
        if (tbody._bound_common2_) return;
        tbody._bound_common2_ = true;

        // ★ 개선 사항 2: 비동기 통신을 위해 async 키워드 추가
        tbody.addEventListener('click', async (e) => { 
            const tr = e.target.closest('tr');
            if (!tr || tr.hasAttribute('aria-hidden')) return;
            if (e.target.matches('input[type="checkbox"]')) return;
            if (e.target.tagName === 'A' || e.target.closest('a')) return;

            // 1. ID 값 추출
            const d = tr.dataset || {};
            // data-id 우선, 없으면 두 번째 셀(index 1) 텍스트 폴백
            const id = d.id ?? (tr.querySelectorAll('td')[1]?.textContent.trim() || ''); 

            if (!id) {
                console.error('클릭된 행에서 ID 값을 찾을 수 없습니다.');
                return;
            }
            
            // 2. 서버에서 상세 데이터 불러오기
            try {
                // 실제 API 엔드포인트에 맞게 URL을 수정하세요.
                const response = await fetch(`/api/item/details/${id}`); 
                
                if (!response.ok) {
                    throw new Error(`HTTP 오류: ${response.status} - ID: ${id}`);
                }

                // 서버에서 받은 상세 데이터 객체
                const itemDetails = await response.json(); 
                
                // 3. 필드 매핑 및 데이터 준비 (서버 응답 데이터 사용)
                const map = {
                    id: itemDetails.id, 
                    itemName: itemDetails.itemName,
                    itemDiv: itemDetails.itemDiv,
                    // 콤마 제거 로직은 서버 데이터가 정제되었다면 불필요하지만, 안전을 위해 유지 가능
                    unitPrice: String(itemDetails.unitPrice).replace(/,/g,''), 
                    unit: itemDetails.unit,
                    itemIdView: itemDetails.id,
                    version: itemDetails.version || '' // 버전 필드는 서버에서 받아야 함
                };
                
                // 4. 화면 요소에 값 채우기
                Object.entries(map).forEach(([k,v])=>{
                    const el = document.getElementById(k);
                    if (el) el.value = v ?? '';
                });

                // 5. 모드 전환 및 슬라이드 열기
                setViewMode(); // 타이틀: 품목 상세 / 버튼: 수정
                openSlide('slide-input');

            } catch (error) {
                console.error('품목 상세 정보를 불러오는 중 오류 발생:', error);
                alert('데이터를 불러오는데 실패했습니다.');
            }
        });
    })();

    // ===== "수정/저장" 버튼 동작 =====
    (function bindSubmitMode(){
        if (!submitBtn || !saveForm) return;
        if (submitBtn._bound_common2_) return;
        submitBtn._bound_common2_ = true;

        submitBtn.addEventListener('click', (e) => {
            if (mode === 'view') {
                e.preventDefault();      // 첫 클릭: 폼 제출 방지 및 편집 모드 전환만
                setEditMode();           // 타이틀: 품목 수정 / 버튼: 저장
            }
            // mode가 edit/create면 폼 제출(저장) 진행 → 서버 처리
        });
    })();

    // ===== 취소 버튼 → 닫고 상세 모드 복원 =====
    (function bindCloseBtns(){
        $$('.close-btn').forEach(btn=>{
            if (btn._bound_common2_) return;
            btn._bound_common2_ = true;

            btn.addEventListener('click', () => {
                setViewMode();
                const slide = btn.closest('.slide');
                if (slide) slide.classList.remove('open');
            });
        });
    })();

    // ===== 선택 삭제 제출 (#deleteForm 사용) =====
    (function bindDelete(){
        const delBtn  = $('.btm-btn.del');
        const delForm = $('#deleteForm');
        const delIds  = $('#deleteIds');
        if (!delBtn || !delForm || !delIds) return;
        if (delBtn._bound_common2_) return;
        delBtn._bound_common2_ = true;

        delBtn.addEventListener('click', ()=>{
            const ids = $$('.table tbody input[name="rowChk"]:checked').map(cb=>cb.value);
            if (ids.length === 0) { alert('삭제할 행을 선택하세요.'); return; }
            if (!confirm(`${ids.length}건을 삭제하시겠습니까?`)) return;
            delIds.value = ids.join(',');
            delForm.submit();
        });
    })();

    // ===== 체크박스 전체선택 보조상태(indeterminate) 보강 =====
    (function enhanceSelectAll(){
        const chkAll = document.getElementById('chkAll');
        const table  = document.querySelector('.table table');
        if (!chkAll || !table) return;
        if (table._enhanced_common2_) return;
        table._enhanced_common2_ = true;

        table.addEventListener('change', (event) => {
            if (event.target && event.target.name === 'rowChk') {
                const boxes = Array.from(table.querySelectorAll('tbody input[name="rowChk"]'));
                const total = boxes.length;
                const checked = boxes.filter(b => b.checked).length;
                chkAll.checked = (total > 0 && checked === total);
                chkAll.indeterminate = (checked > 0 && checked < total);
            }
        });
    })();

    // ===== 유효성: 단가 0 이상 강제 =====
    (function guardUnitPrice(){
        const el = document.getElementById('unitPrice');
        if (!el) return;
        el.setAttribute('min','0');
        if (el._bound_common2_) return;
        el._bound_common2_ = true;

        el.addEventListener('input', () => {
            const v = parseFloat(el.value);
            // v < 0인 경우에만 0으로 설정하여 NaN 입력 시 필드를 비워둘 수 있도록 처리 개선
            if (v < 0) el.value = '0';
        });
    })();
});