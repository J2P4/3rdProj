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
    <title>입고 검사 < 품질 관리 < J2P4</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css" type="text/css">
    <script src="${pageContext.request.contextPath}/resources/js/common.js" defer></script>
</head>
<body>
    <div class = "title"><h1>입고 검사</h1></div>
    <form class = "filter" method="get" action="">
        <div class = "filter-item-box">
            <div class = "filter-item">
                <div class = "filitem-name">· 결과 ID</div>
                <div class = "filitem-input">
                    <select name = "변수명" size = "1">
                        <option value = "전달값1" selected>나중에 불러오도록</option>
                        <option value = "전달값2">나중에 불러오도록</option>
                    </select>
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 검사일</div>
                <div class = "filitem-input">
                    <input type = "date" name="fromDate" id="fromDate">
                    <span class="tilde">~</span>
                    <input type = "date" name="toDate" id="toDate">
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 품명</div>
                <div class = "filitem-input">
                    <select name = "변수명" size = "1">
                        <option value = "전달값1" selected>나중에 불러오도록</option>
                        <option value = "전달값2">나중에 불러오도록</option>
                    </select>
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
                    <th>양품 수</th>
                    <th>불량 수</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="checkbox" name="rowChk"></td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                </tr>
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
            <div class = "silde-title"><h2>입고 검사 등록</h2></div>
            <div class = "slide-id">입고 검사 ID: </div>
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
            <div class = "silde-title"><h2>입고 검사 상세</h2></div>
            <div class = "slide-id">입고 검사 ID: </div>
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