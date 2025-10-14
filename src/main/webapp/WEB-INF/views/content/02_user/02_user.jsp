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
   	<c:url var="workerlistUrl" value="/workerlist"/> <%-- 모든 내부 링크의 기준 URL(중복 /mes/mes 방지) 이거 떄믄에 한시간.... --%>
	<c:set var="selfPath" value="/workerlist"/> <%-- c:url value에 사용할 경로 문자열 --%>
	
    <form class = "filter" method="get" action="${workerlistUrl}">
        <div class = "filter-item-box">
            <div class = "filter-item">
                <div class = "filitem-name">· 사원명</div>
                <div class = "filitem-input">
                    <select name="worker_name">
					      <option value="">
					        전체
					      </option>
					      <c:forEach var="w" items="${list}">
				            <option value="${w.worker_name}"
				              ${w.worker_name == filter.worker_name ? 'selected' : ''}>
				              ${w.worker_name}
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
                    <select name = "worker_code" size = "1">
						  <option value=""  ${empty filter.worker_code ? 'selected' : ''}>전체</option>
						  <option value="ADMIN" ${filter.worker_code == 'ADMIN' ? 'selected' : ''}>ADMIN</option>
						  <option value="HEAD" ${filter.worker_code == 'HEAD' ? 'selected' : ''}>HEAD</option>
						  <option value="STAFF" ${filter.worker_code == 'STAFF' ? 'selected' : ''}>STAFF</option>
						</select>
                    </select>
                </div>
            </div>
        </div>
        <div class = "filter-btn">
            <input type="hidden" name="page" value="1"/> <%-- 조회 시 항상 1페이지부터 --%>
            <input type="hidden" name="size" value="${pagePerRows != null ? pagePerRows : 10}"/> <%-- 현재 Rows 유지 --%>
            <input type="submit" class="fil-btn" value="조회">
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
		                    <td><input type="checkbox" class="rowChk" name="many_workers" value="${workerDTO.worker_id }"></td>
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
    <!-- 현재 페이지 유지 -->
    <input type="hidden" name="page" value="${page}">
    <input type="hidden" name="size" value="${pagePerRows}">
    <div class = "bottom-btn">
    	<div class = "bottom-btn-box">
            <input type = "button" class = "btm-btn new" value="신규">
            <input type = "submit" class = "btm-btn del" value="삭제">
        </div>
    </div>
    </form>
    <div class = "page">
        	<c:if test="${empty page}"><c:set var="page" value="1"/></c:if> <%-- 현재 페이지 기본 1 --%>
	        <c:if test="${empty pagePerRows}"><c:set var="pagePerRows" value="10"/></c:if> <%-- Rows 기본 10 --%>
	        <c:if test="${empty totalPages}"><c:set var="totalPages" value="1"/></c:if> <%-- 총페이지 기본 1 --%>
	        <c:if test="${empty startPage}"><c:set var="startPage" value="1"/></c:if> <%-- 블록 시작 기본 1 --%>
	        <c:if test="${empty endPage}"><c:set var="endPage" value="${totalPages}"/></c:if> <%-- 블록 끝 기본 총페이지 --%>
	
	        <form id="sizeForm" method="get" action="${workerlistUrl}" style="display:inline-block; margin-right:8px;">
	            <input type="hidden" name="page" value="1"/> <%-- Rows 바꾸면 1페이지로 --%>
	            <input type="hidden" name="worker_name" value="${fn:escapeXml(param.worker_name)}"/> <%-- 기존 필터 유지 --%>
	            <input type="hidden" name="department_id" value="${fn:escapeXml(param.department_id)}"/>
	            <input type="hidden" name="worker_code" value="${fn:escapeXml(param.worker_code)}"/>
	
	            <label>Rows:
	                <select name="size" onchange="document.getElementById('sizeForm').submit()">
	                    <option value="1" ${pagePerRows==1 ? 'selected' : ''}>1</option> <%-- 1행 보기(블록 전환 테스트에 유용) --%>
	                    <option value="10" ${pagePerRows==10 ? 'selected' : ''}>10</option>
	                    <option value="20" ${pagePerRows==20 ? 'selected' : ''}>20</option>
	                    <option value="50" ${pagePerRows==50 ? 'selected' : ''}>50</option>
	                    <option value="100" ${pagePerRows==100 ? 'selected' : ''}>100</option>
	                </select>
	            </label>
	        </form>
	
	        <c:choose>
	            <c:when test="${hasPrevBlock}"> <%-- 이전 블록이 있으면 링크 활성 --%>
	                <c:url var="prevBlockUrl" value="${selfPath}"> <%-- /list 에 파라미터 조합 --%>
	                    <c:param name="page" value="${prevBlockStart}"/> <%-- 이전 블록 첫 페이지로 이동 --%>
	                    <c:param name="size" value="${pagePerRows}"/> <%-- Rows 유지 --%>
	                    <c:param name="worker_name" value="${param.worker_name}"/> <%-- 필터 유지 --%>
	                    <c:param name="department_id" value="${param.department_id}"/>
	                    <c:param name="worker_code" value="${param.worker_code}"/>
	                </c:url>
	                <a class="page-link" href="${prevBlockUrl}">이전</a> <%-- 클릭 시 이전 블록 시작으로 --%>
	            </c:when>
	            <c:otherwise>
	                <span class="page-link disabled">이전</span> <%-- 이전 블록이 없으면 비활성 --%>
	            </c:otherwise>
	        </c:choose>
	
	        <c:forEach var="p" begin="${startPage}" end="${endPage}">
	            <c:url var="pUrl" value="${selfPath}"> <%-- 각 페이지 숫자 링크 --%>
	                <c:param name="page" value="${p}"/>
	                <c:param name="size" value="${pagePerRows}"/>
	                <c:param name="worker_name" value="${param.worker_name}"/>
	                <c:param name="department_id" value="${param.department_id}"/>
	                <c:param name="worker_code" value="${param.worker_code}"/>
	            </c:url>
	            <c:choose>
	                <c:when test="${p == page}">
	                    <span class="page-link current"><strong>${p}</strong></span> <%-- 현재 페이지는 강조(링크 X) --%>
	                </c:when>
	                <c:otherwise>
	                    <a class="page-link" href="${pUrl}">${p}</a> <%-- 다른 페이지는 링크 --%>
	                </c:otherwise>
	            </c:choose>
	        </c:forEach>
	
	        <c:choose>
	            <c:when test="${hasNextBlock}">
	                <c:url var="nextBlockUrl" value="${selfPath}">
	                    <c:param name="page" value="${nextBlockStart}"/> <%-- 다음 블록 시작 페이지 --%>
	                    <c:param name="size" value="${pagePerRows}"/>
	                    <c:param name="worker_name" value="${param.worker_name}"/>
	                    <c:param name="department_id" value="${param.department_id}"/>
	                    <c:param name="worker_code" value="${param.worker_code}"/>
	                </c:url>
	                <a class="page-link" href="${nextBlockUrl}">다음</a> <%-- 클릭 시 11, 21, … --%>
	            </c:when>
	            <c:otherwise>
	                <span class="page-link disabled">다음</span> <%-- 다음 블록 없으면 비활성 --%>
	            </c:otherwise>
	        </c:choose>
        </div>
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