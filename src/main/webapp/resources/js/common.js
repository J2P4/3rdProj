document.addEventListener('DOMContentLoaded', () => {

    console.log('plz... plz...');

    // ============================
    // 슬라이드
    // ============================

    console.log('그냥 아예 console.log가 안 뜨는 건지 확인용');
    const newBtn = document.querySelector('.btm-btn.new');
    const slideInput = document.querySelector('#slide-input');

    // 작성 버튼 누를 때 뜨도록
    newBtn.addEventListener('click', () => {
        slideInput.classList.add('open');
    });
    // 취소 버튼 누를 때 닫히도록
    // 지금 이 부분 이슈인데... querySelectorAll로 해서 할 게 아니라, 정확히 상세의 취소라고 설정하기.
    // 등록 & 수정이 한 페이지에 묶여있으므로, stock.js의 mode 영역에서 수정해서 해결을 보든 해야 함.
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.slide').classList.remove('open');
        });
    });

    
    // ============================
    // 체크 박스 전체 선택
    // ============================
    
    console.log('체크박스 코드 실행 시작 (설마 슬라이드가 문제인지 확인용)');

    // .table 클래스 내의 table(기본 조회 영역 테이블)의 모두 선택과 tbody, tbody의 체크박스
    const chkAll = document.querySelector('#chkAll');
    console.log('chkAll:', chkAll);
    const mainTable = document.querySelector('.table table');
    console.log('mainTable:', mainTable);
    const tbody =  mainTable ? mainTable.querySelector('tbody') : null;
    console.log('tbody:', tbody);
    const getRowChecks = () => {
        // tbody가 없을 경우 빈 배열 반환하여 오류 방지
        if (!tbody) return []; 
        return tbody.querySelectorAll('input.rowChk:not([disabled])');
    };
    // 모두 선택 체크되어 있으면 바꾸도록
    if (chkAll) {
        chkAll.addEventListener('change', () => {
                console.log('전체 체크박스 addEventListener... 작동은 하는지.');

                const rowChecks = getRowChecks();

                // 확인용...
                console.log('전체 선택 체크 여부:', chkAll.checked);
                console.log('tbody 체크박스 개수:', rowChecks.length);
                console.log('전체 선택 됐나??:', chkAll.checked);
                // forEach로 돌며 각 체크박스의 checked 설정을 chkAll의 checked와 동일하게
                rowChecks.forEach(chk => chk.checked = chkAll.checked);
        });
    }
    // tbody에 있는 거 체크 해제되면 전체 선택도 해제되도록
    mainTable.addEventListener('change', (event) => {
        if (event.target.classList.contains('rowChk') && chkAll) {
            const rowChecks = getRowChecks();
            const checkedCount = Array.from(rowChecks).every(chk => chk.checked);
            
            console.log('checkedCount: ', checkedCount);

            // 전체 체크박스의 상태를 현재 체크된 개수와 전체 개수를 비교하여 설정
            chkAll.checked = checkedCount && (rowChecks.length > 0); // 데이터가 아예 없을 경우 (길이가 0)에는 체크 해제 상태 유지
        }
    // });

});



    // ============================
    // 날짜 선택 시, 제약조건 설정
    // ============================

    const form = document.querySelector('form.filter');
    const from = document.querySelector('#fromDate');
    const to = document.querySelector('#toDate');

    console.log('from:', from, 'to:', to, 'plz...');


    // 날짜 관련 input 없는 페이지면 devTools 콘솔 오류 뜰 수 있음. 신경 쓰지 말고 진행.
    function clampMinMax() {
        if (from.value) 
            to.min = from.value;
        else 
            to.removeAttribute('min');
        if (to.value) 
            from.max = to.value;
        else 
            from.removeAttribute('max');
        }
    function fixIfInvalid() {
        if (from.value && to.value && to.value < from.value) {
            to.value = from.value;
        }
    }
    clampMinMax();
    fixIfInvalid();
    from.addEventListener('change', () => {
        clampMinMax();
        fixIfInvalid();
    });
    to.addEventListener('change', () => {
        clampMinMax();
        fixIfInvalid();
    });
    form.addEventListener('submit', function (e) {
        if (from.value && to.value && to.value < from.value) {
            e.preventDefault();
            alert('끝 날짜는 시작 날짜보다 빠를 수 없습니다.');
            to.focus();
        }
    });
 

});