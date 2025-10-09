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
    <script src="${pageContext.request.contextPath}/resources/js/common.js" defer></script>
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
    <form class = "filter" method="get" action="">
        <div class = "filter-item-box">
            <div class = "filter-item">
                <div class = "filitem-name">· 재고 ID</div>
                <div class = "filitem-input">
                    <input type="text" placeholder=" ID를 입력해주세요">
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 구분</div>
                <div class = "filitem-input">
                    <select name = "변수명" size = "1">
                        <option value = "1" selected>완제</option>
                        <option value = "2">반제</option>
                        <option value = "3">재료</option>
                    </select>                    
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 보관 위치</div>
                <div class = "filitem-input">
                    <select name = "변수명" size = "1">
                        <option value = "1" selected>WH1</option>
                        <option value = "2">WH2</option>
                        <option value = "3">WH3</option>
                        <option value = "4">WH4</option>
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
            <tbody>
               	<c:if test="${empty list}">
                	<tr>
                		<td colspan="5"> 조회 내역이 없습니다.</td>
                	</tr>
               	</c:if>
               	<c:if test="${not empty list}">
               		<c:forEach var="P0401_StockDTO" items="${list}">
	               		<tr>
		                    <td><input type="checkbox" name="rowChk"></td>
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
        <div class = "slide-contents">
            <div class = "silde-title"><h2>재고 등록</h2></div>
            <div class = "slide-id">재고 ID: </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th>품목 ID</th>
                        <th>품목 분류</th>
                        <th>품목 이름</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td data-type = "select">1</td>
                            <td>1</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th>재고 수량</th>
                        <th>보관 위치</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2</td>
                            <td data-type = "select">2</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-btnbox">
                <input type = "button" class = "slide-btn" value = "등록">
                <input type = "button" class = "close-btn slide-btn" value = "취소">
            </div>
        </div>
    </div>
    <!-- 상세용 슬라이드-->
    <div class = "slide" id = "slide-detail">
        <div class = "slide-contents">
            <div class = "silde-title"><h2>재고 상세</h2></div>
            <div class = "slide-id">재고 ID: ${P0401_StockDTO.stock_id}</div>
            <div class = "slide-tb">
                <table id="simpleEditableTable">
                    <thead>
                        <th>품목 ID</th>
                        <th>품목 분류</th>
                        <th>품목 이름</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td class = "editMe">${P0401_StockDTO.item_id}</td>
                            <td class = "editMe">${P0401_StockDTO.item_div}</td>
                            <td class = "editMe">${P0401_StockDTO.item_name}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th>재고 수량</th>
                        <th>보관 위치</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td class = "editMe">${P0401_StockDTO.stock_amount}</td>
                            <td class = "editMe">${P0401_StockDTO.stock_wrap}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-btnbox">
                <input type = "button" class = "slide-btn" value = "수정">
                <input type = "button" class = "close-btn slide-btn" value = "취소">
            </div>
        </div>
    </div>
</body>
</html>