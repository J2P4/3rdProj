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
    <title>J2P4</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/main.css">
    <script>window.contextPath='${pageContext.request.contextPath}';</script>
    
    <script src="${pageContext.request.contextPath}/resources/js/main.js"></script>
</head>
<body>
  <div class="up">
    <!-- 생산 현황 -->
    <section class="card">
      <header class="card__head">
        <h2 class="card__title">생산 현황</h2>
        <a href="${pageContext.request.contextPath}/cplist" class="card__more">+ 더보기</a>
      </header>

      <div class="kpi-list">
        <div class="kpi kpi--total">
          <div class="kpi__label">총 생산량(단위 : 개)</div>
          <strong class="kpi__value" id="kpiTotal">15,251</strong>
        </div>

        <div class="kpi kpi--goal">
          <div class="kpi__label">목표 달성률(%)</div>
          <strong class="kpi__value" id="kpiGoal">89.6%</strong>
        </div>

        <div class="kpi kpi--error">
          <div class="kpi__label">누적 불량 수(단위 : 개)</div>
          <strong class="kpi__value" id="kpiError">300</strong>
        </div>
      </div>
    </section>

    <!-- 재고 현황 -->
    <section class="card">
      <header class="card__head">
        <h2 class="card__title">재고 현황</h2>
        <a href="${pageContext.request.contextPath}/stocklist" class="card__more">+ 더보기</a>
      </header>

      <div class="chart">
      </div>
    </section>
  </div>

  <!-- 게시판 -->
  <section class="board card">
    <header class="card__head">
      <h2 class="card__title">게시판</h2>
      <a href="${pageContext.request.contextPath}/board" class="card__more">+ 더보기</a>
    </header>

    <table class="board__table">
      <tr><td>[안내] 2025년 하반기 생산 목표 공지</td></tr>
      <tr><td>[긴급] 라인2 설비 점검 일정 변경</td></tr>
      <tr><td>[공지] 안전 수칙 교육 일정 안내</td></tr>
      <tr><td>[안내] 2025년 작업 규칙 공지</td></tr>
      <tr><td>[공지] 불량품 처리 방법 변경 안내</td></tr>
    </table>
  </section>

</body>
</html>