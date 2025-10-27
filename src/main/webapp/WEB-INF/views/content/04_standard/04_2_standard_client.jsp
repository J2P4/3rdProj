<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%> 
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> 
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %> 
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %> 
<%
    // 오늘 날짜를 문자열로 만들어 EL에서 쓸 수 있게 request에 넣음
    String todayStr = new java.text.SimpleDateFormat("yyyy-MM-dd").format(new java.util.Date());
    request.setAttribute("todayStr", todayStr);
%>

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<c:url var="cssUrl" value="/resources/css/common.css"/>
<c:url var="jsUrl" value="/resources/js/common.js"/>
<link rel="stylesheet" href="${cssUrl}" type="text/css">
<script src="${jsUrl}"></script>
<script>const contextPath='${pageContext.request.contextPath}';</script>
<c:url var="clientJs" value="/resources/js/04_2_client.js"/>
<script src="${clientJs}" defer></script>

<title>거래처 리스트</title>
</head>
<body>
<div class = "title"><h1>거래처 관리</h1></div>

<c:url var="clientlistUrl" value="/clientlist"/>
<c:set var="selfPath" value="/clientlist"/>

<form class="panel" method="get" action="${clientlistUrl}">
    <div class="filter">
        <div class="filter-item-box">
            <div class="filter-item" style = "width: 100%;">
                <div class="filitem-name" style = "width: 150px;">· 사업자등록번호</div>
                <div class="filitem-input">
                    <input type="text" name="client_id" value="${fn:escapeXml(param.client_id)}">
                </div>
            </div>

            <div class="filter-item" style = "width: 100%;">
                <div class="filitem-name" style = "width: 150px;">· 거래처 이름</div>
                <div class="filitem-input">
                    <input type="text" name="clientName" value="${fn:escapeXml(param.clientName)}">
                </div>
            </div>
        </div>

        <div class="filter-btn">
            <input type="hidden" name="page" value="1"/>
            <input type="hidden" name="size" value="${pagePerRows != null ? pagePerRows : 10}"/>
            <input type="submit" class="fil-btn" value="조회">
        </div>
    </div>
</form>

<div class="table">
    <table>
        <thead>
            <tr>
                <th class="chkbox"><input type="checkbox" id="chkAll"></th>
                <th>사업자 등록번호</th>
                <th>거래처 이름</th>
                <th>거래처 전화번호</th>
                <th>담당사원 ID</th>
            </tr>
        </thead>
        <tbody>
            <c:choose>
                <c:when test="${not empty list}">
                    <c:forEach var="row" items="${list}">
                        <tr data-id="${row.client_id}">
                            <td class="chkbox"><input type="checkbox" class="rowChk" value="${row.client_id}"></td>
                            <td>${fn:escapeXml(row.client_id)}</td>
                            <td>${fn:escapeXml(row.client_name)}</td>
                            <td>${fn:escapeXml(row.client_tel)}</td>           
                            <td>${fn:escapeXml(row.worker_id)}</td>
                        </tr>
                    </c:forEach>
                </c:when>
                <c:otherwise>
                    <c:forEach var="i" begin="1" end="10">
                        <tr aria-hidden="true">
                            <td class="chkbox"><input type="checkbox" name="rowChk" disabled aria-hidden="true"></td>
                            <td>&nbsp;</td><td></td><td></td><td class="col-qty"></td>
                        </tr>
                    </c:forEach>
                </c:otherwise>
            </c:choose>
        </tbody>
    </table>
</div>
<div class="bottom-btn">
	<div class = "bottom-btn-box">
        <input type="button" id="btnDelete" class="btm-btn del" value="삭제">
        <input type="button" class="btm-btn new" value="신규" id="btnNew">
	</div>
</div>
	<!-- 현재 페이지 유지 -->
    <input type="hidden" name="page" value="${page}">
    <input type="hidden" name="size" value="${pagePerRows}">
    <div class="page">

        <c:if test="${empty page}"><c:set var="page" value="1"/></c:if>
        <c:if test="${empty pagePerRows}"><c:set var="pagePerRows" value="10"/></c:if>
        <c:if test="${empty totalPages}"><c:set var="totalPages" value="1"/></c:if>
        <c:if test="${empty startPage}"><c:set var="startPage" value="1"/></c:if>
        <c:if test="${empty endPage}"><c:set var="endPage" value="${totalPages}"/></c:if>

        <form id="sizeForm" method="get" action="${clientlistUrl}" style="display:inline-block; margin-right:8px;">
            <input type="hidden" name="page" value="1"/>
            <input type="hidden" name="client_id" value="${fn:escapeXml(param.client_id)}"/>
            <input type="hidden" name="clientName" value="${fn:escapeXml(param.clientName)}"/>

            <label>Rows:
                <select name="size" onchange="document.getElementById('sizeForm').submit()">
                    <option value="1"  ${pagePerRows==1 ? 'selected' : ''}>1</option>
                    <option value="10" ${pagePerRows==10 ? 'selected' : ''}>10</option>
                    <option value="20" ${pagePerRows==20 ? 'selected' : ''}>20</option>
                    <option value="50" ${pagePerRows==50 ? 'selected' : ''}>50</option>
                    <option value="100" ${pagePerRows==100 ? 'selected' : ''}>100</option>
                </select>
            </label>
        </form>

        <c:choose>
            <c:when test="${hasPrevBlock}">
                <c:url var="prevBlockUrl" value="${selfPath}">
                    <c:param name="page" value="${prevBlockStart}"/>
                    <c:param name="size" value="${pagePerRows}"/>
                    <c:param name="client_id" value="${param.client_id}"/>
                    <c:param name="clientName" value="${param.clientName}"/>
                </c:url>
                <a class="page-link" href="${prevBlockUrl}">이전</a>
            </c:when>
            <c:otherwise>
                <span class="page-link disabled">이전</span>
            </c:otherwise>
        </c:choose>

        <c:forEach var="p" begin="${startPage}" end="${endPage}">
            <c:url var="pUrl" value="${selfPath}">
                <c:param name="page" value="${p}"/>
                <c:param name="size" value="${pagePerRows}"/>
                <c:param name="client_id" value="${param.client_id}"/>
                <c:param name="clientName" value="${param.clientName}"/>
            </c:url>
            <c:choose>
                <c:when test="${p == page}">
                    <span class="page-link current"><strong>${p}</strong></span>
                </c:when>
                <c:otherwise>
                    <a class="page-link" href="${pUrl}">${p}</a>
                </c:otherwise>
            </c:choose>
        </c:forEach>

        <c:choose>
            <c:when test="${hasNextBlock}">
                <c:url var="nextBlockUrl" value="${selfPath}">
                    <c:param name="page" value="${nextBlockStart}"/>
                    <c:param name="size" value="${pagePerRows}"/>
                    <c:param name="client_id" value="${param.client_id}"/>
                    <c:param name="clientName" value="${param.clientName}"/>
                </c:url>
                <a class="page-link" href="${nextBlockUrl}">다음</a>
            </c:when>
            <c:otherwise>
                <span class="page-link disabled">다음</span>
            </c:otherwise>
        </c:choose>

    </div> 
<c:url var="deleteUrl" value="/client/delete"/>
<form id="deleteForm" method="post" action="${deleteUrl}" style="display:none;">
    <input type="hidden" name="ids" id="deleteIds">
    <input type="hidden" name="page" value="${page}">
    <input type="hidden" name="size" value="${pagePerRows}">
    <input type="hidden" name="client_id" value="${fn:escapeXml(param.client_id)}"/>
    <input type="hidden" name="clientName" value="${fn:escapeXml(param.clientName)}"/>
</form>

<!-- 입력 슬라이드 -->
<div class="slide" id="slide-input">
  <div class="slide-contents">
    <div class="silde-title"><h2>거래처 등록</h2></div>

    <div class="slide-id">거래처 ID :
      <!-- DB 트리거가 자동생성하므로 입력 필드 없음 -->
    </div>
    <div class="slide-id">거래처 이름 :
      <input type="text" name="client_name" id="client_name" form="client-insert-form" required maxlength="100">
    </div>

    <div class="slide-id">거래처 전화번호 :
      <select name="countryCode" id="countryCode" size="1" form="client-insert-form">
        <option value="+82">대한민국 (+82)</option>
        <option value="+81">일본 (+81)</option>
        <option value="+86">중국 (+86)</option>
        <option value="+84">베트남 (+84)</option>
        <option value="+60">말레이시아 (+60)</option>
        <option value="+1">미국 / 캐나다 (+1)</option>
        <option value="+56">칠레 (+56)</option>
        <option value="+57">콜롬비아 (+57)</option>
        <option value="+51">페루 (+51)</option>
        <option value="+44">영국 (+44)</option>
        <option value="+33">프랑스 (+33)</option>
        <option value="+49">독일 (+49)</option>
        <option value="+39">이탈리아 (+39)</option>
        <option value="+34">스페인 (+34)</option>
        <option value="+31">네덜란드 (+31)</option>
        <option value="+41">스위스 (+41)</option>
        <option value="+46">스웨덴 (+46)</option>
        <option value="+47">노르웨이 (+47)</option>
        <option value="+45">덴마크 (+45)</option>
        <option value="+48">폴란드 (+48)</option>
        <option value="+36">헝가리 (+36)</option>
        <option value="+420">체코 (+420)</option>
        <option value="+30">그리스 (+30)</option>
        <option value="+61">호주 (+61)</option>
        <option value="+64">뉴질랜드 (+64)</option>
      </select>
      <span> - </span>
      <input type="text" name="client_tel1" id="client_tel1" form="client-insert-form" placeholder="00000" maxlength="5" inputmode="numeric" pattern="[0-9]*">
      <span> - </span>
      <input type="text" name="client_tel2" id="client_tel2" form="client-insert-form" placeholder="00000" maxlength="5" inputmode="numeric" pattern="[0-9]*">
    </div>

    <div class="slide-id">담당사원 ID :
      <input type="text" name="worker_id" id="worker_id" form="client-insert-form" maxlength="50">
    </div>

    <!-- 전송 폼 -->
    <form id="client-insert-form" method="post" action="${pageContext.request.contextPath}/client/insert">
      <input type="hidden" name="page" value="${page}">
      <input type="hidden" name="size" value="${pagePerRows}">
      <input type="hidden" name="client_id" value="${fn:escapeXml(param.client_id)}">
      <input type="hidden" name="clientName" value="${fn:escapeXml(param.clientName)}">
      <!-- 최종 전화번호(조합값) -->
      <input type="hidden" name="client_tel" id="client_tel_final">
    </form>

    <div class="slide-btnbox">
      <input type="button" class="close-btn slide-btn" value="취소" id="btnCancel">
      <input type="button" class="slide-btn" value="등록" id="btnSubmitClient">
    </div>

  </div>
</div>

<!-- 상세 슬라이드 -->
<div class="slide" id="slide-detail">
  <div class="slide-contents">
    <div class="silde-title"><h2>거래처 상세</h2></div>

    <div class="slide-id">거래처 ID: <span id="d-client_id"></span></div>
    <div class="slide-id">거래처 이름: <span id="d-client_name"></span></div>

    <div class="slide-tb">
      <table>
        <thead>
          <tr>
            <th>거래처 ID</th>
            <th>거래처 이름</th>
            <th>전화번호</th>
            <th>담당사원</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td id="d-client_id_cell"></td>
            <td id="d-client_name_cell"></td>
            <td id="d-client_tel_cell"></td>
            <td id="d-worker_id_cell"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="slide-btnbox">
      <input type="button" class="close-btn slide-btn" value="취소" id="btnCloseDetail">
      <input type="button" class="slide-btn" value="수정" id="btnEdit">
    </div>
  </div>
</div>

<!-- 페이지 전용 스크립트 -->
<script>
(function () {
  const byId = (id) => document.getElementById(id);

  // 신규 버튼: 입력 슬라이드 열기(필요 시 CSS/JS에 맞게 토글)
  const btnNew = byId('btnNew');
  if (btnNew) btnNew.addEventListener('click', () => {
    document.getElementById('slide-input')?.classList.add('open');
  });

  // 취소 버튼: 입력 슬라이드 닫기
  const btnCancel = byId('btnCancel');
  if (btnCancel) btnCancel.addEventListener('click', () => {
    document.getElementById('slide-input')?.classList.remove('open');
  });

  // 등록 버튼: 값 조합 -> hidden 주입 -> submit
  const btnSubmit = byId('btnSubmitClient');
  const form = byId('client-insert-form');

  if (btnSubmit && form) {
    btnSubmit.addEventListener('click', function () {
      const name = byId('client_name')?.value?.trim();
      const cc   = byId('countryCode')?.value?.trim();
      const t1   = byId('client_tel1')?.value?.trim();
      const t2   = byId('client_tel2')?.value?.trim();
      const worker = byId('worker_id')?.value?.trim();

      // 필수값 검증
      if (!name) { alert('거래처 이름을 입력하세요.'); byId('client_name').focus(); return; }

      const numOnly = /^[0-9]+$/;
      if (!t1 || !numOnly.test(t1)) { alert('전화번호(중간)는 숫자만 입력하세요.'); byId('client_tel1').focus(); return; }
      if (!t2 || !numOnly.test(t2)) { alert('전화번호(끝자리)는 숫자만 입력하세요.'); byId('client_tel2').focus(); return; }

      // 최종 전화번호 조합 -> hidden 주입
      const finalTel = `${cc}-${t1}-${t2}`;
      byId('client_tel_final').value = finalTel;

      // 전송
      btnSubmit.disabled = true;
      form.submit();
    });
  }
})();
</script>

</body>
</html>
