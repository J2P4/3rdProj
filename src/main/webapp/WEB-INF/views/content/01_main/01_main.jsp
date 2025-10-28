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
    <script src="${pageContext.request.contextPath}/resources/js/main.js"></script>
    <script>window.contextPath='${pageContext.request.contextPath}';</script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns"></script>
</head>
<body>
  <div class="up">
    <!-- 생산 현황 -->
    <section class="card">
      <header class="card_head">
        <h2 class="card_title">생산 현황</h2>
        <a href="${pageContext.request.contextPath}/cplist" class="card_more">+ 더보기</a>
      </header>

      <div class="kpi-list">
        <div class="kpi kpi-total">
          <div class="kpi_label">총 생산량(단위 : 개)</div>
          <strong class="kpi_value" id="kpiTotal">${data.totalProduction}</strong>
        </div>

        <div class="kpi kpi-goal">
          <div class="kpi_label">목표 달성률(%)</div>
          <strong class="kpi_value" id="kpiGoal">${data.successRate}%</strong>
        </div>

        <div class="kpi kpi-error">
          <div class="kpi_label">누적 불량 수(단위 : 개)</div>
          <strong class="kpi_value" id="kpiError">${data.totalDefect}</strong>
        </div>
      </div>
    </section>
  <!-- 게시판 -->
  <section class="board card">
    <header class="card_head">
      <h2 class="card_title">게시판</h2>
      <a href="${pageContext.request.contextPath}/board" class="card_more">+ 더보기</a>
    </header>
		<table class="board_table">
            <thead>
            	<tr>
	                <th>유형</th>
	                <th>제목</th>
	                <th>작성자</th>
                </tr>
            </thead>
            <tbody>
	            <c:if test="${empty list }">
					<tr>
						<td colspan="3"> 조회 내역이 없습니다.</td>
					</tr>
				</c:if>
				<c:if test="${not empty list }">
					<c:forEach var="boardDTO" items="${list }" varStatus="b">	
						<c:if test="${b.index < 3}">		 
			                <tr>
			                    <td style="text-align: center;">${boardDTO.board_type }</td>
			                    <td>${boardDTO.board_title}</td>
			                    <td style="text-align: center;">${boardDTO.worker_id}</td>
			                </tr>
		                </c:if>
	                </c:forEach>
	            </c:if>	
            </tbody>
        </table>
    </section>
  </div>
  
    <!-- 재고 현황 -->
    <section class="card">
      <header class="card_head">
        <h2 class="card_title">수요량</h2>
        <div>
        <form action="${pageContext.request.contextPath}/main" method="get">
	        <label for="idSelect">ID 선택:</label>
			<select id="idSelect">
			</select>
        </form>
        </div>
        <a href="${pageContext.request.contextPath}/stocklist" class="card_more">+ 더보기</a>
      </header>

      <div class="chart">
      	<canvas id="dataChart"></canvas>
      </div>
    </section>

</body>
</html>