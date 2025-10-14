<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

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

    <script>
	    // 서버(JSP) → 클라이언트(JS) 데이터 전달
	    const sessionInfo = {
	      isLogin: true,
	      userName: "${sessionScope.loginUser.worker_name}",    // 로그인 사용자 이름
	      remainSec: ${remainSec != null ? remainSec : 1800},    // 남은시간 (초)
	      contextPath: "${pageContext.request.contextPath}"      // 프로젝트 루트 경로
	    };
    </script>
  <div class="flex items-center space-x-4 sm:space-x-8">
    <c:if test="${not empty sessionScope.loginUser}">
      <div id="sess-box"
           style="padding:5px 12px; background-color: rgb(24, 33, 49);
                  border: none; border-radius:8px;
                  font-size:14px; font-weight: bold; color: white;">
        남은 시간: <span id="sess-remaining" >--:--</span>
        <button id="sess-extend" type="button" style="margin-left:8px; border-radius:8px; padding: 5px 8px; color: rgb(250, 250, 0);">연장</button>
      </div>
    </c:if>
	
    <div class="logout text-sm sm:text-base cursor-pointer hover:underline">
        <c:if test="${not empty sessionScope.loginUser}">
		    <a href="${pageContext.request.contextPath}/logout">로그아웃</a>
	    </c:if>
    </div>

    <div class="myIcon relative">
      <button id="myIconBtn" class="focus:outline-none" aria-haspopup="true" aria-expanded="false">
        <img src="https://i.postimg.cc/zfVqTbvr/user.png" class="w-8 sm:w-9 rounded-full bg-white" alt="마이페이지 아이콘">
      </button>

      <div id="userMenu"
           class="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg border hidden z-50 drop">
        <div class="row">
          <a href="${pageContext.request.contextPath}/workerlist">계정관리</a><br>
        </div>
        <!-- 이슈 처리 -->
        <div class="row">
        	<a href="${pageContext.request.contextPath}/pw_change">비밀번호 변경</a><br>
        </div>
      </div>
    </div>
  </div>
</div>
<%-- <script src="${pageContext.request.contextPath}/resources/js/session.js"></script> --%>
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
