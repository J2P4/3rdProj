<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> 
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> 
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %> 
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %> 
<% // 오늘 날짜를 문자열로 만들어 EL에서 쓸 수 있게 request에 넣음
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
<script>const contextPath='${pageContext.request.contextPath}';</script>
<script src="${pageContext.request.contextPath}/resources/js/04_3_item.js" defer></script>
<title>품목 리스트</title>
</head>
<body>
<h1>품목 리스트</h1>

<c:url var="itemlistUrl" value="/itemlist"/> <%-- 모든 내부 링크의 기준 URL(중복 /mes/mes 방지) 이거 떄믄에 한시간.... --%>
<c:set var="selfPath" value="/itemlist"/> <%-- c:url value에 사용할 경로 문자열 --%>

<form class="panel" method="get" action="${itemlistUrl}">
    <div class="filter">
        <div class="filter-item-box">
            <div class="filter-item">
                <span class="filitem-name">· 품목 ID</span>
                <div class="filitem-input">
                    <input type="text" name="itemNo" value="${fn:escapeXml(param.itemNo)}"> <%-- 이전 입력 유지 --%>
                </div>
            </div>

            <div class="filter-item">
                <span class="filitem-name">· 품목 이름</span>
                <div class="filitem-input">
                    <input type="text" name="itemName" value="${fn:escapeXml(param.itemName)}"> <%-- 이전 입력 유지 --%>
                </div>
            </div>

            <div class="filter-item">
                <span class="filitem-name">· 구분</span>
                <div class="filitem-input">
                    <input type="text" name="item_div" value="${fn:escapeXml(param.item_div)}"> <%-- 이전 입력 유지 --%>
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
            <input type="hidden" name="page" value="1"/> <%-- 조회 시 항상 1페이지부터 --%>
            <input type="hidden" name="size" value="${pagePerRows != null ? pagePerRows : 10}"/> <%-- 현재 Rows 유지 --%>
            <input type="submit" class="fil-btn" value="조회">
        </div>
    </div>
</form>

<div class="table">
    <table>
        <thead>
            <tr>
                <th class="chkbox"><input type="checkbox" id="chkAll"></th> <%-- 전체선택 --%>
                <th>품목 ID</th>
                <th>품목 이름</th>
                <th>구분</th>
                <th>단가</th>
                <th>단위</th>
            </tr>
        </thead>
        <tbody>
            <c:choose>
                <c:when test="${not empty list}"> <%-- 데이터가 있을 때 --%>
                    <c:forEach var="row" items="${list}"> <%-- 각 행 렌더링 --%>
                        <tr data-id="${row.item_id}"> <%-- 수정: ItemDTO.item_id 대신 row.item_id 사용 --%>
                            <td class="chkbox"><input type="checkbox" class="rowChk"></td> <%-- 행 선택 --%>
                            <td>${fn:escapeXml(row.item_id)}</td> <%-- DTO 필드 그대로 표시 --%>
                            <td>${fn:escapeXml(row.item_name)}</td>
                            <td>${fn:escapeXml(row.item_div)}</td>
                            <td><fmt:formatNumber value="${row.item_price}" pattern="#,##0"/></td>
                            <td>${fn:escapeXml(row.item_unit)}</td>
                        </tr>
                    </c:forEach>
                </c:when>
                <c:otherwise> <%-- 데이터 없을 때 자리 채우기 --%>
                    <c:forEach var="i" begin="1" end="10">
                        <tr aria-hidden="true">
                            <td class="chkbox"><input type="checkbox" name="rowChk" disabled aria-hidden="true"></td> <%-- 비활성화로 오작동 방지 --%>
                            <td>&nbsp;</td><td></td><td></td><td class="col-qty"></td><td></td>
                        </tr>
                    </c:forEach>
                </c:otherwise>
            </c:choose>
        </tbody>
    </table>
</div>

<div class="bottom-btn">
    <div class="page">

        <c:if test="${empty page}"><c:set var="page" value="1"/></c:if> <%-- 현재 페이지 기본 1 --%>
        <c:if test="${empty pagePerRows}"><c:set var="pagePerRows" value="10"/></c:if> <%-- Rows 기본 10 --%>
        <c:if test="${empty totalPages}"><c:set var="totalPages" value="1"/></c:if> <%-- 총페이지 기본 1 --%>
        <c:if test="${empty startPage}"><c:set var="startPage" value="1"/></c:if> <%-- 블록 시작 기본 1 --%>
        <c:if test="${empty endPage}"><c:set var="endPage" value="${totalPages}"/></c:if> <%-- 블록 끝 기본 총페이지 --%>

        <form id="sizeForm" method="get" action="${itemlistUrl}" style="display:inline-block; margin-right:8px;">
            <input type="hidden" name="page" value="1"/> <%-- Rows 바꾸면 1페이지로 --%>
            <input type="hidden" name="itemNo" value="${fn:escapeXml(param.itemNo)}"/> <%-- 기존 필터 유지 --%>
            <input type="hidden" name="itemName" value="${fn:escapeXml(param.itemName)}"/>
            <input type="hidden" name="item_div" value="${fn:escapeXml(param.item_div)}"/>
            <input type="hidden" name="item_min" value="${fn:escapeXml(param.item_min)}"/>
            <input type="hidden" name="item_max" value="${fn:escapeXml(param.item_max)}"/>

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
                <c:url var="prevBlockUrl" value="${selfPath}"> <%-- /itemlist 에 파라미터 조합 --%>
                    <c:param name="page" value="${prevBlockStart}"/> <%-- 이전 블록 첫 페이지로 이동 --%>
                    <c:param name="size" value="${pagePerRows}"/> <%-- Rows 유지 --%>
                    <c:param name="itemNo" value="${param.itemNo}"/> <%-- 필터 유지 --%>
                    <c:param name="itemName" value="${param.itemName}"/>
                    <c:param name="item_div" value="${param.item_div}"/>
                    <c:param name="item_min" value="${param.item_min}"/>
                    <c:param name="item_max" value="${param.item_max}"/>
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
                <c:param name="itemNo" value="${param.itemNo}"/>
                <c:param name="itemName" value="${param.itemName}"/>
                <c:param name="item_div" value="${param.item_div}"/>
                <c:param name="item_min" value="${param.item_min}"/>
                <c:param name="item_max" value="${param.item_max}"/>
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
                    <c:param name="itemNo" value="${param.itemNo}"/>
                    <c:param name="itemName" value="${param.itemName}"/>
                    <c:param name="item_div" value="${param.item_div}"/>
                    <c:param name="item_min" value="${param.item_min}"/>
                    <c:param name="item_max" value="${param.item_max}"/>
                </c:url>
                <a class="page-link" href="${nextBlockUrl}">다음</a> <%-- 클릭 시 11, 21, … --%>
            </c:when>
            <c:otherwise>
                <span class="page-link disabled">다음</span> <%-- 다음 블록 없으면 비활성 --%>
            </c:otherwise>
        </c:choose>

    </div> <div class="bottom-btn-box">
        <input type="button" class="btm-btn new" value="신규"> <%-- 신규 등록(예정) --%>
        <input type="button" id="btnDelete" class="btm-btn del" value="삭제"> <%-- 선택 삭제(예정) --%>
    </div>
</div> <c:url var="deleteUrl" value="/item/delete"/>
<form id="deleteForm" method="post" action="${deleteUrl}" style="display:none;">
    <input type="hidden" name="ids" id="deleteIds">
    <input type="hidden" name="page" value="${page}">
    <input type="hidden" name="size" value="${pagePerRows}">
    <input type="hidden" name="itemNo" value="${fn:escapeXml(param.itemNo)}"/>
    <input type="hidden" name="itemName" value="${fn:escapeXml(param.itemName)}"/>
    <input type="hidden" name="item_div" value="${fn:escapeXml(param.item_div)}"/>
    <input type="hidden" name="item_min" value="${fn:escapeXml(param.item_min)}"/>
    <input type="hidden" name="item_max" value="${fn:escapeXml(param.item_max)}"/>
</form>

<c:url var="saveUrl" value="/item/save"/>

<div class="slide" id="slide-input">
    <div class="slide-contents">
        <div class="silde-title"><h2>품목 상세</h2></div>
        <div class="slide-id">품목 ID : </div>
        <div class="slide-id"> 품목 이름 :
            <input type="text" name="itemName" id="itemName">
        </div>

        <div class="slide-tb">
            <table>
                <thead>
                    <tr><th>거래처 ID</th>
                    <th>구분</th>
                    <th>단가</th>
                    <th>단위 </th></tr>
                </thead>
                <tbody>
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
            <input type="submit" class="slide-btn" value="등록">
            <input type="button" class="close-btn slide-btn" value="취소">
        </div>

    </div>
</div>

<div class="slide" id="slide-detail">
  <div class="slide-contents">
    <div class="silde-title"><h2>품목 상세</h2></div>

    <div class="slide-id">품목 ID: <span id="d-itemId"></span></div>
    <div class="slide-id">품목 이름: <span id="d-itemName"></span></div>

    <div class="slide-tb">
      <table>
        <thead>
          <tr>
            <th>거래처 ID</th>
            <th>거래처 이름</th>
            <th>품목 구분</th>
            <th>단가</th>
            <th>단위</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td id="d-clientId"></td>
            <td id="d-clientName"></td>
            <td id="d-itemDiv"></td>
            <td id="d-itemPrice"></td>
            <td id="d-itemUnit"></td>
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


<script>
// 기존의 체크박스 및 삭제 로직은 그대로 유지했습니다.
(function() {
    function textOf(el){ return (el && el.textContent ? el.textContent : '').replace(/\u00A0/g,' ').trim(); }

    var chkAll = document.getElementById('chkAll');
    if (chkAll) {
        chkAll.addEventListener('change', function(){
            var nodes = document.querySelectorAll('tbody .rowChk');
            for (var i=0; i<nodes.length; i++) {
                if (!nodes[i].disabled) nodes[i].checked = chkAll.checked;
            }
        });
    }
    document.addEventListener('change', function(e){
        var t = e.target;
        if (t && t.classList && t.classList.contains('rowChk')) {
            var rows = document.querySelectorAll('tbody .rowChk:not(:disabled)');
            var checked = document.querySelectorAll('tbody .rowChk:not(:disabled):checked');
            if (chkAll && rows.length > 0) chkAll.checked = (rows.length === checked.length);
        }
    });

    var btnDel = document.getElementById('btnDelete');
    if (!btnDel) return;
    btnDel.addEventListener('click', function(){
        var checks = document.querySelectorAll('tbody .rowChk:checked');
        if (!checks || checks.length === 0) { alert('삭제할 항목을 선택하세요.'); return; }

        var ids = [];
        for (var i=0; i<checks.length; i++) {
            var tr = checks[i].closest ? checks[i].closest('tr') : null;
            if (!tr || tr.getAttribute('aria-hidden') === 'true') continue; // 자리채움행 무시
            var tds = tr.querySelectorAll('td');
            if (tds.length < 2) continue;
            var idVal = textOf(tds[1]); // 2번째 컬럼 = 품목 ID
            if (idVal) ids.push(idVal);
        }

        if (ids.length === 0) { alert('선택된 행에서 품목 ID를 찾지 못했습니다.'); return; }
        if (!confirm(ids.length + '건 삭제하시겠습니까?')) return;

        var form = document.getElementById('deleteForm');
        if (!form) { alert('삭제 폼을 찾을 수 없습니다.'); return; }
        document.getElementById('deleteIds').value = ids.join(',');
        form.submit();
    });
})();
</script>

</body>
</html>