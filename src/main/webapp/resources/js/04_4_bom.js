document.addEventListener('DOMContentLoaded', () => {

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
                    element.removeAttribute('disabled'); // 필요한 경우 disabled 제거
                } else if (element.type === 'text' || element.type === 'number') {
                    element.value = element.type === 'number' ? 0 : '';
                }
            });

            // tbody에 새 행 추가 (첫 행 템플릿 바로 다음에 추가)
            if (initialRow.nextSibling) {
                initialRow.parentNode.insertBefore(newRow, initialRow.nextSibling);
            } else {
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
const rows = bomTbody.querySelectorAll('tr:not(.initial-row)'); // 템플릿 행 제외

        const newBOMs = []; // INSERT 데이터 (new-bom-row)
        const updatedBOMs = []; // UPDATE 데이터 (existing-bom-row)
        const deletedBOMs = []; // DELETE 대상 ID

        rows.forEach(row => {
            const item_div = row.querySelector('.input_bom_div') ? row.querySelector('.input_bom_div').value : '';
            const item_id = row.querySelector('.input_bom_item') ? row.querySelector('.input_bom_item').value : '';
            const item_name = row.querySelector('.input_bom_name') ? row.querySelector('.input_bom_name').value : '';
            const bom_amount = row.querySelector('.input_bom_amount') ? row.querySelector('.input_bom_amount').value : '';
            
            const bomData = {
                item_div: item_div,
                item_id: item_id,
                item_name: item_name,
                bom_amount: bom_amount
            };

            // 신규 추가된 행
            if (row.classList.contains('new-bom-row') && row.dataset.status !== 'DELETE') {
                newBOMs.push(bomData);
            } 
            // 기존 행 (수정 시 로직 추가 필요)
            else if (row.classList.contains('existing-bom-row')) {
                // if (row.dataset.status === 'UPDATE') {
                //     updatedBOMs.push({...bomData, bom_id: row.dataset.bomId});
                // } else if (row.dataset.status === 'DELETE') {
                //     deletedBOMs.push(row.dataset.bomId);
                // }
                // 현재는 별도 update/delete 로직이 없으므로, 기본적으로 아무 작업도 하지 않음
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
    // 등록/수정에서 재료 분류 선택 시, 
    // ===================================
});