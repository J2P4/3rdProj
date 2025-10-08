$(document).ready(function () { // document.addEventListener('DOMContentLoaded', function() { ... }); 와 동일

    // 셀 수정용 라이브러리 객체 생성(SimpleTableCellEditor). 커스텀 코드 사용.
    var editor = new SimpleTableCellEditor("slide-detail");
    // 수정 가능 셀 지정
    editor.SetEditableClass("editMe");

    // cell:edited = 라이브러리의 커스텀 이벤트. 셀 변경했을 때라는 뜻.
    // cell:edited 이벤트가 발생했을 때, 다음의 함수를 실행해라.
    $('#slide-detail').on("cell:edited", function (event) {
        console.log(`'${event.oldValue}' changed to '${event.newValue}'`);
    });

    var $toggle = $('#basicToggle');
    if ($toggle.length === 0) {
        console.warn('#basicToggle 요소를 찾을 수 없습니다. 아이디가 맞는지 확인하세요.');
    }

    $("#basicToggle").on('click', function(e){
    editor.Toggle($(e.currentTarget).is(':checked'));

    // 4) change 이벤트로 토글 바인딩 (더 안정적)
    $toggle.on('change', function () {
        var checked = this.checked; // boolean
        if (typeof editor.Toggle === 'function') {
            editor.Toggle(checked);
            console.log('editor.Toggle called ->', checked);
        } else {
            console.error('editor.Toggle 메서드를 찾을 수 없습니다. 라이브러리 버전을 확인하세요.');
        }
    });

    // 5) 초기 상태 맞추기 (페이지 로드 시 체크박스 상태에 따라 편집모드 설정)
    if (typeof editor.Toggle === 'function') {
        editor.Toggle($toggle.is(':checked'));
        console.log('초기 editor.Toggle 설정 ->', $toggle.is(':checked'));
    }
});

});