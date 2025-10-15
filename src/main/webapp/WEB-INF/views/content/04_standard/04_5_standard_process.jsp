<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%
    String todayStr = new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date());
    request.setAttribute("todayStr", todayStr);
%>
<!DOCTYPE html>
<html lang="en">
<style>
.image{
border : 1px solid black;
wide: 50px;
height: 50px;
backgroundcolor : white;
}
.specific{
border : 1px solid black;
backgroundcolor : white;
}
.detail-table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
}

.detail-table th,
.detail-table td {
    width: 33.33%;
    text-align: center;
    padding: 8px;
    border: none;
    outline: none;
    box-sizing: border-box;
}

/* ✅ 입력창 테두리 제거 및 스타일링 */
.detail-table input[type="text"] {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    text-align: center;
    font-size: 14px;
    padding: 4px;
}
</style>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>공정 관리 < 기준 관리 < J2P4</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css" type="text/css">
    <!-- 상세, 품목 select 뜰 수 있도록 아래 script 영역 필수 추가!! -->
    <script>
        const contextPath = '${pageContext.request.contextPath}';
        // 품목 목록을 JSON 형식으로 js 변수에 저장하려고 작성
        const allItemsJson = `${itemListJson}`; 
    </script>
    <script src="${pageContext.request.contextPath}/resources/js/common.js" defer></script>
    <script src="${pageContext.request.contextPath}/resources/js/04_1_stock.js" defer></script>
</head>
<body>
    <!-- 페이지 제목 -->
    <div class = "title"><h1>공정 관리</h1></div>
    <!-- 검색 필터(filter)
        - filter-item-box : select란 모음
            + filter-item: 개별 select란
                * filitem-name : select란 명
                * filitem-input : 실제 select 영역
        - filter-btn : 조회 버튼 영억
    -->
    <form class = "filter" method="get" action="${pageContext.request.contextPath}/stocklist">
        <div class = "filter-item-box">
            <div class = "filter-item">
                <div class = "filitem-name">· 공정ID</div>
                <div class = "filitem-input">
                    <input type="text" name="stock_id" placeholder=" ID를 입력해주세요">
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 부서</div>
                <div class = "filitem-input">
                    <input type="text" name="stock_id" placeholder=" 부서를 입력해주세요">
                
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 공정명</div>
               	<div class = "filitem-input">
                    <input type="text" name="stock_id" placeholder=" 공정명을 입력해주세요">
                
                </div>
                
                </div>
            <div class = "filter-item"></div>
        </div>
        <div class = "filter-btn">
            <input type = "submit" class = "fil-btn" value="조회">
        </div>
    </form>
    <!-- 테이블 영역(table)
        - table(클래스 X) : 실제 테이블 영역
            + thead : 제목 영역. 너비 조정 위해서 일부 속성에 클래스 넣음.
            + tbody : 데이터 영역
    -->
    <div class = "table">
        <table>
            <thead>
                <tr>
                    <th class = "chkbox"><input type="checkbox" id="chkAll"></th>
                    <th class = "id">공정 순서</th>
                    <th>공정 ID</th>
                    <th class = "type">공정명</th>
                </tr>
            </thead>
            <!-- 데이터 행 tr에 data-id 속성 잊지 말기! (상세 슬라이드에 필수) -->
            <tbody>
               	<c:if test="${empty list}">
                	<tr>
                        <td><input type="checkbox" class="rowChk" disabled></td>
                		<td colspan="3"> 조회 내역이 없습니다.</td>
                	</tr>
               	</c:if>
               	<c:if test="${not empty list}">
               		<c:forEach var="P0401_StockDTO" items="${list}">
	               		<tr data-id="${P0401_StockDTO.stock_id}">
		                    <td><input type="checkbox" class="rowChk" name="delete_stock_id" value="${P0401_StockDTO.stock_id}"></td>
		                    <td>${P0401_StockDTO.stock_id}</td>
		                    <td>${P0401_StockDTO.stock_amount}</td>
		                    <td>${P0401_StockDTO.item_div}</td>
	                    </tr>
                    </c:forEach>
                 </c:if>
            </tbody>
        </table>
    </div>
    <!-- 테이블 하단 버튼 영역(bottom-btn)
        - page : 페이징 들어가는 영역
        - bottom-btn-boc : 등록, 삭제 등 버튼 영역
            + btm-btn : 공통 양식 지정
            + new, del : 개별 양식 지정
    -->
    <form class = "bottom-btn">
        <div class = "page"></div>
        <div class = "bottom-btn-box">
            <input type = "button" class = "btm-btn new" value="입력">
            <input type = "button" class = "btm-btn del" value="등록">
        </div>
    </form>
    <!-- 입력용 슬라이드 -->
    <div class = "slide" id = "slide-input">
        <form class = "slide-contents" id="stockInsertForm">
            <div class = "silde-title"><h2 id="slide-title">공정 상세</h2></div>
            <div class = "slide-id" id="stock-id-show" style = "display: none">
                재고 ID: <span id="stock-id-val"></span>
                <input type="hidden" id="input_stock_id" name="stock_id" value="">
            </div>
          <div class="slide-tb">
    <table class="detail-table">
        <thead>
            <tr>
                <th>공정 순서</th>
                <th>공정명</th>
                <th>담당부서</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                    <td><input type="text" name="process_order" /></td>
        			<td><input type="text" name="process_name" /></td>
        			<td><input type="text" name="department" /></td>
            </tr>
        </tbody>
    </table>
</div>

	<div class = "image">
	공정 이미지
	</div>
	<div class = "specific">
	공정 상세 설명
	</div>

  <div class = "slide-btnbox">
                <input type = "button" class = "slide-btn" id="detailEditBtn" value = "수정">
                <input type = "button" class = "close-btn slide-btn" value = "취소">
            </div>
      
        </form>
    </div>
    <!-- 상세용 슬라이드 : ajax로 채울 거라 el 태그 사용 필요 X -->
    
                <!-- 상세 데이터 표시용 id 주는 영역 1 -->
          
            
  				<!-- 상세 데이터 표시용 id 주는 영역 1 -->

    
</body>
</html>