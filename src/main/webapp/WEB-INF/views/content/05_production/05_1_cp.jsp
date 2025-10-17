<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%
    String todayStr = new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date());
    request.setAttribute("todayStr", todayStr);
%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css" type="text/css">
    <script src="${pageContext.request.contextPath}/resources/js/common.js"></script>

<title>생산 계획</title>

</head>
<body>
    <h1>생산 계획</h1>
    
    <form class="panel" method="get" action="">
               
<!--     검색필터 -->
        <div class="filter">
            <div class="filter-item-box">
				<div class = "filter-item">
		                	<span class="filitem-name">· 생산계획 ID </span>
		                	<div class = "filitem-input">
		              			<input type="text" name="orderNo" value="${fn:escapeXml(param.orderNo)}">
		               		 </div>
				</div>


	            <div class = "filter-item">
	                <div class = "filitem-name">· 생산계획일 </div>
	                <div class = "filitem-input">
	                	<input type="date" name="fromDate" id="fromDate" value="${empty param.fromDate ? '' : param.fromDate}">
	                	<span class="tilde">~</span>
	                	<input type="date" name="toDate" id="toDate" value="${empty param.toDate ? todayStr : param.toDate}">
	                   
	               	 </div>
				</div>

				<div class = "filter-item">
		                	<span class="filitem-name">· 목표품목 ID </span>
		                	<div class = "filitem-input">
		              			<input type="text" name="publisher_name" value="${fn:escapeXml(param.publisher_name)}">
		               		 </div>
				</div>

		</div>
		<div class = "filter-btn">
            <input type = "submit" class = "fil-btn" value="조회">
        </div>
	</div>
    </form>

    <div class="table">
     
            <table>
                <thead>
                    <tr>
                        <th class="chkbox"><input type="checkbox" id="chkAll"></th>
                        <th>생산계획 ID</th>
                        <th>품목 ID</th>
                        <th>생산계획일</th>
                        <th>목표수량</th>
                    </tr>
                </thead>
           <tbody>
    <c:choose>
        <c:when test="${not empty orders}">
            <c:forEach var="o" items="${orders}">
                <tr>
                    <td class="col-check"><input type="checkbox" name="rowChk" value="${o.order_id}"></td>
                    <td>${o.order_id}</td>
                    <td>
                        <a href="${pageContext.request.contextPath}/po/detail?id=${o.order_id}" style="color:inherit; text-decoration:none;">
                            ${o.item_id}
                        </a>
                    </td>
                    <td>
                        <fmt:formatDate value="${o.order_date}" pattern="yyyy-MM-dd"/>
                    </td>
                    <td class="col-qty">${o.order_amount}</td> <!-- ✅ 목표수량 -->
                </tr>
            </c:forEach>
        </c:when>
        <c:otherwise>
            <c:forEach var="i" begin="1" end="10">
                <tr>
                    <td class="col-check"><input type="checkbox" name="rowChk"></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="col-qty"></td>
                </tr>
            </c:forEach>
        </c:otherwise>
    </c:choose>
</tbody>
            </table>
       
    </div>

    <div class="bottom-btn">
		<div class = "page"></div>
		<div class = "bottom-btn-box">
			<input type = "button" class = "btm-btn new" value = "신규">
			<input type = "button" class = "btm-btn del" value = "삭제">
			
		</div>
		
    </div>
    
      <!-- 등록 슬라이드 -->
    <div class="slide" id="slide-input">
        <div class="slide-contents">
            <div class="silde-title"><h2>생산계획 등록</h2></div>
            <div class="slide-id">생산계획 ID: HOOOOOOO </div>
            
            
            
            </div>

            <div class="slide-tb">
                <table>
                    <thead>
                        <tr><th>생산 계획일</th><th>목표 품목 ID</th><th>목표 수량</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>1</td><td>1</td><td>1</td></tr>
                    </tbody>
                </table>
            </div>

        
     
            <div class="slide-btnbox">
                <input type="button" class="slide-btn" value = "등록">
                <input type="button" class="close-btn slide-btn" value = "취소">
            </div>
        </div>
    </div>


</body>
</html>
   <c:choose>
            <c:when test="${hasPrevBlock}"> <%-- 이전 블록이 있으면 링크 활성 --%>
                <c:url var="prevBlockUrl" value="${selfPath}"> <%-- /list 에 파라미터 조합 --%>
                    <c:param name="page" value="${prevBlockStart}"/> <%-- 이전 블록 첫 페이지로 이동 --%>
                    <c:param name="size" value="${pagePerRows}"/> <%-- Rows 유지 --%>
                    <c:param name="stock_id" value="${param.stock_id}"/> <%-- 필터 유지 --%>
                    <c:param name="item_div" value="${param.item_div}"/>
                    <c:param name="stock_wrap" value="${param.stock_wrap}"/>
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
                <c:param name="stock_id" value="${param.stock_id}"/>
                <c:param name="item_div" value="${param.item_div}"/>
                <c:param name="stock_wrap" value="${param.stock_wrap}"/>
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
                    <c:param name="stock_id" value="${param.stock_id}"/>
                    <c:param name="item_div" value="${param.item_div}"/>
                    <c:param name="stock_wrap" value="${param.stock_wrap}"/>
                </c:url>
                <a class="page-link" href="${nextBlockUrl}">다음</a> <%-- 클릭 시 11, 21, … --%>
            </c:when>
            <c:otherwise>
                <span class="page-link disabled">다음</span> <%-- 다음 블록 없으면 비활성 --%>
            </c:otherwise>
        </c:choose>
    </div>
   


   
</body>
</html>