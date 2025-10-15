document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 삭제 기능
    // ============================

    // 삭제 버튼 지정
    const deleteBtn = document.querySelector('.btm-btn.del');
    // 삭제 버튼 클릭 이벤트
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            // 선택된 재고 ID 목록 추출
            const checkedIds = Array.from(document.querySelectorAll('input[name="delete_bom_id"]:checked')).map(checkbox => checkbox.value);

            // 선택 항목 없으면(배열 길이 0이면) 경고 창 띄우기
            if (checkedIds.length === 0) {
                alert('삭제할 재고 항목을 선택해 주세요.');
                return;
            }

            // 확인 창 표시 : 배열 길이로 개수 표시
            const isConfirmed = confirm(`선택된 재고 ${checkedIds.length}개를 정말로 삭제하시겠습니까?`);

            // 컨펌 창에서 확인을 눌렀다면,
            if (isConfirmed) {
                try {
                    // ajax 요청. POST 방식으로 선택된 id 배열을 json으로로 전송
                    const response = await fetch(`${contextPath}/bomdelete`, {
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
                        alert('선택된 재고가 성공적으로 삭제되었습니다.');
                        // 삭제 후 목록 페이지 새로고침
                        window.location.href = `${contextPath}/bomlist`; 
                    }
                    else {
                        alert('재고 삭제에 실패했습니다. (서버 응답: ' + result + ')');
                    }
                }
                catch (error) {
                    console.error('재고 삭제 중 통신 오류 발생:', error);
                    alert('삭제 중 통신 오류가 발생했습니다.');
                }
            }
        });
    }
});