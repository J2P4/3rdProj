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

<c:url var="cssUrl" value="/resources/css/common.css"/>
<c:url var="jsUrl" value="/resources/js/common.js"/>
<link rel="stylesheet" href="${cssUrl}" type="text/css">
<script src="${jsUrl}"></script>
<c:url var="common2Url" value="/resources/js/common2.js"/>
<script src="${common2Url}"></script>

<title>품목 리스트</title>
</head>
<body>
    <h1>품목 리스트</h1>

    <c:url var="selfUrl" value=""/>
    <c:set var="qs" value="${pageContext.request.queryString}" />

    <form class="panel" method="get" action="${selfUrl}">
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
                    <span class="filitem-name">· 품목 이름</span>
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
                        <input type="text" name="item_min" style="width:40%" value="${fn:escapeXml(param.item_min)}">
                        <span class="tilde">~</span>
                        <input type="text" name="item_max" style="width:40%" value="${fn:escapeXml(param.item_max)}">
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
                    <c:when test="${not empty list}">
                        <c:forEach var="row" items="${list}">
                            <tr>
                                <td class="chkbox"><input type="checkbox" name="rowChk"></td>
                                <!-- ItemDTO에 맞춘 바인딩 (snake_case) -->
                                <td>${row.item_id}</td>
                                <td>${row.item_name}</td>
                                <td>${row.item_div}</td>
                                <td><fmt:formatNumber value="${row.item_price}" pattern="#,##0"/></td>
                                <td>${row.item_unit}</td>
                            </tr>
                        </c:forEach>
                    </c:when>
                    <c:otherwise>
                        <c:forEach var="i" begin="1" end="10">
                            <tr aria-hidden="true">
                                <td class="chkbox"><input type="checkbox" name="rowChk"></td>
                                <td>&nbsp;</td>
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

    <!-- 하단 버튼 -->
    <div class="bottom-btn">
        <div class="page"></div>
        <div class="bottom-btn-box">
            <input type="button" class="btm-btn new" value="신규">
            <input type="button" class="btm-btn del" value="삭제">
        </div>
    </div>

    <!-- 삭제용 POST 폼(체크박스 일괄 삭제) -->
    <c:url var="deleteUrl" value="/item/delete"/>
    <form id="deleteForm" method="post" action="${deleteUrl}" style="display:none;">
        <input type="hidden" name="ids" id="deleteIds">
    </form>

    <c:url var="saveUrl" value="/item/save"/>

    <!-- 등록용 슬라이드 (조회/수정/추가) -->
    <div class="slide" id="slide-input">
        <div class="slide-contents">
            <div class="silde-title"><h2>품목 상세</h2></div>

            <!-- 저장용 POST 폼: id가 비어있으면 INSERT, 있으면 UPDATE -->
            <form id="slideSaveForm" method="post" action="${saveUrl}">

                <div class="slide-id">품목 ID :
                    <input type="text" name="itemIdView" id="itemIdView" readonly>
                    <input type="hidden" name="id" id="id">
                    <input type="hidden" name="version" id="version">
                </div>

                <div class="slide-id"> 품목 이름 :
                    <input type="text" name="itemName" id="itemName">
                </div>

                <div class="slide-tb">
                    <table>
                        <thead>
                            <tr><th>거래처 ID</th><th>구분</th><th>단가</th><th>단위 </th></tr>
                        </thead>
                        <tbody id="editRows">
                            <tr>
                                <td><input type="text" name="vendorId" id="vendorId"></td>
                                <td><input type="text" name="itemDiv" id="itemDiv"></td>
                                <td><input type="number" name="unitPrice" id="unitPrice" min="0"></td>
                                <td><input type="text" name="unit" id="unit"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="slide-btnbox">
                    <input type="submit" class="slide-btn" value="수정">
                    <input type="button" class="close-btn slide-btn" value="취소">
                </div>
            </form>
        </div>
    </div>

    <!-- 상세 슬라이드  -->
    <div class="slide" id="slide-detail">
        <div class="slide-contents">
            <div class="silde-title"><h2>발주 등록</h2></div>
            <div class="slide-id">발주 ID: </div>
            <div class="date">
                <div class="slide-id" style="display:flex">
                    <div>발주일 <input type="date" name="orderdate" id="orderdate-input-1" value="${todayStr}"></div>
                    <div>결제(예정일) <input type="date" name="orderdate" id="orderdate-input-2"></div>
                    <div>수주(예정일) <input type="date" name="orderdate" id="orderdate-input-3"></div>
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
                <input type="button" class="slide-btn" value="등록">
                <input type="button" class="close-btn slide-btn" value="취소">
            </div>
        </div>
    </div>
</body>
</html>
