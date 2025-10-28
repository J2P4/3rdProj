// ============================
// 삭제 기능
// ============================

    const deleteBtn = document.querySelector('.btm-btn.del');

    if(deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            const checkedIds = Array.from(document.querySelectorAll('input[name="delete_cp_list_id"]:checked')).map(checkbox => checkbox.value);

            if(checkedIds.length === 0) {
                alert('삭제할 생산 실적 항목을 선택해 주세요.');
                return;
            }

            const isConfirmed = confirm(`선택된 생산 실적 ${checkedIds.length}개를 정말로 삭제하시겠습니까?`);

            if (isConfirmed) {
                try {
                    const response = await fetch(`${contextPath}/cplistdelete`, {
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
                        alert('선택된 생산 실적이 성공적으로 삭제되었습니다.');
                        // 삭제 후 목록 페이지 새로고침
                        window.location.href = `${contextPath}/cplist`; 
                    }
                    else {
                        alert('생산 실적 삭제에 실패했습니다. (서버 응답: ' + result + ')');
                    }
                }
                catch (error) {
                    console.error('생산 실적 삭제 중 통신 오류 발생:', error);
                    alert('생산 실적 삭제 중 통신 오류가 발생했습니다.');
                }
            }
        })
    }