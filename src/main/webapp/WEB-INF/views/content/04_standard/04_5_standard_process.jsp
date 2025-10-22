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
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>공정 관리 &lt; 기준 관리 &lt; J2P4</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css" type="text/css" />

    <style>
        /* 공정 이미지 영역 */
        .image-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 0 0 400px;
            height: 400px;
            position: relative;
            font-size: 20px;
        }
        /* 섹션 제목(이미지) */
        .image-section::before {
            content: "공정 이미지";
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
        }
        /* 이미지 자체 */
        .image {
            width: 100%;
            height: 350px;
            object-fit: cover;
            border: 1px solid #ccc;
            background-color: #f9f9f9;
            box-sizing: border-box;
            display: block;
        }

        /* 공정 상세 영역(이미지 섹션과 동일 패턴) */
        .specific {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 0 0 500px;
            height: 400px;
            position: relative;
            font-size: 20px;
        }
        .specific::before {
            content: "공정 상세";
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .specific-box {
            width: 100%;
            height: 350px;           /* 이미지와 동일 높이 */
            border: 1px solid #ccc;
            background-color: #f9f9f9;
            box-sizing: border-box;
            padding: 12px;
            overflow: auto;
            font-size: 16px;
            line-height: 1.5;
            white-space: pre-wrap;
        }

        /* 공정 박스 레이아웃 */
        .process-box {
            display: flex;
            gap: 16px;
            justify-content: center;
            margin-top: 20px;
            height: 400px;
        }

        /* 테이블 관련 */
/*         .detail-table { */
/*             width: 100%; */
/*             table-layout: fixed; */
/*             border-collapse: collapse; */
/*         } */
/*         .detail-table th, */
/*         .detail-table td { */
/*             width: 33.33%; */
/*             text-align: center; */
/*             padding: 8px; */
/*             border: none; */
/*             outline: none; */
/*             box-sizing: border-box; */
/*         } */
/*         .detail-table input[type="text"] { */
/*             border: none; */
/*             outline: none; */
/*             background: transparent; */
/*             width: 100%; */
/*             text-align: center; */
/*             font-size: 14px; */
/*             padding: 4px; */
/*         } */

/*         /* 리스트 테이블(간단 스타일) */ */
/*         .table table { width: 100%; border-collapse: collapse; } */
/*         .table thead th { padding: 8px; border-bottom: 1px solid #ddd; } */
/*         .table tbody td { padding: 8px; border-bottom: 1px solid #eee; } */
    </style>

    <script>
        const contextPath = '${pageContext.request.contextPath}';
        const allItemsJson = `${itemListJson}`;
    </script>
    <script src="${pageContext.request.contextPath}/resources/js/common.js" defer></script>
    <script src="${pageContext.request.contextPath}/resources/js/04_5_process.js" defer></script>
</head>

<body>
    <!-- 페이지 제목 -->
    <div class="title"><h1>공정 관리</h1></div>

    <!-- 검색 필터 -->
    <form class="filter" method="get" action="${pageContext.request.contextPath}/processlist">
        <div class="filter-item-box">
            <div class="filter-item">
                <div class="filitem-name">· 공정ID</div>
                <div class="filitem-input">
                    <input type="text" name="process_id" placeholder=" ID를 입력해주세요" />
                </div>
            </div>
<!--             <div class="filter-item"> -->
<!--                 <div class="filitem-name">· 부서</div> -->
<!--                 <div class="filitem-input"> -->
<!--                     <input type="text" name="deparment" placeholder=" 부서를 입력해주세요" /> -->
<!--                 </div> -->
<!--             </div> -->
            <div class="filter-item">
                <div class="filitem-name">· 공정명</div>
                <div class="filitem-input">
                    <input type="text" name="process_id" placeholder=" 공정명을 입력해주세요" />
                </div>
            </div>
            <div class="filter-item"></div>
        </div>
        <div class="filter-btn">
            <input type="submit" class="fil-btn" value="조회" />
        </div>
    </form>

    <!-- 테이블 영역 -->
    <div class="table">
        <table>
            <thead>
                <tr>
                    <th class="chkbox"><input type="checkbox" id="chkAll" /></th>
                    <th class="id">공정 순서</th>
                    <th>공정 ID</th>
                    <th class="type">공정명</th>
                </tr>
            </thead>
            <tbody>
                <c:if test="${empty list}">
                    <tr>
                        <td><input type="checkbox" class="rowChk" disabled /></td>
                        <td colspan="3">조회 내역이 없습니다.</td>
                    </tr>
                </c:if>
                <c:if test="${not empty list}">
                    <c:forEach var="P0405_ProcessDTO" items="${list}">
                        <tr data-id="${P0405_ProcessDTO.process_id}">
                            <td><input type="checkbox" class="rowChk" name="delete_process_id" value="${P0405_ProcessDTO.process_id}" /></td>
                            <td>${P0405_ProcessDTO.process_seq}</td>
                            <td>${P0405_ProcessDTO.process_id}</td>
                            <td>${P0405_ProcessDTO.process_name}</td>
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
            <input type="button" class="btm-btn new" value="등록" />
            <input type="button" class="btm-btn del" value="삭제" />
        </div>
    </form>

    <!-- 입력용 슬라이드 -->
    <div class="slide" id="slide-input">
        <form class="slide-contents" id="processInsertForm">
            <div class="silde-title"><h2 id="slide-title">공정 상세</h2></div>
            <div class="slide-id" id="process-id-show" style="display:none">
                공정 ID: <span id="process-id-val"></span>
                <input type="hidden" id="input_process_id" name="process_id" value="" />
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
                            <td><input type="text" name="process_seq" /></td>
                            <td><input type="text" name="process_name" /></td>
                            <td><input type="text" name="department" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="process-box">
                <!-- 공정 이미지 -->
                <div class="image-section">
                    <img class="image" id="preview" alt="" />
                    <br />
                    <input type="file" id="img" accept="image/*" />
                </div>

                <!-- 공정 상세(이미지와 동일 패턴) -->
                <div class="specific">
                    <div class="specific-box" contenteditable="true" aria-label="공정 상세 입력 영역"></div>
                </div>
            </div>

            <div class="slide-btnbox">
                <input type="button" class="slide-btn" id="detailEditBtn" value="저장" />
                <input type="button" class="close-btn slide-btn" value="취소" />
            </div>
        </form>
    </div>

    <!-- 이미지 미리보기 스크립트 -->
    <script>
        document.addEventListener('change', function(e) {
            if (e.target && e.target.id === 'img') {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(ev) {
                    document.querySelector('#preview').setAttribute('src', ev.target.result);
                };
            }
        });
    </script>
</body>
</html>
