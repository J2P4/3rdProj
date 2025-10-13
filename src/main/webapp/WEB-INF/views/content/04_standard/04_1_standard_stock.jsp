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
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>재고 관리 < 기준 관리 < J2P4</title>
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
    <div class = "title"><h1>재고 관리</h1></div>
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
                <div class = "filitem-name">· 재고 ID</div>
                <div class = "filitem-input">
                    <input type="text" name="stock_id" placeholder=" ID를 입력해주세요">
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 구분</div>
                <div class = "filitem-input">
                    <select name = "item_div" size = "1">
                        <c:set var="selectedDiv" value="${param.item_div}" />
                        <!-- 삼항 연산자로 selected 상태인지 아닌지 지정 -->
                        <option value = "" ${empty selectedDiv ? 'selected' : ''}>재고 구분 선택</option>
                        <option value = "도서" ${selectedDiv eq '도서' ? 'selected' : ''}>도서</option>
                        <option value = "포장지" ${selectedDiv eq '포장지' ? 'selected' : ''}>포장지</option>
                        <option value = "완제품" ${selectedDiv eq '완제품' ? 'selected' : ''}>완제품</option>
                    </select>                    
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 보관 위치</div>
                <div class = "filitem-input">
                    <select name = "stock_wrap" size = "1">
                        <c:set var="selectedWrap" value="${param.stock_wrap}" />
                        <option value = "" ${empty selectedWrap ? 'selected' : ''}>보관 위치 선택</option>
                        <option value = "WH1 :: 1번 창고" ${selectedWrap eq 'WH1 :: 1번 창고' ? 'selected' : ''}>WH1 :: 1번 창고</option>
                        <option value = "WH2 :: 2번 창고" ${selectedWrap eq 'WH2 :: 2번 창고' ? 'selected' : ''}>WH2 :: 2번 창고</option>
                        <option value = "WH3 :: 3번 창고" ${selectedWrap eq 'WH3 :: 3번 창고' ? 'selected' : ''}>WH3 :: 3번 창고</option>
                        <option value = "WH4 :: 4번 창고" ${selectedWrap eq 'WH4 :: 4번 창고' ? 'selected' : ''}>WH4 :: 4번 창고</option>
                    </select>
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
                    <th class = "id">재고 ID</th>
                    <th>재고량</th>
                    <th class = "type">구분</th>
                    <th>보관 위치</th>
                </tr>
            </thead>
            <!-- 데이터 행 tr에 data-id 속성 잊지 말기! (상세 슬라이드에 필수) -->
            <tbody>
               	<c:if test="${empty list}">
                	<tr>
                        <td><input type="checkbox" class="rowChk" disabled></td>
                		<td colspan="5"> 조회 내역이 없습니다.</td>
                	</tr>
               	</c:if>
               	<c:if test="${not empty list}">
               		<c:forEach var="P0401_StockDTO" items="${list}">
	               		<tr data-id="${P0401_StockDTO.stock_id}">
		                    <td><input type="checkbox" class="rowChk" name="delete_stock_id" value="${P0401_StockDTO.stock_id}"></td>
		                    <td>${P0401_StockDTO.stock_id}</td>
		                    <td>${P0401_StockDTO.stock_amount}</td>
		                    <td>${P0401_StockDTO.item_div}</td>
		                    <td>${P0401_StockDTO.stock_wrap}</td>
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
            <input type = "button" class = "btm-btn new" value="신규">
            <input type = "button" class = "btm-btn del" value="삭제">
        </div>
    </form>
    <!-- 입력용 슬라이드 -->
    <div class = "slide" id = "slide-input">
        <form class = "slide-contents" id="stockInsertForm">
            <div class = "silde-title"><h2 id="slide-title">재고 등록</h2></div>
            <div class = "slide-id" id="stock-id-show" style = "display: none">
                재고 ID: <span id="stock-id-val"></span>
                <input type="hidden" id="input_stock_id" name="stock_id" value="">
            </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <!-- select 데이터 글씨가 너무 많으면 테이블이 깨져서 강제로 style 속성 지정 1 -->
                        <th style = "width: 40%">품목 ID</th>
                        <th>품목 분류</th>
                        <th>품목 이름</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <!-- select에 DB의 품목 id 데이터 불러와서 채워넣기 -->
                                <!-- select 데이터 글씨가 너무 많으면 테이블이 깨져서 강제로 style 속성 지정 2 -->
                                <select id="input_item_id" name="item_id" size = "1" style = "width: 100%;">
                                    <option value="">품목 ID 선택</option>
                                    <c:forEach var="item" items="${itemList}">
                                        <option 
                                            value="${item.item_id}"
                                            data-div="${item.item_div}"
                                            data-name="${item.item_name}">
                                            ${item.item_id} - ${item.item_name}
                                        </option>
                                    </c:forEach>
                                </select>
                            </td>
                            <td data-type = "select">
                                <select id="input_item_div" name="item_div" size="1" style = "width: 100%;">
                                    <option value="" selected>품목 ID 선택</option>
                                    <option value = "도서">도서</option>
                                    <option value = "포장지">포장지</option>
                                    <option value = "완제품">완제품</option>
                                </select>
                            </td>
                            <td><input type = "text" id="input_item_name" placeholder = "품목명을 입력해주세요" style = "width: 100%;"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th class = "amount">재고 수량</th>
                        <th>보관 위치</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type = "number"  id="input_stock_amount" name="stock_amount" style = "width: 100%;"></td>
                            <td data-type = "select">
                                <select id="input_stock_wrap" name="stock_wrap" style = "width: 100%;">
                                    <option value = "WH1 :: 1번 창고">WH1 :: 1번 창고</option>
                                    <option value = "WH2 :: 2번 창고">WH2 :: 2번 창고</option>
                                    <option value = "WH3 :: 3번 창고">WH3 :: 3번 창고</option>
                                    <option value = "WH4 :: 4번 창고">WH4 :: 4번 창고</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-btnbox">
                <input type = "button" class = "submit-btn slide-btn" value = "등록">
                <input type = "button" class = "close-btn slide-btn" value = "취소">
            </div>
        </form>
    </div>
    <!-- 상세용 슬라이드 : ajax로 채울 거라 el 태그 사용 필요 X -->
    <div class = "slide" id = "slide-detail">
        <div class = "slide-contents">
            <div class = "silde-title"><h2>재고 상세</h2></div>
            <div class = "slide-id">재고 ID: </div>
            <div class = "slide-tb">
                <!-- 상세 데이터 표시용 id 주는 영역 1 -->
                <table id="itemDetail">
                    <thead>
                        <th>품목 ID</th>
                        <th>품목 분류</th>
                        <th>품목 이름</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb">
                <!-- 상세 데이터 표시용 id 주는 영역 1 -->
                <table id="stockDetail">
                    <thead>
                        <th>재고 수량</th>
                        <th>보관 위치</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-btnbox">
                <input type = "button" class = "slide-btn" id="detailEditBtn" value = "수정">
                <input type = "button" class = "close-btn slide-btn" value = "취소">
            </div>
        </div>
    </div>
</body>
</html>