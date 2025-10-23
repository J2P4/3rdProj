document.addEventListener('DOMContentLoaded', () => {

    // ===================================
    // bom : 행 추가, 행 삭제
    // ===================================

    // 변수 모음집
    const addBomBtn = document.querySelector('#addD');
    const delBomBtn = document.querySelector('#delD');
    const bomTbody = document.querySelector('#bomLists table tbody');
    // 첫 행 숨기기용 1
    const initialRow = bomTbody ? bomTbody.querySelector('.initial-row') : null;

    // 새로운 행의 임시 ID를 위해 지정. 삭제 기능에 사용!
    let newRowCounter = 0;

    // 첫 행 숨기기용 2
    if (initialRow) {
        initialRow.style.display = 'none';
    }

    // bom 추가
    if (addBomBtn && bomTbody) {
        addBomBtn.addEventListener('click', () => {
            // 행 수에 1 추가
            newRowCounter++;
            // 행 수를 임시 ID로 지정
            const tempId = `temp_${newRowCounter}`;

            // select 생성
            const bomDivHtml = Array.from(document.querySelector('.initial-row .input_bom_div').options)
                .map(option => `<option value="${option.value}">${option.textContent}</option>`)
                .join('');
            const bomItemHtml = Array.from(document.querySelector('.initial-row .input_bom_item').options)
                .map(option => `<option value="${option.value}">${option.textContent}</option>`)
                .join('');

            // tr 새로 만들기(+클래스 추가, data 속성에 id 저장)
            const newRow = document.createElement('tr');
            newRow.classList.add('new-bom-row');
            newRow.dataset.tempId = tempId; 

            // td 내용을 HTML 문자열로 정의
            const newRowHtml = `
                            <td class = "chkbox"><input type="checkbox" class="rowChk existingDefectChk" name = "delete_bom_id" value=""></td>
                            <td>
                                <select name = "bomDivList" class = "input_bom_div" size="1">
                                    ${bomDivHtml}
                                </select>
                            </td>
                            <td>
                                <select name = "bomItemList" class="input_bom_item" size = "1" style = "width: 100%;">
                                    ${bomItemHtml}
                                </select>                                
                            </td>
                            <td>
                                <input type = "text" name = "bomNameList" class="input_bom_name" placeholder = "품목명을 입력해주세요">
                            </td>
                            <td><input type = "number" name = "bomAmountList" class = "input_bom_amount"></td>
            `;

            // tr 내용 추가
            newRow.innerHTML = newRowHtml;

            // tbody에 새 행 추가
            bomTbody.appendChild(newRow);
        });
    }

    // bom 삭제 버튼 클릭 이벤트
    if (delBomBtn && bomTbody) {
        delBomBtn.addEventListener('click', () => {
            // 새로 추가된 행 중 체크된 것들을 먼저 처리
            const checkedNewRows = Array.from(bomTbody.querySelectorAll('input[name="new_defect_delete"]:checked'));
            // 기존 행 중 체크된 것들을 처리
            const checkedExistingRows = Array.from(bomTbody.querySelectorAll('input[name="delete_defect_id"]:checked'));
            
            // 삭제할 항목이 없으면 경고
            if (checkedNewRows.length === 0 && checkedExistingRows.length === 0) {
                alert('삭제할 BOM 행을 선택해 주세요.');
                return;
            }

            // 삭제 수 확인 후 그에 따라 경고문 표시
            const totalToDelete = checkedNewRows.length + checkedExistingRows.length;
            const isConfirmed = confirm(`선택된 BOM 행 ${totalToDelete}개를 삭제하시겠습니까?`);

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

                alert('선택된 BOM 행이 삭제되었습니다.');
            }
        });
    }

    // 테이블에서 모든 BOM 수집
    function collectBOMData() {
        const defectRows = bomTbody.querySelectorAll('tr:not(.initial-row)'); // 템플릿 행 제외

        const newBOMs = []; // insert 데이터
        const existingBOMs = []; // update 데이터
        const deletedBOMs = []; // delete 데이터

        defectRows.forEach(row => {
            // 새로 추가된 행
            if (row.classList.contains('new-defect-row')) {
                const divSelect = row.querySelector('input[name="bomDivList"]');
                const itemSelect = row.querySelector('input[name="bomItemList"]');
                const nameInput = row.querySelector('select[name="bomNameList"]');
                const amountInput = row.querySelector('select[name="bomAmountList"]');

                newBOM.push({
                    item_div: divSelect ? divSelect.value : '',
                    item_id: itemSelect ? parseInt(itemSelect.value) : 0,
                    item_name: nameInput ? nameInput.value : '',
                    bom_amount: amountInput ? amountInput.value : ''
                });
            }
        });
        
        return { 
            newBOM: newBOM,
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


});