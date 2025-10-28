document.addEventListener('DOMContentLoaded', () => {

// ============================
// 삭제 기능
// ============================

    const deleteBtn = document.querySelector('.btm-btn.del');

    if(deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            const checkedIds = Array.from(document.querySelectorAll('input[name="delete_work_order_id"]:checked')).map(checkbox => checkbox.value);

            if(checkedIds.length === 0) {
                alert('삭제할 작업 지시서 항목을 선택해 주세요.');
                return;
            }

            const isConfirmed = confirm(`선택된 작업 지시서 ${checkedIds.length}개를 정말로 삭제하시겠습니까?`);

            if (isConfirmed) {
                try {
                    const response = await fetch(`${contextPath}/wodelete`, {
                        method: 'POST',
                        headers: {
                            // json으로 전송할 거라고 content-type 지정
                            'Content-Type': 'application/json;charset=UTF-8' 
                        },
                        // id 배열을 json 문자열로 변환
                        body: JSON.stringify(checkedIds) 
                    });

                    // fetch로 반환되는 응답 본문을 문자열(text) 형태로 읽어 result에 저장
                    const result = await response.text();

                    // 전송 잘 되고 controller에서 success를 return 받으면,
                    if (response.ok && result === 'success') {
                        alert('선택된 작업 지시서가 성공적으로 삭제되었습니다.');
                        // 삭제 후 목록 페이지 새로고침
                        window.location.href = `${contextPath}/workorderlist`; 
                    }
                    else {
                        alert('작업 지시서 삭제에 실패했습니다. (서버 응답: ' + result + ')');
                    }
                }
                catch (error) {
                    console.error('작업 지시서 삭제 중 통신 오류 발생:', error);
                    alert('작업 지시서 삭제 중 통신 오류가 발생했습니다.');
                }
            }
        })
    }

// ============================
// 상세 슬라이드 : 클릭된 행에 맞게 데이터 넣어서 보여주기
// ============================

// ============================
// 등록/수정 슬라이드 열기. 모드 설정.
// ============================
    let nowSlide = 'new';
    let nowEditId = null;

    let origDetail = null;

    const detailEditBtn = document.querySelector('#detailEditBtn');
    const inSlideTitle = document.querySelector('#slide-title');
    const woIdShow = document.querySelector('#work-order-id-show');
    const woIdVal = document.querySelector('#work-order-id-val');
    const inputWoIdHidden = document.querySelector('#input_work_order_id');

    // 입력 영역들
    const inputWoDate = document.querySelector('#input_work_order_date');
    const inputWoNum = document.querySelector('#input_work_order_num');
    const inputWoFin = document.querySelector('#input_work_order_fin');
    const inputWorkerId = document.querySelector('#input_worker_id');
    const inputCPId = document.querySelector('#input_cp_id');
    const inputItemId = document.querySelector('#input_item_id');
    const slideInput = document.querySelector('#slide-input');

        function openSlideInput(mode, woId = null) {
        // 현재 슬라이드 모드에 따라 변경하기 위해 사용
        nowSlide = mode;
        nowEditId = woId; 
        
        // 등록 상태처럼 입력란 value 정리
        slideInput.querySelector('form').reset();
        inputWoDate.value = '';
        inputWoNum.value = '';
        inputWoFin.value = '';
        inputWorkerId.value = '';
        inputCPId.value = '';
        inputItemId.value = '';
        // 여기! 작업자 select 감안해서 넣은 거라 나중에 upItemIdOpt 수정 ㄱ!
        upItemIdOpt(allWorkers);

        // 상세 -> 수정 전환 시 애니메이션 효과 없애서 바로 전환된 것처럼
        const editNoAnime = (mode === 'edit');

        if (editNoAnime) {
            // 이 부분 
            // 상세 -> 수정 전환 시 즉시 닫히는 것처럼 보이게 애니메이션 효과 없애기.
            detail.style.transition = 'none';
            detail.classList.remove('open');
            void detail.offsetWidth;
            detail.style.transition = 'right 1s ease';

            // 입력, 수정 영역을 즉시 열기 위한 준비
            slideInput.style.transition = 'none';
        }
        
        // mode에 따라 등록, 수정 구분
        if (mode === 'edit' && woId) {
            // 수정 모드 : 슬라이드 제목 영역. 저장 버튼의 value를 수정으로 함.
            inSlideTitle.textContent = '작업 지시서 수정';
            saveBtn.value = '수정';
            // ID 표시. 기존(등록)에는 display: none 상태였음
            woIdShow.style.display = 'flex';
            woIdVal.textContent = woId;
            // hidden에 id 저장
            inputWoIdHidden.value = woId;
            
            // 수정 데이터 로드 및 폼 채우기
            loadData(woId);

        }
        else {
            // 등록 모드 : 슬라이드 제목 영역. 저장 버튼의 value를 등록으로 함.
            inSlideTitle.textContent = '작업 지시서 등록';
            saveBtn.value = '등록';
            // ID 숨김
            woIdShow.style.display = 'none';
            woIdVal.textContent = '';
            inputWoIdHidden.value = '';
            // 상세 슬라이드 닫기
            if (detail.classList.contains('open')) {
                detail.classList.remove('open');
            }
        }

        // 설정한 후 슬라이드 열기
        slideInput.classList.add('open');
    }

// ==========================
// 등록 <-> 수정 슬라이드 : 수정일 경우, 데이터를 채움
// 이쪽 js만 옮겨오고 실제 백 작업 안 함.
// ==========================
    async function loadData(woId) {
        try {
            const response = await fetch(`${contextPath}/workorderdetail?work_order_id=${woId}`);
            if (!response.ok) throw new Error('수정 데이터 로드 오류');

            const data = await response.json();

            // 수정 -> 상세 전환 시 생기는 지연 최대한 방지
            origDetail = data;
            
            // form에 데이터 채우기
            // 현재 재고 기준으로 되어 있으므로 바꾸기!!!
            // 품목 ID (Select): 품목 ID 선택
            inputItemId.value = data.item_id || '';
            
            // 품목 분류/이름 : 품목 ID 변경 이벤트를 수동으로 실행하여 관련 필드 자동 채우기
            const itemOption = Array.
                                    // item_id의 select-option 중에서
                                    from(inputItemId.options).  
                                    // option의 value가 받아온 데이터의 item_id와 일치하는 것을 찾아 반환
                                    find((opt) => {
                                        opt.value === data.item_id;
                                    });
            // 일치하는 게 있다면, 그에 해당하는 분류, 품목명으로 채우기
            if (itemOption) {
                inputItemDiv.value = itemOption.dataset.div || '';
                inputItemName.value = itemOption.dataset.name || '';
            }
            else {
                // 품목 ID가 목록에 없는 경우를 대비하여 직접 채우거나 초기화
                inputItemDiv.value = data.item_div || '';
                inputItemName.value = data.item_name || '';
            }
            
            // 재고 수량 채우기
            document.querySelector('#input_stock_amount').value = data.stock_amount || '';
            
            // 보관 위치 채우기
            document.querySelector('#input_stock_wrap').value = data.stock_wrap || '';

        }
        catch (err) {
            console.error('수정 데이터를 불러오는 중 오류 발생:', err);
            alert('수정 데이터를 불러오는 데 실패했습니다.');
            slideInput.classList.remove('open');
        }
    }

    // 버튼 클릭 시, 슬라이드 열기
    // 신규(등록)
    document.querySelector('.btm-btn.new').addEventListener('click', () => {
        openSlideInput('new');
    });
    // 수정
    if (detailEditBtn) {
        detailEditBtn.addEventListener('click', () => {
            const woIdDisplay = detail.querySelector('.slide-id').textContent;
            const woId = woIdDisplay.split(': ')[1]; 
            if (woId) {
                openSlideInput('edit', woId);
            }
            else {
                alert('수정할 작업 지시서 ID를 찾을 수 없습니다.');
            }
        });
    }

// ==========================
// 등록/수정 슬라이드 닫기 이벤트
// ==========================
    const closeInputBtn = slideInput.querySelector('.close-btn');

    if (closeInputBtn) {

        closeInputBtn.addEventListener('click', async () => {
            // 수정 슬라이드 닫기
            slideInput.classList.remove('open');

            // 현재 모드가 '수정'이었고, 닫기 버튼을 눌렀다면 상세 슬라이드로 복귀
            if (nowSlide === 'edit' && nowEditId && origDetail) {
                
                // 상세 슬라이드로 전환 시 애니메이션 없이 즉시 전환되도록 처리
                slideInput.style.transition = 'none';
                detail.style.transition = 'none';
                void slideInput.offsetWidth;
                slideInput.style.transition = 'right 1s ease';

                fillDetail(detail, origDetail);

                // 상세 슬라이드 열기
                detail.classList.add('open');
                void detail.offsetWidth;

                detail.style.transition = 'right 1s ease';
            }
        });
    }

// ============================
// 등록 / 수정 슬라이드 - 데이터 저장
// 재고 코드에서 수정 필요
// ============================
    const saveBtn = document.querySelector('.submit-btn');

    saveBtn.addEventListener('click', async () => {

        // 입력값 모음집
        const inputWoDate = document.querySelector('#input_work_order_date').value;
        const inputWoNum = document.querySelector('#input_work_order_num').value;
        const inputWoFin = document.querySelector('#input_work_order_fin').value;
        const inputWorkerId = document.querySelector('#input_worker_id').value;
        const inputCPId = document.querySelector('#input_cp_id').value;
        const inputItemId = document.querySelector('#input_item_id').value;

        // 로딩 문제 추가 코드들
        const woId = document.querySelector('#input_work_order_id').value;

        // 값이 잘 들어갔는지 확인.
        // value가 비어있다면 alert 창이 뜨도록.
        // 그런데 이 부분은 여러 개를 입력하지 않았을 경우도 고려해서, 빨간 글씨 띄우는 게 맞는 듯.
        // 우선 지금은 핵심 기능 확인 용도로 여기까지만.
        if (inputWoDate === '') {
            alert('작업 지시일을 선택해 주세요.');
            return;
        }
        if (!inputWoNum || parseInt(inputWoNum)) {
            alert('목표 수량은 0보다 큰 값을 입력해 주세요.');
            document.querySelector('#input_work_order_num').focus();
            return;
        }
        if (inputWorkerId === '') {
            alert('담당자를 선택해 주세요.');
            return;
        }
        if (inputCPId === '') {
            alert('생산 계획을 선택해 주세요.');
            return;
        }

        // 객체 구성
        const woData = {
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
            woData.stock_id = nowEditId; 
        }
        else {
            url = `${contextPath}/woinsert`;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: new URLSearchParams(woData).toString() 
            });

            const result = await response.text();
            const actionText = nowSlide === 'edit' ? '수정' : '등록';

            if (response.ok && result === 'success') {
                alert(`작업 지시서 ${actionText}이 성공적으로 완료되었습니다.`);
                
                if(actionText == '수정') {

                    // 수정 슬라이드 닫기 (애니메이션 제거)
                    slideInput.style.transition = 'none';
                    slideInput.classList.remove('open');
                    void slideInput.offsetWidth;
                    slideInput.style.transition = 'right 1s ease';

                    // 상세 슬라이드 애니메이션 재설정
                    detail.style.transition = 'none';
                    void detail.offsetWidth;
                    detail.style.transition = 'right 1s ease';

                    // 수정된 데이터 다시 로드 및 상세 슬라이드 열기 (비동기)
                    try {
                        const detailResponse = await fetch(
                            `${contextPath}/workorderdetail?work_order_id=${nowEditId}`
                        );
                        if (!detailResponse.ok) {
                            throw new Error('수정 후 상세 데이터 로드 오류');
                        }
                        
                        const detailData = await detailResponse.json();
                        // 원본 데이터도 갱신하여 취소 버튼 클릭 시에도 갱신된 내용이 보이도록 함
                        originalDetailData = detailData;

                        fillDetail(detail, detailData);
                        detail.classList.add('open');
                    }
                    catch (detailError) {
                        console.error('수정 후 상세 화면 복귀 중 오류 발생:', detailError);
                        alert('수정은 완료되었으나, 상세 정보를 불러오는 데 실패했습니다. 목록을 새로고침합니다.');
                        window.location.href = `${contextPath}/workorderlist`;
                    }
                }
                else {
                    window.location.href = `${contextPath}/workorderlist`;
                }
            }
            else {
                alert(`작업 지시서 ${actionText}에 실패했습니다. (서버 응답: ` + result + ')');
            }

        }
        catch (error) {
            console.error(`${nowSlide} 중 오류 발생:`, error);
            alert(`${nowSlide} 중 통신 오류가 발생했습니다.`);
        }


    })

})