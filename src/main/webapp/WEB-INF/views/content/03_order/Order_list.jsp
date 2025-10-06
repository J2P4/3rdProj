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
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/common.css" type="text/css">
    <script src="${pageContext.request.contextPath}/resources/js/common.js"></script>

<title>발주 리스트</title>

</head>
<body>
    <h1>발주 리스트</h1>
    
    <form class="panel" method="get" action="">
               
<!--     검색필터 -->
        <div class="filter">
            <div class="filter-item-box">
				<div class = "filter-item">
		                	<span class="filitem-name">· 발주ID</span>
		                	<div class = "filitem-input">
		              			<input type="text" name="orderNo" value="${fn:escapeXml(param.orderNo)}">
		               		 </div>
				</div>


	            <div class = "filter-item">
	                <div class = "filitem-name">· 발주일</div>
	                <div class = "filitem-input">
	                	<input type="date" name="fromDate" id="fromDate" value="${empty param.fromDate ? '' : param.fromDate}">
	                	<span class="tilde">~</span>
	                	<input type="date" name="toDate" id="toDate" value="${empty param.toDate ? todayStr : param.toDate}">
	                   
	               	 </div>
				</div>

				<div class = "filter-item">
		                	<span class="filitem-name">· 거래처</span>
		                	<div class = "filitem-input">
		              			<input type="text" name="publisher_name" value="${fn:escapeXml(param.publisher_name)}">
		               		 </div>
				</div>

          <div class="filter-item">		
                <span class="filitem-name">· 품명</span>
                	<div class = "filitem-input">
                             <input type="text" name="itemName" value="${fn:escapeXml(param.itemName)}">
               		 </div>


			</div>
		</div>
		<div class = "filter-btn">
            <input type = "submit" class = "fil-btn" value="조회">
        </div>
	</div>
    </form>

    <div class="table">
     
            <table>
                <thead>
                    <tr>
                        <th class="chkbox"><input type="checkbox" id="chkAll"></th>
                        <th>발주 ID</th>
                        <th>품명</th>
                        <th>수량</th>
                        <th>제조사</th>
                        <th>발주 담당자</th>
                        <th>발주일</th>
                    </tr>
                </thead>
                <tbody>
                    <c:choose>
                        <c:when test="${not empty orders}">
                            <c:forEach var="o" items="${orders}">
                                <tr>
                                    <td class="col-check"><input type="checkbox" name="rowChk" value="${o.id}"></td>
                                    <td>${o.id}</td>
                                    <td>
                                        <a href="${pageContext.request.contextPath}/po/detail?id=${o.id}" style="color:inherit; text-decoration:none;">${o.itemName}</a>
                                    </td>
                                    <td class="col-qty"><fmt:formatNumber value="${o.qty}" pattern="#,##0"/></td>
                                    <td>${o.maker}</td>
                                    <td>${o.owner}</td>
                                    <td><fmt:formatDate value="${o.orderDate}" pattern="yyyy-MM-dd"/></td>
                                </tr>
                            </c:forEach>
                        </c:when>
                        <c:otherwise>
                            <c:forEach var="i" begin="1" end="10">
                                <tr>
                                    <td class="col-check"><input type="checkbox" name="rowChk"></td>
                                    <td></td><td></td><td class="col-qty"></td><td></td><td></td><td></td>
                                </tr>
                            </c:forEach>
                        </c:otherwise>
                    </c:choose>
                </tbody>
            </table>
       
    </div>

    <div class="bottom-btn">
		<div class = "page"></div>
		<div class = "bottom-btn-box">
			<input type = "button" class = "btm-btn new" value = "신규">
			<input type = "button" class = "btm-btn del" value = "삭제">
			
		</div>
		
    </div>
    
    
    
    
    
        <!-- 상세용 슬라이드-->
    <div class = "slide" id = "slide-detail">
        <div class = "slide-contents">
            <div class = "silde-title"><h2>발주 상세</h2></div>
            <div class = "slide-id">발주 ID: </div>
            <div class = "date">
            	<div class="slide-id" style = "display : flex">
            		<div>발주일 <input type="date" name="orderdate" id="orderdate"></div>
            		<div>결제일 <input type="date" name="orderdate" id="orderdate"></div>
            		<div>수주일 <input type="date" name="orderdate" id="orderdate"></div>
            	</div>
            </div>
            
 
            <div class="slide-tb">
                <table>
                    <thead>
                        <tr><th>발주 상태</th><th>발주량</th><th>발주 담당자 사번</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>1</td><td>1</td><td>1</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="slide-tb">
                <table>
                    <thead>
                        <tr><th>품목 ID</th><th>품목 분류</th><th>품목 이름</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>2</td><td>2</td><td>2</td></tr>
                    </tbody>
                </table>
            </div>
            
            <div class="slide-tb">
                <table>
                    <thead>
                        <tr><th>거래처 ID</th><th>거래처 이름</th><th>거래처 담당자 사번</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>2</td><td>2</td><td>2</td></tr>
                    </tbody>
                </table>
            </div>
               
            </div>
            <div class = "slide-btnbox">
                <input type = "button" class = "slide-btn" value = "수정">
                <input type = "button" class = "close-btn slide-btn" value = "취소">
            </div>
        </div>
    </div>
    
    
    
    
    
    
    
    
    
    
    

    <!-- 등록 슬라이드 -->
    <div class="slide" id="slide-input">
        <div class="slide-contents">
            <div class="silde-title"><h2>발주 등록</h2></div>
            <div class="slide-id">발주 ID: </div>
            <div class = "date">
            	<div class="slide-id" style = "display : flex">
            		<div>발주일 <input type="date" name="orderdate" id="orderdate"></div>
            		<div>결제(예정일) <input type="date" name="orderdate" id="orderdate"></div>
            		<div>수주(예정일) <input type="date" name="orderdate" id="orderdate"></div>
            	</div>
            		  
            
            
            </div>

            <div class="slide-tb">
                <table>
                    <thead>
                        <tr><th>발주 상태</th><th>발주량</th><th>발주 담당자 사번</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>1</td><td>1</td><td>1</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="slide-tb">
                <table>
                    <thead>
                        <tr><th>품목 ID</th><th>품목 분류</th><th>품목 이름</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>2</td><td>2</td><td>2</td></tr>
                    </tbody>
                </table>
            </div>
            
            <div class="slide-tb">
                <table>
                    <thead>
                        <tr><th>거래처 ID</th><th>거래처 이름</th><th>거래처 담당자 사번</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>2</td><td>2</td><td>2</td></tr>
                    </tbody>
                </table>
            </div>

            <div class="slide-btnbox">
                <input type="button" class="slide-btn" value = "등록">
                <input type="button" class="close-btn slide-btn" value = "취소">
            </div>
        </div>
    </div>

<script>

/*일단 수정 버튼을 눌렀을때 발주 상세에서 발주 수정으로, 수정 버튼이 저장 버튼으로 바뀌면서 기능까지 바뀌어야 한다.*/
/* 전환점은 클릭 이벤트, 그리고 각각의 아이디나 상태값을 지정할수 있다면 가능할 것이다. */
 /* 
	 그럼 트리거를 만들자, 내가 어던것을 클릭햇을때 그 변화를 가져다줄
	 상태값을 만들어 주고 상태 전환을 할수 있는 함수를 구현하자
	 그 다음 그 상태값을 기반으로 기능을 분류 할수 있을거다.
	 생각해보니 상태값이 아니아도 어차피 버튼의 아아디가 다르면 기능은 달라지잖아?
	 그럼 로직을 정리하자
	 1. 행을 클릭했을떄 상세 내역이 나오게
	 
	 2. 상세 슬라이드가 나왔을때 수정을 누르면 수정 버튼이 저장 버튼으로, 제목도 상세에서 수정으로 바뀌게
	 3. 저장 버튼을 누르면 다시 상세창으로 돌아오세, 당연히 제목과 버튼도 달라져야 함
	 
	 그럼 문제점, 내가 클릭한 행에 대한 데이터를 슬라이드로 가져오는 방법 get방식?
	 해결법 ID값을 가져와서 DB에서 따로 가져오기
	 
	 그럼 그걸 수정한다음 보내는 방법은? json? ajax?
	좀더 고민해 보자
 */
// document.addEventListener('DOMContentLoaded', function(){
//   /* ===== 날짜 범위 유효성 ===== */
//   const form = document.querySelector('form.panel');
//   const from = document.getElementById('fromDate');
//   const to   = document.getElementById('toDate');


  

</script>
</body>
</html>
