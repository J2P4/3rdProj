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

<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>
/* TailWind CSS를 보완하는 최소한의 커스텀 스타일 (주로 슬라이드 및 테이블 고정 너비용) */
.col-qty { width: 80px; }
.col-check { width: 50px; }
.slide {
    position: fixed;
    top: 0;
    right: 0;
    width: 0; /* 초기 너비 0 */
    height: 100%;
    background-color: white;
    box-shadow: -4px 0 10px rgba(0, 0, 0, 0.1);
    overflow-x: hidden;
    transition: width 0.3s ease-in-out;
    z-index: 60; 
}
.slide-contents { 
    width: 450px; /* 슬라이드 내부 콘텐츠 너비 (JS에서 #slide-input은 800px로 변경됨) */
    padding: 24px;
}
.slide.active { width: 450px; } /* 이 CSS는 #slide-detail에 적용되고, #slide-input은 JS로 제어됨 */
.slide-tb th { background-color: #f3f4f6; text-align: left; padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600; }
.slide-tb td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
.slide-tb table { width: 100%; border-collapse: collapse; }
.tilde { padding: 0 5px; color: #6b7280; }
</style>

<script>const contextPath='${pageContext.request.contextPath}';</script>
<script src="${pageContext.request.contextPath}/resources/js/03_order.js" defer></script>

<title>발주 리스트</title>
</head>
<body class="bg-gray-100 p-8">

<h1 class="text-3xl font-bold text-gray-800 mb-6">발주 리스트</h1>

<form class="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200" method="get" action="">
    <div class="flex flex-col sm:flex-row gap-x-6 gap-y-4">
        
        <div class="flex flex-wrap gap-x-6 gap-y-4 flex-grow">
            
            <div class="flex flex-col sm:flex-row sm:items-center space-x-2">
                <span class="text-sm font-medium text-gray-700 w-20 flex-shrink-0">· 발주ID</span>
                <div class="flex-grow">
                    <input type="text" name="orderNo" value="${fn:escapeXml(param.orderNo)}" placeholder="발주ID"
                           class="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center space-x-2">
                <div class="text-sm font-medium text-gray-700 w-20 flex-shrink-0">· 발주일</div>
                <div class="flex items-center space-x-2">
                    <input type="date" name="fromDate" id="fromDate" value="${empty param.fromDate ? '' : param.fromDate}"
                           class="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                    <span class="tilde">~</span>
                    <input type="date" name="toDate" id="toDate" value="${empty param.toDate ? todayStr : param.toDate}"
                           class="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center space-x-2">
                <span class="text-sm font-medium text-gray-700 w-20 flex-shrink-0">· 거래처</span>
                <div class="flex-grow">
                    <input type="text" name="publisher_name" value="${fn:escapeXml(param.publisher_name)}" placeholder="거래처명"
                           class="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center space-x-2">
                <span class="text-sm font-medium text-gray-700 w-20 flex-shrink-0">· 품명</span>
                <div class="flex-grow">
                    <input type="text" name="itemName" value="${fn:escapeXml(param.itemName)}" placeholder="품목명"
                           class="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                </div>
            </div>
        </div>

        <div class="flex-shrink-0 sm:mt-auto"> 
            <input type="submit" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-150 cursor-pointer w-24 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" value="조회">
        </div>
    </div>
</form>

<div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="col-check py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" id="chkAll" class="rounded text-indigo-600 focus:ring-indigo-500">
                    </th>
                    <th class="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">발주 ID</th>
                    <th class="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">품목 ID</th>
                    <th class="col-qty py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">수량</th>
                    <th class="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">거래처 ID</th>
                    <th class="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">발주 담당자</th>
                    <th class="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">발주일</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <c:choose>
                    <c:when test="${not empty orders}">
                        <c:forEach var="o" items="${orders}">
                            <tr class="hover:bg-gray-50 cursor-pointer" data-id="${o.order_id}">
                                <td class="col-check py-2 px-4 text-center">
                                    <input type="checkbox" name="rowChk" value="${o.order_id}" class="rounded text-indigo-600 focus:ring-indigo-500">
                                </td>
                                <td class="py-2 px-4 text-center text-sm text-gray-900">${o.order_id}</td>
                                <td class="py-2 px-4 text-center text-sm text-gray-900">${o.item_id}</td>
                                <td class="col-qty py-2 px-4 text-right text-sm text-gray-900">${o.order_amount}</td>
                                <td class="py-2 px-4 text-center text-sm text-gray-900">${o.client_id}</td>
                                <td class="py-2 px-4 text-center text-sm text-gray-900">${o.worker_id}</td>
                                <td class="py-2 px-4 text-center text-sm text-gray-900">
                                    <fmt:formatDate value="${o.order_date}" pattern="yyyy-MM-dd"/>
                                </td>
                            </tr>
                        </c:forEach>
                    </c:when>
                    <c:otherwise>
                        <c:forEach var="i" begin="1" end="10">
                            <tr aria-hidden="true" class="text-gray-400">
                                <td class="col-check py-2 px-4 text-center">
                                    <input type="checkbox" name="rowChk" disabled aria-hidden="true" class="rounded text-gray-300">
                                </td>
                                <td class="py-2 px-4 text-center text-sm">데이터 없음</td>
                                <td class="py-2 px-4 text-center text-sm"></td>
                                <td class="col-qty py-2 px-4 text-center text-sm"></td>
                                <td class="py-2 px-4 text-center text-sm"></td>
                                <td class="py-2 px-4 text-center text-sm"></td>
                                <td class="py-2 px-4 text-center text-sm"></td>
                            </tr>
                        </c:forEach>
                        <tr class="h-4">
                            <td colspan="7"></td>
                        </tr>
                    </c:otherwise>
                </c:choose>
            </tbody>
        </table>
    </div>
</div>

<div class="flex justify-between items-center mt-6">
    <div class="page flex space-x-1 text-sm">
        </div>
    
    <div class="bottom-btn-box flex space-x-3">
        <button type="button" class="btm-btn new bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            신규
        </button>
        <button type="button" class="btm-btn del bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            <svg class="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            삭제
        </button>
    </div>
</div>

<div class="slide" id="slide-detail">
    <div class="slide-contents">
        <div class="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-800">발주 상세</h2>
            <div class="text-sm font-medium text-gray-500">발주 ID: <span id="d-order_id_head" class="text-indigo-600 font-semibold"></span></div>
        </div>

        <div class="slide-tb bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <table>
                <tbody>
                    <tr>
                        <th>품목 ID</th>
                        <td id="d-item_id"></td>
                    </tr>
                    <tr>
                        <th>발주량</th>
                        <td id="d-order_amount"></td>
                    </tr>
                    <tr>
                        <th>발주일</th>
                        <td id="d-order_date"></td>
                    </tr>
                    <tr>
                        <th>결제일</th>
                        <td id="d-order_payment_date"></td>
                    </tr>
                    <tr>
                        <th>결제 예정일</th>
                        <td id="d-order_payment_duedate"></td>
                    </tr>
                    <tr>
                        <th>수주일</th>
                        <td id="d-order_receive_date"></td>
                    </tr>
                    <tr>
                        <th>수주 예정일</th>
                        <td id="d-order_receive_duedate"></td>
                    </tr>
                    <tr>
                        <th>작업자 ID</th>
                        <td id="d-worker_id"></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button type="button" class="slide-btn edit bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                수정
            </button>
            <button type="button" class="close-btn slide-btn py-2 px-4 rounded-lg font-semibold text-gray-700 bg-white border border-gray-400 hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2">
                취소
            </button>
        </div>
    </div>
</div>

<div class="slide" id="slide-input">
    <div class="slide-contents">
        <div class="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-800">발주 등록</h2>
            <div class="text-sm font-medium text-gray-500">발주 ID: <span class="text-indigo-600 font-semibold">(자동 생성)</span></div>
        </div>

        <div class="space-y-4">
            <div>
                <label for="input-item_id" class="block text-sm font-medium text-gray-700 mb-1">품목 ID</label>
                <input type="text" id="input-item_id" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div>
                <label for="input-order_amount" class="block text-sm font-medium text-gray-700 mb-1">발주량</label>
                <input type="number" id="input-order_amount" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            </div>

        <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button type="button" class="slide-btn register bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                등록
            </button>
            <button type="button" class="close-btn slide-btn py-2 px-4 rounded-lg font-semibold text-gray-700 bg-white border border-gray-400 hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2">
                취소
            </button>
        </div>
    </div>
</div>

<script>
    // JS: 슬라이드 기능 구현 및 너비 변경
    document.addEventListener('DOMContentLoaded', () => {
        const slideDetail = document.getElementById('slide-detail');
        const slideInput = document.getElementById('slide-input');
        
        // 상세 슬라이드용 상수 너비
        const DETAIL_SLIDE_WIDTH = '450px'; 
        // 등록 슬라이드용 상수 너비 (사이드바 전까지 크기 확장)
        const NEW_SLIDE_WIDTH = '800px'; 

        // 테이블 본문 선택자
        const tableBody = document.querySelector('table.min-w-full tbody'); 
        const newButton = document.querySelector('.bottom-btn-box .new');
        const registerButton = slideInput ? slideInput.querySelector('.slide-btn.register') : null;

        // --- 슬라이드 제어 함수 정의 ---
        // 슬라이드 열기/닫기 함수 (너비 제어 포함)
        const openSlide = (slideElement, width) => {
            slideElement.classList.add('active');
            // CSS transition이 적용되도록 width도 직접 설정
            slideElement.style.width = width;
            
            // 등록 슬라이드의 경우 내부 콘텐츠 너비도 맞춰줌
            if (slideElement.id === 'slide-input') {
                const contents = slideElement.querySelector('.slide-contents');
                if (contents) contents.style.width = width;
            }
        };

        const closeSlide = (slideElement) => {
            slideElement.classList.remove('active');
            slideElement.style.width = '0px'; // 닫을 때는 너비를 0으로
        };
        // --- 끝: 슬라이드 제어 함수 정의 ---


        // 상세 슬라이드 열기 (테이블 행 클릭)
        if (tableBody) { 
            tableBody.addEventListener('click', (e) => {
                const row = e.target.closest('tr[data-id]');
                // 체크박스 클릭 제외 및 유효한 행인지 확인
                if (row && !e.target.closest('.col-check')) { 
                    const orderId = row.getAttribute('data-id');
                    document.getElementById('d-order_id_head').textContent = orderId;
                    
                    // 데이터 채우기 (실제로는 서버에서 가져와야 함)
                    document.getElementById('d-item_id').textContent = row.children[2].textContent;
                    document.getElementById('d-order_amount').textContent = row.children[3].textContent;
                    document.getElementById('d-order_date').textContent = row.children[6].textContent;
                    
                    if (slideDetail) {
                        // 다른 슬라이드(등록)가 열려있으면 닫기
                        if(slideInput && slideInput.classList.contains('active')) closeSlide(slideInput);
                        openSlide(slideDetail, DETAIL_SLIDE_WIDTH);
                    }
                }
            });
        }


        // 신규 버튼 클릭 시 등록 슬라이드 열기 (확장된 너비 적용)
        if (newButton && slideInput) { 
             newButton.addEventListener('click', () => {
                // 다른 슬라이드(상세)가 열려있으면 닫기
                if(slideDetail && slideDetail.classList.contains('active')) closeSlide(slideDetail);
                openSlide(slideInput, NEW_SLIDE_WIDTH);
             });
        }
        
        // '등록' 버튼 작동 로직 (서버 요청 부분 구현 필요)
        if (registerButton) {
            registerButton.addEventListener('click', () => {
                const itemId = document.getElementById('input-item_id').value;
                const orderAmount = document.getElementById('input-order_amount').value;
                
                // 실제 서버 전송 로직이 여기에 들어가야 합니다. (AJAX 또는 Form Submit)
                console.log("=== 발주 등록 요청 데이터 ===");
                console.log("품목 ID:", itemId);
                console.log("발주량:", orderAmount);
                
                // 임시로 슬라이드 닫기 및 알림
                if(slideInput) {
                    closeSlide(slideInput);
                    alert(`발주 등록 요청: 품목 ${itemId}, 수량 ${orderAmount} (실제 서버 요청 필요)`);
                    // 성공적으로 처리 후 페이지를 리로드하거나 목록을 업데이트하는 로직 추가
                }
            });
        }

        
        // 슬라이드 닫기 버튼 이벤트
        document.querySelectorAll('.close-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const slide = e.target.closest('.slide');
                closeSlide(slide);
            });
        });
        
        // 슬라이드 외부 클릭 시 닫기
        document.addEventListener('click', (e) => {
            // 상세 슬라이드 닫기
            if (slideDetail && slideDetail.classList.contains('active') && !e.target.closest('#slide-detail') && !e.target.closest('tr[data-id]')) {
                closeSlide(slideDetail);
            }
            // 등록 슬라이드 닫기
            if (slideInput && slideInput.classList.contains('active') && !e.target.closest('#slide-input') && !e.target.closest('.bottom-btn-box .new')) {
                closeSlide(slideInput);
            }
        });
    });

</script>

</body>
</html>