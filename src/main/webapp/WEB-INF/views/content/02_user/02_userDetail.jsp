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
	        <div class = "silde-title">
	        	<h2 >사원 상세</h2>
	        </div>
	        <div class="title-box">
		        <div class = "slide-worker">사번 : ${dto.worker_id }</div>
		        <form action="<c:url value='/temp'/>" method="post" >
				    <input type="hidden" name="worker_id" value="${dto.worker_id}">
				    <input type="submit" value="비밀번호 초기화" class="pw-reset">
				</form>
	        </div>
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
		                    <td>${dto.worker_name }</td>
		                    <td>${dto.worker_birth }</td>
		                    <td>${dto.worker_email }</td>
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
		                    <td>${dto.worker_join }</td>
		                    <td>
								<c:forEach var="d" items="${deptList}">
								    <c:if test="${d.department_id == dto.department_id}">
								      ${d.department_name}
								    </c:if>
								</c:forEach>	
							</td>
		                    <td>${dto.worker_code }</td>
		                </tr>
	                </tbody>
	            </table>
        	</div>
	        <div class = "slide-btnbox">
	        	<c:if test="${sessionScope.role != 'STAFF'}">
                	<a href="modify?worker_id=${dto.worker_id}" class="slide-btn modify-btn">수정</a>
					<a href="workerlist" class="slide-btn close-btn">취소</a>
            	</c:if>
            	<c:if test="${sessionScope.role == 'STAFF'}">
					<a href="workerlist" class="slide-btn close-btn">취소</a>
            	</c:if>
            </div>
       	</div>
    </div>
    
</body>
</html>