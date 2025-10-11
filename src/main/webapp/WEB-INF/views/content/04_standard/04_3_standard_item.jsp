<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core" %>                       
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>                       
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions" %>                  
<%  // 오늘 날짜를 문자열로 만들어 EL에서 쓸 수 있게 request에 넣음
    String todayStr = new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date());
    request.setAttribute("todayStr", todayStr);
%>

<!DOCTYPE html>
<html lang="ko"> 
<head>
<meta charset="UTF-8">                                           
<meta name="viewport" content="width=device-width, initial-scale=1.0"> 

<c:url var="cssUrl" value="/resources/css/common.css"/>           
<c:url var="jsUrl"  value="/resources/js/common.js"/>             
<link rel="stylesheet" href="${cssUrl}" type="text/css">         
<script src="${jsUrl}"></script>                                   

<title>품목 리스트</title>                                        
</head>
<body>
<h1>품목 리스트</h1>                                              

<c:url var="itemlistUrl" value="/itemlist"/>                      <%-- 모든 내부 링크의 기준 URL(중복 /mes/mes 방지) 이거 떄믄에 한시간.... --%>
<c:set var="selfPath" value="/itemlist"/>                         <%-- c:url value에 사용할 경로 문자열 --%>

<!-- ====================== 검색/필터 영역 ====================== -->
<form class="panel" method="get" action="${itemlistUrl}">         
  <div class="filter">
    <div class="filter-item-box">
      <div class="filter-item">
        <span class="filitem-name">· 품목 ID</span>
        <div class="filitem-input">
          <input type="text" name="itemNo" value="${fn:escapeXml(param.itemNo)}">   <%-- 이전 입력 유지 --%>
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
      <input type="hidden" name="page" value="1"/>                      <%-- 조회 시 항상 1페이지부터 --%>
      <input type="hidden" name="size" value="${pagePerRows != null ? pagePerRows : 10}"/> <%-- 현재 Rows 유지 --%>
      <input type="submit" class="fil-btn" value="조회">                
    </div>
  </div>
</form>

<!-- ====================== 목록 테이블 ====================== -->
<div class="table">
  <table>
    <thead>
      <tr>
        <th class="chkbox"><input type="checkbox" id="chkAll"></th>  <%-- 전체선택 --%>
        <th>품목 ID</th>
        <th>품목 이름</th>
        <th>구분</th>
        <th>단가</th>
        <th>단위</th>
      </tr>
    </thead>
    <tbody>
      <c:choose>
        <c:when test="${not empty list}">                             <%-- 데이터가 있을 때 --%>
          <c:forEach var="row" items="${list}">                       <%-- 각 행 렌더링 --%>
            <tr>
              <td class="chkbox"><input type="checkbox" class="rowChk"></td>  <%-- 행 선택 --%>
              <td>${row.item_id}</td>                                 <%-- DTO 필드 그대로 표시 --%>
              <td>${row.item_name}</td>
              <td>${row.item_div}</td>
              <td><fmt:formatNumber value="${row.item_price}" pattern="#,##0"/></td> 
              <td>${row.item_unit}</td>
            </tr>
          </c:forEach>
        </c:when>
        <c:otherwise>                                                 <%-- 데이터 없을 때 자리 채우기 --%>
          <c:forEach var="i" begin="1" end="10">
            <tr aria-hidden="true">
              <td class="chkbox"><input type="checkbox" name="rowChk"></td>
              <td>&nbsp;</td><td></td><td></td><td class="col-qty"></td><td></td>
            </tr>
          </c:forEach>
        </c:otherwise>
      </c:choose>
    </tbody>
  </table>
</div>

<!-- ====================== 하단: 페이지네이션 + 버튼 ====================== -->
<div class="bottom-btn">
  <div class="page">

    <!-- 컨트롤러가 값 안 줄 때의 안전망(테스트/예외상황 대비) -->
    <c:if test="${empty page}"><c:set var="page" value="1"/></c:if>                 <%-- 현재 페이지 기본 1 --%>
    <c:if test="${empty pagePerRows}"><c:set var="pagePerRows" value="10"/></c:if>  <%-- Rows 기본 10 --%>
    <c:if test="${empty totalPages}"><c:set var="totalPages" value="1"/></c:if>     <%-- 총페이지 기본 1 --%>
    <c:if test="${empty startPage}"><c:set var="startPage" value="1"/></c:if>       <%-- 블록 시작 기본 1 --%>
    <c:if test="${empty endPage}"><c:set var="endPage" value="${totalPages}"/></c:if> <%-- 블록 끝 기본 총페이지 --%>

    <!-- Rows 선택 (테스트 편의 위해 1 포함) -->
    <form id="sizeForm" method="get" action="${itemlistUrl}" style="display:inline-block; margin-right:8px;">
      <input type="hidden" name="page" value="1"/>                                   <%-- Rows 바꾸면 1페이지로 --%>
      <input type="hidden" name="itemNo"   value="${fn:escapeXml(param.itemNo)}"/>   <%-- 기존 필터 유지 --%>
      <input type="hidden" name="itemName" value="${fn:escapeXml(param.itemName)}"/>
      <input type="hidden" name="item_div" value="${fn:escapeXml(param.item_div)}"/>
      <input type="hidden" name="item_min" value="${fn:escapeXml(param.item_min)}"/>
      <input type="hidden" name="item_max" value="${fn:escapeXml(param.item_max)}"/>

      <label>Rows:
        <select name="size" onchange="document.getElementById('sizeForm').submit()">
          <option value="1"   ${pagePerRows==1   ? 'selected' : ''}>1</option>      <%-- 1행 보기(블록 전환 테스트에 유용) --%>
          <option value="10"  ${pagePerRows==10  ? 'selected' : ''}>10</option>
          <option value="20"  ${pagePerRows==20  ? 'selected' : ''}>20</option>
          <option value="50"  ${pagePerRows==50  ? 'selected' : ''}>50</option>
          <option value="100" ${pagePerRows==100 ? 'selected' : ''}>100</option>
        </select>
      </label>
    </form>

    <!-- 이전 블록 (예: 11~20 블록에서 '이전'은 1로 이동) -->
    <c:choose>
      <c:when test="${hasPrevBlock}">                                               <%-- 이전 블록이 있으면 링크 활성 --%>
        <c:url var="prevBlockUrl" value="${selfPath}">                              <%-- /itemlist 에 파라미터 조합 --%>
          <c:param name="page" value="${prevBlockStart}"/>                          <%-- 이전 블록 첫 페이지로 이동 --%>
          <c:param name="size" value="${pagePerRows}"/>                             <%-- Rows 유지 --%>
          <c:param name="itemNo"   value="${param.itemNo}"/>                        <%-- 필터 유지 --%>
          <c:param name="itemName" value="${param.itemName}"/>
          <c:param name="item_div" value="${param.item_div}"/>
          <c:param name="item_min" value="${param.item_min}"/>
          <c:param name="item_max" value="${param.item_max}"/>
        </c:url>
        <a class="page-link" href="${prevBlockUrl}">이전</a>                        <%-- 클릭 시 이전 블록 시작으로 --%>
      </c:when>
      <c:otherwise>
        <span class="page-link disabled">이전</span>                                 <%-- 이전 블록이 없으면 비활성 --%>
      </c:otherwise>
    </c:choose>

    <!-- 현재 블록의 페이지 번호들 (startPage ~ endPage) -->
    <c:forEach var="p" begin="${startPage}" end="${endPage}">
      <c:url var="pUrl" value="${selfPath}">                                        <%-- 각 페이지 숫자 링크 --%>
        <c:param name="page" value="${p}"/>
        <c:param name="size" value="${pagePerRows}"/>
        <c:param name="itemNo"   value="${param.itemNo}"/>
        <c:param name="itemName" value="${param.itemName}"/>
        <c:param name="item_div" value="${param.item_div}"/>
        <c:param name="item_min" value="${param.item_min}"/>
        <c:param name="item_max" value="${param.item_max}"/>
      </c:url>
      <c:choose>
        <c:when test="${p == page}">
          <span class="page-link current"><strong>${p}</strong></span>               <%-- 현재 페이지는 강조(링크 X) --%>
        </c:when>
        <c:otherwise>
          <a class="page-link" href="${pUrl}">${p}</a>                               <%-- 다른 페이지는 링크 --%>
        </c:otherwise>
      </c:choose>
    </c:forEach>

    <!-- 다음 블록 (예: 1~10 블록에서 '다음'은 11로 이동) -->
    <c:choose>
      <c:when test="${hasNextBlock}">
        <c:url var="nextBlockUrl" value="${selfPath}">
          <c:param name="page" value="${nextBlockStart}"/>                           <%-- 다음 블록 시작 페이지 --%>
          <c:param name="size" value="${pagePerRows}"/>
          <c:param name="itemNo"   value="${param.itemNo}"/>
          <c:param name="itemName" value="${param.itemName}"/>
          <c:param name="item_div" value="${param.item_div}"/>
          <c:param name="item_min" value="${param.item_min}"/>
          <c:param name="item_max" value="${param.item_max}"/>
        </c:url>
        <a class="page-link" href="${nextBlockUrl}">다음</a>                         <%-- 클릭 시 11, 21, … --%>
      </c:when>
      <c:otherwise>
        <span class="page-link disabled">다음</span>                                 <%-- 다음 블록 없으면 비활성 --%>
      </c:otherwise>
    </c:choose>


  <!-- 우측 하단 버튼 -->
  <div class="bottom-btn-box">
    <input type="button" class="btm-btn new" value="신규">                           <%-- 신규 등록(예정) --%>
    <input type="button" class="btm-btn del" value="삭제">                           <%-- 선택 삭제(예정) --%>
  </div>
</div>

<!-- 삭제용 히든 폼 (체크된 행들을 한번에 삭제할 때 사용) -->
<c:url var="deleteUrl" value="/item/delete"/>                                       
<form id="deleteForm" method="post" action="${deleteUrl}" style="display:none;">
  <input type="hidden" name="ids" id="deleteIds">                                   
</form>

<!-- 등록/수정 저장 액션 URL -->
<c:url var="saveUrl" value="/item/save"/>

<!-- 등록/수정 슬라이드 패널 -->
<div class="slide" id="slide-input">
  <div class="slide-contents">
    <div class="silde-title"><h2>품목 상세</h2></div>

    <form id="slideSaveForm" method="post" action="${saveUrl}">
      <div class="slide-id">품목 ID :
        <input type="text" name="itemIdView" id="itemIdView" readonly>               
        <input type="hidden" name="id"      id="id">                                  
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
              <td><input type="text"   name="vendorId"  id="vendorId"></td>          
              <td><input type="text"   name="itemDiv"   id="itemDiv"></td>           
              <td><input type="number" name="unitPrice" id="unitPrice" min="0"></td> 
              <td><input type="text"   name="unit"      id="unit"></td>              
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

<!-- 상세(샘플) 슬라이드 패널 -->
<div class="slide" id="slide-detail">
  <div class="slide-contents">
    <div class="silde-title"><h2>발주 등록</h2></div>
    <div class="slide-id">발주 ID: </div>                                            
    <div class="date">
      <div class="slide-id" style="display:flex; gap:12px;">
        <div>발주일 <input type="date" name="orderdate" id="orderdate-input-1" value="${todayStr}"></div> 
        <div>결제(예정일) <input type="date" name="orderdate" id="orderdate-input-2"></div>
        <div>수주(예정일) <input type="date" name="orderdate" id="orderdate-input-3"></div>
      </div>
    </div>

    <div class="slide-tb">
      <table>
        <thead><tr><th>발주 상태</th><th>발주량</th><th>발주 담당자 사번</th></tr></thead>
        <tbody><tr><td>1</td><td>1</td><td>1</td></tr></tbody>                       
      </table>
    </div>

    <div class="slide-tb">
      <table>
        <thead><tr><th>품목 ID</th><th>품목 분류</th><th>품목 이름</th></tr></thead>
        <tbody><tr><td>2</td><td>2</td><td>2</td></tr></tbody>                      
      </table>
    </div>

    <div class="slide-tb">
      <table>
        <thead><tr><th>거래처 ID</th><th>거래처 이름</th><th>거래처 담당자 사번</th></tr></thead>
        <tbody><tr><td>2</td><td>2</td><td>2</td></tr></tbody>                     
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
