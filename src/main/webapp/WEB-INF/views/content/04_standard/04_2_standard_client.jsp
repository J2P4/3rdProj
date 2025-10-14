<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<c:url var="cssUrl" value="/resources/css/common.css"/>
<c:url var="jsUrl" value="/resources/js/common.js"/>
<link rel="stylesheet" href="${cssUrl}" type="text/css">
<script src="${jsUrl}"></script>
<script>const contextPath='${pageContext.request.contextPath}';</script>
<title>거래처 리스트</title>

</head>
<body>
<h1>거래처 리스트</h1>

<c:url var="clientlistUrl" value="/clientlist"/>
<c:set var="selfPath" value="/clientlist"/>

<form class="panel" method="get" action="${clientlistUrl}">
    <div class="filter">
        <div class="filter-item-box">
            <div class="filter-item">
                <span class="filitem-name">· 거래처 ID</span>
                <div class="filitem-input">
                    <input type="text" name="clientNo" value="${fn:escapeXml(param.clientNo)}">
                </div>
            </div>

            <div class="filter-item">
                <span class="filitem-name">· 거래처 이름</span>
                <div class="filitem-input">
                    <!-- name/value 통일 -->
                    <input type="text" name="clientName" value="${fn:escapeXml(param.clientName)}">
                </div>
            </div>
        </div>

        <div class="filter-btn">
            <input type="hidden" name="page" value="1"/>
            <input type="hidden" name="size" value="${pagePerRows != null ? pagePerRows : 10}"/>
            <input type="submit" class="fil-btn" value="조회">
        </div>
    </div>
</form>

<div class="table">
    <table>
        <thead>
            <tr>
                <th class="chkbox"><input type="checkbox" id="chkAll"></th>
                <th>거래처 ID</th>
                <th>거래처 이름</th>
                <th>거래처 전화번호</th>
                <th>담당사원 ID</th>
            </tr>
        </thead>
        <tbody>
            <c:choose>
                <c:when test="${not empty list}">
                    <c:forEach var="row" items="${list}">
                        <tr data-id="${row.client_id}">
                            <td class="chkbox"><input type="checkbox" class="rowChk" value="${row.client_id}"></td>
                            <td>${fn:escapeXml(row.client_id)}</td>
                            <td>${fn:escapeXml(row.client_name)}</td>
                            <td>${fn:escapeXml(row.client_tel)}</td>
                            <td>${fn:escapeXml(row.worker_id)}</td>
                        </tr>
                    </c:forEach>
                </c:when>
                <c:otherwise>
                    <c:forEach var="i" begin="1" end="10">
                        <tr aria-hidden="true">
                            <td class="chkbox"><input type="checkbox" disabled></td>
                            <td>&nbsp;</td><td></td><td></td><td></td>
                        </tr>
                    </c:forEach>
                </c:otherwise>
            </c:choose>
        </tbody>
    </table>
</div>

<div class="bottom-btn">
    <div class="page">

        <c:if test="${empty page}"><c:set var="page" value="1"/></c:if>
        <c:if test="${empty pagePerRows}"><c:set var="pagePerRows" value="10"/></c:if>
        <c:if test="${empty totalPages}"><c:set var="totalPages" value="1"/></c:if>
        <c:if test="${empty startPage}"><c:set var="startPage" value="1"/></c:if>
        <c:if test="${empty endPage}"><c:set var="endPage" value="${totalPages}"/></c:if>

        <form id="sizeForm" method="get" action="${clientlistUrl}" style="display:inline-block; margin-right:8px;">
            <input type="hidden" name="page" value="1"/>
            <input type="hidden" name="clientNo" value="${fn:escapeXml(param.clientNo)}"/>
            <input type="hidden" name="clientName" value="${fn:escapeXml(param.clientName)}"/>
            <label>Rows:
                <select name="size" onchange="document.getElementById('sizeForm').submit()">
                    <option value="1"  ${pagePerRows==1  ? 'selected' : ''}>1</option>
                    <option value="10" ${pagePerRows==10 ? 'selected' : ''}>10</option>
                    <option value="20" ${pagePerRows==20 ? 'selected' : ''}>20</option>
                    <option value="50" ${pagePerRows==50 ? 'selected' : ''}>50</option>
                    <option value="100"${pagePerRows==100? 'selected' : ''}>100</option>
                </select>
            </label>
        </form>

        <c:choose>
            <c:when test="${hasPrevBlock}">
                <c:url var="prevBlockUrl" value="${selfPath}">
                    <c:param name="page" value="${prevBlockStart}"/>
                    <c:param name="size" value="${pagePerRows}"/>
                    <c:param name="clientNo" value="${param.clientNo}"/>
                    <c:param name="clientName" value="${param.clientName}"/>
                </c:url>
                <a class="page-link" href="${prevBlockUrl}">이전</a>
            </c:when>
            <c:otherwise>
                <span class="page-link disabled">이전</span>
            </c:otherwise>
        </c:choose>

        <c:forEach var="p" begin="${startPage}" end="${endPage}">
            <c:url var="pUrl" value="${selfPath}">
                <c:param name="page" value="${p}"/>
                <c:param name="size" value="${pagePerRows}"/>
                <c:param name="clientNo" value="${param.clientNo}"/>
                <c:param name="clientName" value="${param.clientName}"/>
            </c:url>
            <c:choose>
                <c:when test="${p == page}">
                    <span class="page-link current"><strong>${p}</strong></span>
                </c:when>
                <c:otherwise>
                    <a class="page-link" href="${pUrl}">${p}</a>
                </c:otherwise>
            </c:choose>
        </c:forEach>

        <c:choose>
            <c:when test="${hasNextBlock}">
                <c:url var="nextBlockUrl" value="${selfPath}">
                    <c:param name="page" value="${nextBlockStart}"/>
                    <c:param name="size" value="${pagePerRows}"/>
                    <c:param name="clientNo" value="${param.clientNo}"/>
                    <c:param name="clientName" value="${param.clientName}"/>
                </c:url>
                <a class="page-link" href="${nextBlockUrl}">다음</a>
            </c:when>
            <c:otherwise>
                <span class="page-link disabled">다음</span>
            </c:otherwise>
        </c:choose>

    </div>
    <div class="bottom-btn-box">
        <input type="button" class="btm-btn new" id="btnNew" value="신규">
        <input type="button" id="btnDelete" class="btm-btn del" value="삭제">
    </div>
</div>

<c:url var="deleteUrl" value="/client/delete"/>
<form id="deleteForm" method="post" action="${deleteUrl}" style="display:none;">
    <input type="hidden" name="ids" id="deleteIds">
    <input type="hidden" name="page" value="${page}">
    <input type="hidden" name="size" value="${pagePerRows}">
    <input type="hidden" name="clientNo" value="${fn:escapeXml(param.clientNo)}"/>
    <input type="hidden" name="clientName" value="${fn:escapeXml(param.clientName)}"/>
    <!-- Spring Security CSRF 사용시 아래 주석 해제
    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
    -->
</form>

<!-- 등록 슬라이드 -->
<div class="slide" id="slide-input">
  <form id="client-insert-form" method="post" action="${pageContext.request.contextPath}/client/insert">
    <!-- 목록 복귀 시 파라미터 보존 -->
    <input type="hidden" name="page" value="${page}">
    <input type="hidden" name="size" value="${pagePerRows}">
    <input type="hidden" name="clientNo" value="${fn:escapeXml(param.clientNo)}">
    <input type="hidden" name="clientName" value="${fn:escapeXml(param.clientName)}">
    <!-- CSRF 사용시
    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}">
    -->

    <div class="slide-contents">
        <div class="silde-title"><h2>거래처 등록</h2></div>

        <div class="slide-id">거래처 ID:
            <input type="text" name="client_id" id="client_id" required>
        </div>
        <div class="slide-id">거래처 이름:
            <input type="text" name="client_name" id="client_name" required>
        </div>
        <div class="slide-id">전화번호:
            <input type="text" name="client_tel" id="client_tel" placeholder="010-0000-0000">
        </div>
        <div class="slide-id">담당사원 ID:
            <input type="text" name="worker_id" id="worker_id">
        </div>

        <div class="slide-tb">
            <table>
                <thead>
                    <tr>
                        <th>Vendor</th>
                        <th>구분</th>
                        <th>단가</th>
                        <th>단위</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <!-- 필요 시 JS로 옵션 주입 -->
                            <select name="vendorId" id="vendorId" size="6">
                                <option value="">선택</option>
                            </select>
                        </td>
                        <td>
                            <select name="clientDiv" id="clientDiv">
                                <option value="도서">도서</option>
                                <option value="포장지">포장지</option>
                                <option value="완제품">완제품</option>
                            </select>
                        </td>
                        <td><input type="number" name="unitPrice" id="unitPrice" min="0" step="1" required></td>
                        <td><input type="text" name="unit" id="unit" required></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="slide-btnbox">
            <button type="submit" class="slide-btn">등록</button>
            <input type="button" class="close-btn slide-btn" value="취소" id="btnCloseNew">
        </div>
    </div>
  </form>
</div>

<!-- 상세 슬라이드 -->
<div class="slide" id="slide-detail">
  <div class="slide-contents">
    <div class="silde-title"><h2>거래처 상세</h2></div>

    <div class="slide-id">거래처 ID: <span id="d-clientId-text"></span></div>
    <div class="slide-id">거래처 이름: <span id="d-clientName"></span></div>

    <div class="slide-tb">
      <table>
        <thead>
          <tr>
            <th>거래처 ID</th>
            <th>거래처 구분</th>
            <th>단가</th>
            <th>단위</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td id="d-clientId-cell"></td>
            <td id="d-clientDiv"></td>
            <td id="d-clientPrice"></td>
            <td id="d-clientUnit"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="slide-btnbox">
      <input type="button" class="slide-btn" value="수정" id="btnEdit">
      <input type="button" class="close-btn slide-btn" value="취소" id="btnCloseDetail">
    </div>
  </div>
</div>



</body>
</html>
