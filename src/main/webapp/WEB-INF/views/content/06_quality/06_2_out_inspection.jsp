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
    <title>출고 검사 < 품질 관리 < J2P4</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css" type="text/css">
    <script src="${pageContext.request.contextPath}/resources/js/common.js" defer></script>
</head>
<body>
    <div class = "title"><h1>출고 검사</h1></div>
    <form class = "filter" method="get" action="">
        <div class = "filter-item-box">
            <div class = "filter-item">
                <div class = "filitem-name">· 결과 ID</div>
                <div class = "filitem-input">
                    <input type = "text" name = "inspection_result_id" placeholder = "검사 결과 id를 입력해주세요">
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 검사일</div>
                <div class = "filitem-input">
                    <input type = "date" name="fromDate" id="fromDate">
                    <span class="tilde">~</span>
                    <input type = "date" name="toDate"id="toDate">
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 품명</div>
                <div class = "filitem-input">
                    <input type = "text" name = "item_name" placeholder = "품명을 입력해주세요">
                </div>
            </div>
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
                    <th class = "id">검사 결과 ID</th>
                    <th class = "date">검사일</th>
                    <th class = "gb">양품 수</th>
                    <th class = "gb">불량 수</th>
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
					<c:forEach var="P0602_OutInsDTO" items="${list}">
		                <tr>
		                    <td class = "chkbox"><input type="checkbox" class="rowChk"></td>
		                    <td class = "id">${P0602_OutInsDTO.inspection_result_id}</td>
		                    <td class = "date">${P0602_OutInsDTO.inspection_result_date}</td>
		                    <td>${P0602_OutInsDTO.inspection_result_good}</td>
		                    <td>${P0602_OutInsDTO.inspection_result_bad}</td>
		                </tr>
	                </c:forEach>
	            </c:if>
            </tbody>
        </table>
    </div>
    <div class = "bottom-btn">
        <div class = "page"></div>
        <div class = "bottom-btn-box">
            <input type = "button" class = "btm-btn new" value="신규">
            <input type = "button" class = "btm-btn del" value="삭제">
        </div>
    </div>
    <div class = "slide" id = "slide-input">
        <div class = "slide-contents">
            <div class = "silde-title"><h2>출고 검사 등록</h2></div>
            <div class = "slide-id">출고 검사 ID: </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th>검사일</th>
                        <th>양품 수</th>
                        <th>불량 수</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th>검사 대상</th>
                        <th>담당 사원</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2</td>
                            <td>2</td>
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
    <div class = "slide" id = "slide-detail">
        <div class = "slide-contents">
            <div class = "silde-title"><h2>출고 검사 상세</h2></div>
            <div class = "slide-id">출고 검사 ID: </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th>검사일</th>
                        <th>양품 수</th>
                        <th>불량 수</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-type = "date">1</td>
                            <td>1</td>
                            <td>1</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th>검사 대상</th>
                        <th>담당 사원</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-type = "select">2</td>
                            <td data-type = "select">2</td>
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