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

<!-- 컨텍스트 경로 노출 -->
<script>const contextPath='${pageContext.request.contextPath}';</script>
<!-- 이 페이지 전용 JS -->
<script src="${pageContext.request.contextPath}/resources/js/03_order.js" defer></script>

<title>발주 리스트</title>
</head>
<body>
<h1>발주 리스트</h1>

<form class="panel" method="get" action="">
  <div class="filter">
    <div class="filter-item-box">
      <div class="filter-item">
        <span class="filitem-name">· 발주ID</span>
        <div class="filitem-input">
          <input type="text" name="orderNo" value="${fn:escapeXml(param.orderNo)}">
        </div>
      </div>

      <div class="filter-item">
        <div class="filitem-name">· 발주일</div>
        <div class="filitem-input">
          <input type="date" name="fromDate" id="fromDate" value="${empty param.fromDate ? '' : param.fromDate}">
          <span class="tilde">~</span>
          <input type="date" name="toDate" id="toDate" value="${empty param.toDate ? todayStr : param.toDate}">
        </div>
      </div>

      <div class="filter-item">
        <span class="filitem-name">· 거래처</span>
        <div class="filitem-input">
          <input type="text" name="publisher_name" value="${fn:escapeXml(param.publisher_name)}">
        </div>
      </div>

      <div class="filter-item">
        <span class="filitem-name">· 품명</span>
        <div class="filitem-input">
          <input type="text" name="itemName" value="${fn:escapeXml(param.itemName)}">
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
        <th>발주 ID</th>
        <th>품목 ID</th>
        <th>수량</th>
        <th>거래처 ID</th>
        <th>발주 담당자</th>
        <th>발주일</th>
      </tr>
    </thead>
    <tbody>
      <c:choose>
        <c:when test="${not empty orders}">
          <c:forEach var="o" items="${orders}">
            <tr>
              <td class="col-check"><input type="checkbox" name="rowChk" value="${o.order_id}"></td>
              <td>${o.order_id}</td>
              <td>${o.item_id}</td>
              <td class="col-qty">${o.order_amount}</td>
              <td>${o.client_id}</td>
              <td>${o.worker_id}</td>
              <td><fmt:formatDate value="${o.order_date}" pattern="yyyy-MM-dd"/></td>
            </tr>
          </c:forEach>
        </c:when>
        <c:otherwise>
          <c:forEach var="i" begin="1" end="10">
            <tr aria-hidden="true">
              <td class="col-check"><input type="checkbox" name="rowChk" disabled aria-hidden="true"></td>
              <td></td><td></td><td class="col-qty"></td><td></td><td></td><td></td>
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

<!-- 상세 슬라이드 -->
<div class="slide" id="slide-detail">
  <div class="slide-contents">
    <div class="silde-title"><h2>발주 상세</h2></div>
    <div class="slide-id">발주 ID: <span id="d-order_id_head"></span></div>

    <!-- 요약 필드(9개) -->
    <div class="slide-tb">
      <table>
        <tbody>
          
          
          <tr>
          	<th>품목 ID</th>
          	<th>발주일</th>
          	<th>발주량</th>          
          	<th>결제일</th>
          	<th>결제 예정일</th>
          	<th>수주일</th>
          	<th>수주 예정일</th>

          	<th>작업자 ID</th>
 
          </tr>
          
          <tr>
          	<td id="d-item_id">
          	<td id="d-order_date">
           	<td id="d-order_amount">
          	<td id="d-order_payment_date"></td>
          	<td id="d-order_payment_duedate">
          	<td id="d-order_receive_date">
          	<td id="d-order_receive_duedate">


          	<td id="d-worker_id">
      
          </tr>
        </tbody>
      </table>
    </div>



    <div class="slide-btnbox">
      <input type="button" class="slide-btn" value="수정">
      <input type="button" class="close-btn slide-btn" value="취소">
    </div>
  </div>
</div>

<!-- 등록 슬라이드 (필요시 유지/추가 구성) -->
<div class="slide" id="slide-input">
  <div class="slide-contents">
    <div class="silde-title"><h2>발주 등록</h2></div>
    <div class="slide-id">발주 ID: </div>

    <!-- 등록용 테이블/입력은 프로젝트 규약대로 채워넣어 -->
    <div class="slide-btnbox">
      <input type="button" class="slide-btn" value="등록">
      <input type="button" class="close-btn slide-btn" value="취소">
    </div>
  </div>
</div>

</body>
</html>
