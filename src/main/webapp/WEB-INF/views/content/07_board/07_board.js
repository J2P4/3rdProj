// 게시판 데이터 (샘플)
const boardData = [
    { type: '안내', title: '월간 시스템 점검 예정', content: '월간 시스템 점검 예정 안내입니다.', authorId: 'N24020202', date: '2024-10-20' },
    { type: '공유', title: '새로운 롤모델 교육 자료 공유', content: '새로운 롤모델 교육 자료 공유입니다.', authorId: 'N24010101', date: '2024-10-19' },
    // **이전 요청에 따라 제목이 수정된 부분**
    { type: '자유', title: '이번 주 가장 힘들었던 공정은 무엇이었는지 자유롭게 의견을 나눠보세요.', content: '이번 주 힘들었던 공정에 대한 자유로운 의견 공유입니다.', authorId: 'N24100910', date: '2024-10-18' },
    { type: '자유', title: '현장 작업 시 필요한 개인 보호 장비 개선 건의', content: '현장 작업 시 개인 보호 장비 개선에 대한 건의 사항입니다.', authorId: 'N24100856', date: '2024-10-17' },
    { type: '공유', title: '품질 불량률 10% 감소 달성! 공정 개선 아이디어 제안', content: '품질 불량률 감소를 위한 공정 개선 아이디어 제안 상세 내용입니다.', authorId: 'N24091531', date: '2024-10-16' },
    { type: '자유', title: '공장 물류센터 자동화 로봇 이용 공모합니다!', content: '공장 물류센터 자동화 로봇 이용에 대한 아이디어 공모 안내입니다.', authorId: 'N24100574', date: '2024-10-15' },
    { type: '안내', title: '4분기 공정별 안전 교육 의무 이수 대상자 명단 공지', content: '4분기 공정별 안전 교육 의무 이수 대상자 명단 및 일정에 대한 공지입니다.', authorId: 'N24090120', date: '2024-10-14' },
    { type: '안내', title: '신규 입고 도서의 품목 등록 기준 및 규격 안내', content: '신규 입고 도서의 품목 등록 기준에 대한 상세 안내입니다.', authorId: 'N24101267', date: '2024-10-13' },
    { type: '자유', title: '생산성 향상에 도움이 된 도서 \'린 제조의 정석\' 후기', content: '도서 \'린 제조의 정석\'을 읽고 작성한 후기입니다.', authorId: 'N24100345', date: '2024-10-12' },
    { type: '긴급', title: '🚨 라인 5 품질 센서 오작동, 수동 검사 전환 완료!', content: '라인 5의 품질 센서 오작동으로 인한 긴급 수동 검사 전환 상황에 대한 보고입니다.', authorId: 'N24092598', date: '2024-10-11' },
    { type: '안내', title: '[필독] 11월 MES 시스템 정기 업데이트 및 서버 점검 일정 공지', content: '11월 MES 시스템 업데이트 및 점검에 대한 상세 안내입니다.', authorId: 'N24100103', date: '2024-10-10' },
    { type: '공유', title: '재고 관리 최적화: FIFO 원칙 적용 성공 사례 공유', content: 'FIFO 원칙을 적용한 재고 관리 성공 사례에 대한 상세 내용입니다.', authorId: 'N24101412', date: '24-10-09' },
    { type: '자유', title: '2024년 1분기 생산 목표 달성 축하 이벤트', content: '축하 이벤트 상세 내용입니다.', authorId: 'N24101413', date: '2024-10-08' }
]; 

// =================================================================
// 댓글 데이터 구조 (샘플 데이터를 '최신순 정렬' 테스트를 위해 날짜를 다양하게 설정)
// =================================================================
const commentsData = {
    // 0번 인덱스 게시글의 댓글
    0: [
        { id: 1, authorId: 'N24020202', text: '테스트용 댓글입니다. (관리자 댓글)', date: '2025-10-20 16:49:00', parentId: null },
        { id: 2, authorId: 'N24100910', text: '두 번째 댓글입니다.', date: '2025-10-20 16:55:00', parentId: null },
        { id: 3, authorId: 'N24100856', text: '세 번째 댓글입니다.', date: '2025-10-20 17:00:00', parentId: null },
        { id: 4, authorId: 'N24020202', text: '네 번째 댓글입니다. (관리자 댓글 - 답글 테스트용)', date: '2025-10-20 17:05:00', parentId: null },
        { id: 5, authorId: 'N24010101', text: '다섯 번째 댓글입니다.', date: '2025-10-20 17:10:00', parentId: null },
        { id: 6, authorId: 'N24100910', text: '가장 최근에 달린 댓글입니다. (6번째)', date: '2025-10-20 17:15:00', parentId: null },
        { id: 7, authorId: 'N24020202', text: '가장 오래된 댓글입니다. (7번째)', date: '2025-10-20 16:45:00', parentId: null },
        // 이 댓글(ID: 8)은 ID: 4 (관리자 댓글)에 달린 대댓글입니다. -> ID: 4에 '답글 달림' 표시됨.
        { id: 8, authorId: 'N24010101', text: 'ID: 4번에 대한 답변입니다.', date: '2025-10-20 17:18:00', parentId: 4 }, 
    ],
    // 2번 인덱스 게시글에 여러 개의 댓글 추가 
    2: [
        { id: 10, authorId: 'N24010101', text: '저는 라인 3에서 자재 입고 지연이 가장 힘들었어요.', date: '2024-10-18 10:00:00', parentId: null },
        { id: 11, authorId: 'N24020202', text: '의견 감사합니다. 해당 문제는 현재 해결 방안을 모색 중입니다.', date: '2024-10-18 10:30:00', parentId: null },
        { id: 12, authorId: 'N24100856', text: '공정 중에 안전 문제가 발생하지 않도록 항상 유의해 주십시오.', date: '2024-10-18 11:45:00', parentId: 11 }, // 대댓글 (ID: 11에 '답글 달림' 표시됨)
        { id: 13, authorId: 'N24020202', text: '답변 감사합니다. 안전에 더욱 신경 쓰겠습니다!', date: '2024-10-18 11:55:00', parentId: 12 } // 2차 대댓글 
    ],
    // 5번 인덱스 게시글의 댓글
    5: [
        { id: 20, authorId: 'N24100910', text: '공모전 아이디어 멋지네요! 자동화 로봇 꼭 도입되길 바랍니다.', date: '2024-10-20 10:00:00', parentId: null },
        { id: 21, authorId: 'N24020202', text: '아이디어 제출 기간은 다음 주 금요일까지입니다.', date: '2024-10-20 11:30:00', parentId: 20 }
    ],
};

// =================================================================
// 댓글 로딩 및 페이징 관련 변수 및 상수
// =================================================================
const commentsPerPage = 5; // 한 번에 보여줄 댓글 수
let loadedCommentsCount = {}; // 게시글별 현재 로드된 댓글 수 추적 (detail 뷰 진입 시 초기화)


// 댓글 ID를 위한 전역 카운터 (실제 DB에서는 자동 생성됨)
let nextCommentId = 100;

// 메인 콘텐츠 영역 DOM
const mainContent = document.querySelector('.main-content');

// 현재 화면에 표시할 게시글 데이터 (검색 결과에 따라 변경됨)
let currentDisplayedData = [...boardData]; 
let currentPage = 1; 
let currentSearchCriteria = 'title'; // 마지막 검색 기준 저장
let currentSearchKeyword = ''; // 마지막 검색 키워드 저장


// 유형별 색상 매핑 (색깔 변경 요청이 없었으므로 유지)
const typeColors = {
    '공유': 'bg-green-100 text-green-800 border border-green-300 rounded-lg', 
    '안내': 'bg-blue-100 text-blue-800 border border-blue-300 rounded-lg', 
    '긴급': 'bg-red-100 text-red-800 border border-red-300 rounded-lg', 
    '자유': 'bg-gray-200 text-gray-800 border border-gray-400 rounded-lg', 
    '공지': 'bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg',
    '보고': 'bg-purple-100 text-purple-800 border border-purple-300 rounded-lg',
    '기타': 'bg-gray-100 text-gray-800 border border-gray-300 rounded-lg',
};

// 페이징 관련 상수 및 변수 정의
const postsPerPage = 10; 

// =================================================================
// 작성자 ID-이름 매핑 객체
// =================================================================
const authorMap = {
    'N24020202': '관리자(김재은)', 
    'N24010101': '인사팀(최연지)', 
    'N24100910': '생산팀(조민서)', 
    'N24100856': '안전보건팀(최아라)', 
    'N24091531': '품질관리팀(고현지)', 
    'N24100574': '물류팀(최연지)', 
    'N24090120': '교육팀(이하나)', 
    'N24101267': '품목관리팀(윤성연)', 
    'N24100345': '청소부(윤성연)', 
    'N24092598': '라인5 책임자(정성민)', 
    'N24100103': 'IT팀(윤성연)', 
    'N24101412': '창고팀(조민서)', 
    'N24101413': '생산관리팀(최아라)' 
};

// ID로 이름 조회하는 함수
const getAuthorName = (authorId) => authorMap[authorId] || '신규/익명 작성자';

// 현재 로그인 사용자 ID (댓글 작성/삭제/수정 권한 확인용 - '관리자(김재은)'의 ID)
const CURRENT_USER_ID = 'N24020202'; 

// =================================================================
// 게시글 검색 및 필터링 함수
// =================================================================
function filterPosts() {
    const criteriaElement = document.getElementById('search-criteria');
    const searchInput = document.getElementById('searchInput');

    if (!criteriaElement || !searchInput) return;

    // 현재 검색 기준과 키워드를 업데이트
    currentSearchCriteria = criteriaElement.value;
    currentSearchKeyword = searchInput.value.toLowerCase().trim();

    if (!currentSearchKeyword) {
        currentDisplayedData = [...boardData]; 
        // 키워드가 없을 때는 원래 데이터 전체를 표시합니다.
        return;
    }

    currentDisplayedData = boardData.filter(post => {
        let value = '';
        
        // 검색 기준에 따라 해당 필드의 값을 가져와 비교합니다.
        if (currentSearchCriteria === 'title') {
            value = post.title.toLowerCase();
        } else if (currentSearchCriteria === 'authorName') { 
            // 작성자 이름으로 검색할 경우, ID가 아닌 실제 이름으로 검색해야 합니다.
            value = getAuthorName(post.authorId).toLowerCase(); 
        } else if (currentSearchCriteria === 'type') {
            value = post.type.toLowerCase();
        }
        
        return value.includes(currentSearchKeyword);
    });
}


// =================================================================
// 게시판 목록 렌더링 함수
// =================================================================
function renderBoardListHTML(page = 1) {
    currentPage = page; 

    // 필터링 함수를 호출하여 currentDisplayedData를 업데이트합니다.
    filterPosts();
    
    const data = currentDisplayedData; 
    const totalPosts = data.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = Math.min(startIndex + postsPerPage, totalPosts);

    const currentPosts = data.slice(startIndex, endIndex);

    let tableRows = '';
    
    if (currentPosts.length > 0) {
        tableRows = currentPosts.map((post, index) => {
            // 목록에서 표시되는 순번 (현재 페이지 기준)
            const postNumber = startIndex + index + 1;
            
            // 필터링된 목록에서 원본 boardData의 인덱스를 찾아 상세 페이지 연결
            // 원본 데이터에서 해당 게시글을 찾기 위한 인덱스
            const originalIndex = boardData.findIndex(p => p.title === post.title && p.authorId === post.authorId && p.date === post.date);
            
            const typeClass = typeColors[post.type] || 'bg-gray-200 text-gray-800 border border-gray-400 rounded-lg';
            
            return `
                <tr class="hover:bg-gray-50">
                    <td class="py-2 px-4 text-center text-sm font-medium text-gray-900">${postNumber}</td>
                    <td class="py-2 px-4 text-center">
                        <span class="inline-flex items-center px-3 py-1 text-xs font-semibold ${typeClass}">
                            ${post.type}
                        </span>
                    </td>
                    <td class="py-2 px-4 text-left text-sm font-medium text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors duration-150"
                        onclick="loadBoardContent('detail', ${originalIndex})">
                        ${post.title}
                    </td>
                    <td class="py-2 px-4 text-center text-sm text-gray-500 w-40 text-nowrap">${getAuthorName(post.authorId)}</td>
                </tr>
            `;
        }).join(''); 
    } else {
        tableRows = `
            <tr>
                <td colspan="4" class="p-8 text-center text-gray-500 text-lg">
                    <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    검색 결과가 없습니다.
                </td>
            </tr>
        `;
    }
    
    const paginationHTML = generatePaginationHTML(totalPages, currentPage);

    return `
        <h2 class="text-3xl font-bold text-gray-800 mb-6">게시판 목록</h2>

        <div class="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-lg mb-6 border border-gray-200 space-y-4 sm:space-y-0">
            <div class="flex items-center space-x-2 w-full sm:w-auto">
                <select id="search-criteria" class="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                    <option value="title">제목</option>
                    <option value="authorName">작성자 이름</option> 
                    <option value="type">유형</option>
                </select>
                <div class="relative flex-grow">
                    <input type="text" id="searchInput" placeholder="검색 내용을 입력하세요." class="p-2 pr-8 border border-gray-300 rounded-lg shadow-sm w-full focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                    <button id="searchButton" class="absolute right-0 top-0 h-full px-2 text-gray-500 hover:text-gray-700 transition-colors duration-150">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </button>
                </div>
            </div>
            
            <button id="writePostButton" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-150 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                글쓰기
            </button>
        </div>

        <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div class="table-responsive">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="py-2 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">순번</th>
                            <th class="py-2 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">유형</th> 
                            <th class="py-2 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">제목</th>
                            <th class="py-2 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">작성자</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>

        ${paginationHTML}
    `;
}

// =================================================================
// 페이지네이션 HTML 생성 함수
// =================================================================
function generatePaginationHTML(totalPages, currentPage) {
    if (totalPages <= 1) return '';

    let pagesHTML = '';
    const visiblePages = 5; 
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
        startPage = Math.max(1, endPage - visiblePages + 1);
    }
    
    // 페이지 버튼 생성
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'bg-indigo-600 text-white font-bold' : 'text-gray-500 hover:bg-gray-100';
        pagesHTML += `<button onclick="loadBoardContent('list', ${i})" class="px-3 py-1 text-sm rounded-lg transition-colors duration-150 ${activeClass}">${i}</button>`;
    }

    // 이전 버튼
    const prevDisabled = currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100';
    const prevButton = `
        <button onclick="loadBoardContent('list', ${currentPage - 1})" 
            class="px-3 py-1 text-sm rounded-lg text-gray-500 transition-colors duration-150 ${prevDisabled}" 
            ${currentPage === 1 ? 'disabled' : ''}>
            이전
        </button>
    `;

    // 다음 버튼
    const nextDisabled = currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100';
    const nextButton = `
        <button onclick="loadBoardContent('list', ${currentPage + 1})" 
            class="px-3 py-1 text-sm rounded-lg text-gray-500 transition-colors duration-150 ${nextDisabled}" 
            ${currentPage === totalPages ? 'disabled' : ''}>
            다음
        </button>
    `;
    
    // 페이지네이션 그룹 전체
    return `
        <div class="flex justify-center items-center space-x-1 mt-8">
            ${prevButton}
            ${pagesHTML}
            ${nextButton}
        </div>
    `;
}

// =================================================================
// 새 게시글 작성/수정 폼 렌더링 함수
// =================================================================
function renderPostWriteHTML(post = null, index = null) {
    const isEditing = post !== null;
    const title = isEditing ? '게시글 수정' : '새 게시글 작성';
    const saveButtonText = isEditing ? '수정 완료' : '저장';
    
    const initialTitle = isEditing ? post.title : '';
    const initialContent = isEditing ? post.content : '';

    return `
        <h2 class="text-3xl font-bold text-gray-800 mb-6">${title}</h2>

        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div id="post-form-area" data-index="${index !== null ? index : ''}" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="md:col-span-1">
                        <label class="block text-sm font-medium text-gray-700 mb-1">유형</label>
                        <select id="postType" class="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">유형 선택</option>
                            <option value="안내" ${isEditing && post.type === '안내' ? 'selected' : ''}>안내</option>
                            <option value="긴급" ${isEditing && post.type === '긴급' ? 'selected' : ''}>긴급</option>
                            <option value="공유" ${isEditing && post.type === '공유' ? 'selected' : ''}>공유</option>
                            <option value="자유" ${isEditing && post.type === '자유' ? 'selected' : ''}>자유</option>
                        </select>
                    </div>
                    <div class="md:col-span-3">
                        <label class="block text-sm font-medium text-gray-700 mb-1">제목</label>
                        <input type="text" id="postTitle" placeholder="제목을 입력하세요." value="${initialTitle}" class="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">내용</label>
                    <textarea id="postContentEditor" rows="10" placeholder="게시글 내용을 입력하세요." class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y">${initialContent}</textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">첨부 파일</label>
                    <div class="p-3 border border-gray-300 rounded-lg bg-gray-50">
                        <input type="file" id="file-upload" class="hidden" multiple>
                        
                        <label for="file-upload" class="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded-lg text-sm font-medium inline-block transition-colors duration-150">
                            파일 선택
                        </label>
                        <span id="fileNameDisplay" class="ml-3 text-sm text-gray-500">선택된 파일 없음</span>
                        <p id="currentFileStatus" class="mt-2 text-xs text-gray-400">현재 파일 첨부: 없음</p>
                    </div>
                </div>
            </div>

            <div class="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-200">
                <button id="cancelPostButton" class="py-2 px-4 rounded-lg font-semibold text-gray-700 bg-white border border-gray-400 hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2">
                    취소
                </button>
                <button id="savePostButton" data-mode="${isEditing ? 'edit' : 'new'}" class="py-2 px-4 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    ${saveButtonText}
                </button>
            </div>
        </div>
    `;
}

// =================================================================
// 댓글 작성 폼 HTML (대댓글용)
// =================================================================
function renderReplyFormHTML(postIndex, parentId, parentAuthor) {
    return `
        <div id="reply-form-${parentId}" class="reply-form-container mt-2 mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200 shadow-inner">
            <p class="text-sm font-semibold text-indigo-700 mb-2">
                ${parentAuthor}님에게 답글 작성
            </p>
            <textarea id="replyInput-${parentId}" rows="2" placeholder="답글을 입력하세요." class="w-full p-2 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm"></textarea>
            <div class="flex justify-end space-x-2 mt-2">
                <button onclick="hideReplyForm(${parentId})" class="py-1 px-3 rounded-lg font-semibold text-gray-700 bg-white border border-gray-400 hover:bg-gray-50 transition-colors duration-150 text-xs">
                    취소
                </button>
                <button onclick="addComment(${postIndex}, ${parentId})" class="bg-indigo-600 text-white font-semibold py-1 px-3 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-150 text-xs">
                    답글 작성
                </button>
            </div>
        </div>
    `;
}

// =================================================================
// 댓글/대댓글 목록 렌더링 함수
// =================================================================
function renderCommentsHTML(postIndex) {
    const comments = commentsData[postIndex] || [];
    let commentsListHTML = '';

    // 1. **NEW**: 어떤 댓글에 답글이 달렸는지 확인 (알림 표시용)
    const parentIdsWithReplies = new Set(comments.map(c => c.parentId).filter(id => id !== null));

    // 2. 최신순 정렬 (Date 내림차순)
    const sortedComments = [...comments].sort((a, b) => new Date(b.date) - new Date(a.date));

    // 3. 더보기 기능 적용
    const totalComments = sortedComments.length;
    // 해당 게시글의 현재 로드된 댓글 수를 가져오거나 기본값(commentsPerPage) 설정
    const currentLoadedCount = loadedCommentsCount[postIndex] || commentsPerPage; 
    
    // 현재 표시할 댓글 목록 (최신순으로 currentLoadedCount 개만큼)
    const commentsToDisplay = sortedComments.slice(0, currentLoadedCount);
    
    const hasMore = totalComments > currentLoadedCount;


    if (totalComments === 0) {
        commentsListHTML = `<p class="text-gray-500 p-4 text-center">아직 댓글이 없습니다. 첫 댓글을 남겨보세요.</p>`;
    } else {
        commentsListHTML = commentsToDisplay.map((comment, index) => {
            const authorName = getAuthorName(comment.authorId);
            const isOwner = comment.authorId === CURRENT_USER_ID; 
            
            // **NEW**: 현재 댓글이 로그인 사용자의 것이며 답글이 달린 원댓글인지 확인
            const isTargetComment = comment.authorId === CURRENT_USER_ID && parentIdsWithReplies.has(comment.id);
            
            // **NEW**: 답글 달림 배지 HTML (pulse 애니메이션으로 눈에 띄게 표시)
            const replyBadgeHTML = isTargetComment ? 
                `<span class="bg-indigo-600 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full animate-pulse">
                    답글 달림
                </span>` : '';


            // 대댓글 여부에 따른 들여쓰기 클래스 설정
            const indentClass = comment.parentId !== null ? 'pl-6 border-l-4 border-indigo-100' : 'pl-0'; 
            
            // 부모 댓글의 작성자 이름 찾기 (대댓글인 경우)
            let parentAuthorText = '';
            if (comment.parentId !== null) {
                const parentComment = comments.find(c => c.id === comment.parentId);
                if (parentComment) {
                    // 대댓글일 경우 부모 댓글의 작성자를 @태그로 표시
                    parentAuthorText = `<span class="text-indigo-500 font-bold mr-1">@${getAuthorName(parentComment.authorId).split('(')[0]}</span>`;
                }
            }

            // 댓글/대댓글 자체의 HTML
            const commentItemHTML = `
                <div class="py-4 last:border-b-0 ${indentClass}">
                    <div class="flex items-center justify-between mb-1">
                        <div class="flex items-center space-x-2">
                            ${replyBadgeHTML} <!-- 답글 달림 배지 위치 -->
                            <span class="font-semibold text-sm text-gray-800">${authorName}</span>
                            <span class="text-xs text-gray-400">${comment.date}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <!-- 답글 달기 버튼 -->
                            <button id="replyBtn-${comment.id}" onclick="toggleReplyForm(${postIndex}, ${comment.id}, '${authorName.split('(')[0]}')" class="text-indigo-600 hover:text-indigo-700 text-xs transition-colors duration-150 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded ml-2">
                                답글 달기
                            </button>
                            ${isOwner ? 
                                `<button id="editBtn-${comment.id}" onclick="toggleCommentEdit(${postIndex}, ${comment.id})" class="text-green-600 hover:text-green-700 text-xs transition-colors duration-150 bg-green-50 hover:bg-green-100 px-2 py-0.5 rounded">수정</button>
                                <button onclick="deleteComment(${postIndex}, ${comment.id})" class="text-red-600 hover:text-red-700 text-xs transition-colors duration-150 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded">삭제</button>` : ''
                            }
                        </div>
                    </div>
                    
                    <!-- 댓글 내용 표시 영역 -->
                    <div id="comment-content-${comment.id}" class="text-gray-700 text-sm whitespace-pre-wrap mt-1">
                        ${parentAuthorText} ${comment.text}
                    </div>
                    
                    <!-- 댓글 수정 폼 컨테이너 (수정 버튼 클릭 시 여기에 폼이 로드됨) -->
                    <div id="comment-edit-form-${comment.id}"></div>

                    <!-- 답글 폼을 위한 컨테이너 -->
                    <div id="reply-form-container-${comment.id}"></div>
                </div>
            `;
            
            return commentItemHTML;
        }).join('');
    }
    
    // 3. 더보기 버튼
    const loadMoreButtonHTML = hasMore ? `
        <div class="text-center pt-4 pb-2 border-t border-gray-100">
            <button onclick="loadMoreComments(${postIndex})" class="text-indigo-600 hover:text-indigo-700 font-semibold text-sm py-2 px-4 rounded-lg transition-colors duration-150 bg-indigo-50 hover:bg-indigo-100">
                댓글 더보기 (${currentLoadedCount} / ${totalComments})
            </button>
        </div>
    ` : '';

    return `
        <div class="mt-8 pt-6 border-t border-gray-300">
            <h3 class="text-xl font-bold text-gray-800 mb-4">댓글 (${totalComments})</h3>

            <!-- 기본 댓글 작성 폼 (parent: null) -->
            <div class="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
                <textarea id="commentInput" rows="3" placeholder="새 댓글을 입력하세요." class="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm"></textarea>
                <div class="flex justify-end mt-2">
                    <button id="submitCommentButton" data-index="${postIndex}" onclick="addComment(${postIndex}, null)" class="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm">
                        댓글 작성
                    </button>
                </div>
            </div>

            <!-- 댓글 목록 -->
            <div id="commentsList" class="divide-y divide-gray-100 bg-white rounded-xl p-0 shadow">
                ${commentsListHTML}
            </div>
            
            ${loadMoreButtonHTML}
        </div>
    `;
}

// =================================================================
// 게시글 상세 보기 렌더링 함수 (유형을 제목과 한 줄로 배치)
// =================================================================
function renderPostDetailHTML(post, index) { 
    const typeClass = typeColors[post.type] || 'bg-gray-200 text-gray-800 border border-gray-400 rounded-lg';
    
    // 댓글 영역 HTML 추가
    const commentsSectionHTML = renderCommentsHTML(index);

    return `
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden p-6">
            <header class="pb-4 border-b border-gray-200 mb-6">
                
                <!-- 요청 사항 반영: 유형과 제목을 한 줄로 배치 (유형 태그를 작게) -->
                <h1 class="text-2xl font-bold text-gray-800 mb-3 flex items-center space-x-3">
                    <span class="inline-flex items-center px-3 py-1 text-sm font-semibold ${typeClass} whitespace-nowrap">
                        ${post.type}
                    </span>
                    <span>${post.title}</span>
                </h1>

                <div class="text-sm text-gray-500 flex justify-between items-center">
                    <div>
                        작성자: <span class="font-medium text-gray-700">${getAuthorName(post.authorId)}</span> 
                        <span class="ml-4">작성일: <span class="font-medium text-gray-700">${post.date || '날짜 미정'}</span></span>
                    </div>
                </div>
            </header>
            
            <section class="min-h-96">
                <div class="prose max-w-none text-gray-700 leading-relaxed">
                    ${post.content.replace(/\n/g, '<br>')}
                </div>
            </section>
            
            <div class="pt-6 mt-6 border-t border-gray-200">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">첨부 파일</h3>
                <p class="text-gray-500 text-sm">첨부 파일이 없습니다.</p>
            </div>

            <footer class="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
                <button id="backToListButton" class="py-2 px-4 rounded-lg font-semibold text-gray-700 bg-white border border-gray-400 hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2">
                    목록으로 돌아가기
                </button>
                
                <div class="space-x-2">
                    <button id="deletePostButton" data-index="${index}" class="py-2 px-4 rounded-lg font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                        삭제
                    </button>
                    <button id="editPostButton" data-index="${index}" class="py-2 px-4 rounded-lg font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        수정
                    </button>
                </div>
            </footer>
        </div>
        ${commentsSectionHTML}
    `;
}

// =================================================================
// **NEW** 댓글 더보기 기능 함수
// =================================================================
function loadMoreComments(postIndex) {
    // 현재 로드된 댓글 수를 commentsPerPage만큼 증가
    const currentCount = loadedCommentsCount[postIndex] || commentsPerPage;
    loadedCommentsCount[postIndex] = currentCount + commentsPerPage;
    
    // 상세 화면을 다시 로드하여 증가된 수만큼 댓글을 표시
    loadBoardContent('detail', postIndex);
}

// =================================================================
// 댓글 작성/대댓글 작성 함수
// =================================================================
function addComment(postIndex, parentId) {
    let text;
    
    if (parentId === null) {
        // 일반 댓글
        const commentInput = document.getElementById('commentInput');
        text = commentInput ? commentInput.value.trim() : '';
        if (commentInput) commentInput.value = ''; 
    } else {
        // 대댓글
        const replyInput = document.getElementById(`replyInput-${parentId}`);
        text = replyInput ? replyInput.value.trim() : '';
        if (replyInput) replyInput.value = ''; 
        hideReplyForm(parentId); // 작성 후 폼 숨기기
    }

    if (!text) {
        // alert('댓글 내용을 입력해주세요.');
        // TODO: Custom Modal 사용
        console.error('댓글 내용을 입력해주세요.');
        return;
    }
    
    const currentAuthorId = CURRENT_USER_ID; 
    const now = new Date();
    // 댓글 정렬을 위해 상세 시간까지 포함
    const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newComment = {
        id: nextCommentId++, // 새 ID 할당
        authorId: currentAuthorId,
        text: text,
        date: dateString,
        parentId: parentId 
    };

    if (!commentsData[postIndex]) {
        commentsData[postIndex] = [];
    }
    
    commentsData[postIndex].push(newComment);
    
    // 새 댓글 작성 후에는 로드된 댓글 수를 최신 댓글을 포함하도록 확장
    const totalComments = commentsData[postIndex].length;
    loadedCommentsCount[postIndex] = Math.max(loadedCommentsCount[postIndex] || commentsPerPage, totalComments);

    loadBoardContent('detail', postIndex);
}

// =================================================================
// 댓글 삭제 함수 (ID 기반)
// =================================================================
function deleteComment(postIndex, commentId) {
    // if (confirm('정말로 이 댓글을 삭제하시겠습니까? (달린 답글도 함께 삭제됩니다.)')) {
    // TODO: Custom Modal 사용
    const confirmed = window.confirm('정말로 이 댓글을 삭제하시겠습니까? (달린 답글도 함께 삭제됩니다.)');
    
    if (confirmed) {
        const comments = commentsData[postIndex];
        if (comments) {
            // 삭제할 댓글 ID와 해당 댓글에 달린 모든 대댓글 ID를 찾습니다.
            const idsToDelete = [commentId];
            let changed = true;
            
            // 계층적으로 자식 댓글을 찾습니다.
            while(changed) {
                changed = false;
                comments.forEach(comment => {
                    if (comment.parentId !== null && idsToDelete.includes(comment.parentId) && !idsToDelete.includes(comment.id)) {
                        idsToDelete.push(comment.id);
                        changed = true;
                    }
                });
            }

            // idsToDelete 목록에 없는 댓글만 남기고 필터링합니다.
            commentsData[postIndex] = comments.filter(comment => !idsToDelete.includes(comment.id));
            
            // 댓글 수 감소에 따라 loadedCommentsCount 조정
            const newTotalComments = commentsData[postIndex].length;
            if (loadedCommentsCount[postIndex] > newTotalComments) {
                loadedCommentsCount[postIndex] = newTotalComments;
            } else if (loadedCommentsCount[postIndex] === totalComments) {
                loadedCommentsCount[postIndex] = Math.max(commentsPerPage, newTotalComments);
            }
            
            loadBoardContent('detail', postIndex);
            // alert('댓글이 삭제되었습니다.');
            // TODO: Custom Modal 사용
            console.log('댓글이 삭제되었습니다.');
        }
    }
}

// =================================================================
// 대댓글 폼 토글 함수
// =================================================================
function toggleReplyForm(postIndex, parentId, parentAuthor) {
    const container = document.getElementById(`reply-form-container-${parentId}`);
    
    // 댓글 수정 폼이 열려 있다면 닫음
    cancelCommentEdit(postIndex, parentId);

    // 모든 답글 폼을 숨깁니다.
    document.querySelectorAll('.reply-form-container').forEach(form => {
        // 해당 댓글의 컨테이너에 있는 폼만 제거합니다. (ID가 reply-form-XXX인 요소)
        if (form.parentElement.id !== `reply-form-container-${parentId}`) {
            form.remove();
        }
    });

    if (container.children.length === 0) {
        // 폼이 없으면 생성하고 보여줍니다.
        container.innerHTML = renderReplyFormHTML(postIndex, parentId, parentAuthor);
        document.getElementById(`replyInput-${parentId}`).focus();
    } else {
        // 폼이 있으면 숨깁니다.
        container.innerHTML = '';
    }
}

// =================================================================
// 대댓글 폼 숨기기 함수
// =================================================================
function hideReplyForm(parentId) {
    const container = document.getElementById(`reply-form-container-${parentId}`);
    if (container) {
        container.innerHTML = '';
    }
}

// =================================================================
// **NEW** 댓글 수정 폼 토글 함수
// 수정 버튼 클릭 시 기존 댓글 내용을 입력창에 표시하고 저장/취소 버튼 표시
// =================================================================
function toggleCommentEdit(postIndex, commentId) {
    const comments = commentsData[postIndex] || [];
    const comment = comments.find(c => c.id === commentId);

    if (!comment || comment.authorId !== CURRENT_USER_ID) return;

    // 답글 폼이 열려 있다면 닫음
    hideReplyForm(commentId);

    const contentContainer = document.getElementById(`comment-content-${commentId}`);
    const editFormContainer = document.getElementById(`comment-edit-form-${commentId}`);
    const editButton = document.getElementById(`editBtn-${commentId}`);
    const replyButton = document.getElementById(`replyBtn-${commentId}`);

    // 현재 상태: Display (수정 버튼 클릭) -> Switch to Editing
    if (!contentContainer.classList.contains('hidden')) {
        
        // 1. Hide original content and related buttons
        contentContainer.classList.add('hidden');
        editButton.classList.add('hidden');
        if (replyButton) replyButton.classList.add('hidden');
        
        // 2. Render Edit Form
        const currentText = comment.text;
        
        editFormContainer.innerHTML = `
            <div id="comment-edit-box-${commentId}" class="mt-2 mb-4 p-3 bg-green-50 rounded-lg border border-green-200 shadow-inner">
                <textarea id="editInput-${commentId}" rows="3" class="w-full p-2 border border-green-300 rounded-lg focus:ring-green-500 focus:border-green-500 resize-none text-sm">${currentText.trim()}</textarea>
                <div class="flex justify-end space-x-2 mt-2">
                    <button onclick="cancelCommentEdit(${postIndex}, ${commentId})" class="py-1 px-3 rounded-lg font-semibold text-gray-700 bg-white border border-gray-400 hover:bg-gray-50 transition-colors duration-150 text-xs">
                        취소
                    </button>
                    <button onclick="saveCommentEdit(${postIndex}, ${commentId})" class="bg-green-600 text-white font-semibold py-1 px-3 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-150 text-xs">
                        저장
                    </button>
                </div>
            </div>
        `;
        
        // 3. Focus on the textarea
        document.getElementById(`editInput-${commentId}`).focus();
    } 
}

// =================================================================
// **NEW** 댓글 수정 취소 함수
// =================================================================
function cancelCommentEdit(postIndex, commentId) {
    const contentContainer = document.getElementById(`comment-content-${commentId}`);
    const editFormContainer = document.getElementById(`comment-edit-form-${commentId}`);
    const editButton = document.getElementById(`editBtn-${commentId}`);
    const replyButton = document.getElementById(`replyBtn-${commentId}`);
    
    if (contentContainer) contentContainer.classList.remove('hidden');
    if (editFormContainer) editFormContainer.innerHTML = '';
    if (editButton) editButton.classList.remove('hidden');
    if (replyButton) replyButton.classList.remove('hidden');
}


// =================================================================
// **NEW** 댓글 수정 내용 저장 함수
// 수정 완료 후 변경된 내용 반영
// =================================================================
function saveCommentEdit(postIndex, commentId) {
    const comments = commentsData[postIndex] || [];
    const commentIndex = comments.findIndex(c => c.id === commentId);
    
    if (commentIndex === -1) return;

    const editInput = document.getElementById(`editInput-${commentId}`);
    const newText = editInput.value.trim();

    if (!newText) {
        // alert('댓글 내용을 입력해주세요.');
        console.error('댓글 내용을 입력해주세요.');
        return;
    }

    commentsData[postIndex][commentIndex].text = newText;
    
    // Re-render the detail view to update the comment list and reset all states
    loadBoardContent('detail', postIndex);
    // alert('댓글이 수정되었습니다.');
    console.log('댓글이 수정되었습니다.');
}


// =================================================================
// 새 게시글 저장/수정 처리 함수
// =================================================================
function savePost(mode, index) {
    const type = document.getElementById('postType').value;
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContentEditor').value.trim(); 
    
    if (!type || !title || !content) {
        // alert('모든 필드를 채워주세요 (유형, 제목, 내용).');
        // TODO: Custom Modal 사용
        console.error('모든 필드를 채워주세요 (유형, 제목, 내용).');
        return;
    }

    if (mode === 'new') {
        const now = new Date();
        const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        const newPost = {
            type: type,
            title: title,
            content: content,
            authorId: CURRENT_USER_ID, 
            date: dateString // 현재 날짜로 작성일 설정
        };
        
        boardData.unshift(newPost); // 배열 맨 앞에 추가
    } else if (mode === 'edit' && index !== null) {
        // 수정 시 기존 ID 및 작성일 유지
        boardData[index].type = type;
        boardData[index].title = title;
        boardData[index].content = content;
    }

    currentDisplayedData = [...boardData]; 
    // alert(mode === 'new' ? '게시글이 성공적으로 저장되었습니다.' : '게시글이 성공적으로 수정되었습니다.');
    // TODO: Custom Modal 사용
    console.log(mode === 'new' ? '게시글이 성공적으로 저장되었습니다.' : '게시글이 성공적으로 수정되었습니다.');
    loadBoardContent('list', 1); 
}

// =================================================================
// 게시글 삭제 처리 함수
// =================================================================
function deletePost(index) {
    // if (confirm('정말로 이 게시글을 삭제하시겠습니까? (이 게시글에 달린 모든 댓글도 함께 삭제됩니다.)')) {
    // TODO: Custom Modal 사용
    const confirmed = window.confirm('정말로 이 게시글을 삭제하시겠습니까? (이 게시글에 달린 모든 댓글도 함께 삭제됩니다.)');

    if (confirmed) {
        boardData.splice(index, 1);
        
        // 댓글 데이터 삭제
        if (commentsData[index]) {
            delete commentsData[index];
        }
        
        // 게시글 인덱스가 변경되었을 수 있으므로 댓글 데이터 키를 재정렬 (매우 중요)
        const newCommentsData = {};
        for(let key in commentsData) {
            const oldIndex = parseInt(key, 10);
            if (oldIndex < index) {
                newCommentsData[oldIndex] = commentsData[key];
            } else if (oldIndex > index) {
                newCommentsData[oldIndex - 1] = commentsData[key];
            }
        }
        // 기존 commentsData 객체를 새 데이터로 덮어쓰기
        // 주의: Object.assign은 복사가 아니라 병합이므로, 기존 키를 지우려면 명시적으로 비우고 할당해야 함.
        for (const key in commentsData) {
            delete commentsData[key];
        }
        Object.assign(commentsData, newCommentsData);


        currentDisplayedData = [...boardData];
        // alert('게시글이 삭제되었습니다.');
        // TODO: Custom Modal 사용
        console.log('게시글이 삭제되었습니다.');
        loadBoardContent('list', 1);
    }
}

// =================================================================
// 메인 콘텐츠 로드 및 이벤트 리스너 설정 함수
// =================================================================
function loadBoardContent(view, data = null) {
    mainContent.innerHTML = '';
    let html = '';
    
    if (view === 'list') {
        filterPosts(); 
        html = renderBoardListHTML(data); 
    } else if (view === 'write') {
        html = renderPostWriteHTML(data, null); 
    } else if (view === 'edit') {
        const post = boardData[data];
        html = renderPostWriteHTML(post, data);
    } else if (view === 'detail') {
        // 상세 뷰로 진입 시, 해당 게시글의 loadedCommentsCount가 없으면 초기화
        if (loadedCommentsCount[data] === undefined) {
            loadedCommentsCount[data] = commentsPerPage;
        }

        const post = boardData[data];
        html = renderPostDetailHTML(post, data); 
    } else {
        html = `<div>오류: 잘못된 뷰 요청입니다.</div>`;
    }

    mainContent.innerHTML = html;
    setupEventListeners(view, data);
}

// =================================================================
// 동적 이벤트 리스너 설정 함수
// =================================================================
function setupEventListeners(view, data) {
    if (view === 'list') {
        const writeButton = document.getElementById('writePostButton');
        if (writeButton) {
            writeButton.onclick = () => loadBoardContent('write');
        }
        
        const searchButton = document.getElementById('searchButton');
        const searchInput = document.getElementById('searchInput');
        const criteriaElement = document.getElementById('search-criteria');
        
        if (criteriaElement) criteriaElement.value = currentSearchCriteria;
        if (searchInput) searchInput.value = currentSearchKeyword;

        const handleSearch = () => {
            loadBoardContent('list', 1);
        };

        if (searchButton) searchButton.onclick = handleSearch;
        if (searchInput) {
            searchInput.onkeyup = (e) => {
                if (e.key === 'Enter') handleSearch();
            };
        }
    } 
    
    else if (view === 'write' || view === 'edit') {
        const formArea = document.getElementById('post-form-area');
        const index = formArea ? formArea.dataset.index : null;
        const mode = document.getElementById('savePostButton').dataset.mode;
        
        const saveButton = document.getElementById('savePostButton');
        if (saveButton) {
            saveButton.onclick = () => savePost(mode, index !== '' ? parseInt(index, 10) : null);
        }

        const cancelButton = document.getElementById('cancelPostButton');
        if (cancelButton) {
            cancelButton.onclick = () => {
                if (mode === 'edit' && index !== null) {
                    loadBoardContent('detail', parseInt(index, 10));
                } else {
                    loadBoardContent('list', 1);
                }
            };
        }
        
        const fileInput = document.getElementById('file-upload');
        const fileNameDisplay = document.getElementById('fileNameDisplay');
        if (fileInput && fileNameDisplay) {
             fileInput.onchange = (e) => {
                if (e.target.files.length > 0) {
                    const fileNames = Array.from(e.target.files).map(f => f.name).join(', ');
                    fileNameDisplay.textContent = `${e.target.files.length}개 파일 선택됨: ${fileNames}`;
                } else {
                    fileNameDisplay.textContent = '선택된 파일 없음';
                }
            };
        }
    }
    
    else if (view === 'detail') {
        const index = data; 
        
        const backToListButton = document.getElementById('backToListButton');
        if (backToListButton) {
            backToListButton.onclick = () => loadBoardContent('list', 1);
        }
        
        const editPostButton = document.getElementById('editPostButton');
        if (editPostButton) {
            editPostButton.onclick = () => loadBoardContent('edit', index);
        }
        
        const deletePostButton = document.getElementById('deletePostButton');
        if (deletePostButton) {
            deletePostButton.onclick = () => deletePost(index);
        }
        
        // 기본 댓글 작성 폼의 Enter 이벤트 처리 (대댓글은 인라인에서 처리)
        const commentInput = document.getElementById('commentInput');
        if (commentInput) {
            commentInput.onkeyup = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) { 
                    addComment(index, null);
                }
            };
        }
    }
}
//
