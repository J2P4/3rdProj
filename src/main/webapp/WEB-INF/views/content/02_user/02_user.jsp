<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>계정 관리 < J2P4</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/user.css">
    <script src="${pageContext.request.contextPath}/resources/js/common.js" defer></script>
</head>
<body>
    <div class = "title">
    	<h1>계정 관리</h1>
   	</div>
    <form class = "filter" method="get" action="">
        <div class = "filter-item-box">
            <div class = "filter-item">
                <div class = "filitem-name">· 사원번호</div>
                <div class = "filitem-input">
                    <select name = "변수명" size = "1">
                        <option value = "전달값1" selected>나중에 불러오도록</option>
                        <option value = "전달값2">나중에 불러오도록</option>
                    </select>
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 부서</div>
                <div class = "filitem-input">
                    <select name = "변수명" size = "1">
                        <option value = "전달값1" selected>나중에 불러오도록</option>
                        <option value = "전달값2">나중에 불러오도록</option>
                    </select>                    
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 사원명</div>
                <div class = "filitem-input">
                    <select name = "변수명" size = "1">
                        <option value = "전달값1" selected>나중에 불러오도록</option>
                        <option value = "전달값2">나중에 불러오도록</option>
                    </select>
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 권한</div>
                <div class = "filitem-input">
                    <select name = "inout" size = "1">
                        <option value = "1" selected>전체</option>
                        <option value = "2">관리자</option>
                        <option value = "3">부서장</option>
                        <option value = "4">사원</option>
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
	                <th><input type="checkbox" class = "chkbox" id="chkAll"></th>
	                <th>사원번호</th>
	                <th>이름</th>
	                <th>부서</th>
	                <th>직급</th>
	                <th>권한</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="checkbox" name="rowChk"></td>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                </tr>
            </tbody>s
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
	        <div class = "silde-title"><h2>사원 등록</h2></div>
	        <div class = "slide-id">사번 : </div>
	        <div class = "slide-tb">
	            <table>
	                <thead>
	                    <th>이름</th>
	                    <th>생년월일</th>
	                    <th>입사일</th>
	                </thead>
	                <tbody>
	                    <tr>
	                        <td>1</td>
	                        <td><input type="date"></td>
	                        <td><input type="date"></td>
	                    </tr>
	                </tbody>
	            </table>
	        </div>
	        <div class = "slide-tb">
	            <table>
	                <thead>
	                    <th>부서</th>
	                    <th>직급</th>
	                    <th>권한</th>
	                </thead>
	                <tbody>
	                    <tr>
	                        <td>2</td>
	                        <td>
	                        	<select>
	                        		<option value="1" selected>전체</option>
	                        		<option value="2">부장</option>
	                        		<option value="3">과장</option>
	                        		<option value="4">대리</option>
	                        		<option value="5">사원</option>
	                        	</select>
							</td>
	                        <td>
	                        	<select>
	                        		<option value="1" selected>전체</option>
	                        		<option value="2">admin</option>
	                        		<option value="3">부서장</option>
	                        		<option value="4">평사원</option>
	                        	</select>
	                       	</td>
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
    <div class="modal-bg hide">
        <div class = "add-modal">
            <div class="modal-title">J2P4 MES</div>
            <div class="modal-content">
                <div class="field">
                    <label class="label">아이디</label>
                </div>
                <div class="field">
                    <label class="label">초기 비밀번호</label>
                </div>
                <div class="confirm">
                    <div>등록하시겠습니까?</div>
                </div>
            </div>
            <div class = "modal-btnbox">
                <input type = "button" class = "m-btn slide-btn" value = "등록">
                <input type = "button" class = "close-btn m-btn slide-btn" value = "취소">
            </div>
        </div>
    </div>
    <div class = "slide detail modify">
        <div class = "silde-title"><h2>사원 정보 상세</h2></div>
        <div class = "slide-id">사원번호: </div>
        <div class = "slide-tb">
            <table>
                <thead>
                    <th>이름</th>
                    <th>생년월일</th>
                    <th>입사일</th>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td><input type="date"></td>
                        <td><input type="date"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class = "slide-tb">
            <table>
                <thead>
                    <th>부서</th>
                    <th>직급</th>
                    <th>권한</th>
                </thead>
                <tbody>
                    <tr>
                        <td>2</td>
                        <td>
                        	<select>
                        		<option value="1" selected>전체</option>
                        		<option value="2">부장</option>
                        		<option value="3">과장</option>
                        		<option value="4">대리</option>
                        		<option value="5">사원</option>
                        	</select>
						</td>
                        <td>
                        	<select>
                        		<option value="1" selected>전체</option>
                        		<option value="2">관리자</option>
                        		<option value="3">부서장</option>
                        		<option value="4">평사원</option>
                        	</select>
                       	</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class = "slide-btnbox">
            <input type = "button" class = "slide-btn" value = "등록">
            <input type = "button" class = "slide-btn" value = "수정">
            <input type = "button" class = "close-btn slide-btn" value = "취소">
        </div>
    </div>
</body>
</html>