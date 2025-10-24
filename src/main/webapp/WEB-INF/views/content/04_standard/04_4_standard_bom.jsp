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
    <script>
        const contextPath = '${pageContext.request.contextPath}';
        // 품목 목록을 JSON 형식으로 js 변수에 저장하려고 작성
        const allItemsJson = `${materialListJson}`; 
        const allProJson = `${proListJson}`;
    </script>
    <script src="${pageContext.request.contextPath}/resources/js/common.js" defer></script>
    <script src="${pageContext.request.contextPath}/resources/js/04_4_bom.js" defer></script>
</head>
<body>
    <div class = "title"><h1>BOM 관리</h1></div>
   	<c:url var="/bomlist" value="/bomlist"/> <%-- 모든 내부 링크의 기준 URL(중복 /mes/mes 방지) 이거 떄믄에 한시간.... --%>
	<c:set var="selfPath" value="/bomlist"/> <%-- c:url value에 사용할 경로 문자열 --%>
    <form class = "filter" method="get" action="${pageContext.request.contextPath}/bomlist">
        <div class = "filter-item-box">
            <div class = "filter-item">
                <div class = "filitem-name">· 재료명</div>
                <div class = "filitem-input">
                    <c:set var="filter.material_item_name" value="${param.material_item_name}" />
                    <input type = "text" name = "material_item_name" placeholder="재료명을 입력해주세요" value = "${filter.bom_id}">
                </div>
            </div>
            <div class = "filter-item">
                <div class = "filitem-name">· 품목명</div>
                <div class = "filitem-input">
                    <c:set var="filter.product_item_name" value="${param.product_item_name}" />
                    <input type = "text" name = "product_item_name" placeholder="품목명을 입력해주세요" value = "${filter.item_id}">   
                </div>
            </div>
            <!-- <div class = "filter-item"></div> -->
        </div>
        <div class = "filter-btn">
            <input type="hidden" name="page" value="1"/> <%-- 조회 시 항상 1페이지부터 --%>
            <input type="hidden" name="size" value="${pagePerRows != null ? pagePerRows : 10}"/> <%-- 현재 Rows 유지 --%>
            <input type = "submit" class = "fil-btn" value="조회">
        </div>
    </form>
    <div class = "table">
        <!-- <table>
            <thead>
                <tr>
                    <th class = "chkbox"><input type="checkbox" id="chkAll"></th>
                    <th class = "id">BOM ID</th>
                    <th class = "id">품목 ID</th>
                    <th class = "type">분류</th>
                    <th style="width: 20%;">소요량</th>
                </tr>
            </thead>
            <tbody>
            	<c:if test="${empty list}">
					<tr>
                        <td><input type="checkbox" class="rowChk" disabled></td>
						<td colspan="5" style="width: 100%;"> 조회 내역이 없습니다.</td>
					</tr>
				</c:if>
				<c:if test="${not empty list}">
					<c:forEach var="P0404_BOMDTO" items="${list}">
		                <tr data-id="${P0404_BOMDTO.bom_id}">
		                    <td><input type="checkbox" class="rowChk" name = "delete_bom_id" value="${P0404_BOMDTO.bom_id}"></td>
		                    <td>${P0404_BOMDTO.bom_id}</td>
		                    <td>${P0404_BOMDTO.item_id}</td>
		                    <td>${P0404_BOMDTO.item_div}</td>
		                    <td>${P0404_BOMDTO.bom_amount}</td>
		                </tr>
		            </c:forEach>
                </c:if>
            </tbody>
        </table> -->
        <table>
            <thead>
                <tr>
                    <th class = "chkbox"><input type="checkbox" id="chkAll"></th>
                    <th>목표 품목 ID</th>
                    <th>목표 품목명</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <c:if test="${empty list}">
                        <tr>
                            <td><input type="checkbox" class="rowChk" disabled></td>
                            <td colspan="5"> 조회 내역이 없습니다.</td>
                        </tr>
                    </c:if>
                    <c:if test="${not empty list}">
                        <c:forEach var="P0404_BOMDTO" items="${list}">
                            <tr data-id="${P0404_BOMDTO.product_item_id}" class="product-row">
                                <td><input type="checkbox" class="rowChk" name="delete_item_id" value="${P0404_BOMDTO.product_item_id}"></td>
                                <td>${P0404_BOMDTO.product_item_id}</td>
                                <td>${P0404_BOMDTO.product_item_name}</td>
                            </tr>
                        </c:forEach>
                    </c:if>                    
                </tr>
            </tbody>
        </table>
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
	
        <form id="sizeForm" method="get" action="${pageContext.request.contextPath}/bomlist" style="display:inline-block; margin-right:8px;">
            <input type="hidden" name="page" value="1"/> <%-- Rows 바꾸면 1페이지로 --%>
            <input type="hidden" name="bom_id" value="${fn:escapeXml(param.bom_id)}"/> <%-- 기존 필터 유지 --%>
            <input type="hidden" name="item_div" value="${fn:escapeXml(param.item_div)}"/>
            <input type="hidden" name="item_id" value="${fn:escapeXml(param.item_id)}"/>

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
                    <c:param name="bom_id" value="${param.bom_id}"/> <%-- 필터 유지 --%>
                    <c:param name="item_div" value="${param.item_div}"/>
                    <c:param name="item_id" value="${param.item_id}"/>
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
                <c:param name="bom_id" value="${param.bom_id}"/>
                <c:param name="item_div" value="${param.item_div}"/>
                <c:param name="item_id" value="${param.item_id}"/>
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
                    <c:param name="bom_id" value="${param.bom_id}"/>
                    <c:param name="item_div" value="${param.item_div}"/>
                    <c:param name="item_id" value="${param.item_id}"/>
                </c:url>
                <a class="page-link" href="${nextBlockUrl}">다음</a> <%-- 클릭 시 11, 21, … --%>
            </c:when>
            <c:otherwise>
                <span class="page-link disabled">다음</span> <%-- 다음 블록 없으면 비활성 --%>
            </c:otherwise>
        </c:choose>
    </div>    
    <!-- 하단 버튼 영역-->
    <div class = "bottom-btn">
        <c:if test="${sessionScope.role != 'STAFF'}">
            <div class = "bottom-btn-box">
                <input type = "button" class = "btm-btn new" value="신규">
                <input type = "button" class = "btm-btn del" value="삭제">
            </div>
        </c:if>
        <c:if test="${sessionScope.role == 'STAFF'}"></c:if>
    </div>
    <div class = "slide" id = "slide-input">
        <button class="slide-close-btn">✕</button>
        <form class = "slide-contents">
            <div class = "silde-title"><h2 id="slide-title">BOM 등록</h2></div>
            <div class = "slide-id" id="stock-id-show" style = "display: none">
                목표 품목 ID: <span id="item-id-val"></span>
                <input type="hidden" id="input_item_id" name="item_id" value="">
            </div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th>목표 품목 ID</th>
                        <th>품목명</th>
                    </thead>
                    <tbody>
                        <tr>
                            <div style = "font-size:0.8em; color: red; margin-bottom: 10px;">목표 품목명을 입력 후, ID를 선택해주세요.</div>
                            <td>
                                <select size = "1" style = "width: 100%;" disabled>
                                        <option value = "">품목 ID를 선택해주세요</option>
                                </select>
                            </td>
                            <td><input type = "text" placeholder = "품목명을 입력해주세요" style = "width: 100%;"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb">
                <div style = "font-size:0.8em; color: red; margin-bottom: 10px;">재료 분류를 선택하고 품목명을 입력 후, ID를 선택해주세요.</div>
                <table id = "bomLists">
                    <thead>
                        <th></th>
                        <th>분류</th>
                        <th class = "name">재료 품목명</th>
                        <th class = "id">재료 품목 ID</th>
                        <th class = "gb">소요량</th>
                    </thead>
                    <tbody>
                        <tr class = "initial-row">
                            <td class = "chkbox"><input type="checkbox" class="rowChk existingDefectChk" name = "delete_bom_id" value=""></td>
                            <td>
                                <select name = "bomDivList" class = "input_bom_div" size="1">
                                    <option value = "" selected>분류 선택</option>
                                    <option value = "도서" selected>도서</option>
                                    <option value = "포장지">포장지</option>
                                </select>
                            </td>
                            <td>
                                <input type = "text" name = "bomNameList" class="input_bom_name" placeholder = "품목명을 입력해주세요" disabled>
                            </td>
                            <td>
                                <select name = "bomItemList" class="input_bom_item" size = "1" style = "width: 100%;" disabled>
                                        <option value = "" selected>품목 ID 선택</option>
                                        <%-- <c:if test="${not empty list}">
                                            <c:forEach var="ma" items="${materialList}">
                                                <option 
                                                    value = "${ma.material_item_id}"
                                                    data-div = "${ma.material_item_div}"
                                                    data-name="${ma.material_item_name}">
                                                    ${ma.material_item_id} - ${ma.material_item_name}
                                                </option>
                                            </c:forEach>
                                        </c:if>     --%>
                                </select>
                            </td>
                            <td><input type = "number" name = "bomAmountList" class = "input_bom_amount"></td>
                        </tr>
                    </tbody>
                </table>
                <div class = "slide-tb-btnbox">
                    <input type="button" class = "material" id="addD" value="재료 추가">
                    <input type="button" class = "material" id="delD" value="재료 삭제">
                </div>
            </div>
            <div class = "slide-btnbox">
                <input type = "button" class = "submit-btn slide-btn" value = "등록">
                <input type = "button" class = "close-btn slide-btn" value = "취소">
            </div>
        </form>
    </div>
    <div class = "slide" id = "slide-detail">
        <!-- 슬라이드 닫힘 버튼! 이 자리에 넣어주고, 슬라이드 전체가 클래스명이 slide로 되어 있는지 확인.
        common css, js 이미 추가해서 이것만 넣으면 ㅇㅋ-->
        <button class="slide-close-btn">✕</button>
        <div class = "slide-contents">
            <div class = "silde-title"><h2>BOM 상세</h2></div>
            <div class = "slide-id">목표 품목 ID: <span id="detail-product-id"></span></div>
            <div class = "slide-tb">
                <table>
                    <thead>
                        <th>목표 품목 ID</th>
                        <th>품목명</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td id="detail-product-item-id"></td>
                            <td id="detail-product-item-name"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class = "slide-tb" style="overflow-x: hidden; overflow-y: scroll;">
                <table>
                    <thead>
                        <th>재료 품목 ID</th>
                        <th>품목명</th>
                        <th>분류</th>
                        <th>소요량</th>
                    </thead>
                    <tbody id="bom-detail-tbody">
                        <!-- <tr>
                            <td><input type="checkbox"></td>
                            <td data-type = "select">2</td>
                            <td>2</td>
                            <td data-type = "select">2</td>
                            <td>2</td>
                        </tr>
                        <tr>
                            <td><input type="checkbox"></td>
                            <td data-type = "select">2</td>
                            <td>2</td>
                            <td data-type = "select">2</td>
                            <td>2</td>
                        </tr> -->
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