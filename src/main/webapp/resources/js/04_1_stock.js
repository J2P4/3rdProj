// ============================
// 상세 슬라이드 : 클릭된 행에 맞게 데이터 넣어서 보여주기
// ============================
//
// 사용 시 수정 필요 영역 : 
//                          jsp의 상세 슬라이드 테이블별 id 지정. 
//                          메인 테이블 데이터행 tr에 data-id 속성 주입.
//                          Controller도 detail에 @RequestBody 준 것 확인해서 수정.
//                          js의 querySelector 등 본인 페이지에 맞게 변경하기.
// ==================================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 메인 테이블(데이터 영역), 상세 슬라이드 지정
    const tableBody = document.querySelector('.table tbody');
    const detail = document.querySelector('#slide-detail');

    // 안 잡히면 리턴되게(실행 안 되게)
    if (!tableBody || !detail) return;

    // 상세 슬라이드 내부 컨텐츠 영역 지정
    const slideContents = detail.querySelector('.slide-contents');

    if (slideContents) {
        slideContents.addEventListener('click', evt => {
            // 이 영역 내에서 클릭이 발생하면 상위 요소(detail)의 클릭 이벤트 작동 안 하도록 설정...
            // 이걸로 슬라이드 내부 클릭할 때 닫히는 문제 해결해보기
            // 안 돼............ 더 상위인 detail로 해도 달라지지 않는 듯.
            // 아니다. 닫기 이벤트 쪽에서 설정 잘못한 문제였다. 해결 완.
            evt.stopPropagation(); 
        });
    }

    // 테이블 행 클릭 이벤트
    tableBody.addEventListener('click', async evt => {
        const row = evt.target.closest('tr');
        if (!row) return;

        // 체크박스 셀 또는 체크박스 클릭 시 무시(체크박스는 첫 번째 열 고정이라고 침)
        const cellIndex = Array.from(row.cells).indexOf(evt.target.closest('td'));
        if (cellIndex === 0) return;

        // 클릭 시 id 추출.
        // 사용하려면 jsp 메인 테이블 tr에 el태그로 data-id 속성 el 태그 써서 넣어줘야 함
        const stockId = row.dataset.id;
        if (!stockId) return;

        try {
            // Ajax로 상세 데이터 요청. jsp의 js 코드 넣는 부분 최상단에 contextPath용 <script></script> 영역 만들어야 함.
            const response = await fetch(`${contextPath}/stockdetail?stock_id=${stockId}`);
            if (!response.ok) throw new Error('서버 응답 오류');

            // 데이터를 json으로 반환하기
            const data = await response.json();

            // 상세 슬라이드에 데이터 채우기(데이터 채우기용 함수(하단에 있음) 호출)
            fillDetail(detail, data);

            // 슬라이드 열기
            detail.classList.add('open');
        }
        catch (err) {
            console.error(err);
            alert('상세 정보를 불러오는 중 오류가 발생했습니다.');
        }
    });

    // 슬라이드 닫기 이벤트. 약간의 문제... 슬라이드 내부 영역(테이블 아닌 부분) 클릭해도 닫힌다...
    const closeDetail = detail.querySelector('.close-btn');
    if (closeDetail) {
        closeDetail.addEventListener('click', () => {
            detail.classList.remove('open')
        });
    }

// ============================
// 등록 / 수정 슬라이드 - 품목 select용
// ============================
//
// 사용 시 수정 필요 영역 : 
//                          - Controller 전체 조회에 품목 조회용 기능 추가시켜둠. 이스케이프 작성 영역 주의해서 적용하기.
//                          - jsp에서 품목 선택 쪽에 name, data~ 등 적용
//                          - 또... 나중에 생각함.
//                          
// ==================================================================================

    // JSP에서 저장된 전체 품목 목록 데이터 로드 및 parse
    const allItems = JSON.parse(allItemsJson || '[]'); 

    // 품목 분류, 품목 ID, 품목명, 등록/수정 슬라이드 전체 지정
    const inputItemDiv = document.querySelector('#input_item_div');
    const inputItemId = document.querySelector('#input_item_id');
    const inputItemName = document.querySelector('#input_item_name');
    const slideInput = document.querySelector('#slide-input');

    // 뭐 하나라도 없으면 경고~
    // console.warn이라고 하는 것도 있더라
    // 말고 console.error, console.table()-테이블 형식????, console.trace()-함수 호출 경로 파악용
    //      console.time() & console.timeEnd()-실행 시간 측정용
    //      console.group() & console.groupEnd()–콘솔 그룹화... 오 유용할 듯
    //      console.count()–특정 코드 실행 수 확인
    if (!inputItemDiv || !inputItemId || !inputItemName || allItems.length === 0) {
        console.warn('품목 데이터 뭐 빠짐');
        return; 
    }

     // 함수 1: 품목 ID select의 옵션을 갱신

    function upItemIdOpt(itemToUp) {
        // 첫 번째 옵션 (index 0 - 선택이라고 해둔 부분)을 제외하고 모두 삭제
        while (inputItemId.options.length > 1) {
            inputItemId.remove(1);
        }
        
        // 새로운 옵션 추가
        itemToUp.forEach(item => {
            // 옵션 만들기
            const option = document.createElement('option');
            // value는 item_id
            option.value = item.item_id;
            // id와 함께 이름 표시
            option.textContent = `${item.item_id} - ${item.item_name}`;
            // item_name을 data-name 속성에 저장
            option.dataset.name = item.item_name; 
            inputItemId.appendChild(option);
        });

        // 품목 ID select를 "선택" 상태로 초기화
        inputItemId.value = '';
    }

    // 함수 2: 품목 분류 및 품목 이름 검색 조건에 따라 품목 목록을 필터링

    function filterItems() {
        // 선택된 품목 분류, 입력된 품목명 검색어
        const selectedDiv = inputItemDiv.value;
        const searchName = inputItemName.value.trim().toLowerCase();
        
        let filteredItems = allItems;

        // 품목 분류 필터링
        // 분류가 ''가 아니면(비어 있지 않으면) 코드 실행 
        if (selectedDiv !== '') {
            // filteredItems에서 item_div가 selectedDiv랑 같은 것만 남겨서 새로 갱신
            filteredItems = filteredItems.filter((item) => {
                return item.item_div === selectedDiv;
            });
        }

        // 품목 이름 검색 필터링 (대소문자 구분 없이 부분 일치 검색)
        // 분류가 ''가 아니면(안 비어 있으면) 코드 실행
        if (searchName !== '') {   
            filteredItems = filteredItems.filter((item) => {
                return item.item_name && item.item_name.toLowerCase().includes(searchName)
            });
        }

        // 품목 ID select 갱신
        upItemIdOpt(filteredItems);
    }

    // 품목 분류 또는 품목 이름 입력 시 필터링(함수 2) 실행
    inputItemDiv.addEventListener('change', filterItems);
    inputItemName.addEventListener('input', filterItems);

    // 품목 ID 선택 시 품목 이름 input 자동 채우기
    inputItemId.addEventListener('change', (evt) => {
        const selectedOption = evt.target.options[evt.target.selectedIndex];
        
        // 선택된 품목 ID의 품목명으로 검색 필드를 채우기
        if (selectedOption && selectedOption.dataset.name) {
            inputItemName.value = selectedOption.dataset.name; 
        } 
    });

    // 신규(등록) 버튼 클릭 시 슬라이드 열기 및 초기화
    document.querySelector('.btm-btn.new').addEventListener('click', () => {
        slideInput.classList.add('open');
        // 초기화 : 모든 필터와 선택값 초기화
        inputItemDiv.value = '';
        inputItemName.value = '';
        // 전체 품목으로 다시 갱신
        upItemIdOpt(allItems); 
        inputItemId.value = '';
    });




// ============================
// 등록 / 수정 슬라이드 - 데이터 저장
// ============================
//
// 사용 시 수정 필요 영역 : 
//                          -
//                          
// ==================================================================================


});

// 상세 슬라이드에 데이터를 채우는 함수
function fillDetail(slide, data) {
    // json 없으면 리턴
    if (!data) return;

    // 재고 ID 표시
    slide.querySelector('.slide-id').textContent = `재고 ID: ${data.stock_id}`;

    // 첫 번째 테이블 (품목 정보). 테이블에 id 속성 넣어놔야 함.
    // 전달인자로 data를 받아, 거기에서 특정 변수만 뽑아오는 구조.
    const itemRow = slide.querySelector('#itemDetail tbody tr');
    if (itemRow) {
        itemRow.children[0].textContent = data.item_id || '';
        itemRow.children[1].textContent = data.item_div || '';
        itemRow.children[2].textContent = data.item_name || '';
    }

    // 두 번째 테이블 (재고 수량, 보관 위치). 테이블에 id 속성 넣어놔야 함.
    const stockRow = slide.querySelector('#stockDetail tbody tr');
    if (stockRow) {
        stockRow.children[0].textContent = data.stock_amount || '';
        stockRow.children[1].textContent = data.stock_wrap || '';
    }

}


