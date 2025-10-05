// 슬라이드 잘 나오는지 테스트용
// 현재 등록만 가능. 
// 상세도 할 순 있지만 테이블에 db 데이터 반영된 후에.

document.addEventListener('DOMContentLoaded', () => {
    const newBtn = document.querySelector('.btm-btn.new');
    const slideInput = document.getElementById('slide-input');

    newBtn.addEventListener('click', () => {
        slideInput.classList.add('open');
    });

    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.slide').classList.remove('open');
        });
    });
});