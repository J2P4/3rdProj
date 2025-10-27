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

    <c:url var="cssUrl" value="/resources/css/common.css"/>
    <c:url var="commonJsUrl" value="/resources/js/common.js"/>
    <link rel="stylesheet" href="${cssUrl}" type="text/css" />

    <style>
        /* 이미지/설명 공용 레이아웃 */
        .image-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 0 0 400px;
            min-height: 300px;
            position: relative;
            font-size: 16px;
        }
        .image-section::before {
            content: "공정 이미지";
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .image {
            width: 100%;
            height: 260px;
            object-fit: cover;
            border: 1px solid #ccc;
            background-color: #f9f9f9;
            box-sizing: border-box;
            display: block;
        }

        .specific {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1 1 500px;
            min-height: 300px;
            position: relative;
            font-size: 16px;
        }
        .specific::before {
            content: "공정 상세";
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .specific-box {
            width: 100%;
            min-height: 260px;
            border: 1px solid #ccc;
            background-color: #f9f9f9;
            box-sizing: border-box;
            padding: 12px;
            overflow: auto;
            line-height: 1.5;
            white-space: pre-wrap;
        }

        .process-box {
            display: flex;
            gap: 16px;
            justify-content: center;
            margin-top: 20px;
        }

        .helper-text { font-size: 12px; color: #666; margin-top: 6px; }
        .w-100 { width: 100%; }
        .mt-8 { margin-top: 8px; }
    </style>

    <script>const contextPath='${pageContext.request.contextPath}';</script>
    <script src="${commonJsUrl}" defer></script>
    <script src="${pageContext.request.contextPath}/resources/js/04_5_process.js" defer></script>
</head>

<body>
    <div class="title"><h1>공정 관리</h1></div>

    <!-- 검색 필터 -->
    <form class="filter" method="get" action="${pageContext.request.contextPath}/processlist">
        <div class="filter-item-box">
            <div class="filter-item">
                <div class="filitem-name">· 공정ID</div>
                <div class="filitem-input">
                    <input type="text" name="process_id" placeholder=" ID를 입력해주세요" value="${filter.process_id}"/>
                </div>
            </div>
            <div class="filter-item">
                <div class="filitem-name">· 공정명</div>
                <div class="filitem-input">
                    <input type="text" name="process_name" placeholder=" 공정명을 입력해주세요" value="${filter.process_name}"/>
                </div>
            </div>
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

    <!-- 하단 버튼 -->
    <div class="bottom-btn">
        <div class="page"></div>
        <div class="bottom-btn-box">
            <input type="button" id="btnDelete" class="btm-btn del" value="삭제" />
            <input type="button" class="btm-btn new" value="신규" />
        </div>
    </div>

    <!-- 삭제 폼(선택사항: 현재 JS는 /processdelete JSON POST를 사용하므로 없어도 됨) -->
    <c:url var="deleteUrl" value="/process/delete"/>
    <form id="deleteForm" method="post" action="${deleteUrl}" style="display:none;">
        <input type="hidden" name="ids" id="deleteIds">
    </form>

    <!-- 등록 슬라이드: 기존 유지(설명은 contenteditable에서 추출, 이미지 업로드는 미연동/미리보기만) -->
    <div class="slide" id="slide-input">
        	<button type="button" class="slide-close-btn">✕</button>
        <form class="slide-contents" id="processInsertForm">
            <div class="silde-title"><h2 id="slide-title">공정 등록</h2></div>

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
                            <td><input type="text" name="department_id" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="process-box">
                <div class="image-section">
                    <img class="image" id="preview" alt="" />
                    <input class="mt-8" type="file" id="img" accept="image/*" />
                    <div class="helper-text">* 업로드는 미연동. 미리보기만 됩니다.</div>
                </div>

                <div class="specific">
                    <div class="specific-box" id="create-process-desc" contenteditable="true" aria-label="공정 상세 입력 영역"></div>
                </div>
            </div>

            <div class="slide-btnbox">
                <input type="button" class="close-btn slide-btn" value="취소" />
                <input type="submit" class="slide-btn" id="processCreateBtn" value="등록" />
            </div>
        </form>
    </div>

    <!-- 상세 슬라이드: 이미지 + 설명 추가 -->
    <div class="slide" id="slide-detail">
        	<button type="button" class="slide-close-btn">✕</button>
      <div class="slide-contents">
        <div class="silde-title"><h2>공정 상세</h2></div>

        <div class="slide-id">공정 ID: <span id="d-process-id"></span></div>

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
                <td id="d-process-seq"></td>
                <td id="d-process-name"></td>
                <td id="d-dept-id"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 새로 추가된 영역 -->
        <div class="process-box">
            <div class="image-section">
                <img class="image" id="d-process-image" alt="" />
                <div id="d-process-image-helper" class="helper-text"></div>
            </div>
            <div class="specific">
                <div class="specific-box" id="d-process-desc" aria-label="공정 상세"></div>
            </div>
        </div>

        <div class="slide-btnbox">
          <input type="button" class="close-btn slide-btn" value="취소" />
          <input type="button" class="slide-btn" id="detailEditBtn" value="수정" />
        </div>
      </div>
    </div>

    <!-- 등록 슬라이드 이미지 미리보기 -->
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
