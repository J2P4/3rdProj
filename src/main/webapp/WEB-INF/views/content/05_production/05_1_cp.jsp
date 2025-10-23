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
    <title>생산계획 < J2P4</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css">
    <script>window.contextPath='${pageContext.request.contextPath}';</script>
    
    <script src="${pageContext.request.contextPath}/resources/js/common.js" defer></script>
    <script src="${pageContext.request.contextPath}/resources/js/05_1_cp.js"></script>
<style>
.hide {
	display:none !important;
}
</style>
</head>
<body>
    <div class = "title">
    	<h1>생산계획 관리</h1>
   	</div>
   	<c:url var="cpUrl" value="/cp"/> <%-- 모든 내부 링크의 기준 URL(중복 /mes/mes 방지) 이거 떄믄에 한시간.... --%>
	<c:set var="selfPath" value="/cp"/> <%-- c:url value에 사용할 경로 문자열 --%>
	
    <form class = "filter" method="get" action="${cpUrl}">
        <div class = "filter-item-box">
            <div class = "filter-item">
                <div class = "filitem-name">· 계획 품목</div>
                <div class = "filitem-input">
                    <select name="item_id">
					      <option value="">
					        전체
					      </option>
					      <c:forEach var="i" items="${itemList}">
				            <option value="${i.item_id}"
			              		${i.item_id == filter.item_id ? 'selected' : ''}>
				              ${i.item_name}
				            </option>
				          </c:forEach>
				  	</select>                    
                </div>
            </div>
            <div class = "filter-item" style = "width: 100%;">
                <div class = "filitem-name" style = "width: 15%">· 계획일</div>
                <div class = "filitem-input">
                    <input type = "date" name="fromDate" id="fromDate" value="${empty filter.fromDate ? '' : filter.fromDate}">
                    <span class="tilde">~</span>
                    <input type = "date" name="toDate" id="toDate" value="${empty filter.toDate ? '' : filter.toDate}">
                </div>
            </div>
        </div>
        <div class = "filter-btn">
            <input type="hidden" name="page" value="1"/> <%-- 조회 시 항상 1페이지부터 --%>
            <input type="hidden" name="size" value="${pagePerRows != null ? pagePerRows : 10}"/> <%-- 현재 Rows 유지 --%>
            <input type="submit" class="fil-btn" value="조회">
        </div>
    </form>
   	<form id="deleteForm" method="post" action="cpdelete">
    <div class = "table">
		<table border=1>
            <thead>
            	<tr>
	                <th class = "chkbox"><input type="checkbox"  id="chkAll"></th>
	                <th>생산계획ID</th>
	                <th>계획 품목</th>
	                <th>생산계획일</th>
	                <th>목표수량</th>
                </tr>
            </thead>
            <tbody>
	            <c:if test="${empty list }">
					<tr>
						<td colspan="5"> 조회 내역이 없습니다.</td>
					</tr>
				</c:if>
				<c:if test="${not empty list }">
					<c:forEach var="cpDTO" items="${list }">			 
		                <tr data-id="${cpDTO.cp_id}">
		                    <td><input type="checkbox" class="rowChk" name="many_cps" value="${cpDTO.cp_id }"></td>
		                    <td>${cpDTO.cp_id }</td>
		                    <td class="cp-row" data-id="${cpDTO.cp_id}">
							    ${cpDTO.item_name}
							</td>
		                    <td>
		                    	<fmt:formatDate value="${cpDTO.cp_start}" pattern="yy.MM.dd"/>~
  								<fmt:formatDate value="${cpDTO.cp_end}" pattern="yy.MM.dd"/><br>
								<c:if test="${not empty cpDTO.cp_start and not empty cpDTO.cp_end}">
								    <c:set var="day" value="${(cpDTO.cp_end.time - cpDTO.cp_start.time) / (1000*60*60*24) + 1}" />
								    (${day}일간)
								</c:if>
							</td>
		                    <td style= "text-align: right"><fmt:formatNumber value="${cpDTO.cp_amount }" pattern="#,###"></fmt:formatNumber></td>
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
    	<c:if test="${sessionScope.role != 'STAFF'}">
		    <!-- 버튼 영역 전체 -->
	    	<div class = "bottom-btn-box">
	            <input type = "button" class = "btm-btn new" value="신규">
	            <input type = "submit" class = "btm-btn del" value="삭제">
	        </div>
		</c:if>
		<c:if test="${sessionScope.role == 'STAFF'}">
		    <!-- STAFF는 조회만 가능 -->
		    <!-- 버튼 없음 -->
		</c:if>
    </div>
    </form>
    <div class = "page">
        	<c:if test="${empty page}"><c:set var="page" value="1"/></c:if> <%-- 현재 페이지 기본 1 --%>
	        <c:if test="${empty pagePerRows}"><c:set var="pagePerRows" value="10"/></c:if> <%-- Rows 기본 10 --%>
	        <c:if test="${empty totalPages}"><c:set var="totalPages" value="1"/></c:if> <%-- 총페이지 기본 1 --%>
	        <c:if test="${empty startPage}"><c:set var="startPage" value="1"/></c:if> <%-- 블록 시작 기본 1 --%>
	        <c:if test="${empty endPage}"><c:set var="endPage" value="${totalPages}"/></c:if> <%-- 블록 끝 기본 총페이지 --%>
	
	        <form id="sizeForm" method="get" action="${cpUrl}" style="display:inline-block; margin-right:8px;">
	            <input type="hidden" name="page" value="1"/> <%-- Rows 바꾸면 1페이지로 --%>
	           	<!-- 필터에 들어가는 컬럼 적기 -->
	            <input type="hidden" name="item_name" value="${fn:escapeXml(param.item_name)}"/> <%-- 기존 필터 유지 --%>
	            <input type="hidden" name="cp_start" value="${fn:escapeXml(param.cp_start)}"/>
	            <input type="hidden" name="cp_end" value="${fn:escapeXml(param.cp_end)}"/>
	
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
	                    <c:param name="item_name" value="${fn:escapeXml(param.item_name)}"/>	<%-- 필터 유지 --%>
	                    <c:param name="cp_start" value="${fn:escapeXml(param.cp_start)}"/>  
	                    <c:param name="cp_end" value="${fn:escapeXml(param.cp_end)}"/>      
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
	                <c:param name="item_name" value="${fn:escapeXml(param.item_name)}"/>
	                <c:param name="cp_start" value="${fn:escapeXml(param.cp_start)}"/>  
	                <c:param name="cp_end" value="${fn:escapeXml(param.cp_end)}"/>      
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
	                    <c:param name="item_name" value="${fn:escapeXml(param.item_name)}"/>
	                    <c:param name="cp_start" value="${fn:escapeXml(param.cp_start)}"/>  
	                    <c:param name="cp_end" value="${fn:escapeXml(param.cp_end)}"/>      
	                </c:url>
	                <a class="page-link" href="${nextBlockUrl}">다음</a> <%-- 클릭 시 11, 21, … --%>
	            </c:when>
	            <c:otherwise>
	                <span class="page-link disabled">다음</span> <%-- 다음 블록 없으면 비활성 --%>
	            </c:otherwise>
	        </c:choose>
        </div>
    <div class = "slide" id = "slide-input">
    	<button type="button" class="slide-close-btn">✕</button>
    	<form id="cpInsertForm" method="post" action="cpinsert">
    	<div class = "slide-contents">
	        <div class = "silde-title"><h2>생산계획 등록</h2></div>
	        <div class = "slide-tb">
	            <table>
	                <thead>
		                <tr>
		                    <th>계획 시작일</th>
		                    <th>계획 종료일</th>
		                    <th>품목명</th>
		                    <th>계획 수량</th>
	                    </tr>
	                </thead>
	                <tbody>
	                    <tr>
	                        <td><input type="date" name="cp_start"></td>
	                        <td><input type="date" name="cp_end"></td>
	                        <td>
								<select name="item_id" id="itemSelectInsert">
	                        		<option value="">선택</option>
					                <c:forEach var="item" items="${itemList}">
					                  <option value="${item.item_id}">
					                    ${item.item_name}
					                  </option>
					                </c:forEach>
					            </select>
							</td>
	                        <td><input type="number" name="cp_amount"></td>
	                    </tr>
	                </tbody>
	            </table>
	        </div>
	        <div class = "slide-btnbox">
                <input type="button" id="btn-insert" class="slide-btn" value="등록">
                <input type = "button" class = "close-btn slide-btn" value = "취소">
            </div>
       	</div>
    </form>
    </div>
    
	<!--  상세 슬라이드 -->
	<div class="slide" id="slide-detail">
	  <!-- 단일 form: 중첩 금지 -->
	    <button type="button" class="slide-close-btn">✕</button>
	  <form id="cpForm" method="post" action="cpupdate">
	    <div class="slide-contents">
	      <div class="silde-title"><h2>생산계획 상세</h2></div>
	
	      <div class="title-box">
	        <!-- JS가 채움: .slide-cp 클래스명으로 통일 -->
	        <div class="slide-cp slide-id">생산계획 : </div>
	      </div>
	
	      <div class="slide-tb">
	        <table>
	          <thead>
	              <tr>
	              	<th>계획 시작일</th>
                  	<th>계획 종료일</th>
                  	<th>품목명</th>
                  	<th>계획 수량</th>
	              </tr>
	          </thead>
	          <tbody>
	            <tr>
	              <!-- JS가 채움: 순서만 유지 (0,1,2,3) -->
	              <td></td>
	              <td></td>
	              <td></td>
	              <td></td>
	            </tr>
	          </tbody> 
	        </table>
	      </div>
	
	      <div class="slide-btnbox">
	        <c:if test="${sessionScope.role != 'STAFF'}">
	          <input type="button" class="slide-btn modify-btn" id="btn-modify" value="수정">
	          <input type="button" class="slide-btn save-btn hide" id="btn-save" value="저장">
	          <input type="button" class="close-btn slide-btn" value="취소">
	        </c:if>
	        <c:if test="${sessionScope.role == 'STAFF'}">
	          <input type="button" class="close-btn slide-btn" value="취소">
	        </c:if>
	      </div>
	
	    </div>
	  </form>
	</div>
</body>
</html>