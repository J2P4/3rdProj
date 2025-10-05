<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!-- 레이아웃에서 <header>로 감싸므로 여기서는 div만 -->
<div class="header-bg text-white p-4 shadow-lg flex justify-between items-center z-50 relative">
  <div class="flex items-center space-x-2">
    <a href="<c:url value='/proj_mes/mainpage'/>">
      <img src="https://i.postimg.cc/qMsq73hD/icon.png" class="w-10" alt="회사 로고">
    </a>
    <a href="<c:url value='/proj_mes/mainpage'/>" class="text-white no-underline">
      <h3 class="text-xl font-bold">J2P4</h3>
    </a>
  </div>

  <div class="flex items-center space-x-4 sm:space-x-8">
    <button type="button" class="search cursor-pointer" aria-label="검색">
      <img src="https://i.postimg.cc/9QcMwQym/magnifier-white.png" class="w-6 sm:w-7" alt="검색용 아이콘">
    </button>

    <div class="logout text-sm sm:text-base cursor-pointer hover:underline">
      <form method="post" action="<c:url value='/proj_mes/logout'/>">
        <button type="submit">로그아웃</button>
      </form>
    </div>

    <div class="myIcon relative">
      <button id="myIconBtn" class="focus:outline-none" aria-haspopup="true" aria-expanded="false">
        <img src="https://i.postimg.cc/zfVqTbvr/user.png" class="w-8 sm:w-9 rounded-full bg-white" alt="마이페이지 아이콘">
      </button>

      <div id="userMenu"
           class="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg border hidden z-50 drop">
        <div class="row">
          <a href="<c:url value='/proj_mes/AccountManage'/>">계정관리</a><br>
        </div>
        <div class="row">
          <a href="<c:url value='/proj_mes/IssueCtrl'/>">이슈처리</a><br>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  (function () {
    const myIconBtn = document.getElementById('myIconBtn');
    const userMenu  = document.getElementById('userMenu');

    function closeUserMenu() {
      userMenu.classList.add('hidden');
      myIconBtn.setAttribute('aria-expanded', 'false');
    }

    myIconBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenu.classList.toggle('hidden');
      myIconBtn.setAttribute('aria-expanded',
        userMenu.classList.contains('hidden') ? 'false' : 'true');
    });

    userMenu.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', closeUserMenu);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeUserMenu();
    });
  })();
</script>
