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
// 등록 / 수정 슬라이드 - 공통
// ============================
//
// 사용 시 수정 필요 영역 : 공통 넣으면서 저장 쪽도 변경됨. 다시 주석 달기.
// ==================================================================================
    // 현재 슬라이드 모드 (new: 신규 등록, edit: 수정)
    let nowSlide = 'new'; 
    let nowEditId = null;

    const detailEditBtn = document.querySelector('#detailEditBtn');
    const inSlideTitle = document.querySelector('#slide-title');
    const stockIdShow = document.querySelector('#stock-id-show');
    const stockIdVal = document.querySelector('#stock-id-val');
    const inputStockIdHidden = document.querySelector('#input_stock_id');

    // 함수: 등록/수정 슬라이드를 열고 모드를 설정하는 함수

    function openSlideInput(mode, stockId = null) {
        // 현재 슬라이드 모드에 따라 변경하기 위해
        nowSlide = mode;
        nowEditId = stockId; 
        
        // 초기화: 등록 모드처럼 필드 클리어
        slideInput.querySelector('form').reset();
        inputItemDiv.value = '';
        inputItemName.value = '';
        upItemIdOpt(allItems); 
        inputItemId.value = '';
        
        // 모드에 따른 등록, 수정 나누기
        if (mode === 'edit' && stockId) {
            // 수정 모드
            inSlideTitle.textContent = '재고 수정';
            saveBtn.value = '수정';
            // ID 표시
            stockIdShow.style.display = 'flex';
            stockIdVal.textContent = stockId;
            // hidden에 id 저장
            inputStockIdHidden.value = stockId;
            
            // 3. 수정 데이터 로드 및 폼 채우기
            loadStockDataForEdit(stockId);

        }
        else {
            // 신규 등록 모드
            inSlideTitle.textContent = '재고 등록';
            saveBtn.value = '등록';
            // ID 숨김
            stockIdShow.style.display = 'none';
            stockIdVal.textContent = '';
            inputStockIdHidden.value = '';
        }

        // 슬라이드 열기
        slideInput.classList.add('open');
        detail.classList.remove('open'); // 상세 슬라이드 닫기
    }

    // 함수: 수정 데이터를 불러와 폼을 채우는 비동기 함수
    async function loadStockDataForEdit(stockId) {
        try {
            const response = await fetch(`${contextPath}/stockdetail?stock_id=${stockId}`);
            if (!response.ok) throw new Error('수정 데이터 로드 오류');

            const data = await response.json();
            
            // 폼 필드에 데이터 채우기
            // 품목 ID (Select): 품목 ID 선택
            inputItemId.value = data.item_id || '';
            
            // 품목 분류/이름 (Input/Select): 품목 ID 변경 이벤트를 수동으로 실행하여 연동 필드 자동 채우기
            const itemOption = Array.from(inputItemId.options).find(opt => opt.value === data.item_id);
            if (itemOption) {
                inputItemDiv.value = itemOption.dataset.div || '';
                inputItemName.value = itemOption.dataset.name || '';
            }
            else {
                // 품목 ID가 목록에 없는 경우를 대비하여 직접 채우거나 초기화
                inputItemDiv.value = data.item_div || '';
                inputItemName.value = data.item_name || '';
            }
            
            // 재고 수량
            document.querySelector('#input_stock_amount').value = data.stock_amount || '';
            
            // 보관 위치
            document.querySelector('#input_stock_wrap').value = data.stock_wrap || '';

        }
        catch (err) {
            console.error('수정 데이터를 불러오는 중 오류 발생:', err);
            alert('수정 데이터를 불러오는 데 실패했습니다.');
            slideInput.classList.remove('open');
        }
    }    

// ============================
// 등록 / 수정 슬라이드 - 품목 select용
// ============================
//
// 사용 시 수정 필요 영역 : 
//                          - Controller 전체 조회에 품목 조회용 기능 추가시켜둠. 이스케이프 작성 영역 주의해서 적용하기.
//                          - jsp에서 품목 선택 쪽에 name, data~ 등 적용
//                          - 또... 나중에 생각함.
//                          - 지금의 이슈. 품목 ID 선택했을 때 분류 갱신이 안 됨. -> 해결함. option.dataset.div 정의 안 해서였음.
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
            // item_name, item_div를 data-name 속성에 저장
            option.dataset.name = item.item_name;
            option.dataset.div = item.item_div; 

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
        
        // 왜 품목 분류는 안 넣었냐... 하자.
        if (selectedOption && selectedOption.dataset.div) {
            inputItemDiv.value = selectedOption.dataset.div;
        }

        // 선택된 품목 ID의 품목명으로 검색 필드를 채우기
        if (selectedOption && selectedOption.dataset.name) {
            inputItemName.value = selectedOption.dataset.name; 
        } 
    });

    // 신규(등록) 버튼 클릭 시 슬라이드 열기 및 초기화
    document.querySelector('.btm-btn.new').addEventListener('click', () => {
        // 여기 코드는 잘 보기...
        openSlideInput('new');

        slideInput.classList.add('open');
        // 초기화 : 모든 필터와 선택값 초기화
        inputItemDiv.value = '';
        inputItemName.value = '';
        // 전체 품목으로 다시 갱신
        upItemIdOpt(allItems); 
        inputItemId.value = '';
    });

    // 상세 슬라이드 '수정' 버튼 클릭 이벤트
    if (detailEditBtn) {
        detailEditBtn.addEventListener('click', () => {
            // 상세 슬라이드의 재고 ID를 가져옴
            const stockIdDisplay = detail.querySelector('.slide-id').textContent;
            // "재고 ID: CYYMMDDXXXX" 형태에서 ID만 추출
            const stockId = stockIdDisplay.split(': ')[1]; 
            
            if (stockId) {
                openSlideInput('edit', stockId);
            }
            else {
                alert('수정할 재고 ID를 찾을 수 없습니다.');
            }
        });
    }




// ============================
// 등록 / 수정 슬라이드 - 데이터 저장
// 여기 코드 변경 없이 수정 관련 js만 추가하고 싶지만, 어쩔 수 없으면 수정하기.
// ============================
//
// 사용 시 수정 필요 영역 : 
//                          - 등록 버튼 클래스에 submit-btn 추가
//                          - 입력 영역별 name 설정해두기
//                          - controller는 기존 등록문만 제대로 등록해놨으면 문제 없음
//                          
// ==================================================================================

const saveBtn = document.querySelector('.submit-btn');

saveBtn.addEventListener('click', async () => {

    // 입력값 모음집
    const item_id = document.querySelector('#input_item_id').value;
    const item_div = document.querySelector('#input_item_div').value;
    const item_name = document.querySelector('#input_item_name').value;
    const stock_amount = document.querySelector('#input_stock_amount').value;
    const stock_wrap = document.querySelector('#input_stock_wrap').value;

    // 값이 잘 들어갔는지 확인.
    // value가 비어있다면 alert 창이 뜨도록.
    // 그런데 이 부분은 여러 개를 입력하지 않았을 경우도 고려해서, 빨간 글씨 띄우는 게 맞는 듯.
    // 우선 지금은 핵심 기능 확인 용도로 여기까지만.
    if (item_id === '') {
        alert('품목 ID를 선택해 주세요.');
        return;
    }
    if (item_div === '') {
        alert('품목 분류를 선택해 주세요.');
        return;
    }
    if (item_name === '') {
        alert('품목명을 입력해 주세요.');
        return;
    }
    if (!stock_amount || parseInt(stock_amount) <= 0) {
        alert('재고 수량은 0보다 큰 값을 입력해 주세요.');
        document.querySelector('#input_stock_amount').focus();
        return;
    }
    if (stock_wrap === '') {
        alert('보관 위치를 선택해 주세요.');
        return;
    }

    // 객체 구성
    const stockData = {
        item_id: item_id,
        item_div: item_div,
        item_name: item_name,
        // 숫자 변환 필요
        stock_amount: parseInt(stock_amount),
        stock_wrap: stock_wrap
    };

    if (nowSlide === 'edit') {
        url = `${contextPath}/stockupdate`;
        // 수정 시에는 stock_id도 전송해야 함
        stockData.stock_id = nowEditId; 
    } else {
        url = `${contextPath}/stockinsert`;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: new URLSearchParams(stockData).toString() 
        });

        const result = await response.text();
        const actionText = nowSlide === 'edit' ? '수정' : '등록';

        if (response.ok && result === 'success') {
            alert(`재고 ${actionText}이 성공적으로 완료되었습니다.`);
            slideInput.classList.remove('open');
            window.location.href = `${contextPath}/stocklist`; 
        }
        else {
            alert(`재고 ${actionText}에 실패했습니다. (서버 응답: ` + result + ')');
        }

    }
    catch (error) {
        console.error(`${nowSlide} 중 오류 발생:`, error);
        alert(`${nowSlide} 중 통신 오류가 발생했습니다.`);
    }

    // try {
    //     // AJAX POST 요청
    //     const response = await fetch(`${contextPath}/stockinsert`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    //         },
    //         // DTO 필드명에 맞게 URL 쿼리 문자열 형식으로 변환하여 전송
    //         body: new URLSearchParams(stockData).toString() 
    //     });

    //     const result = await response.text();

    //     // response.ok를 만족하고, result가 success라면(이건 controller에 return으로 작성해둠)
    //     if (response.ok && result === 'success') {
    //         alert('재고 등록이 성공적으로 완료되었습니다.');
    //         slideInput.classList.remove('open');
    //         // 등록 후 목록 페이지를 새로고침하여 반영
    //         window.location.href = `${contextPath}/stocklist`; 
    //     }
    //     else {
    //         // 여기 서버 응답 영역은 최종적으로 확정 지을 때 수정할 예정.
    //         // 지금은 유사 console.log로 사용
    //         alert('재고 등록에 실패했습니다. (서버 응답: ' + result + ')');
    //     }

    // }
    // catch (error) {
    //     console.error('등록 중 오류 발생:', error);
    //     alert('등록 중 통신 오류가 발생했습니다.');
    // }

})

// ============================
// 등록 <-> 수정 슬라이드 - 전환 기능
// ============================
//
// 사용 시 수정 필요 영역 : 
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


