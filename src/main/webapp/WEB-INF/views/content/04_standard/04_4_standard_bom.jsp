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
    <title>BOM 관리 < 기준 관리 < J2P4</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css" type="text/css">
    <script src="${pageContext.request.contextPath}/resources/js/common.js" defer></script>
</head>
<body>
    <div class = "title"><h1>BOM 관리</h1></div>
    <form class = "filter" method="get" action="">
        <div class = "filter-item-box">
            <div class = "filter-item">
                <div class = "filitem-name">· BOM ID</div>
                <div class = "filitem-input">
                    <select name = "변수명" size = "1">
                        <option value = "전달값1" selected>나중에 불러오도록</option>
                        <option value = "전달값2">나중에 불러오도록</option>
                    </select>
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 분류</div>
                <div class = "filitem-input">
                    <select name = "변수명" size = "1">
                        <option value = "전달값1" selected>나중에 불러오도록</option>
                        <option value = "전달값2">나중에 불러오도록</option>
                    </select>                    
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 품목 ID</div>
                <div class = "filitem-input">
                    <select name = "변수명" size = "1">
                        <option value = "전달값1" selected>나중에 불러오도록</option>
                        <option value = "전달값2">나중에 불러오도록</option>
                    </select>
                </div>
            </div>
            <div class = "filter-item"></div>
        </div>
        <div class = "filter-btn">
            <input type = "submit" class = "fil-btn" value="조회">
        </div>
    </form>
    <div class = "table">
        <table>
            <thead>
                <tr>
                    <th class = "chkbox"><input type="checkbox" id="chkAll"></th>
                    <th class = "id">BOM ID</th>
                    <th class = "id">품목 ID</th>
                    <th class = "type">분류</th>
                    <th>소요량</th>
                </tr>
            </thead>
            <tbody>
            	<c:if test="${empty list}">
					<tr>
                        <td><input type="checkbox" class="rowChk" disabled></td>
						<td colspan="5"> 조회 내역이 없습니다.</td>
					</tr>
				</c:if>
				<c:if test="${not empty list}">
					<c:forEach var="P0404_BOMDTO" items="${list}">
		                <tr>
		                    <td><input type="checkbox" class="rowChk"></td>
		                    <td>${P0404_BOMDTO.bom_id}</td>
		                    <td>${P0404_BOMDTO.item_id}</td>
		                    <td>${P0404_BOMDTO.item_div}</td>
		                    <td>${P0404_BOMDTO.bom_amount}</td>
		                </tr>
		            </c:forEach>
                </c:if>
            </tbody>
        </table>
    </div>
    <div class = "bottom-btn">
        <div class = "page">페이징 위치 확인용</div>
        <div class = "bottom-btn-box">
            <input type = "button" class = "btm-btn new" value="신규">
            <input type = "button" class = "btm-btn del" value="삭제">
        </div>
    </div>
    <div class = "slide" id = "slide-input">
        <div class = "slide-contents">
            <div class = "silde-title"><h2>BOM 등록</h2></div>
            <div class = "slide-id">목표 품목 ID: </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th>목표 품목 ID</th>
                        <th>품목명</th>
                        <th>분류</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select size = "1">
                                        <option value = "">아래 select에 따라 달라지도록 입력하기!!</option>
                                </select>
                            </td>
                            <td><input type = "text" placehoder = "품목명을 입력해주세요"></td>
                            <td>
                                <select size="1">
                                    <option value = "1" selected>도서</option>
                                    <option value = "2">포장지</option>
                                    <option value = "3">완제품</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th><input type=checkbox></th>
                        <th>재료 품목 ID</th>
                        <th>품목명</th>
                        <th>분류</th>
                        <th>소요량</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="checkbox"></td>
                            <td>
                                <select size = "1">
                                        <option value = "">아래 select에 따라 달라지도록 입력하기!!</option>
                                </select>                                
                            </td>
                            <td>
                                <input type = "text" placehoder = "품목명을 입력해주세요">
                            </td>
                            <td>
                                <select size="1">
                                    <option value = "1" selected>도서</option>
                                    <option value = "2">포장지</option>
                                </select>
                            </td>
                            <td><input type = "number"></td>
                        </tr>
                    </tbody>
                </table>
                <div class = "slide-tb-btnbox">
                    <input type="button" class = "material" value="재료 추가">
                    <input type="button" class = "material" value="재료 삭제">
                </div>
            </div>
            <div class = "slide-btnbox">
                <input type = "button" class = "slide-btn" value = "등록">
                <input type = "button" class = "close-btn slide-btn" value = "취소">
            </div>
        </div>
    </div>
    <div class = "slide" id = "slide-detail">
        <div class = "slide-contents">
            <div class = "silde-title"><h2>BOM 상세</h2></div>
            <div class = "slide-id">목표 품목 ID: </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th>목표 품목 ID</th>
                        <th>품목명</th>
                        <th>분류</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-type = "select">1</td>
                            <td>1</td>
                            <td data-type = "select">1</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th><input type=checkbox></th>
                        <th>재료 품목 ID</th>
                        <th>품목명</th>
                        <th>분류</th>
                        <th>소요량</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="checkbox"></td>
                            <td data-type = "select">2</td>
                            <td>2</td>
                            <td data-type = "select">2</td>
                            <td>2</td>
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