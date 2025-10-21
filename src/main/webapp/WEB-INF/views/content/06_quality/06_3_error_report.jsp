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
    <title>불량 보고서 < 품질 관리 < J2P4</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css" type="text/css">
    <script>
        const contextPath = '${pageContext.request.contextPath}';
        // 품목 목록을 JSON 형식으로 js 변수에 저장하려고 작성
        const allItemsJson = `${itemListJson}`; 
    </script> 
    <script src="${pageContext.request.contextPath}/resources/js/common.js" defer></script>
    <script src="${pageContext.request.contextPath}/resources/js/06_3_error.js" defer></script>
</head>
<body>
    <div class = "title"><h1>불량 보고서</h1></div>
    <form class = "filter" method="get" action="">
        <div class = "filter-item-box">
            <div class = "filter-item">
                <div class = "filitem-name" style = "width: 115px;">· 검사 ID</div>
                <div class = "filitem-input">
                    <input type = "text" name = "inspection_result_id" placeholder = "검사 결과 id를 입력해주세요">
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name" style = "width: 115px;">· 검사일</div>
                <div class = "filitem-input">
                    <input type = "date" name="fromDate" id="fromDate" style = "width: 115px;">
                    <span class="tilde">~</span>
                    <input type = "date" name="toDate" id="toDate" style = "width: 115px;">
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name" style = "width: 115px;">· 품명</div>
                <div class = "filitem-input">
                    <input type = "text" name = "item_name" placeholder = "품명을 입력해주세요">
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name" style = "width: 115px;">· 폐기 여부</div>
                <div class = "filitem-input" style = "width: 78%;">
                    <select name = "inout" size = "1">
                        <option value = "0" selected>폐기 포함</option>
                        <option value = "1">폐기 미포함</option>
                    </select>
                </div>
            </div>
        </div>
        <div class = "filter-btn">
            <input type = "submit" class = "fil-btn" value="조회">
        </div>
    </form>
    <div class = "table">
        <!-- <table>
            <thead>
                <tr>
                    <th class = "chkbox"><input type="checkbox" id="chkAll"></th>
                    <th class = "id">불량 사유 ID</th>
                    <th class = "name">불량사유명</th>
                    <th style = "width: 30%;">폐기 여부</th>
                </tr>
            </thead>
            <tbody>
           		<c:if test="${empty list}">
					<tr>
                        <td><input type="checkbox" class="rowChk" disabled></td>
						<td colspan="4"> 조회 내역이 없습니다.</td>
					</tr>
				</c:if>
				<c:if test="${not empty list}">
					<c:forEach var="P0603_ErrorDTO" items="${list}">
		                <tr>
		                    <td class = "chkbox"><input type="checkbox" class="rowChk" name="delete_defect_id" value="${P0603_ErrorDTO.defect_reason_id}"></td>
		                    <td class "= "id">${P0603_ErrorDTO.defect_reason_id}</td>
		                    <td class = "date">${P0603_ErrorDTO.defect_reason}</td>
		                    <td>${P0603_ErrorDTO.defect_exhaust}</td>
		                </tr>
	                </c:forEach>
	            </c:if>
            </tbody>
        </table> -->
        <table>
            <thead>
                <tr>
                    <th class = "chkbox"><input type="checkbox" id="chkAll"></th>
                    <th>검사 ID</th>
                    <th>검사일</th>
                    <th>검사 종류</th>
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
                    <c:forEach var="P0603_ErrorDTO" items="${list}">
                        <tr>
                            <td class = "chkbox"><input type="checkbox" class="rowChk" name="delete_defect_id" value="${P0603_ErrorDTO.defect_reason_id}"></td>
                            <td>${P0603_ErrorDTO.inspection_result_id}</td>
                            <td>${P0603_ErrorDTO.inspection_result_date}</td>
                            <td>
                                <c:choose>
                                    <c:when test="${P0603_ErrorDTO.inspection_type == 0}">
                                        입고 검사
                                    </c:when>
                                    <c:when test="${P0603_ErrorDTO.inspection_type == 1}">
                                        출고 검사
                                    </c:when>
                                    <c:otherwise>-</c:otherwise>
                                </c:choose> 
                            </td>
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
            <div class = "silde-title"><h2>불량 보고서 등록</h2></div>
            <div class = "slide-id">불량 보고서 ID: </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th>검사일</th>
                        <th>검사 대상</th>
                        <th>검사 ID</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type = "date" name= "input_ins_date" id="input_ins_date"></td>
                            <td>
                                <!-- date 설정 전까지는 readonly
                                    date 설정 후에 고를 수 있도록 -->
                                <select name = "input_ins_item" id = "input_ins_item" size = "1">
                                    <option value="">검사 대상 선택</option>
                                </select>
                            </td>
                            <td>
                                <!-- 여기 date, 검사 대상 설정 전까지는 readonly로 됐다가,
                                    date, 검사 대상 설정 후에 고를 수 있도록 -->
                                <select name = "input_ins_id" id = "input_ins_id" size = "1">
                                    <option value="">검사 ID 선택</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th class = "chkbox"><input type="checkbox" id="chkAll"></th>
                        <th>불량 사유명</th>
                        <th>불량 수량</th>
                        <th>폐기 여부</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td class = "chkbox"><input type="checkbox" class="rowChk" name = "delete_defect_id" value="${P0603_ErrorDTO.defect_id}"></td>
                            <td>
                                <input type = "text" name = "defect_reason" id = "defect_reason">
                            </td>
                            <td>
                                <input type = "number" name = "defect_amount" id = "defect_amount">
                            </td>
                            <td>
                                <select name = "input_defect_exhaust" id = "input_defect_exhaust">
                                    <option value = "">폐기 여부 선택</option>
                                    <option value = "0">폐기</option>
                                    <option value = "1">재검사</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class = "slide-tb-btnbox">
                    <input type="button" class = "material" style = "width: 20%" value="불량 사유 추가">
                    <input type="button" class = "material" style = "width: 20%" value="불량 사유 삭제">
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
            <div class = "silde-title"><h2>불량 보고서 상세</h2></div>
            <div class = "slide-id">불량 보고서 ID: ${P0603_ErrorDTO.defect_reason_id}</div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th>검사 ID</th>
                        <th>검사일</th>
                        <th>검사 대상</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-type = "select">${P0603_ErrorDTO.inspection_result_id}</td>
                            <td data-type = "date">${P0603_ErrorDTO.inspection_result_date}</td>
                            <td data-type = "select">${P0603_ErrorDTO.stock_id}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th>불량 사유명</th>
                        <th>폐기 여부</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${P0603_ErrorDTO.defect_reason}</td>
                            <td data-type = "select">${P0603_ErrorDTO.defect_exhaust}</td>
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