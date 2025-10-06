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
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css" type="text/css">
<script src="${pageContext.request.contextPath}/resources/js/common.js"></script>

<title>품목 리스트</title>
</head>
<body>
    <h1>품목 리스트</h1>

    <form class="panel" method="get" action="">
        <!-- 검색필터 -->
        <div class="filter">
            <div class="filter-item-box">
                <div class="filter-item">
                    <span class="filitem-name">· 품목 ID</span>
                    <div class="filitem-input">
                        <input type="text" name="itemNo" value="${fn:escapeXml(param.itemNo)}">
                    </div>
                </div>

                <div class="filter-item">
                    <div class="filitem-name">· 품목 이름</div>
                    <div class="filitem-input">
                        <input type="text" name="itemName" value="${fn:escapeXml(param.itemName)}">
                    </div>
                </div>

                <div class="filter-item">
                    <span class="filitem-name">· 구분</span>
                    <div class="filitem-input">
                        <input type="text" name="item_div" value="${fn:escapeXml(param.item_div)}">
                    </div>
                </div>

                <div class="filter-item">
                    <span class="filitem-name">· 단가</span>
                    <div class="filitem-input">
                        <input type="text" name="item_min" value="${fn:escapeXml(param.item_min)}">
                        <span class="tilde">~</span>
                        <input type="text" name="item_max" value="${fn:escapeXml(param.item_max)}">
                    </div>
                </div>
            </div>
            <div class="filter-btn">
                <input type="submit" class="fil-btn" value="조회">
            </div>
        </div>
    </form>

    <div class="table">
        <table>
            <thead>
                <tr>
                    <th class="chkbox"><input type="checkbox" id="chkAll"></th>
                    <th>품목 ID</th>
                    <th>품목 이름</th>
                    <th>구분</th>
                    <th>단가</th>
                    <th>단위</th>
                </tr>
            </thead>
            <tbody>
                <c:choose>
                    <!-- 컨트롤러에서 List<Item> items 로 내려준다는 가정 -->
                    <c:when test="${not empty items}">
                        <c:forEach var="o" items="${items}">
                            <tr>
                                <td class="col-check"><input type="checkbox" name="rowChk" value="${o.id}"></td>
                                <td>${o.id}</td>
                                <td>
                                    <a href="${pageContext.request.contextPath}/item/detail?id=${o.id}" style="color:inherit; text-decoration:none;">
                                        ${o.itemName}
                                    </a>
                                </td>
                                <td>${o.itemDiv}</td>
                                <td class="col-qty"><fmt:formatNumber value="${o.unitPrice}" pattern="#,##0"/></td>
                                <td>${o.unit}</td>
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
                                <td></td>
                            </tr>
                        </c:forEach>
                    </c:otherwise>
                </c:choose>
            </tbody>
        </table>
    </div>

    <div class="bottom-btn">
        <div class="page"></div>
        <div class="bottom-btn-box">
            <input type="button" class="btm-btn new" value="신규">
            <input type="button" class="btm-btn del" value="삭제">
        </div>
    </div>

    <!-- 상세용 슬라이드-->
    <div class = "slide" id = "slide-detail">
        <div class = "slide-contents">
            <div class = "silde-title"><h2>발주 상세</h2></div>
            <div class = "slide-id">발주 ID: </div>
            <div class = "date">
                <div class="slide-id" style = "display : flex">
                    <div>발주일 <input type="date" name="orderdate" id="orderdate"></div>
                    <div>결제일 <input type="date" name="orderdate" id="orderdate"></div>
                    <div>수주일 <input type="date" name="orderdate" id="orderdate"></div>
                </div>
            </div>

            <div class="slide-tb">
                <table>
                    <thead>
                        <tr><th>발주 상태</th><th>발주량</th><th>발주 담당자 사번</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>1</td><td>1</td><td>1</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="slide-tb">
                <table>
                    <thead>
                        <tr><th>품목 ID</th><th>품목 분류</th><th>품목 이름</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>2</td><td>2</td><td>2</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="slide-tb">
                <table>
                    <thead>
                        <tr><th>거래처 ID</th><th>거래처 이름</th><th>거래처 담당자 사번</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>2</td><td>2</td><td>2</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class = "slide-btnbox">
            <input type = "button" class = "slide-btn" value = "수정">
            <input type = "button" class = "close-btn slide-btn" value = "취소">
        </div>
    </div>

    <!-- 등록 슬라이드 -->
    <div class="slide" id="slide-input">
        <div class="slide-contents">
            <div class="silde-title"><h2>발주 등록</h2></div>
            <div class="slide-id">발주 ID: </div>
            <div class = "date">
                <div class="slide-id" style = "display : flex">
                    <div>발주일 <input type="date" name="orderdate" id="orderdate"></div>
                    <div>결제(예정일) <input type="date" name="orderdate" id="orderdate"></div>
                    <div>수주(예정일) <input type="date" name="orderdate" id="orderdate"></div>
                </div>
            </div>

            <div class="slide-tb">
                <table>
                    <thead>
                        <tr><th>발주 상태</th><th>발주량</th><th>발주 담당자 사번</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>1</td><td>1</td><td>1</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="slide-tb">
                <table>
                    <thead>
                        <tr><th>품목 ID</th><th>품목 분류</th><th>품목 이름</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>2</td><td>2</td><td>2</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="slide-tb">
                <table>
                    <thead>
                        <tr><th>거래처 ID</th><th>거래처 이름</th><th>거래처 담당자 사번</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>2</td><td>2</td><td>2</td></tr>
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
