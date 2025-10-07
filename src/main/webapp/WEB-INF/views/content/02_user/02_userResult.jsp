<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>계정 관리 < J2P4</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/user.css">
</head>
    <div class = "title">
    	<h1>계정 관리</h1>
   	</div>
    <div class = "slide open" id = "slide-input">
    	<div class = "slide-contents">
	        <div class = "silde-title"><h2>사원 등록</h2></div>
	        <div class = "slide-id">사번 : ${worker_id }</div>
	        <div class = "slide-tb">
	            <table>
	                <thead>
		                <tr>
		                    <th>이름</th>
		                    <th>생년월일</th>
		                    <th>이메일</th>
	                    </tr>
	                </thead>
	                <tbody>
		                <tr>
		                    <td>${worker.worker_name }</td>
		                    <td>${worker.worker_birth }</td>
		                    <td>${worker.worker_email }</td>
		                </tr>
	            </table>
	        </div>
	        <div class = "slide-tb">
	            <table>
	                <thead>
		                <tr>
		                    <th>입사일</th>
		                    <th>부서</th>
		                    <th>권한</th>
	                    </tr>
	                </thead>
	                <tbody>
		                <tr>
		                    <td>${worker.worker_join }</td>
		                    <td>${worker.department_id }</td>
		                    <td>${worker.worker_code }</td>
		                </tr>
	                </tbody>
	            </table>
        	</div>
	        <div class = "slide-btnbox">
                <input type = "submit" class = "slide-btn" value = "등록">
                <input type = "button" class = "close-btn slide-btn" value = "취소">
            </div>
       	</div>
    </div>
    <!-- 등록 확인 모달 -->
    <div class="modal-bg">
        <div class = "add-modal">
            <div class="modal-title">J2P4 MES</div>
            <div class="modal-content">
                <div class="field"><span>아이디 :</span> ${worker_id }</div>
                <div class="field"><span>초기 비밀번호 :</span> ${worker_birth6 }</div>
                <div class="field"><span>이메일 :</span> ${worker_email }</div>
                <div class="confirm">
                    <div>등록되었습니다.</div>
                </div>
            </div>
            <div class = "modal-btnbox">
                <input type = "button" class = "close-btn m-btn slide-btn" value = "확인">
            </div>
        </div>
    </div>
<script>
  document.addEventListener('DOMContentLoaded', () => {

    // "확인" 버튼 클릭 시 목록 페이지로 이동
    const okBtn = document.querySelector('.m-btn.close-btn');
    if (okBtn) {
      okBtn.addEventListener('click', () => {
        window.location.href = '${pageContext.request.contextPath}/list';
      });
    }
  });
</script>
</body>
</html>