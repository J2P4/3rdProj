document.addEventListener('DOMContentLoaded', () => {

    console.log('plz... plz...');

    // ============================
    // 슬라이드
    // ============================

    console.log('그냥 아예 console.log가 안 뜨는 건지 확인용');
    const newBtn = document.querySelector('.btm-btn.new');
    const slideInput = document.querySelector('#slide-input');

    // 작성 버튼 누를 때 뜨도록
    newBtn?.addEventListener('click', () => slideInput.classList.add('open'));

    // 취소 버튼 누를 때 닫히도록
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.slide')?.classList.remove('open');
        });
    });

    
    // ============================
    // 체크 박스 전체 선택
    // ============================

    console.log('체크박스 코드 실행 시작 (설마 슬라이드가 문제인지 확인용)');

    const chkAll = document.querySelector('#chkAll');
    console.log('chkAll:', chkAll);
    const mainTable = document.querySelector('.table table');
    console.log('mainTable:', mainTable);
    const tbody = mainTable ? mainTable.querySelector('tbody') : null;
    console.log('tbody:', tbody);
    const getRowChecks = () => (tbody ? tbody.querySelectorAll('input.rowChk:not([disabled])') : []);

    // 모두 선택 체크되어 있으면 바꾸도록
    chkAll?.addEventListener('change', () => {
        console.log('전체 체크박스 addEventListener... 작동은 하는지.');
        const rowChecks = getRowChecks();
        console.log('tbody 체크박스 개수:', rowChecks.length);
        rowChecks.forEach(chk => chk.checked = chkAll.checked);
    });

    // tbody에 있는 거 체크 해제되면 전체 선택도 해제되도록
    mainTable?.addEventListener('change', (event) => {
        if (event.target.classList.contains('rowChk') && chkAll) {
            const rowChecks = getRowChecks();
            const allChecked = Array.from(rowChecks).every(chk => chk.checked);
            chkAll.checked = allChecked && rowChecks.length > 0;
        }
    });


    // ============================
    // 날짜 선택 시, 제약조건 설정
    // ============================

    const form = document.querySelector('form.filter');
    const from = document.querySelector('#fromDate');
    const to = document.querySelector('#toDate');

    console.log('from:', from, 'to:', to, 'plz...');

    function clampMinMax() {
        if (from?.value) to.min = from.value;
        else to?.removeAttribute('min');
        if (to?.value) from.max = to.value;
        else from?.removeAttribute('max');
    }

    function fixIfInvalid() {
        if (from?.value && to?.value && to.value < from.value) {
            to.value = from.value;
        }
    }

    clampMinMax();
    fixIfInvalid();

    from?.addEventListener('change', () => {
        clampMinMax();
        fixIfInvalid();
    });
    to?.addEventListener('change', () => {
        clampMinMax();
        fixIfInvalid();
    });
    form?.addEventListener('submit', (e) => {
        if (from?.value && to?.value && to.value < from.value) {
            e.preventDefault();
            alert('끝 날짜는 시작 날짜보다 빠를 수 없습니다.');
            to.focus();
        }
    });


    // ============================
    // 테이블 토글(정렬) 기능
    // ============================

    const table = document.querySelector('.table table');
    if (!table) return;
    const headers = table.tHead?.rows[0]?.cells || [];
    const Tbody = table.tBodies[0];
    if (!Tbody) return;

    // 원래 순서 보존용 인덱스
    Array.from(Tbody.rows).forEach((tr, i) => tr.dataset.index = i);
    const sortState = new Map(); // 현재 정렬중인 열/방향 저장

    [...headers].forEach((th, idx) => {
        if (th.classList.contains('chkbox')) return; // 체크박스 열 제외
        th.tabIndex = 0; // 키보드 접근성
        const type = th.dataset.type || 'text';

        const trigger = () => sortBy(idx, type, th);
        th.addEventListener('click', trigger);
        th.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                trigger();
            }
        });
    });

    function cellText(tr, idx) {
        return tr.cells[idx]?.textContent.trim() ?? '';
    }

    function parseByType(val, type) {
        if (type === 'number') {
            return parseFloat(val.replace(/[^0-9.-]/g, '')) || 0;
        }
        if (type === 'date') {
            const norm = val.replace(/[./]/g, '-');
            const t = Date.parse(norm);
            return isNaN(t) ? -Infinity : t;
        }
        return val.toLowerCase();
    }

    function sortBy(colIdx, type, thEl) {
        const rows = Array.from(Tbody.querySelectorAll('tr'));
        const dataRows = rows.filter(r => !r.querySelector('td[colspan]')); // 안내행 제외

        const asc = !(sortState.get(colIdx) === true); // 방향 토글
        sortState.clear();
        sortState.set(colIdx, asc);

        dataRows.sort((a, b) => {
            const A = parseByType(cellText(a, colIdx), type);
            const B = parseByType(cellText(b, colIdx), type);
            if (A < B) return asc ? -1 : 1;
            if (A > B) return asc ? 1 : -1;
            return (a.dataset.index - b.dataset.index);
        });

        // 시각적 표시 업데이트
        [...headers].forEach(h => h.classList.remove('asc', 'desc'));
        thEl.classList.add(asc ? 'asc' : 'desc');

        // 재삽입
        const frag = document.createDocumentFragment();
        const infoRows = rows.filter(r => r.querySelector('td[colspan]'));
        dataRows.forEach(r => frag.appendChild(r));
        infoRows.forEach(r => frag.appendChild(r)); // 안내행은 마지막에
        Tbody.appendChild(frag);
    }

    console.log('테이블 정렬 기능 활성화 완료');

});
