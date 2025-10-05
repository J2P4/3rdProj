<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!-- 레이아웃이 <aside class="side ...">로 감싸므로 여기서는 내용만 -->
<ul class="mainList space-y-2 text-base">
  <li class="relative p-3 rounded-md cursor-pointer transition-colors duration-200">메인</li>

  <li class="parent-menu relative p-3 rounded-md cursor-pointer transition-colors duration-200">
    <div class="flex items-center justify-between">
      <span>기준 관리</span>
      <svg class="w-4 h-4 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </div>
    <ul class="subList space-y-1 mt-2 pl-4">
      <li class="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200">재고 계획</li>
      <li class="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200">거래처 지시서</li>
      <li class="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200">품목 실적</li>
      <li class="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200">BOM 불량률</li>
      <li class="py-2 px-3 rounded-md cursor-pointer transition-colors duration-200">공정 불량률</li>
    </ul>
  </li>

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
  document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.mainList > li:not(.parent-menu)');
    const parentMenus = document.querySelectorAll('.parent-menu');
    const allItems = [...menuItems, ...document.querySelectorAll('.subList li')];

    function deactivateAll() {
      allItems.forEach(item => {
        item.classList.remove('active-link');
        item.classList.add('transition-colors', 'duration-200');
      });
      parentMenus.forEach(menu => {
        menu.classList.remove('active-parent');
        const subList = menu.querySelector('.subList');
        const arrow = menu.querySelector('svg');
        subList.classList.remove('visible');
        arrow.style.transform = 'rotate(0deg)';
      });
    }

    const mainMenuItem = document.querySelector('.mainList > li:first-child');
    if (mainMenuItem) {
      mainMenuItem.classList.add('active-link');
      mainMenuItem.classList.remove('transition-colors', 'duration-200');
    }

    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        deactivateAll();
        item.classList.add('active-link');
        item.classList.remove('transition-colors', 'duration-200');
      });
    });

    parentMenus.forEach(parentMenu => {
      const subList = parentMenu.querySelector('.subList');
      const subMenuItems = subList.querySelectorAll('li');
      const arrow = parentMenu.querySelector('svg');

      parentMenu.addEventListener('click', () => {
        const isParentActive = parentMenu.classList.contains('active-parent');
        if (isParentActive) {
          subList.classList.remove('visible');
          parentMenu.classList.remove('active-parent');
        } else {
          deactivateAll();
          subList.classList.add('visible');
          parentMenu.classList.add('active-parent');
        }
        arrow.style.transform = subList.classList.contains('visible') ? 'rotate(90deg)' : 'rotate(0deg)';
      });

      subMenuItems.forEach(item => {
        item.addEventListener('click', (event) => {
          deactivateAll();
          item.classList.add('active-link');
          item.classList.remove('transition-colors', 'duration-200');
          parentMenu.classList.add('active-parent');
          subList.classList.add('visible');
          parentMenu.querySelector('svg').style.transform = 'rotate(90deg)';
          event.stopPropagation();
        });
      });
    });
  });
</script>
