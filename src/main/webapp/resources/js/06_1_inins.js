document.addEventListener('DOMContentLoaded', () => {

    // 변수 모음
    const slideInput = document.querySelector('#slide-input');
    const inputStockId = document.querySelector('#input_stock_id');
    const inputInInsDate = document.querySelector('#input_inIns_date');
    const inputInInsGood = document.querySelector('#input_inIns_good');
    const inputInInsBad = document.querySelector('#input_inIns_bad');
    const inputWorkerName = document.querySelector('#input_worker_name');
    const itemDiv = document.querySelector('#input_item_div');
    const inInsId = document.querySelector('#input_inIns_id');
    const inspectionResultIdValue = inInsId ? inInsId.value : null;
    
    // ============================
    // 삭제 기능
    // ============================
    
        // 삭제 버튼 지정
        const deleteBtn = document.querySelector('.btm-btn.del');
    
        // 삭제 버튼 클릭 이벤트
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
                // 선택된 재고 ID 목록 추출
                const checkedIds = Array.from(document.querySelectorAll('input[name="delete_InIns_id"]:checked')).map(checkbox => checkbox.value);
    
                // 선택 항목 없으면(배열 길이 0이면) 경고 창 띄우기
                if (checkedIds.length === 0) {
                    alert('삭제할 품질 검사 내역을 선택해 주세요.');
                    return;
                }
    
                // 확인 창 표시 : 배열 길이로 개수 표시
                const isConfirmed = confirm(`선택된 검사 내역 ${checkedIds.length}개를 정말로 삭제하시겠습니까?`);
    
                // 컨펌 창에서 확인을 눌렀다면,
                if (isConfirmed) {
                    try {
                        // ajax 요청. POST 방식으로 선택된 id 배열을 json으로로 전송
                        const response = await fetch(`${contextPath}/inInsdelete`, {
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
                            alert('선택된 검사 내역이 성공적으로 삭제되었습니다.');
                            // 삭제 후 목록 페이지 새로고침
                            window.location.href = `${contextPath}/inInslist`; 
                        }
                        else {
                            alert('검사 내역 삭제에 실패했습니다. (서버 응답: ' + result + ')');
                        }
                    }
                    catch (error) {
                        console.error('검사 내역 삭제 중 통신 오류 발생:', error);
                        alert('삭제 중 통신 오류가 발생했습니다.');
                    }
                }
            });
        }

    // ============================
    // 상세 페이지 기능
    // ============================

    const tableBody = document.querySelector('.table tbody');
    const detail = document.querySelector('#slide-detail');
    
    if (!tableBody || !detail) return;

    const slideContents = detail.querySelector('.slide-contents');

    if (slideContents) {
        slideContents.addEventListener('click', evt => {
            evt.stopPropagation(); 
        });
    }

    tableBody.addEventListener('click', async evt => {
        const row = evt.target.closest('tr');
        if (!row) return;

        const cellIndex = Array.from(row.cells).indexOf(evt.target.closest('td'));
        if (cellIndex === 0) return;

        const inResultId = row.dataset.id;
        if (!inResultId) return;

        try {
            const response = await fetch(`${contextPath}/inInsdetail?inspection_result_id=${inResultId}`);
            if (!response.ok) throw new Error('서버 응답 오류');

            const data = await response.json();

            fillDetail(detail, data);

            detail.classList.add('open');
        }
        catch (err) {
            console.error(err);
            alert('상세 정보를 불러오는 중 오류가 발생했습니다.');
        }
    });

    const closeDetail = detail.querySelector('.close-btn');
    if (closeDetail) {
        closeDetail.addEventListener('click', () => {
            detail.classList.remove('open')
        });
    }

    function fillDetail(slide, data) {
        if (!data) {
            console.log("상세 : 데이터도 없음");
            return;
        }

        slide.querySelector('.slide-id').textContent = `품질 검사 ID: ${data.inspection_result_id}`;

        const inspectionInfo = slide.querySelector('#inspectionInfo tbody tr');
        if (inspectionInfo) {
            inspectionInfo.children[0].textContent = formatDate(data.inspection_result_date);
            inspectionInfo.children[1].textContent = data.inspection_result_good || '';
            inspectionInfo.children[2].textContent = data.inspection_result_bad || '';
        }

        const charge = slide.querySelector('#charge tbody tr');
        console.log("charge 있나...: ", charge);
        if (charge) {
            console.log("상세: charge.children.length:", charge.children.length);
            
            const children = charge.children;

            console.log("상세: children[0]:", children[0]);
            console.log("상세: children[1]:", children[1]);
            console.log("상세: children[2]:", children[2]);
            charge.children[0].textContent = data.stock_id || '';
            charge.children[1].textContent = data.item_name || '';
            charge.children[2].textContent = data.worker_name || '';
        }

    }

    // 날짜 변환용 - fillDetail에 사용
    function formatDate(timestamp) {
        if (!timestamp) return '';

        // 밀리초 타임스탬프로 Date 객체 생성
        const date = new Date(timestamp);
        
        // 유효한 날짜가 아니면 공백 반환
        if (isNaN(date.getTime())) return '';

        // 년, 월, 일 추출 (월은 0부터 시작하므로 +1)
        const year = date.getFullYear();
        // getMonth()는 0부터 시작하므로 +1, 두 자리로 포맷 (01, 02...)
        const month = String(date.getMonth() + 1).padStart(2, '0');
        // getDate()는 날짜, 두 자리로 포맷
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    // ============================
    // 등록/수정 슬라이드 열기. 모드 설정.
    // ============================

    let nowSlide = 'new'; 
    let nowEditId = null;

    let originalDetailData = null;

    const detailEditBtn = document.querySelector('#detailEditBtn');
    const inSlideTitle = document.querySelector('#slide-title');
    const inInsIdShow = document.querySelector('#inIns-id-show');
    const inInsIdVal = document.querySelector('#inIns-id-val');
    const inputInInsIdHidden = document.querySelector('#input_inIns_id');

    // mode(nowSlide)에 따라 등록/수정 변경
    function openSlideInput(mode, inInsID = null) {
        // 현재 슬라이드 모드에 따라 변경하기 위해 사용
        nowSlide = mode;
        nowEditId = inInsID; 
        
        // 등록 상태처럼 입력란 value 정리
        slideInput.querySelector('form').reset();
        inputInInsDate.value = '';
        inputInInsGood.value = '';
        inputInInsBad.value = '';
        inputItemDiv.value = '';
        inputStockId.value = '';
        upStockIdOpt(allItems); 
        inputWorkerName.value = '';

        // 상세 -> 수정 전환 시 애니메이션 효과 없애서 바로 전환된 것처럼
        const editNoAnime = (mode === 'edit');

        if (editNoAnime) {
            // 이 부분 
            // 상세 -> 수정 전환 시 즉시 닫히는 것처럼 보이게 애니메이션 효과 없애기.
            detail.style.transition = 'none';
            detail.classList.remove('open');
            void detail.offsetWidth;
            detail.style.transition = 'right 1s ease';
            slideInput.style.transition = 'none';
        }
        
        // mode에 따라 등록, 수정 구분
        if (mode === 'edit' && inInsID) {
            // 수정 모드 : 슬라이드 제목 영역. 저장 버튼의 value를 수정으로 함.
            inSlideTitle.textContent = '품질 검사 수정';
            saveBtn.value = '수정';
            // ID 표시. 기존(등록)에는 display: none 상태였음
            inInsIdShow.style.display = 'flex';
            inInsIdVal.textContent = inInsID;
            // hidden에 id 저장
            inputInInsIdHidden.value = inInsID;
            
            // 수정 데이터 로드 및 폼 채우기
            loadData(inInsID);

        }
        else {
            // 등록 모드 : 슬라이드 제목 영역. 저장 버튼의 value를 등록으로 함.
            inSlideTitle.textContent = '품질 검사 등록';
            saveBtn.value = '등록';
            // ID 숨김
            inInsIdShow.style.display = 'none';
            inInsIdVal.textContent = '';
            inputInInsIdHidden.value = '';
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
    // ==========================
    async function loadData(inInsId) {
        try {
            const response = await fetch(`${contextPath}/inInsdetail?inspection_result_id=${inInsId}`);
            if (!response.ok) throw new Error('수정 데이터 로드 오류');

            const data = await response.json();

            originalDetailData = data;
            
            // form에 데이터 채우기
            document.querySelector('#input_inIns_date').value = formatDate(data.inspection_result_date) || '';
            document.querySelector('#input_inIns_good').value = data.inspection_result_good || '';
            document.querySelector('#input_inIns_bad').value = data.inspection_result_bad || '';
            const itemDivElement = document.querySelector('#input_item_div');
            itemDivElement.value = data.item_div || '';

            filterItems();

            document.querySelector('#input_stock_id').value = data.stock_id || '';
            document.querySelector('#input_worker_name').value = data.worker_id || '';

            // 불량 사유용: 데이터 테이블 초기화 및 채우기
                // 템플릿 행 제외 전부 제거
                while (defectTbody.children.length > 1) {
                    defectTbody.removeChild(defectTbody.lastChild);
                }
                
                // 불량 사유 데이터(defectList)가 있다면 행 추가
                if (data.defectList && Array.isArray(data.defectList)) {
                    data.defectList.forEach(defect => {
                        // 아래에 새로운 함수 정의
                        const newRow = createDefectRow(defect); 
                        defectTbody.appendChild(newRow);
                    });
                }            

        }
        catch (err) {
            console.error('수정 데이터를 불러오는 중 오류 발생:', err);
            alert('수정 데이터를 불러오는 데 실패했습니다.');
            slideInput.classList.remove('open');
        }
    }    

    // ==========================
    // 등록 / 수정 슬라이드 닫기
    // ==========================

    const closeInputBtn = slideInput.querySelector('.close-btn');
    if (closeInputBtn) {

        closeInputBtn.addEventListener('click', async () => {
            slideInput.classList.remove('open');

            if (nowSlide === 'edit' && nowEditId && originalDetailData) {
                slideInput.style.transition = 'none';
                detail.style.transition = 'none';
                void slideInput.offsetWidth;
                slideInput.style.transition = 'right 1s ease';

                fillDetail(detail, originalDetailData);

                detail.classList.add('open');
                void detail.offsetWidth;

                detail.style.transition = 'right 1s ease';
            }
        });
    }

    // ==========================
    // 등록 / 수정 슬라이드 - 품목 select용
    // ==========================     
    
    const allItems = JSON.parse(stockListJson || '[]');
    const inputItemDiv = document.querySelector('#input_item_div');

    if(!allItems.length) {
        console.warn('위 코드의 변수 정의 재확인');
        return;
    }

    // 품목 id 갱신
    function upStockIdOpt(stockToUp) {
        while(inputStockId.options.length > 1) {
            inputStockId.remove(1);
        }

        stockToUp.forEach(stock => {
            const option = document.createElement('option');
            option.value = stock.stock_id;
            option.textContent = `${stock.stock_id} - ${stock.item_name}`;
            option.dataset.id = stock.stock_id;
            option.dataset.name = stock.item_name;
            inputStockId.appendChild(option);
        })
    }

    // 품목 분류에 따라 재고 목록(id) 필터링
    function filterItems() {
        const selectedDiv = inputItemDiv.value;
        const resultId = document.querySelector('#input_stock_id').value.trim().toLowerCase();
    
        let filteredItems = allItems;

        if (selectedDiv !== '') {
            filteredItems = filteredItems.filter((item) => {
                return item.item_div === selectedDiv;
            })
        }

        upStockIdOpt(filteredItems);
    }

    inputItemDiv.addEventListener('change', filterItems);

    document.querySelector('.btm-btn.new').addEventListener('click', () => {
        openSlideInput('new');
    });

    if (detailEditBtn) {
        detailEditBtn.addEventListener('click', () => {
            const inInsIdDisplay = detail.querySelector('.slide-id').textContent;
            const inInsId = inInsIdDisplay.split(': ')[1]; 
            
            if (inInsId) {
                openSlideInput('edit', inInsId);
            }
            else {
                alert('수정할 품질 검사 ID를 찾을 수 없습니다.');
            }
        });
    }

    // ==========================
    // 등록 / 수정 슬라이드 - 데이터 저장
    // ==========================    

    const saveBtn = document.querySelector('.submit-btn');

    saveBtn.addEventListener('click', async () => {

        // 입력값 모음집
        const inInsDate = document.querySelector('#input_inIns_date').value;
        const inInsGood = document.querySelector('#input_inIns_good').value;
        const inInsBad = document.querySelector('#input_inIns_bad').value;
        const stockIds = document.querySelector('#input_stock_id').value;
        const workerSelect = document.querySelector('#input_worker_name');
        const selectedOption = workerSelect.options[workerSelect.selectedIndex];
        const workerId = selectedOption.value;
        const workerName = selectedOption.dataset.name;
        const nowDivVal = itemDiv.value;
        // 불량 사유용(추후 bom 쪽에도 참고해서 넣기)
        const defectData = collectDefectData();

        // 기존 코드~~~
        const inInsId = document.querySelector('#input_inIns_id');

        // 값이 잘 들어갔는지 확인.
        if (inInsDate === '') {
            alert('검사일을 선택해 주세요.');
            return;
        }
        if (inInsGood === '') {
            alert('양품 수를 선택해 주세요.');
            return;
        }
        if(parseInt(inInsGood) < 0) {
            alert('수량은 0 이상의 값을 입력해 주세요.');
            document.querySelector('#input_inIns_good').focus();
            return;
        }
        if (inInsBad === '') {
            alert('불량 수를 입력해 주세요.');
            return;
        }
        if(stockIds === '') {
            alert('품목을 선택해 주세요.');
            return;
        }
        if (workerName === '') {
            alert('담당자를 선택해 주세요.');
            return;
        }

        // 객체 구성
        const inInsData = {
            inspection_result_id: inspectionResultIdValue,
            inspection_result_date: inInsDate,
            inspection_result_good: parseInt(inInsGood),
            inspection_result_bad: parseInt(inInsBad),
            item_div: nowDivVal,
            stock_id: stockIds,
            worker_id: workerId,
            worker_name: workerName
        };

        // 불량 사유 관련 코드
        // 수집된 불량 사유 데이터 배열을 메인 데이터 객체에 추가
        inInsData.defectListJson = JSON.stringify(defectData.newDefects);

        if (nowSlide === 'edit') {
            url = `${contextPath}/inInsupdate`;
            inInsData.inspection_result_id = nowEditId; 
            // 수정 모드인 경우에만 삭제할 기존 항목 ID 추가
            inInsData.deletedDefectIds = JSON.stringify(defectData.deletedDefectIds);
        }
        else {
            url = `${contextPath}/inInsinsert`;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: new URLSearchParams(inInsData).toString() 
            });

            const result = await response.text();
            const actionText = nowSlide === 'edit' ? '수정' : '등록';

            if (response.ok && result === 'success') {
                alert(`품질 검사 ${actionText}이 성공적으로 완료되었습니다.`);
                
                if(actionText == '수정') {
                    // inInsId = nowEditId;

                    slideInput.style.transition = 'none';
                    slideInput.classList.remove('open');
                    void slideInput.offsetWidth;
                    slideInput.style.transition = 'right 1s ease';
                    detail.style.transition = 'none';
                    void detail.offsetWidth;
                    detail.style.transition = 'right 1s ease';
                    }
                else {
                    window.location.href = `${contextPath}/inInslist`;
                }
            }
            else {
                alert(`재고 ${actionText}에 실패했습니다. (서버 응답: ` + result + ')');
            }

        }
        catch (error) {
            console.error(`${nowSlide} 중 오류 발생:`, error);
            alert(`${nowSlide} 중 통신 오류가 발생했습니다.`);
        }


    })


    // ===================================
    // 불량 사유 : 행 추가, 행 삭제
    // ===================================

    // 변수 모음집
    const addDefectBtn = document.querySelector('#addD');
    const delDefectBtn = document.querySelector('#delD');
    const defectTbody = document.querySelector('#defect-report table tbody');
    // 첫 행 숨기기용 1
    const initialRow = defectTbody ? defectTbody.querySelector('.initial-row') : null;

    // 새로운 행의 임시 ID를 위해 지정. 삭제 기능에 사용!
    let newRowCounter = 0;

    // 첫 행 숨기기용 2
    if (initialRow) {
        initialRow.style.display = 'none';
    }

    // 불량 사유 추가
    if (addDefectBtn && defectTbody) {
        addDefectBtn.addEventListener('click', () => {
            // 행 수에 1 추가
            newRowCounter++;
            // 행 수를 임시 ID로 지정
            const tempId = `temp_${newRowCounter}`;

            // select 생성
            const exhaustOptionsHtml = Array.from(document.querySelector('.initial-row .input_defect_exhaust').options)
                .map(option => `<option value="${option.value}">${option.textContent}</option>`)
                .join('');

            // tr 새로 만들기(+클래스 추가, data 속성에 id 저장)
            const newRow = document.createElement('tr');
            newRow.classList.add('new-defect-row');
            newRow.dataset.tempId = tempId; 

            // td 내용을 HTML 문자열로 정의
            const newRowHtml = `
                <td class="chkbox">
                    <input type="checkbox" class="rowChk newDefectChk" name="new_defect_delete" value="${tempId}">
                </td>
                <td>
                    <input type="text" name="defectReasonList" class="defect_reason" placeholder="불량 사유명 입력">
                </td>
                <td>
                    <input type="number" name="defectAmountList" class="defect_amount" placeholder="수량" value="0" min="0">
                </td>
                <td>
                    <select name="defectExhaustList" class="input_defect_exhaust" size="1">
                        ${exhaustOptionsHtml}
                    </select>
                </td>
            `;

            // tr 내용 추가
            newRow.innerHTML = newRowHtml;

            // tbody에 새 행 추가
            defectTbody.appendChild(newRow);
        });
    }

    // 불량 사유 삭제 버튼 클릭 이벤트
    if (delDefectBtn && defectTbody) {
        delDefectBtn.addEventListener('click', () => {
            // 새로 추가된 행 중 체크된 것들을 먼저 처리
            const checkedNewRows = Array.from(defectTbody.querySelectorAll('input[name="new_defect_delete"]:checked'));
            // 기존 행 중 체크된 것들을 처리
            const checkedExistingRows = Array.from(defectTbody.querySelectorAll('input[name="delete_defect_id"]:checked'));
            
            // 삭제할 항목이 없으면 경고
            if (checkedNewRows.length === 0 && checkedExistingRows.length === 0) {
                alert('삭제할 불량 사유 행을 선택해 주세요.');
                return;
            }

            // 삭제 수 확인 후 그에 따라 경고문 표시
            const totalToDelete = checkedNewRows.length + checkedExistingRows.length;
            const isConfirmed = confirm(`선택된 불량 사유 행 ${totalToDelete}개를 삭제하시겠습니까?`);

            if (isConfirmed) {
                // 새로 추가된 행은 화면에서 즉시 제거(어차피 db에는 없으니까~)
                checkedNewRows.forEach(checkbox => {
                    const rowToRemove = checkbox.closest('tr');
                    if (rowToRemove) {
                        rowToRemove.remove();
                    }
                });
                
                // 기존 행: 화면 즉시 제거 + 서버 전송 준비
                checkedExistingRows.forEach(checkbox => {
                    const rowToRemove = checkbox.closest('tr');
                    if (rowToRemove) {
                        // 삭제 ID 수집
                        rowToRemove.remove();
                    }
                });

                alert('선택된 불량 사유 행이 삭제되었습니다.');
            }
        });
    }

    // 테이블에서 모든 불량 데이터 수집
    function collectDefectData() {
        const defectRows = defectTbody.querySelectorAll('tr:not(.initial-row)'); // 템플릿 행 제외

        const newDefects = []; // insert 데이터
        const existingDefects = []; // update 데이터
        const deletedDefectIds = []; // delete 데이터

        defectRows.forEach(row => {
            // 새로 추가된 행
            if (row.classList.contains('new-defect-row')) {
                const reasonInput = row.querySelector('input[name="defectReasonList"]');
                const amountInput = row.querySelector('input[name="defectAmountList"]');
                const exhaustSelect = row.querySelector('select[name="defectExhaustList"]');

                newDefects.push({
                    defect_reason: reasonInput ? reasonInput.value : '',
                    defect_amount: amountInput ? parseInt(amountInput.value) : 0,
                    defect_exhaust: exhaustSelect ? exhaustSelect.value : ''
                });
            }
        });
        
        return { 
            newDefects: newDefects,
            deletedDefectIds: deletedDefectIds
        };
    }

    // 기존 데이터(defect)를 기반으로 행 생성
    function createDefectRow(defect) {
        const row = document.createElement('tr');
        // 기존 데이터임을 식별하기 위한 클래스
        row.classList.add('existing-defect-row');
        // 기존 데이터의 고유 ID를 data 속성에 저장 (수정 / 삭제용)
        row.dataset.defectId = defect.defect_id; 

        // 폐기 여부 옵션을 포함한 HTML 생성
        const exhaustOptionsHtml = Array.from(document.querySelector('.initial-row .input_defect_exhaust').options)
            .map(option => `<option value="${option.value}" ${option.value == defect.defect_exhaust ? 'selected' : ''}>${option.textContent}</option>`)
            .join('');
        
        row.innerHTML = `
            <td class="chkbox">
                <input type="checkbox" class="rowChk existingDefectChk" name="delete_defect_id" value="${defect.defect_id}">
            </td>
            <td>
                <input type="text" name="defectReasonList" class="defect_reason" value="${defect.defect_reason || ''}">
            </td>
            <td>
                <input type="number" name="defectAmountList" class="defect_amount" value="${defect.defect_amount || 0}" min="0">
            </td>
            <td>
                <select name="defectExhaustList" class="input_defect_exhaust" size="1">
                    ${exhaustOptionsHtml}
                </select>
            </td>
        `;
        return row;
    }

})
