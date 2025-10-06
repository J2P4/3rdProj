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
    <script src="${pageContext.request.contextPath}/resources/js/slide_test.js"></script>

<title>발주 리스트</title>

</head>
<body>
    <h1>발주 리스트</h1>
    
    <form class="panel" method="get" action="">
                <input type="text" name="itemName" value="${fn:escapeXml(param.itemName)}">
                                <input type="text" name="publisher_name" value="${fn:escapeXml(param.publisher_name)}">
<!--     검색필터 -->
        <div class="fields">
            <div class="field">
                <span class="label">발주번호</span>
                <span class="label">발주일</span>
            </div>
            <div class="field">
                <input type="text" name="orderNo" value="${fn:escapeXml(param.orderNo)}">
                <input type="date" name="fromDate" id="fromDate" value="${empty param.fromDate ? '' : param.fromDate}">
                <span class="tilde">~</span>
                <input type="date" name="toDate" id="toDate" value="${empty param.toDate ? todayStr : param.toDate}">

            </div>
        </div>

        <div class="fields">		
            <div class="field">
                <span class="label">품명</span>

            </div>
            <div class="field">
                <span class="label">거래처</span>

            </div>
        </div>

        <div class="search-actions">
            <button type="submit" class="btn">조회</button>
        </div>
    </form>

    <div class="container">
        <div class="table-wrap">
            <table>
                <colgroup>
                    <col class="col-check">
                    <col class="col-id">
                    <col> <!-- 품명 -->
                    <col class="col-qty">
                    <col class="col-maker">
                    <col class="col-owner">
                    <col class="col-date">
                </colgroup>
                <thead>
                    <tr>
                        <th class="col-check"><input type="checkbox" id="chkAll"></th>
                        <th>발주 ID</th>
                        <th>품명</th>
                        <th>수량</th>
                        <th>제조사</th>
                        <th>발주 담당자</th>
                        <th>발주일</th>
                    </tr>
                </thead>
                <tbody>
                    <c:choose>
                        <c:when test="${not empty orders}">
                            <c:forEach var="o" items="${orders}">
                                <tr>
                                    <td class="col-check"><input type="checkbox" name="rowChk" value="${o.id}"></td>
                                    <td>${o.id}</td>
                                    <td>
                                        <a href="${pageContext.request.contextPath}/po/detail?id=${o.id}" style="color:inherit; text-decoration:none;">${o.itemName}</a>
                                    </td>
                                    <td class="col-qty"><fmt:formatNumber value="${o.qty}" pattern="#,##0"/></td>
                                    <td>${o.maker}</td>
                                    <td>${o.owner}</td>
                                    <td><fmt:formatDate value="${o.orderDate}" pattern="yyyy-MM-dd"/></td>
                                </tr>
                            </c:forEach>
                        </c:when>
                        <c:otherwise>
                            <c:forEach var="i" begin="1" end="10">
                                <tr>
                                    <td class="col-check"><input type="checkbox" name="rowChk"></td>
                                    <td></td><td></td><td class="col-qty"></td><td></td><td></td><td></td>
                                </tr>
                            </c:forEach>
                        </c:otherwise>
                    </c:choose>
                </tbody>
            </table>
        </div>
    </div>

    <div class="toolbar">
        <div class="count">
            <c:if test="${not empty totalCount}">총 ${totalCount}건</c:if>
        </div>
        <div class="slide-btnbox">
            <button type="button" class="btn" id="openSlideBtn">등록</button>
            <button type="button" class="btn close-btn">취소</button>
        </div>
    </div>

    <!-- 상세 슬라이드 -->
    <div class="slide" id="slide-detail">
        <div class="slide-contents">
            <div class="silde-title"><h2>재고 상세</h2></div>
            <div class="slide-id">재고 ID: </div>

            <div class="slide-tb">
                <table>
                    <thead>
                        <tr><th>품목 ID</th><th>품목 분류</th><th>품목 이름</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>1</td><td>1</td><td>1</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="slide-tb">
                <table>
                    <thead>
                        <tr><th>재고 수량</th><th>보관 위치</th><th>입/출고</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>2</td><td>2</td><td>2</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="slide-btnbox">
                <button type="button" class="btn">수정</button>
                <button type="button" class="btn close-btn">취소</button>
            </div>
        </div>
    </div>

<script>
document.addEventListener('DOMContentLoaded', function(){
  /* ===== 날짜 범위 유효성 ===== */
  const form = document.querySelector('form.panel');
  const from = document.getElementById('fromDate');
  const to   = document.getElementById('toDate');

  function clampMinMax(){
    if (from.value) to.min = from.value; else to.removeAttribute('min');
    if (to.value)   from.max = to.value; else from.removeAttribute('max');
  }
  function fixIfInvalid(){
    if(from.value && to.value && to.value < from.value){ to.value = from.value; }
  }
  clampMinMax(); fixIfInvalid();
  from.addEventListener('change', () => { clampMinMax(); fixIfInvalid(); });
  to.addEventListener('change',   () => { clampMinMax(); fixIfInvalid(); });
  form.addEventListener('submit', function(e){
    if(from.value && to.value && to.value < from.value){
      e.preventDefault();
      alert('끝 날짜는 시작 날짜보다 빠를 수 없습니다.');
      to.focus();
    }
  });

  /* ===== 체크박스 전체선택 ===== */
  const chkAll = document.getElementById('chkAll');
  const tbody  = document.querySelector('tbody');
  const getRowChecks = () => tbody.querySelectorAll('input[name="rowChk"]');
  chkAll?.addEventListener('change', () => {
    getRowChecks().forEach(chk => chk.checked = chkAll.checked);
  });

});
</script>
</body>
</html>
