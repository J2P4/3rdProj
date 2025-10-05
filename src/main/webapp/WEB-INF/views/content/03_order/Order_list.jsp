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
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans KR","Malgun Gothic",Apple SD Gothic Neo,"Helvetica Neue",Arial,sans-serif;
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

    /* 검색 패널(스샷과 동일한 테두리/여백) */
    .panel{
        position:relative;
        background:#fff;
        border:2px solid var(--border);
        padding:12px 12px 12px 12px;
    }
    .fields{
        display:grid;
        grid-template-columns: 1fr 1fr;
        gap:12px 28px;
        align-items:center;
    }
    
    
    
    
    
    
    
    .field{ display:flex; align-items:center; gap:8px; }
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

    /* 조회 버튼(우측) */
    .search-actions{
        position:absolute; right:12px; top:10px;
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
    .btn.secondary{
        background:#fff; color:var(--primary);
    }

    /* 표 컨테이너 */
    .container{
        margin-top:14px;
        background:#fff;
        border:2px solid var(--border);
        border-radius:var(--radius);
        overflow:hidden;
    }
     .table-wrap{
         max-height:none; 
         overflow:visible;
    } 
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
        height:44px;              /* 스샷보다 살짝 여유 */
        text-align: center;
        padding:0 10px;
        font-weight:700;
    }
    thead th:last-child{ border-right:none; }
    tbody td{
        border-bottom:1px solid var(--grid);
        border-right:1px solid var(--grid);
        height:52px;              /* 행 높이 크게 */
        padding:0 10px;
        vertical-align:middle;
        overflow:hidden; 
        text-overflow:ellipsis; 
        white-space:nowrap;
        background:#fff;
    }
    tbody td:last-child{ border-right:none; }
    tbody tr:nth-child(odd){ background:#fff; } /* 스샷은 스트라이프 없음 */

    .col-check{ 
    	width:44px; 
    	text-align:center;
    	 }
    .col-id{ width:140px; }
    .col-qty{ 
    	width:120px; 
    	text-align:right;
     }
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



    /* 하단 오른쪽 버튼 */
    .actions{
        display:flex; justify-content:flex-end; gap:12px;
        padding:8px 0 0;
    }
</style>
</head>
<body>
    <h1>발주 리스트</h1>

    <form class="panel" method="get" action="">
        <div class="fields">
            <div class="field">
                <span class="label">발주번호</span>
                <input type="text" name="orderNo" value="${fn:escapeXml(param.orderNo)}">
            </div>

            <div class="field">
                <span class="label">품명</span>
                <input type="text" name="itemName" value="${fn:escapeXml(param.itemName)}">
            </div>

            <div class="field">
                <span class="label">발주일</span>
                <input type="date" name="fromDate" id="fromDate" value="${empty param.fromDate ? '' : param.fromDate}">
                <span class="tilde">~</span>
                <input type="date" name="toDate" id="toDate" value="${empty param.toDate ? todayStr : param.toDate}">
            </div>

            <div class="field">
                <span class="label">거래처</span>
                <input type="text" name="publisher_name" value="${fn:escapeXml(param.publisher_name)}">
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
                        <th class="col-check" ><input type="checkbox" id="chkAll"></th>
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
                            <c:forEach var="i" begin="1" end="12">
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
		<div>
		
		<!--  페이징이 구현될 부분 -->
		</div>

        <div class="toolbar">
            <div class="count">
                <c:if test="${not empty totalCount}">총 ${totalCount}건</c:if>
            </div>
            <div class="actions">
                <button type="button" class="btn" id="btnNew">신규</button>
                <button type="button" class="btn" id="btnDelete">삭제</button>
            </div>
        </div>

	<script>
		document.addEventListener('DOMContentLoaded', function(){
		    /* 날짜 범위 유효성(오른쪽이 왼쪽보다 빠르면 보정/차단) */
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
		
		    /* 체크박스 전체선택 */
		    const chkAll = document.getElementById('chkAll');
		    const tbody = document.querySelector('tbody');
		    const getRowChecks = () => tbody.querySelectorAll('input[name="rowChk"]');
		
		    chkAll?.addEventListener('change', () => {
		        getRowChecks().forEach(chk => chk.checked = chkAll.checked);
		    });
		
		    /* 버튼 동작 (필요 시 URL 교체) */
		    document.getElementById('btnNew').addEventListener('click', function(){
		        const url = '<c:out value="${pageContext.request.contextPath}"/>/po/new';
		        window.location.href = url;
		    });
		    document.getElementById('btnDelete').addEventListener('click', function(){
		        const ids = Array.from(getRowChecks()).filter(x=>x.checked && x.value).map(x=>x.value);
		        if(ids.length===0){ alert('삭제할 항목을 선택하세요.'); return; }
		        if(confirm(ids.length + '건을 삭제하시겠습니까?')){
		            alert('개발용 더미 동작: ' + ids.join(', '));
		        }
		    });
		});
	</script>
</body>
</html>
