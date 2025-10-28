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
    <title>품질 검사 < 품질 관리 < J2P4</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css" type="text/css">
    <script>
        const contextPath = '${pageContext.request.contextPath}';
        // 품목 목록을 JSON 형식으로 js 변수에 저장하려고 작성
        const stockListJson = `${stockListJson}`; 
    </script>    
    <script src="${pageContext.request.contextPath}/resources/js/common.js" defer></script>
    <script src="${pageContext.request.contextPath}/resources/js/06_1_inins.js" defer></script>
</head>
<body>
    <div class = "title"><h1>품질 검사</h1></div>
   	<c:url var="/inInslist" value="/inInslist"/> <%-- 모든 내부 링크의 기준 URL(중복 /mes/mes 방지) 이거 떄믄에 한시간.... --%>
	<c:set var="selfPath" value="/inInslist"/> <%-- c:url value에 사용할 경로 문자열 --%>
    <form class = "filter" method="get" action="${pageContext.request.contextPath}/inInslist">
        <div class = "filter-item-box">
            <div class = "filter-item" >
                <div class = "filitem-name" style = "width: 115px;">· 결과 ID</div>
                <div class = "filitem-input" style = "width: 60%;">
                    <input type = "text" name = "inspection_result_id" placeholder = "검사 결과 id를 입력해주세요" value="${filter.inspection_result_id}">
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name" style = "width: 115px;">· 품명</div>
                <div class = "filitem-input" style = "width: 60%;">
                    <input type = "text" name = "item_name" placeholder = "품명을 입력해주세요" value="${filter.item_name}">
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name" style = "width: 115px;">· 검사일</div>
                <div class = "filitem-input">
                    <input type = "date" style = "width: 110px; padding: 2px;" name="fromDate" id="fromDate" value="${param.fromDate}">
                    <span class="tilde">~</span>
                    <input type = "date" style = "width: 110px; padding: 2px;" name="toDate" id="toDate" value="${param.toDate}">
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name" style = "width: 115px;">· 검사 유형</div>
                <div class = "filitem-input">
                    <select name = "inspection_type" size = "1" style = "width: 130px; padding: 2px;">
                        <option value = "" selected>전체</option>
                        <option value = "0">입고</option>
                        <option value = "1">출고</option>
                    </select>
                </div>
            </div>
        </div>
        <div class = "filter-btn">
            <input type="hidden" name="page" value="1"/> <%-- 조회 시 항상 1페이지부터 --%>
            <input type="hidden" name="size" value="${pagePerRows != null ? pagePerRows : 10}"/> <%-- 현재 Rows 유지 --%>
            <input type = "submit" class = "fil-btn" value="조회">
        </div>
    </form>
    <div class = "table">
        <table>
            <thead>
                <tr>
                    <th class = "chkbox"><input type="checkbox" id="chkAll"></th>
                    <th style = "width: 25%;">검사 결과 ID</th>
                    <th>검사 유형</th>
                    <th style = "width: 25%;">검사일</th>
                    <th class = "gb">양품 수</th>
                    <th class = "gb">불량 수</th>
                </tr>
            </thead>
            <tbody>
           		<c:if test="${empty list}">
					<tr>
                        <td><input type="checkbox" class="rowChk" disabled></td>
						<td colspan="6"> 조회 내역이 없습니다.</td>
					</tr>
				</c:if>
				<c:if test="${not empty list}">
					<c:forEach var="P0601_InInsDTO" items="${list}">
		                <tr data-id="${P0601_InInsDTO.inspection_result_id}">
		                    <td class = "chkbox"><input type="checkbox" name="delete_InIns_id" value="${P0601_InInsDTO.inspection_result_id}" class="rowChk"></td>
		                    <td style = "width: 25%;">${P0601_InInsDTO.inspection_result_id}</td>
                            <td style = "width: 20%;">
                                <c:choose>
                                    <c:when test="${P0601_InInsDTO.inspection_type == 0}">
                                        입고
                                    </c:when>
                                    <c:when test="${P0601_InInsDTO.inspection_type == 1}">
                                        출고
                                    </c:when>
                                    <c:otherwise>
                                        -
                                    </c:otherwise>
                                </c:choose>
                            </td>
		                    <td style = "width: 25%;">${P0601_InInsDTO.inspection_result_date}</td>
		                    <td class = "gb">${P0601_InInsDTO.inspection_result_good}</td>
		                    <td class = "gb">${P0601_InInsDTO.inspection_result_bad}</td>
		                </tr>
	                </c:forEach>
	            </c:if>
            </tbody>
        </table>
    </div>
    <div class = "bottom-btn">
        <c:if test="${sessionScope.role != 'STAFF'}">
            <div class = "bottom-btn-box">
                <input type = "button" class = "btm-btn del" value="삭제">
                <input type = "button" class = "btm-btn new" value="신규">
            </div>
        </c:if>
		<c:if test="${sessionScope.role == 'STAFF'}">
		    <!-- STAFF는 조회만 가능 -->
		    <!-- 버튼 없음 -->
		</c:if>
    </div>
    <!-- 현재 페이지 유지 -->
    <input type="hidden" name="page" value="${page}">
    <input type="hidden" name="size" value="${pagePerRows}">
    <div class = "page">
        <c:if test="${empty page}"><c:set var="page" value="1"/></c:if> <%-- 현재 페이지 기본 1 --%>
        <c:if test="${empty pagePerRows}"><c:set var="pagePerRows" value="10"/></c:if> <%-- Rows 기본 10 --%>
        <c:if test="${empty totalPages}"><c:set var="totalPages" value="1"/></c:if> <%-- 총페이지 기본 1 --%>
        <c:if test="${empty startPage}"><c:set var="startPage" value="1"/></c:if> <%-- 블록 시작 기본 1 --%>
        <c:if test="${empty endPage}"><c:set var="endPage" value="${totalPages}"/></c:if> <%-- 블록 끝 기본 총페이지 --%>
	
        <form id="sizeForm" method="get" action="${pageContext.request.contextPath}/inInslist" style="display:inline-block; margin-right:8px;">
            <input type="hidden" name="page" value="1"/> <%-- Rows 바꾸면 1페이지로 --%>
            <input type="hidden" name="inspection_result_id" value="${fn:escapeXml(param.inspection_result_id)}"/> 
            <input type="hidden" name="item_name" value="${fn:escapeXml(param.item_name)}"/> 
            <input type="hidden" name="fromDate" value="${fn:escapeXml(param.fromDate)}"/> 
            <input type="hidden" name="toDate" value="${fn:escapeXml(param.toDate)}"/>
            <input type="hidden" name="inspection_type" value="${fn:escapeXml(param.inspection_type)}"/>

            <label>Rows:
                <select name="size" onchange="document.querySelector('#sizeForm').submit()">
                    <option value="1" ${pagePerRows==1 ? 'selected' : ''}>1</option> <%-- 1행 보기(블록 전환 테스트에 유용) --%>
                    <option value="10" ${pagePerRows==10 ? 'selected' : ''}>10</option>
                    <option value="20" ${pagePerRows==20 ? 'selected' : ''}>20</option>
                    <option value="50" ${pagePerRows==50 ? 'selected' : ''}>50</option>
                    <option value="100" ${pagePerRows==100 ? 'selected' : ''}>100</option>
                </select>
            </label>
        </form>

        <c:choose>
            <c:when test="${hasPrevBlock}"> <%-- 이전 블록이 있으면 링크 활성 --%>
                <c:url var="prevBlockUrl" value="${selfPath}"> <%-- /list 에 파라미터 조합 --%>
                    <c:param name="page" value="${prevBlockStart}"/> <%-- 이전 블록 첫 페이지로 이동 --%>
                    <c:param name="size" value="${pagePerRows}"/> <%-- Rows 유지 --%>
                    <c:param name="inspection_result_id" value="${param.inspection_result_id}"/> <%-- 필터 유지 --%>
                    <c:param name="fromDate" value="${param.fromDate}"/>   <c:param name="toDate" value="${param.toDate}"/>
                    <c:param name="item_name" value="${param.item_name}"/>
                    <c:param name="inspection_type" value="${param.inspection_type}"/>
                </c:url>
                <a class="page-link" href="${prevBlockUrl}">이전</a> <%-- 클릭 시 이전 블록 시작으로 --%>
            </c:when>
            <c:otherwise>
                <span class="page-link disabled">이전</span> <%-- 이전 블록이 없으면 비활성 --%>
            </c:otherwise>
        </c:choose>
	
        <c:forEach var="p" begin="${startPage}" end="${endPage}">
            <c:url var="pUrl" value="${selfPath}"> <%-- 각 페이지 숫자 링크 --%>
                <c:param name="page" value="${p}"/>
                <c:param name="size" value="${pagePerRows}"/>
                <c:param name="inspection_result_id" value="${param.inspection_result_id}"/>
                <c:param name="fromDate" value="${param.fromDate}"/>   <c:param name="toDate" value="${param.toDate}"/>
                <c:param name="item_name" value="${param.item_name}"/>
                <c:param name="inspection_type" value="${param.inspection_type}"/>
            </c:url>
            <c:choose>
                <c:when test="${p == page}">
                    <span class="page-link current"><strong>${p}</strong></span> <%-- 현재 페이지는 강조(링크 X) --%>
                </c:when>
                <c:otherwise>
                    <a class="page-link" href="${pUrl}">${p}</a> <%-- 다른 페이지는 링크 --%>
                </c:otherwise>
            </c:choose>
        </c:forEach>
	
        <c:choose>
            <c:when test="${hasNextBlock}">
                <c:url var="nextBlockUrl" value="${selfPath}">
                    <c:param name="page" value="${nextBlockStart}"/> <%-- 다음 블록 시작 페이지 --%>
                    <c:param name="size" value="${pagePerRows}"/>
                    <c:param name="inspection_result_id" value="${param.inspection_result_id}"/>
                    <c:param name="fromDate" value="${param.fromDate}"/>   <c:param name="toDate" value="${param.toDate}"/>
                    <c:param name="item_name" value="${param.item_name}"/>
                    <c:param name="inspection_type" value="${param.inspection_type}"/>
                </c:url>
                <a class="page-link" href="${nextBlockUrl}">다음</a> <%-- 클릭 시 11, 21, … --%>
            </c:when>
            <c:otherwise>
                <span class="page-link disabled">다음</span> <%-- 다음 블록 없으면 비활성 --%>
            </c:otherwise>
        </c:choose>
    </div>
    
    <div class = "slide" id = "slide-input">
        <button class="slide-close-btn">✕</button>
        <form class = "slide-contents" id="inInsInsertForm">
            <div class = "silde-title"><h2 id="slide-title">품질 검사 등록</h2></div>
            <div class = "slide-id" id="inIns-id-show" style = "display: none">
                품질 검사 ID: <span id="inIns-id-val"></span>
                <input type="hidden" id="input_inIns_id" name="inspection_result_id" value="">
            </div>
        <div class = "slide-tb">
            <div style="font-size:0.8em; color: red; margin-bottom: 10px;">검사 품목 분류 선택 후, 품목 데이터를 입력해주세요.</div>
                <table>
                    <thead>
                        <th>검사 품목 분류</th>
                        <th>검사 품목명</th>
                        <th>담당 사원</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select name = "item_div" size = "1" id = "input_item_div">
                                    <option value="" selected>품목 분류 선택</option>
                                    <option value="도서">도서</option>
                                    <option value="포장지">포장지</option>
                                    <option value="완제품">완제품</option>
                                </select>
                            </td>
                            <td>
                                <select name = "stock_id" size = "1" id = "input_stock_id" readonly>
                                    <option value="" selected>검사 품목 선택</option>
                                    <!-- <c:forEach var="stock" items="${stockList}">
                                        <option
                                            value="stock.stock_id"
                                            data-id="${stock.stock_id}"
                                            data-name="${stock.item_name}">
                                            ${stock.stock_id} - ${stock.item_name}
                                        </option>
                                    </c:forEach> -->
                                </select>
                            </td>
                            <td>
                                <select name = "worker_id" size = "1" id = "input_worker_name">
                                    <option value="" selected>담당자 선택</option>
                                    <c:forEach var="worker" items="${wnlist}">
                                        <option value="${worker.worker_id}" data-name = "${worker.worker_name}">
                                            ${worker.worker_id} - ${worker.worker_name}
                                        </option>
                                    </c:forEach>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th>검사일</th>
                        <th>양품 수</th>
                        <th>불량 수</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <input type = "date" id="input_inIns_date">
                            </td>
                            <td>
                                <input type = "number" id="input_inIns_good" placeholder="양품 수를 입력해주세요">
                            </td>
                            <td>
                                <input type = "number" id="input_inIns_bad" placeholder="총 불량 수 확인(조회용)" readonly = "readonly">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb" id = "defect-report" style = "margin-bottom: 100px;">
                <table>
                    <thead>
                        <th class = "chkbox"><input type="checkbox" id="chkAllDefect"></th>
                        <th>불량 사유명</th>
                        <th>불량 수량</th>
                        <th>폐기 여부</th>
                    </thead>
                    <tbody>
                        <tr class="initial-row">
                            <td class = "chkbox"><input type="checkbox" class="rowChk existingDefectChk" name = "delete_defect_id" value=""></td>
                            <td>
                                <input type = "text" name = "defectReasonList" class="defect_reason">
                            </td>
                            <td>
                                <input type = "number" name = "defectAmountList" class="defect_amount">
                            </td>
                            <td>
                                <select name = "defectExhaustList" class="input_defect_exhaust" size="1">
                                    <option value = "">폐기 여부 선택</option>
                                    <option value = "0">폐기</option>
                                    <option value = "1">재검사</option>
                                    <option value = "2">재작업</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class = "slide-tb-btnbox">
                    <input type="button" class = "material" id="addD" style = "width: 20%" value="불량 사유 추가">
                    <input type="button" class = "material" id="delD" style = "width: 20%" value="불량 사유 삭제">
                </div>
            </div>
            <div class = "slide-btnbox">
                <input type = "button" class = "close-btn slide-btn" value = "취소">
                <input type = "button" class = "submit-btn slide-btn" value = "등록">
            </div>
        </form>
    </div>
    <div class = "slide" id = "slide-detail">
        <button class="slide-close-btn">✕</button>
        <div class = "slide-contents">
            <div class = "silde-title"><h2>품질 검사 상세</h2></div>
            <div class = "slide-id">품질 검사 ID: </div>
            <div class = "slide-tb">
                <table id = "charge">
                    <thead>
                        <th>검사 품목 ID</th>
                        <th>검사 품목명</th>
                        <th>담당 사원</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-type = "select"></td>
                            <td data-type = "select"></td>
                            <td data-type = "select"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb">
                <table id = "inspectionInfo">
                    <thead>
                        <th>검사일</th>
                        <th>양품 수</th>
                        <th>불량 수</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-type = "date"></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb" id = "defect-info">
                <table>
                    <thead>
                        <th>불량 사유명</th>
                        <th>불량 수량</th>
                        <th>폐기 여부</th>
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
            <div class = "slide-btnbox">
                <input type = "button" class = "close-btn slide-btn" value = "취소">
                <input type = "button" class = "slide-btn" id="detailEditBtn" value = "수정">
            </div>
        </div>
    </div>
</body>
</html>