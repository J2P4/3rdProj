<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%
    String todayStr = new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date());
    request.setAttribute("todayStr", todayStr);
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>생산 실적 < 생산관리 < J2P4</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css" type="text/css">
    <!-- 상세, 품목 select 뜰 수 있도록 아래 script 영역 필수 추가!! -->
    <script>
        const contextPath = '${pageContext.request.contextPath}';
        // 품목 목록을 JSON 형식으로 js 변수에 저장하려고 작성
        const allItemsJson = `${itemListJson}`; 
    </script>
    <script src="${pageContext.request.contextPath}/resources/js/common.js" defer></script>
    <script src="${pageContext.request.contextPath}/resources/js/05_3_cplist.js" defer></script>
</head>
<body>
    <!-- 페이지 제목 -->
    <div class = "title"><h1>생산 실적</h1></div>
    <!-- 페이징용 추가 코드 1-->
   	<c:url var="/cplist" value="/cplist"/> <%-- 모든 내부 링크의 기준 URL(중복 /mes/mes 방지) 이거 떄믄에 한시간.... --%>
	<c:set var="selfPath" value="/cplist"/> <%-- c:url value에 사용할 경로 문자열 --%>
    <!-- 검색 필터(filter)
        - filter-item-box : select란 모음
            + filter-item: 개별 select란
                * filitem-name : select란 명
                * filitem-input : 실제 select 영역
        - filter-btn : 조회 버튼 영억
    -->
    <form class = "filter" method="get" action="${pageContext.request.contextPath}/cplist">
        <div class = "filter-item-box">
            <div class = "filter-item">
                <div class = "filitem-name">· 생산계획 ID</div>
                 <div class = "filitem-input">
                    <c:set var="filter.cp_id" value="${param.cp_id}" />
                    <input type="text" name="cp_id" placeholder=" ID를 입력해주세요" value="${filter.cp_id}">
                </div>
              
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 생산 계획일</div>
                <div class = "filitem-input">
	                	<input type="date" name="fromDate" id="fromDate" value="${empty param.fromDate ? '' : param.fromDate}">
	                	<span class="tilde">~</span>
	                	<input type="date" name="toDate" id="toDate" value="${empty param.toDate ? todayStr : param.toDate}">
                </div>
            </div>
        </div>
        <div class = "filter-btn">
            <input type="hidden" name="page" value="1"/> <%-- 조회 시 항상 1페이지부터 --%>
            <input type="hidden" name="size" value="${pagePerRows != null ? pagePerRows : 10}"/> <%-- 현재 Rows 유지 --%>
            <input type = "submit" class = "fil-btn" value="조회">
        </div>
    </form>
    <!-- 테이블 영역(table)
        - table(클래스 X) : 실제 테이블 영역
            + thead : 제목 영역. 너비 조정 위해서 일부 속성에 클래스 넣음.
            + tbody : 데이터 영역
    -->
    <div class = "table">
        <table>
            <thead>
                <tr>
                    <th class = "chkbox"><input type="checkbox" id="chkAll"></th>
                    <th class = "id">생산 실적 ID</th>
                    <th>생산 계획 ID</th>
                    <th class = "type">진행률</th>
                    <th>달성률</th>
                    <th>불량률</th>
                </tr>
            </thead>
            <!-- 데이터 행 tr에 data-id 속성 잊지 말기! (상세 슬라이드에 필수) -->
            <tbody>
               	<c:if test="${empty list}">
                	<tr>
                        <td><input type="checkbox" class="rowChk" disabled></td>
                		<td colspan="5"> 조회 내역이 없습니다.</td>
                	</tr>
               	</c:if>
               	<c:if test="${not empty list}">
               		<c:forEach var="P0503_CPListDTO" items="${list}">
	               		<tr data-id="${P0503_CPListDTO.cp_list_id}">
                        <td><input type="checkbox" class="rowChk" name="delete_cp_list_id" value="${P0503_CPListDTO.cp_list_id}"></td>
                        <td>${P0503_CPListDTO.cp_list_id}</td>
                        <td>${P0503_CPListDTO.cp_id}</td>
                        <td>${P0503_CPListDTO.cp_rate}</td>              
                        <td>${P0503_CPListDTO.cp_successrate}</td>          
                        <td>${P0503_CPListDTO.cp_defectrate}</td>    
                    </tr>
                    </c:forEach>
                 </c:if>
            </tbody>
        </table>
    </div>
    <!-- 테이블 하단 버튼 영역(bottom-btn)
        - page : 페이징 들어가는 영역
        - bottom-btn-boc : 등록, 삭제 등 버튼 영역
            + btm-btn : 공통 양식 지정
            + new, del : 개별 양식 지정
    -->
    <form class = "bottom-btn">
        <div class = "page"></div>
        <div class = "bottom-btn-box">
            <input type = "button" class = "btm-btn del" value="삭제">
        </div>
    </form>
    <!-- 현재 페이지 유지 -->
    <input type="hidden" name="page" value="${page}">
    <input type="hidden" name="size" value="${pagePerRows}">
    <div class = "page">
        <c:if test="${empty page}"><c:set var="page" value="1"/></c:if> <%-- 현재 페이지 기본 1 --%>
        <c:if test="${empty pagePerRows}"><c:set var="pagePerRows" value="10"/></c:if> <%-- Rows 기본 10 --%>
        <c:if test="${empty totalPages}"><c:set var="totalPages" value="1"/></c:if> <%-- 총페이지 기본 1 --%>
        <c:if test="${empty startPage}"><c:set var="startPage" value="1"/></c:if> <%-- 블록 시작 기본 1 --%>
        <c:if test="${empty endPage}"><c:set var="endPage" value="${totalPages}"/></c:if> <%-- 블록 끝 기본 총페이지 --%>
	
        <form id="sizeForm" method="get" action="${pageContext.request.contextPath}/stocklist" style="display:inline-block; margin-right:8px;">
            <input type="hidden" name="page" value="1"/> <%-- Rows 바꾸면 1페이지로 --%>
            <input type="hidden" name="cp_id" value="${fn:escapeXml(param.stock_id)}"/> <%-- 기존 필터 유지 --%>
            <input type="hidden" name="fromDate" value="${fn:escapeXml(param.fromDate)}"/> 
            <input type="hidden" name="toDate" value="${fn:escapeXml(param.toDate)}"/>

            <label>Rows:
                <select name="size" onchange="document.querySelector('#sizeForm').submit()">
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
                    <c:param name="cp_id" value="${param.cp_id}"/> <%-- 필터 유지 --%>
                    <c:param name="fromDate" value="${param.fromDate}"/>
                    <c:param name="toDate" value="${param.toDate}"/>
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
                <c:param name="cp_id" value="${param.cp_id}"/>
                <c:param name="fromDate" value="${param.fromDate}"/>
                <c:param name="toDate" value="${param.toDate}"/>
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
                    <c:param name="cp_id" value="${param.cp_id}"/>
                    <c:param name="fromDate" value="${param.fromDate}"/>
                    <c:param name="toDate" value="${param.toDate}"/>
                </c:url>
                <a class="page-link" href="${nextBlockUrl}">다음</a> <%-- 클릭 시 11, 21, … --%>
            </c:when>
            <c:otherwise>
                <span class="page-link disabled">다음</span> <%-- 다음 블록 없으면 비활성 --%>
            </c:otherwise>
        </c:choose>
    </div>
    <!-- 상세용 슬라이드 : ajax로 채울 거라 el 태그 사용 필요 X -->
    <div class = "slide" id = "slide-detail">
        <div class = "slide-contents">
            <div class = "silde-title"><h2>생산 실적 상세</h2></div>
            <div class = "slide-id">생산 실적 ID: </div>
            <div class = "slide-tb">
                <!-- 상세 데이터 표시용 id 주는 영역 1 -->
                <table id="itemDetail">
                    <thead>
                        <th>품목 ID</th>
                        <th>품목 분류</th>
                        <th>품목 이름</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb">
                <!-- 상세 데이터 표시용 id 주는 영역 1 -->
                <table id="stockDetail">
                    <thead>
                        <th>생산계획 ID</th>
                        <th>담당 사원</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-btnbox">
                <input type = "button" class = "close-btn slide-btn" value = "취소">
                <input type = "button" class = "slide-btn" id="detailEditBtn" value = "수정">
            </div>
        </div>
    </div>
</body>
</html>