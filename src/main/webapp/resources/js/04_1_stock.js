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
