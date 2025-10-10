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
    <script src="${pageContext.request.contextPath}/resources/js/common.js" defer></script>
    <script src="${pageContext.request.contextPath}/resources/js/02_user.js"></script>
</head>
<body>
    <div class = "title">
    	<h1>계정 관리</h1>
   	</div>
    <form class = "filter" method="get" action="">
        <div class = "filter-item-box">
            <div class = "filter-item">
                <div class = "filitem-name">· 사원명</div>
                <div class = "filitem-input">
                    <select name="worker_name">
					      <option value="">
					        전체
					      </option>
					    <c:forEach var="worker" items="${list}">
					      <option value="${worker_name}">
					        ${worker.worker_name}
					      </option>
					    </c:forEach>
				  	</select>                    
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 부서</div>
                <div class = "filitem-input">
                    <select class="edit-only" name="department_id" id="deptSelect">
                    	<option value="">
					        전체
					    </option>
					    <c:forEach var="dept" items="${deptList}">
					      <option value="${dept.department_id}">
					        ${dept.department_name}
					      </option>
					    </c:forEach>
				  	</select>
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 권한</div>
                <div class = "filitem-input">
                    <select name = "inout" size = "1">
                        <option value = "" selected>전체</option>
                        <option value = "2">관리자</option>
                        <option value = "3">부서장</option>
                        <option value = "4">사원</option>
                    </select>
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 입사일</div>
                <div class = "filitem-input">
                    <select name = "inout" size = "1">
                        <option value = "" selected>전체</option>
                        <option value = "2">입사일 빠른순</option>
                        <option value = "3">부서장</option>
                        <option value = "4">사원</option>
                    </select>
                </div>
            </div>
        </div>
        <div class = "filter-btn">
            <input type = "submit" class = "fil-btn" value="조회">
        </div>
    </form>
   	<form id="deleteForm" method="post" action="delete">
    <div class = "table">
		<table border=1>
            <thead>
            	<tr>
	                <th class = "chkbox"><input type="checkbox"  id="chkAll"></th>
	                <th>사원번호</th>
	                <th>이름</th>
	                <th>부서</th>
	                <th>입사일</th>
	                <th>권한</th>
                </tr>
            </thead>
            <tbody>
	            <c:if test="${empty list }">
					<tr>
						<td colspan="6"> 조회 내역이 없습니다.</td>
					</tr>
				</c:if>
				<c:if test="${not empty list }">
					<c:forEach var="workerDTO" items="${list }">			 
		                <tr>
		                    <td><input type="checkbox" class="rowChk" name="worker_id" value="${workerDTO.worker_id }"></td>
		                    <td>${workerDTO.worker_id }</td>
		                    <td><a href="detail?worker_id=${workerDTO.worker_id }">${workerDTO.worker_name }</a></td>
		                    <td>${workerDTO.department_name }</td>
		                    <td>${workerDTO.worker_join }</td>
		                    <td>${workerDTO.worker_code }</td>
		                </tr>
	                </c:forEach>
	            </c:if>	
            </tbody>
        </table>
    </div>
    <div class = "bottom-btn">
        <div class = "page"></div>
        <div class = "bottom-btn-box">
            <input type = "button" class = "btm-btn new" value="신규">
            <input type = "submit" class = "btm-btn del" value="삭제">
        </div>
    </div>
    </form>
    <form id="workerForm" method="post" action="insert">
    <div class = "slide" id = "slide-input">
    	<div class = "slide-contents">
	        <div class = "silde-title"><h2>사원 등록</h2></div>
	        <div class = "slide-id">사번 : 자동생성</div>
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
	                        <td><input type="text" name="worker_name"></td>
	                        <td><input type="date" name="worker_birth"></td>
	                        <td>
		                        <input type="text" name="person_email">@
								<select name="domain_email">
								    <option value="naver.com">naver.com</option>
								    <option value="gmail.com">gmail.com</option>
								    <option value="daum.net">daum.net</option>
								</select>
							</td>
	                    </tr>
	                </tbody>
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
	                        <td><input type="date" name="worker_join"></td>
	                        <td>
	                        	<select name="department_id" id="deptSelect">
	                        		<option value="">선택</option>
					                <c:forEach var="dept" items="${deptList}">
					                  <option value="${dept.department_id}">
					                    ${dept.department_name}
					                  </option>
					                </c:forEach>
					            </select>
							</td>
	                        <td>
	                        	<select name="worker_code">
	                        		<option value="1" selected>선택</option>
	                        		<option value="ADMIN">관리자</option>
	                        		<option value="MANAGER">부서장</option>
	                        		<option value="STAFF">사원</option>
	                        	</select>
	                       	</td>
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
    </form>
    
	<!--  상세 슬라이드 -->
    <div class = "slide" id = "slide-detail">
	    <form id="workerForm" method="post" action="/update">
        <div class = "slide-contents">
	        <div class = "silde-title"><h2>사원 상세</h2></div>
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
       	</div>
        <div class = "slide-btnbox">
            <input id="btnSave"   class="slide-btn" type="submit" value="등록" style="display: none">
		    <input id="btnEdit"   class="slide-btn" type="button" value="수정">
		    <input id="btnCancel" class="close-btn slide-btn" type="button" value="취소">
        </div>
    </form>
    </div>
    
</body>
</html>