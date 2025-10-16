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
/* 공정 이미지 영역 */
.image-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 0 0 400px;
    height: 400px;
    position: relative;
}

/* 이미지 미리보기 박스 */
.image {
    width: 100%;
    height: 350px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    box-sizing: border-box;
}


/* 이미지 태그가 있으면 꽉 채우기 */
.image img {
    width: 100%;
    height: 100%;
    object-fit: cover;   /* 이미지 비율 유지하며 꽉 채움 */
    display: block;
}

/* 업로드 버튼 */
.upload-btn {
    margin-top: 8px;
    background-color: #007bff;
    color: white;
    padding: 6px 14px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

/* input 숨김 */
#imageUpload {
    display: none;
}

/* 공정 상세 설명 */
.specific {
    flex: 0 0 500px;
    height: 400px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    box-sizing: border-box;
}

/* 테이블 관련 */
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

/* 입력창 테두리 제거 및 스타일링 */
.detail-table input[type="text"] {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    text-align: center;
    font-size: 14px;
    padding: 4px;
}

/* 공정 박스 */
.process-box {
    display: flex;
    gap: 16px;              /* 두 박스 사이 간격 */
    justify-content: center; /* 가운데 정렬 */
    margin-top: 20px;
}

.process-box .image {
    flex: 0 0 400px;         /* 가로 너비 고정 */
    height: 400px;           /* 세로도 같게 */
    border: 1px solid #ccc;
    box-sizing: border-box;
    background-color: #f9f9f9;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 30px;
    font-weight: bold;
}

.process-box .specific {
    flex: 0 0 500px;         /* 가로 너비 고정 */
    height: 400px;           /* 세로도 같게 */
    border: 1px solid #ccc;
    box-sizing: border-box;
    background-color: #f9f9f9;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 30px;
    font-weight: bold;
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

    <!-- 검색 필터 -->
    <form class="filter" method="get" action="${pageContext.request.contextPath}/stocklist">
        <div class="filter-item-box">
            <div class="filter-item">
                <div class="filitem-name">· 공정ID</div>
                <div class="filitem-input">
                    <input type="text" name="process_id" placeholder=" ID를 입력해주세요">
                </div>
            </div>
            <div class="filter-item">
                <div class="filitem-name">· 부서</div>
                <div class="filitem-input">
                    <input type="text" name="deparment" placeholder=" 부서를 입력해주세요">
                </div>
            </div>
            <div class="filter-item">
                <div class="filitem-name">· 공정명</div>
                <div class="filitem-input">
                    <input type="text" name="stock_id" placeholder=" 공정명을 입력해주세요">
                </div>
            </div>
            <div class="filter-item"></div>
        </div>
        <div class="filter-btn">
            <input type="submit" class="fil-btn" value="조회">
        </div>
    </form>

    <!-- 테이블 영역 -->
    <div class="table">
        <table>
            <thead>
                <tr>
                    <th class="chkbox"><input type="checkbox" id="chkAll"></th>
                    <th class="id">공정 순서</th>
                    <th>공정 ID</th>
                    <th class="type">공정명</th>
                </tr>
            </thead>
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

    <!-- 하단 버튼 영역 -->
    <form class="bottom-btn">
        <div class="page"></div>
        <div class="bottom-btn-box">
            <input type="button" class="btm-btn new" value="입력">
            <input type="button" class="btm-btn del" value="등록">
        </div>
    </form>

    <!-- 입력용 슬라이드 -->
    <div class="slide" id="slide-input">
        <form class="slide-contents" id="stockInsertForm">
            <div class="silde-title"><h2 id="slide-title">공정 상세</h2></div>
            <div class="slide-id" id="stock-id-show" style="display: none">
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

            <div class="process-box">
                <!-- 공정 이미지 영역 -->
                    공정 이미지
                <div class="image-section">
                       <img class="image" id="preview">
    <br>
    <!-- accept="image/*" 파일 중 기본적으로 이미지만 필터링  -->
    <input type="file" id="img" accept="image/*">
                </div>

                <!-- 공정 상세 설명 -->
                <div class="specific">
                    공정 상세 설명
                </div>
            </div>

            <div class="slide-btnbox">
                <input type="button" class="slide-btn" id="detailEditBtn" value="수정">
                <input type="button" class="close-btn slide-btn" value="취소">
            </div>
        </form>
    </div>

    <!-- 이미지 미리보기 스크립트 -->
 <script>
 
 // 업로드할 파일이 바뀌면
 document.querySelector('#img').addEventListener('change', function(event){
     // 이미지 처리 객체
     const reader = new FileReader()

     // 업로드할 이미지를 읽어오기
     const file = event.target.files[0]
     reader.readAsDataURL( file )

     // 다 읽어 오면 처리
     reader.onload = function(e){
         // img 태그에 읽어온 이미지 넣기
         document.querySelector('#preview').setAttribute('src', e.target.result)
     }

 })
 
 
</script>
 
</body>
</html>