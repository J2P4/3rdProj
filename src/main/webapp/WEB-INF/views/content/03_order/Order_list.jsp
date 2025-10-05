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
<title>발주 리스트</title>
<style>
    :root{
        --primary:#7e75ff;           /* 버튼/포커스 보라 */
        --primary-600:#6b64e6;
        --header:#dfe4ff;            /* 테이블 헤더 배경 */
        --border:#aeb3c7;            /* 외곽선 색 */
        --grid:#d7d9e3;              /* 셀 경계선 */
        --bg:#fafbff;
        --text:#222;
        --muted:#666;
    }
    *{ box-sizing:border-box; }
    body{
        margin:0;
        color:var(--text);
        background:var(--bg);
    }

    /* 제목 */
    h1{
        margin:0 0 10px;
        font-size:28px;
        font-weight:800;
        letter-spacing:-0.3px;
    }

	/* 검색 조건 (디자인 유지, 레이아웃만 Grid) */
    .panel{
        position:relative;
        background:#fff;
        border:2px solid var(--border);
        padding:12px 12px 12px 12px;

        display:grid;
        grid-template-columns: 1fr auto;  
        column-gap:28px;
        row-gap:10px;
        align-items:center;                
    }

    .fields{
        display:grid;
        grid-template-columns: auto auto;  
        column-gap:28px;
        row-gap:10px;
        align-items:center;
        grid-column:1;
    }
    
    .field{
        display:flex; 
        align-items:center;
        gap:8px;
    }
    	
    .label{
        position:relative;
        padding-left:12px;
        font-size:14px;
        white-space:nowrap;
    }
    .label::before{
        content:"•";
        position:absolute; left:0; top:-1px;
        color:#555;
        font-weight:700;
    }

    input[type="text"], input[type="date"]{
        height:28px;
        border:1px solid black; 
        padding:0 8px;
        min-width:210px;
        background:#fff;
        outline:none;
        font-size:13px;
    }
    input[type="date"]{ min-width:190px; }
    .tilde{ margin:0 6px; color:#333; }

    .search-actions{
        grid-column:2;           
        grid-row:1 / span 2;     
        justify-self:end;        
        align-self:center;       
        display:flex;
        align-items:center;
    }
    
    .btn{
        height:36px; min-width:72px;
        padding:0 18px;
        border:1px solid var(--primary);
        background:var(--primary);
        color:#fff; font-weight:700; cursor:pointer;
        transition:all .15s ease;
    }
    .btn:hover{ background:var(--primary-600); border-color:var(--primary-600); }
    .btn.secondary{ background:#fff; color:#7e75ff; }

    /* 표 컨테이너 */
    .container{
        margin-top:14px;
        background:#fff;
        border:2px solid var(--border);
        border-radius:var(--radius);
        overflow:hidden;
        width : 100%;
    }
    .table-wrap{ max-height:none; overflow:visible; }
    table{
        width:100%;
        border-collapse:collapse;
        table-layout:fixed;
        font-size:13px;
    }
    thead th{
        background:var(--header);
        border-bottom:1px solid var(--grid);
        border-right:1px solid var(--grid);
        height:44px;
        text-align: center;
        padding:0 10px;
        font-weight:700;
    }
    thead th:last-child{ border-right:none; }
    tbody td{
        border-bottom:1px solid var(--grid);
        border-right:1px solid var(--grid);
        height:52px;              
        padding:0 10px;
        vertical-align:middle;
        overflow:hidden; 
        text-overflow:ellipsis; 
        white-space:nowrap;
        background:#fff;
    }
    tbody td:last-child{ border-right:none; }
    tbody tr:nth-child(odd){ background:#fff; }

    .col-check{ width:44px; text-align:center; }
    .col-id{ width:140px; }
    .col-qty{ width:120px; text-align:right; }
    .col-maker{ width:160px; }
    .col-owner{ width:160px; }
    .col-date{ width:140px; }

    input[type="checkbox"]{
        width:16px;
        height:16px;
        vertical-align:middle;
    }

    .toolbar{
        display:flex;
        justify-content:flex-end;
        gap:10px;
        padding:14px;
    }
    .count{ margin-right:auto; color:var(--muted); font-size:12px; }

    .slide-btnbox{
        display:flex;
        justify-content:flex-end;
        align-items:center;
        gap:10px;
    }
    .slide-btnbox > .btn{
        width:auto;             
        min-width:72px;         
    }

    /* ---- 슬라이드 디자인 ---- */
    .slide {
        position: fixed;
        top: 0;
        right: -110%;
        width: 100%;
        height: 100%;
        background-color: #f3f3f3;
        box-shadow: -2px 0 6px rgba(0,0,0,0.2);
        transition: right 1s ease;
        overflow-y: auto;
        z-index: 1000;
    }
    .slide.open { right: 0; }
    .slide-contents { margin: 50px 30px; }
    .slide-id { font-weight: bold; font-size: 1.2rem; }
    .slide-contents > .slide-tb { margin: 30px 0; }
    .slide-contents > .slide-tb > table {
        background-color: #ffffff;
        width: 100%;
        text-align: center;
    }

    /* 반응형(레이아웃만 변경) */
    @media (max-width: 1200px){
        .fields{ grid-template-columns: minmax(0,auto) minmax(0,auto); }
        input[type="text"], input[type="date"]{ min-width: 180px; }
        input[type="date"]{ min-width: 160px; }
    }
    @media (max-width: 900px){
        .panel{ grid-template-columns: 1fr; }
        .search-actions{
            grid-column:1; grid-row:auto;
            justify-self:end; align-self:center;
            margin-top:0;
        }
        .fields{ grid-template-columns: 1fr; }
        .field{ flex-wrap: wrap; gap:6px 8px; }
        .label{ white-space:nowrap; }
        input[type="text"], input[type="date"]{
            min-width:0; width: 260px; max-width:100%;
        }
    }
    @media (max-width: 520px){
        input[type="text"], input[type="date"]{ width:100%; }
        .tilde{ margin:0 4px; }
    }
</style>
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

  /* ===== 슬라이드 열고/닫기 ===== */
  const slideDetail = document.getElementById('slide-detail');

  const openBtnTop  = document.getElementById('openSlideBtn');
  const closeBtnTop = document.querySelector('.toolbar .slide-btnbox .close-btn');

  const closeBtnsInSlide = document.querySelectorAll('#slide-detail .close-btn');
  const slideIdEl = document.querySelector('#slide-detail .slide-id');

  function openSlide(){
    slideDetail.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeSlide(){
    slideDetail.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtnTop?.addEventListener('click', () => openSlide());
  closeBtnTop?.addEventListener('click', () => closeSlide());
  closeBtnsInSlide.forEach(btn => btn.addEventListener('click', () => closeSlide()));



  // 표 행 더블클릭 시 슬라이드 열고 ID 채움(원치 않으면 이 블록 삭제)
  tbody?.addEventListener('dblclick', (e) => {
    const tr = e.target.closest('tr');
    if (!tr || tr.querySelector('th')) return;
    const idCell = tr.children[1]; // 0: 체크박스, 1: 발주 ID
    if (idCell && slideIdEl){
      slideIdEl.textContent = '발주 ID: ' + idCell.textContent.trim();
    }
    openSlide();
  });
});
</script>
</body>
</html>
