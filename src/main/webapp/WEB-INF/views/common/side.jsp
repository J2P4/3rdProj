<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


            <ul class="mainList space-y-2 text-base">
                <!-- 메인 메뉴 추가 -->
                <li class="relative p-3 rounded-md cursor-pointer transition-colors duration-200">메인</li>
                
                <!-- 기준 관리 메뉴와 하위 메뉴 -->
                <li class="parent-menu relative p-3 rounded-md cursor-pointer transition-colors duration-200">
                    <div class="flex items-center justify-between">
                        <span>기준 관리</span>
                        <svg class="w-4 h-4 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <ul class="subList space-y-1 mt-2 pl-5">
                        <li class="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200">재고 관리</li>
                        <li class="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200">거래처 관리</li>
                        <li class="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200">품목 관리</li>
                        <li class="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200">BOM 관리</li>
                        <li class="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200">공정 관리</li>
                    </ul>
                </li>

                <!-- 생산 관리 메뉴와 하위 메뉴 -->
                <li class="parent-menu relative p-3 rounded-md cursor-pointer transition-colors duration-200">
                    <div class="flex items-center justify-between">
                        <span>생산 관리</span>
                        <svg class="w-4 h-4 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <ul class="subList space-y-1 mt-2 pl-4">
                        <li class="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200">생산 계획</li>
                        <li class="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200">작업 지시서</li>
                        <li class="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200">생산 실적</li>
                    </ul>
                </li>

                <!-- 품질 관리 메뉴와 하위 메뉴 -->
                <li class="parent-menu relative p-3 rounded-md cursor-pointer transition-colors duration-200">
                    <div class="flex items-center justify-between">
                        <span>품질 관리</span>
                        <svg class="w-4 h-4 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <ul class="subList space-y-1 mt-2 pl-4">
                        <li class="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200">입고 검사</li>
                        <li class="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200">공정 검사</li>
                        <li class="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200">불량 보고서</li>
                    </ul>
                </li>

            </ul>

    <script>
        /* 사이드바 하위 목록에 따라 늘어나게*/
        document.addEventListener('DOMContentLoaded', () => {
            const menuItems = document.querySelectorAll('.mainList > li:not(.parent-menu)');
            const parentMenus = document.querySelectorAll('.parent-menu');
            const allItems = [...menuItems, ...document.querySelectorAll('.subList li')];

            // 모든 메뉴의 활성화 상태를 초기화
            function deactivateAll() {
                allItems.forEach(item => {
                    item.classList.remove('active-link');
                    item.classList.add('transition-colors', 'duration-200');
                });
                parentMenus.forEach(menu => {
                    const subList = menu.querySelector('.subList');
                    const arrow = menu.querySelector('svg');
                    subList.classList.remove('visible');
                    /* 접기: 높이를 0으로 */
                    subList.style.maxHeight = '0px';
                    menu.classList.remove('active-parent');
                    arrow.style.transform = 'rotate(0deg)';
                });
            }

            // 초기 상태: '메인' 항목 활성화
            const mainMenuItem = document.querySelector('.mainList > li:first-child');
            if (mainMenuItem) {
                mainMenuItem.classList.add('active-link');
                mainMenuItem.classList.remove('transition-colors', 'duration-200');
            }

            // 일반 메뉴 항목 클릭
            menuItems.forEach(item => {
                item.addEventListener('click', () => {
                    deactivateAll();
                    item.classList.add('active-link');
                    item.classList.remove('transition-colors', 'duration-200');
                });
            });

            // 부모 메뉴 클릭/토글
            parentMenus.forEach(parentMenu => {
                const subList = parentMenu.querySelector('.subList');
                const subMenuItems = subList.querySelectorAll('li');
                const arrow = parentMenu.querySelector('svg');

                parentMenu.addEventListener('click', () => {
                    const isParentActive = parentMenu.classList.contains('active-parent');

                    if (isParentActive) {
                        subList.classList.remove('visible');
                        /* 접기 높이 */
                        subList.style.maxHeight = '0px';
                        parentMenu.classList.remove('active-parent');
                        arrow.style.transform = 'rotate(0deg)';
                    } else {
                        deactivateAll();
                        subList.classList.add('visible');
                        parentMenu.classList.add('active-parent');
                        /* 펼칠 때 실제 내용 높이로 설정 (안 잘림) */
                        subList.style.maxHeight = subList.scrollHeight + 'px';
                        arrow.style.transform = 'rotate(90deg)';
                    }
                });

                // 서브 메뉴 항목 클릭
                subMenuItems.forEach(item => {
                    item.addEventListener('click', (event) => {
                        deactivateAll();
                        item.classList.add('active-link');
                        item.classList.remove('transition-colors', 'duration-200');
                        parentMenu.classList.add('active-parent');
                        subList.classList.add('visible');
                        /* 서브 아이템 클릭 시에도 펼친 높이 유지 */
                        subList.style.maxHeight = subList.scrollHeight + 'px';
                        parentMenu.querySelector('svg').style.transform = 'rotate(90deg)';
                        event.stopPropagation();
                    });
                });
            });

            /* 창 크기 변경 시 열린 메뉴 높이 재계산 */
            window.addEventListener('resize', () => {
                document.querySelectorAll('.subList.visible').forEach(el => {
                    el.style.maxHeight = el.scrollHeight + 'px';
                });
            });
        });
    </script>
