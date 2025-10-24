// JSON 객체(jsp의 재료용 품목). 테스트용.
let allItems = [];

// 완제용 json 데이터
let allProductItems = [];

// 전역 변수 설정용. 입력 슬라이드 내 테이블의 행 추가 원상복구하기 위한 용도.
// 1. bom
window.resetBomNewRows = function() {
    const bomTbody = document.querySelector('#bomLists tbody');
    if (bomTbody) {
        // 'new-bom-row' 클래스를 가진 모든 행을 제거
        const newRows = bomTbody.querySelectorAll('.new-bom-row');
        newRows.forEach(row => row.remove());
    }
    // 강제 초기화
    if (typeof newRowCounter !== 'undefined') {
        newRowCounter = 0;
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // 등록 기능
    // ===================================

    const registerBomBtn = document.querySelector('#registerBomBtn');

    if (registerBomBtn) {
        registerBomBtn.addEventListener('click', async () => {
            const collectedData = collectBOMData();
            const newBOMs = collectedData.newBOMs;

            if (newBOMs.length === 0) {
                alert('등록할 유효한 BOM 재료가 없습니다. (목표 품목 ID, 재료 ID, 소요량 확인)');
                return;
            }

            const isConfirmed = confirm(`BOM 재료 ${newBOMs.length}개를 등록하시겠습니까?\n목표 품목 ID: ${inputHiddenId.value}`);
            if (!isConfirmed) {
                return;
            }

            try {
                // 전송되는 데이터는 재료 리스트 배열 (newBOMs)
                const response = await fetch(`${contextPath}/bominsert`, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // JSON 형태로 데이터 전송
                    },
                    body: JSON.stringify(newBOMs) 
                });

                const result = await response.text(); // 응답을 text로 받음 (Controller에서 "success" 등의 문자열 반환 시)

                if (result === 'success') {
                    alert('BOM 등록이 성공적으로 완료되었습니다.');
                    // 슬라이드 닫고, 목록 새로고침
                    document.querySelector('#slide-input').classList.remove('open');
                    window.location.reload(); 
                }
                else {
                    alert(`BOM 등록에 실패했습니다. 서버 응답: ${result}`);
                }
            }
            catch (error) {
                console.error('BOM 등록 중 통신 오류 발생:', error);
                alert('BOM 등록 중 서버와 통신 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
            }
        });
    }

    // ===================================
    // 목표 품목(등록, 수정) : 조회용
    // ===================================


    try {
        if (typeof allProJson !== 'undefined' && allProJson.trim() !== '') {
            allProductItems = JSON.parse(allProJson.trim());
        }
    } 
    catch (e) {
        console.error("완제품 품목 JSON 안 됨:", e);
    }

    // 목표 품목 관련 요소 모음집
    const targetNameInput = document.querySelector('#target-product-name'); // 품목명 입력란 (input type=text)
    const targetIdSelect = document.querySelector('#target-product-id');   // 품목 ID 선택 (select)
    const inputHiddenId = document.querySelector('#input_item_id');       // 숨겨진 필드
    const itemIdVal = document.querySelector('#item-id-val');
    const stockIdShow = document.querySelector('#stock-id-show');

    // ===================================
    // bom : 행 추가, 행 삭제
    // ===================================

    // 변수 모음집
    const addBomBtn = document.querySelector('#addD');
    const delBomBtn = document.querySelector('#delD');
    const bomTbody = document.querySelector('#bomLists tbody');
    

    // 첫 행 숨기기용 1
    const initialRow = bomTbody ? bomTbody.querySelector('.initial-row') : null;

    // 새로운 행의 임시 ID를 위해 지정. 삭제 기능에 사용!
    let newRowCounter = 0;

    // 첫 행 숨기기용 2
    if (initialRow) {
        initialRow.style.display = 'none';
        // 재사용 시 'List'를 다시 붙여 배열로 전송할 수 있도록
        initialRow.innerHTML = initialRow.innerHTML.replace(/name="([^"]+)List"/g, 'data-name="$1"');
    }

    // bom 추가
    if (addBomBtn && bomTbody && initialRow) {
        addBomBtn.addEventListener('click', () => {
            // 행 수에 1 추가
            newRowCounter++;
            // 행 수를 임시 ID로 지정
            const tempId = `temp_${newRowCounter}`;

            // // select 생성
            // const bomDivHtml = Array.from(document.querySelector('.initial-row .input_bom_div').options)
            //     .map(option => `<option value="${option.value}">${option.textContent}</option>`)
            //     .join('');
            // const bomItemHtml = Array.from(document.querySelector('.initial-row .input_bom_item').options)
            //     .map(option => `<option value="${option.value}">${option.textContent}</option>`)
            //     .join('');

            // tr 새로 만들기(+클래스 추가, data 속성에 id 저장)
            const newRow = initialRow.cloneNode(true);
            newRow.style.display = ''; // 숨김 해제
            newRow.classList.remove('initial-row', 'existing-bom-row');
            newRow.classList.add('new-bom-row');
            newRow.dataset.tempId = tempId; 
            newRow.dataset.status = 'INSERT';

            //  체크박스 수정: 신규 행은 tempId를 value로 사용하고, name을 분리
            const chkbox = newRow.querySelector('.chkbox input[type="checkbox"]');
            if (chkbox) {
                chkbox.classList.remove('existingDefectChk');
                chkbox.classList.add('newBomChk'); // 신규 행 체크박스 클래스
                chkbox.name = 'new_bom_row_chk'; // 신규 등록 데이터를 위한 name 분리
                chkbox.value = tempId;
            }

            // input/select 수정: name 속성 복구 및 값 초기화
            newRow.querySelectorAll('input, select').forEach(element => {
                // name 속성 복구
                if (element.dataset.name) {
                    element.name = element.dataset.name + 'List';
                    delete element.dataset.name;
                }
                
                // 값 초기화
                if (element.tagName === 'SELECT') {
                    element.value = element.options[0] ? element.options[0].value : '';
                    if (element.classList.contains('input_bom_item')) {
                        element.setAttribute('disabled', true);
                    }
                    else if (element.classList.contains('input_bom_div')) {
                        element.removeAttribute('disabled');
                    }
                }
                else if (element.type === 'text' || element.type === 'number') {
                    element.value = element.type === 'number' ? 0 : '';
                    if (element.classList.contains('input_bom_name')) {
                        element.setAttribute('disabled', true);
                    }
                }
            });

            // tbody에 새 행 추가 (첫 행 템플릿 바로 다음에 추가)
            if (initialRow.nextSibling) {
                initialRow.parentNode.insertBefore(newRow, initialRow.nextSibling);
            }
            else {
                bomTbody.appendChild(newRow);
            }
        });
    }

    // bom 삭제 버튼 클릭 이벤트
    if (delBomBtn && bomTbody) {
    delBomBtn.addEventListener('click', () => {
            // 새로 추가된 행 (new-bom-row) 체크박스 선택
            const checkedNewRows = Array.from(bomTbody.querySelectorAll('.new-bom-row .newBomChk:checked'));
            // 기존 행 (existing-bom-row) 체크박스 선택
            const checkedExistingRows = Array.from(bomTbody.querySelectorAll('.existing-bom-row .existingBomChk:checked'));
            
            const totalToDelete = checkedNewRows.length + checkedExistingRows.length;

            if (totalToDelete === 0) {
                alert('삭제할 BOM 행을 선택해 주세요.');
                return;
            }

            const isConfirmed = confirm(`선택된 BOM 행 ${totalToDelete}개를 삭제하시겠습니까?`);

            if (isConfirmed) {
                // 새로 추가된 행: 화면에서 즉시 제거 (DB에 없으므로)
                checkedNewRows.forEach(checkbox => {
                    checkbox.closest('tr').remove();
                });
                
                // 기존 행: 화면에서 즉시 제거 + 서버 전송을 위한 준비 (UPDATE/DELETE 분리 시 유용)
                checkedExistingRows.forEach(checkbox => {
                    const rowToRemove = checkbox.closest('tr');
                    if (rowToRemove) {
                        // DB에 존재하는 데이터이므로, 실제 삭제 요청을 위해 ID를 수집하거나 상태를 변경해야 함
                        // rowToRemove.dataset.status = 'DELETE'; // 예를 들어, 상태를 DELETE로 변경
                        // rowToRemove.style.display = 'none'; // 혹은 화면에서만 숨기고 폼 전송 시 ID를 수집
                        
                        // **현재는 화면에서 즉시 제거하는 방식으로 처리**
                        rowToRemove.remove(); 
                    }
                });

                alert('선택된 BOM 행이 삭제되었습니다.');
            }
        });
    }

    // 테이블에서 모든 BOM 수집
    function collectBOMData() {

        // 목표 품목 ID
        const targetItemId = inputHiddenId.value.trim();
        if (!targetItemId) {
            alert('목표 품목 ID를 먼저 선택해야 BOM을 등록할 수 있습니다.');
            return { newBOMs: [] };
        }


        const rows = bomTbody.querySelectorAll('tr:not(.initial-row)'); // 템플릿 행 제외

        const newBOMs = []; // INSERT 데이터 (new-bom-row)
        const updatedBOMs = []; // UPDATE 데이터 (existing-bom-row)
        const deletedBOMs = []; // DELETE 대상 ID

        rows.forEach(row => {
            if (row.classList.contains('new-bom-row')) {
                const material_item_id = row.querySelector('.input_bom_item') ? row.querySelector('.input_bom_item').value : '';
                const bom_amount_str = row.querySelector('.input_bom_amount') ? row.querySelector('.input_bom_amount').value : '';
                const bom_amount = parseInt(bom_amount_str) || 0;
                
                // 필수 값 검증
                if (!material_item_id || bom_amount <= 0) {
                    console.warn("경고: 필수 BOM 정보 누락 또는 소요량 0 이하. 이 행은 제외됩니다.", row);
                    return;
                }

                const bomData = {
                    product_item_id: targetItemId,    // 완제품 ID (부모 품목)
                    material_item_id: material_item_id, // 재료 품목 ID (자식 품목)
                    bom_amount: bom_amount,         // 소요량
                };
                newBOMs.push(bomData);
            }
        });
        
        return { 
            newBOMs: newBOMs,
            updatedBOMs: updatedBOMs,
            deletedBOMs: deletedBOMs
        };
    }

    // 기존 데이터(defect)를 기반으로 행 생성
    function createBOMRow(bom) {
        const row = document.createElement('tr');
        // 기존 데이터임을 식별하기 위한 클래스
        row.classList.add('existing-defect-row');
        // 기존 데이터의 고유 ID를 data 속성에 저장 (수정 / 삭제용)
        row.dataset.defectId = bom.defect_id; 

        // HTML 생성 : innerHTML 수정해야 함
        const bomDivHtml = Array.from(document.querySelector('.initial-row .input_bom_div').options)
            .map(option => `<option value="${option.value}">${option.textContent}</option>`)
            .join('');
        const bomItemHtml = Array.from(document.querySelector('.initial-row .input_bom_item').options)
            .map(option => `<option value="${option.value}">${option.textContent}</option>`)
            .join('');
        
        row.innerHTML = `
            <td class="chkbox">
                <input type="checkbox" class="rowChk existingDefectChk" name="delete_defect_id" value="${bom.defect_id}">
            </td>
            <td>
                <input type="text" name="defectReasonList" class="defect_reason" value="${bom.defect_reason || ''}">
            </td>
            <td>
                <input type="number" name="defectAmountList" class="defect_amount" value="${bom.defect_amount || 0}" min="0">
            </td>
            <td>
                <select name="defectExhaustList" class="input_defect_exhaust" size="1">
                    ${exhaustOptionsHtml}
                </select>
            </td>
        `;
        return row;
    }

    // ===================================
    // 완제품 행 클릭 시, BOM 상세 조회 및 슬라이드 표시
    // ===================================
    
    // product-row로 완제 행 데이터 가져오기
    const productRows = document.querySelectorAll('tr[data-id][class*="product-row"]');
    const slideDetail = document.querySelector('#slide-detail');
    const bomDetailTbody = document.querySelector('#bom-detail-tbody');
    const detailProId = document.querySelector('#detail-product-id');
    const detailProductItemId = document.querySelector('#detail-product-item-id');
    const detailProductItemName = document.querySelector('#detail-product-item-name');
    
    if (productRows.length > 0 && slideDetail && bomDetailTbody) {
        productRows.forEach(row => {
            row.addEventListener('click', async (event) => {
                // 체크박스 클릭 제외
                if (event.target.type === 'checkbox') {
                    return; 
                }

                // 완제 ID
                const productId = row.dataset.id;
                // 완제명
                const productName = row.cells[2].textContent.trim(); 
                
                if (!productId) {
                    console.error("선택된 행에서 완제품 ID(data-id)를 찾을 수 없습니다.");
                    return;
                }
                
                // BOM 상세 조회 AJAX 호출
                try {
                    const response = await fetch(`${contextPath}/bomdetails?item_id=${productId}`);
                    if (!response.ok) {
                        throw new Error(`에러: ${response.status}`);
                    }
                    const bomList = await response.json();

                    // 완제 정보 채우기용
                    detailProId.textContent = productId;
                    detailProductItemId.textContent = productId;
                    detailProductItemName.textContent = productName;
                    
                    // BOM 상세 목록 테이블 초기화 및 채우기
                    // 먼저 기존 내용 날리고
                    bomDetailTbody.innerHTML = '';
                    
                    // 길이 0이면(=데이터 없으면)
                    if (bomList.length === 0) {
                        bomDetailTbody.innerHTML = `<tr><td colspan="4">BOM 상세 내역이 없습니다.</td></tr>`;
                    }
                    // 데이터 있으면
                    else {
                        bomList.forEach(bom => {
                            const newRow = `
                                <tr>
                                    <td>${bom.material_item_id || ''}</td>
                                    <td>${bom.material_item_name || ''}</td>
                                    <td>${bom.material_item_div || ''}</td>
                                    <td>${bom.bom_amount || 0}</td>
                                </tr>
                            `;
                            bomDetailTbody.insertAdjacentHTML('beforeend', newRow);
                        });
                    }

                    // 상세 슬라이드 열기 
                    slideDetail.classList.add('open'); 
                    
                }
                catch (error) {
                    console.error("BOM 상세 조회 중 오류 발생:", error);
                    alert('BOM 상세 정보를 불러오는 데 실패했습니다.');
                }
            });
        });
    }    
    // ===================================
    // 등록/수정에서 재료 분류 선택 혹은 품목명 입력 시, id 선택 option 조정
    // ===================================

    try {
        // allItemsJson 변수를 바로 사용
        if (typeof allItemsJson !== 'undefined' && allItemsJson.trim() !== '') {
            allItems = JSON.parse(allItemsJson);
        }
    } 
    catch (e) {
        console.error("allItemsJson 오류:", e);
    }

    function divFilter(itemDiv) {
        if (!itemDiv || itemDiv === '0') { // '분류 선택'이거나 값이 없으면 빈 배열 반환
            return [];
        }
        // 'item_div' 속성이 일치하는 항목만 필터링
        return allItems.filter(item => String(item.material_item_div) === itemDiv);
    }

    /* 분류 변경 시 품목 ID 드롭다운 갱신 함수 */

    function bomDivChange(event) {
        const selectedDiv = event.target.value;
        const row = event.target.closest('tr');
        const itemSelect = row.querySelector('.input_bom_item');
        const itemNameInput = row.querySelector('.input_bom_name');

        if (!itemSelect || !itemNameInput) return;
        
        // 품목명 초기화
        itemNameInput.value = '';
            
        if (selectedDiv !== '0') {
            itemNameInput.removeAttribute('disabled');
        }
        else {
            itemNameInput.setAttribute('disabled', true);
        }

        // 품목 ID 목록 초기화 및 비활성화
        itemSelect.innerHTML = '<option value="">품목 ID 선택</option>';
        itemSelect.setAttribute('disabled', true);

        // 분류에 맞는 품목만 필터링
        const filteredItems = divFilter(selectedDiv);

        // data-filtered-items 속성에 JSON 문자열로 저장하여 품목명 검색 시 활용
        row.dataset.filteredItems = JSON.stringify(filteredItems);
    
    }
    
    /* 이름 입력 시 ID 드롭다운 갱신 함수 */

    function bomNameSearch(event) {
        console.log("bomNameSearch 호출됨. 제발 좀. 이름 넣었잖아. 현재 입력 값:", event.target.value);

        const inputName = event.target.value.trim().toUpperCase();
        const row = event.target.closest('tr');

    // 현재 행의 분류(Division) 값
    const divisionSelect = row.querySelector('.input_bom_div');
    const itemDiv = divisionSelect ? divisionSelect.value : '0'; // 분류 값 가져오기

    console.log("선택된 분류:", itemDiv, "전체 품목 개수:", allItems.length);
    
    // 2해당 분류에 맞는 품목 목록
    const filteredItems = divFilter(itemDiv); // 분류에 따라 필터링

        const itemSelect = row.querySelector('.input_bom_item');

        if (!itemSelect) return;
        
        // 품목 ID 목록 초기화 및 비활성화
            itemSelect.innerHTML = '<option value="">품목 ID 선택</option>';
            itemSelect.setAttribute('disabled', true); 

            if (inputName.length === 0 || itemDiv === '0') {
                // 이름 입력이 없거나 분류 선택을 안 했으면 disabled 유지
                console.log("검색어 또는 분류 미선택. 왜...");
                return; 
            }

            console.log("제발...... 억울하다 진짜")
            console.log("필터링된 품목 개수:", filteredItems.length);
            console.log("검색 시작 이름:", inputName);

            // 품목명에 부분적으로 일치하는 항목 필터링 (material_item_name 사용)
            const matchedItems = filteredItems.filter(item => 
                // material_item_name 속성으로 검색
                item.material_item_name && String(item.material_item_name).toUpperCase().includes(inputName)
            );

            if (matchedItems.length > 0) {
                matchedItems.forEach(item => {
                    const option = document.createElement('option');
                    // material_item_id를 value로 사용
                    option.value = item.material_item_id; 
                    option.textContent = `${item.material_item_id} - ${item.material_item_name}`; 
                    option.dataset.name = item.material_item_name; // 품목명을 data-name에 저장
                    itemSelect.appendChild(option);
                });
                
                // 검색 결과가 있으면 품목 ID 드롭다운 활성화
                itemSelect.removeAttribute('disabled'); 
            }
    }

    // id 선택 시, 해당 품목명으로 채우기
    function idChangeName(event) {
        const selectedOption = event.target.selectedOptions[0];
        const row = event.target.closest('tr');
        const itemNameInput = row.querySelector('.input_bom_name');
        
        if (selectedOption && itemNameInput && selectedOption.value !== '') {
            // data-name 속성에서 품목명을 가져와 입력란에 채우기
            itemNameInput.value = selectedOption.dataset.name || '';
        }
        else if (itemNameInput) {
            if (selectedOption.value === '') {
                itemNameInput.value = '';
            }
        }
    }

    if(bomTbody) {
        bomTbody.addEventListener('change', (event) => {
            if (event.target.classList.contains('input_bom_div')) {
                bomDivChange(event);
            }
            if (event.target.classList.contains('input_bom_item')) {
                idChangeName(event);
            }
        });

        // 품목명 (input.input_bom_name) 입력 이벤트는 input으로 유지
        bomTbody.addEventListener('input', (event) => {
            if (event.target.classList.contains('input_bom_name')) {
                bomNameSearch(event);
            }
        });
    }

    // ===================================
    // 목표 품목 (완제품) 관련 함수
    // ===================================

    
    // 목표 품목명 입력에 따라 품목 ID 업데이트
    
    function changeProOp() {
        if (!targetNameInput || !targetIdSelect) return;
        
        const inputName = targetNameInput.value.trim().toUpperCase();
        
        console.log("입력 목표 품목명:", inputName);
        console.log("allProductItems 배열 길이:", allProductItems.length, "첫 번째 요소:", allProductItems[0]);

        targetIdSelect.innerHTML = '<option value="">품목 ID를 선택해주세요</option>';
        targetIdSelect.setAttribute('disabled', true);
        
        // 숨겨진 값 초기화
        inputHiddenId.value = "";
        itemIdVal.textContent = "";
        stockIdShow.style.display = 'none';

        if (inputName.length === 0) {
            return; 
        }

        // 품목명에 부분적으로 일치하는 항목 필터링
        const matchedItems = allProductItems.filter(item => {
            if (!item) {
                return false; 
            }
            // name으로 검색
            const itemName = item.pro_item_name;

            if (!itemName) {
                console.log("pro_item_name 없음: ", item);
                return false;
            }
            
            // 검색어와 일치하는지 확인
            const inputName = targetNameInput.value.trim().toUpperCase();
            return String(itemName).toUpperCase().includes(inputName);
        });

        console.log("필터링된 matchedItems 개수:", matchedItems.length);
        if (matchedItems.length > 0) {
            matchedItems.forEach(item => {
                const option = document.createElement('option');
                option.value = item.pro_item_id;
                option.textContent = `${item.pro_item_id} - ${item.pro_item_name}`; // 'id - 품명' 구조
                option.dataset.name = item.pro_item_name; 
                targetIdSelect.appendChild(option);
            });
            
            targetIdSelect.removeAttribute('disabled'); 
        }
    }

    // 목표 품목 ID 선택 시, 품목명을 자동으로 채우는 함수
    
    function changePro(event) {
        if (!targetNameInput || !inputHiddenId || !itemIdVal || !stockIdShow) return;

        const selectedOption = event.target.selectedOptions[0];
        const selectedId = selectedOption.value;
        
        if (selectedId) {
            inputHiddenId.value = selectedId;
            itemIdVal.textContent = selectedId;
            stockIdShow.style.display = 'block';

            const selectedName = selectedOption.dataset.name || '';
            targetNameInput.value = selectedName;
        }
        else {
            inputHiddenId.value = "";
            itemIdVal.textContent = "";
            stockIdShow.style.display = 'none';
        }
    }

    // 품목명 입력 필드에 이벤트 리스너 추가 (키 입력 시마다)
    targetNameInput?.addEventListener('input', changeProOp);

    // 품목 ID Select 선택 시 이벤트 리스너 추가
    targetIdSelect?.addEventListener('change', changePro);

});