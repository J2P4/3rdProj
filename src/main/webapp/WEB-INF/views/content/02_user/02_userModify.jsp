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
    <form id="userForm" method="post" action="modifyDetail">
	  <!-- 반드시 PK 전송 -->
	  <input type="hidden" name="worker_id" value="${dto.worker_id}"/>
	
	  <div class="slide-contents">
	    <div class="silde-title"><h2>사원정보 수정</h2></div>
	    <div class="slide-id">사번 : ${dto.worker_id}</div>
	
	    <!-- 표 #1 -->
	    <div class="slide-tb">
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
	            <td>
	              <input type="text" name="worker_name" value="${dto.worker_name}">
	            </td>
	            <td>
	              <input type="date" name="worker_birth" value="${dto.worker_birth}">
	            </td>
	            <td>
	            	<c:set var="email"  value="${dto.worker_email}" />
					<c:set var="local"  value="${fn:substringBefore(email, '@')}" />
					<c:set var="domain" value="${fn:substringAfter(email, '@')}" />
	                <input type="text" name="person_email" value="${local}" >@
				    <!-- 도메인은 select에서 선택 -->
				    <select id="email_domain" name="domain_email">
					    <option value="naver.com" ${domain == 'naver.com' ? 'selected' : ''}>naver.com</option>
					    <option value="gmail.com" ${domain == 'gmail.com' ? 'selected' : ''}>gmail.com</option>
					    <option value="daum.net"  ${domain == 'daum.net'  ? 'selected' : ''}>daum.net</option>
				    </select>
	            </td>
	          </tr>
	        </tbody>
	      </table>
	    </div>
	
	    <!-- 표 #2 -->
	    <div class="slide-tb">
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
	            <td>
	              <input type="date" name="worker_join" value="${dto.worker_join}">
	            </td>
	            <td>
	              <select name="department_id" id="deptSelect">
	                <c:forEach var="dept" items="${deptList}">
	                  <option value="${dept.department_id}"
	                          <c:if test="${dept.department_id eq dto.department_id}">selected</c:if>>
	                    ${dept.department_name}
	                  </option>
	                </c:forEach>
	              </select>
	            </td>
	            <td>
	            	<select name="worker_code">
				        <option value="ADMIN" <c:if test="${dto.worker_code eq 'ADMIN'}">selected</c:if>>ADMIN</option>
				        <option value="HEAD" <c:if test="${dto.worker_code eq 'HEAD'}">selected</c:if>>HEAD</option>
				        <option value="STAFF" <c:if test="${dto.worker_code eq 'STAFF'}">selected</c:if>>STAFF</option>
				    </select>
	            </td>
	          </tr>
	        </tbody>
	      </table>
	    </div>
	
	    <!-- 버튼 -->
	    <div class="slide-btnbox">
	    
	      <input type="hidden" name="worker_pw" value="${dto.worker_pw}">
	      <input type="submit" class="save-btn slide-btn" value="저장">
	      <a href="workerlist" class="slide-btn close-btn">취소</a>
	    </div>
	  </div>
	</form>
    </div>
</body>
</html>