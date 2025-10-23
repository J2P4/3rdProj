// 게시판 데이터 (샘플) - authorId를 authorName으로 변경하고 comments 배열 구조 유지
const boardData = [
    {
        type: '자유', title: '2024년 1분기 생산 목표 달성 축하 이벤트', content: '축하 이벤트 상세 내용입니다.', authorName: '김철수',
        comments: [
            { id: 1, authorName: '박영희', content: '정말 고생 많으셨습니다! 다음 분기도 기대됩니다.', timestamp: Date.now() - 3600000, replies: [] },
            { 
                id: 2, authorName: '이민수', content: '축하합니다. 덕분에 즐거운 이벤트 기대 중입니다.', timestamp: Date.now() - 7200000, 
                replies: [
                    { id: 5, authorName: '관리자(N24100001)', content: '감사합니다. 즐거운 시간 되시길 바랍니다!', timestamp: Date.now() - 1800000 },
                ]
            },
        ]
    },
    { type: '공유', title: '재고 관리 최적화: FIFO 원칙 적용 성공 사례 공유', content: 'FIFO 원칙을 적용한 재고 관리 성공 사례에 대한 상세 내용입니다.', authorName: '최민지', comments: [] },
    { type: '안내', title: '[필독] 11월 MES 시스템 정기 업데이트 및 서버 점검 일정 공지', content: '11월 MES 시스템 업데이트 및 점검에 대한 상세 안내입니다.', authorName: '박영희', comments: [] },
    {
        type: '긴급', title: '🚨 라인 5 품질 센서 오작동, 수동 검사 전환 완료!', content: '라인 5의 품질 센서 오작동으로 인한 긴급 수동 검사 전환 상황에 대한 보고입니다.', authorName: '정우성',
        comments: [
            {
                id: 3, authorName: '김철수', content: '수동 검사로 빠르게 전환해 주셔서 감사합니다. 현재 상황은 어떤가요?', timestamp: Date.now() - 3600000,
                replies: [
                    { id: 4, authorName: '정우성', content: '라인 5 담당자입니다. 현재는 정상화되었으며, 재발 방지 대책 논의 중입니다.', timestamp: Date.now() - 1800000 },
                ]
            },
        ]
    },
    { type: '자유', title: '생산성 향상에 도움이 된 도서 \'린 제조의 정석\' 후기', content: '도서 \'린 제조의 정석\'을 읽고 작성한 후기입니다.', authorName: '홍길동', comments: [] },
    { type: '안내', title: '신규 입고 도서의 품목 등록 기준 및 규격 안내', content: '신규 입고 도서의 품목 등록 기준에 대한 상세 안내입니다.', authorName: '신은정', comments: [] },
    { type: '안내', title: '4분기 공정별 안전 교육 의무 이수 대상자 명단 공지', content: '4분기 공정별 안전 교육 의무 이수 대상자 명단 및 일정에 대한 공지입니다.', authorName: '강호동', comments: [] },
    { type: '자유', title: '공장 물류센터 자동화 로봇 이용 공모합니다!', content: '공장 물류센터 자동화 로봇 이용에 대한 아이디어 공모 안내입니다.', authorName: '유재석', comments: [] },
    { type: '공유', title: '품질 불량률 10% 감소 달성! 공정 개선 아이디어 제안', content: '품질 불량률 감소를 위한 공정 개선 아이디어 제안 상세 내용입니다.', authorName: '이효리', comments: [] },
    { type: '자유', title: '현장 작업 시 필요한 개인 보호 장비 개선 건의', content: '현장 작업 시 개인 보호 장비 개선에 대한 건의 사항입니다.', authorName: '이상순', comments: [] },
    { type: '자유', title: '이번 주 가장 힘들었던 공정은 무엇이었는지 자유롭게 이야기해 보세요.', content: '이번 주 힘들었던 공정에 대한 자유로운 의견 공유입니다.', authorName: '비', comments: [] },
    { type: '공유', title: '새로운 롤모델 교육 자료 공유', content: '새로운 롤모델 교육 자료 공유입니다.', authorName: '정지훈', comments: [] },
    { type: '안내', title: '월간 시스템 점검 예정', content: '월간 시스템 점검 예정 안내입니다.', authorName: '김태희', comments: [] }
].reverse();

// 메인 콘텐츠 영역 DOM (HTML에 .main-content가 있다고 가정)
const mainContent = document.querySelector('.main-content');

// ⭐현재 화면에 표시할 게시글 데이터 (검색 결과에 따라 변경됨)⭐
let currentDisplayedData = [...boardData];
let currentPage = 1;


// 유형별 색상 매핑 
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

// ⭐현재 사용자 이름을 ID 대신 사용⭐
const currentUserName = '관리자(N24100001)';
// 댓글 ID 생성을 위한 카운터 
let nextCommentId = 6; // 샘플 데이터의 최대 ID + 1


// =================================================================
// 커스텀 모달 함수 (alert/confirm 대체) - Tailwind CSS 모달 DOM이 HTML에 있다고 가정
// =================================================================

/**
 * 커스텀 모달을 표시합니다.
 * @param {string} message 모달에 표시할 메시지
 * @param {'info'|'confirm'|'prompt'} type 모달 유형
 * @param {function(boolean|string): void} callback 결과를 처리할 콜백 함수
 * @param {string} initialValue Prompt 입력창의 초기값
 */
function showMessage(message, type = 'info', callback = null, initialValue = '') {
    const modal = document.getElementById('customModal');
    const messageText = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('modalConfirmBtn');
    const cancelBtn = document.getElementById('modalCancelBtn');
    const modalTitle = document.getElementById('modalTitle');
    
    // Prompt용 입력 필드를 동적으로 생성/제거 (HTML에 없다고 가정하고 JS로 처리)
    let promptInput = document.getElementById('modalPromptInput');
    if (type !== 'prompt' && promptInput) {
        promptInput.remove();
        promptInput = null;
    }

    if (!modal) {
        console.error("Custom Modal HTML elements not found. Falling back to native alert/confirm.");
        // 모달이 없는 경우, 기본 알림으로 대체하여 로직이 끊기지 않도록 합니다.
        if (type === 'confirm') {
            const result = confirm(message);
            if (callback) callback(result);
        } else if (type === 'prompt') {
            const result = prompt(message, initialValue);
            if (callback) callback(result !== null ? result.trim() : false);
        } else {
            alert(message);
            if (callback) callback();
        }
        return; 
    } 

    // Reset visibility
    if (confirmBtn) confirmBtn.classList.add('hidden');
    if (cancelBtn) cancelBtn.classList.add('hidden');
    
    // Set content
    if (messageText) messageText.innerHTML = message;
    if (confirmBtn) confirmBtn.onclick = null;
    if (cancelBtn) cancelBtn.onclick = null;

    if (type === 'prompt') {
        if (!promptInput) {
            promptInput = document.createElement('textarea');
            promptInput.id = 'modalPromptInput';
            promptInput.className = 'w-full p-2 border border-gray-300 rounded-lg mb-4 text-sm resize-y focus:ring-indigo-500 focus:border-indigo-500';
            promptInput.rows = 3;
            // 메시지 아래에 입력 필드 추가
            messageText.parentNode.insertBefore(promptInput, messageText.nextSibling); 
        }
        promptInput.value = initialValue;
        
        if (modalTitle) modalTitle.textContent = '수정';
        if (confirmBtn) {
            confirmBtn.textContent = '수정 완료';
            confirmBtn.classList.remove('hidden');
        }
        if (cancelBtn) {
            cancelBtn.classList.remove('hidden');
        }
        
        if (confirmBtn) confirmBtn.onclick = () => {
            const result = promptInput.value.trim();
            modal.classList.add('hidden');
            if (callback) callback(result);
        };
        if (cancelBtn) cancelBtn.onclick = () => {
            modal.classList.add('hidden');
            if (callback) callback(false); // 취소 시 false 반환
        };
        
    } else if (type === 'confirm') {
        if (modalTitle) modalTitle.textContent = '확인 필요';
        if (confirmBtn) {
            confirmBtn.textContent = '확인';
            confirmBtn.classList.remove('hidden');
        }
        if (cancelBtn) {
            cancelBtn.classList.remove('hidden');
        }
        
        if (confirmBtn) confirmBtn.onclick = () => {
            modal.classList.add('hidden');
            if (callback) callback(true);
        };
        if (cancelBtn) cancelBtn.onclick = () => {
            modal.classList.add('hidden');
            if (callback) callback(false);
        };
    } else { // info/alert
        if (modalTitle) modalTitle.textContent = '알림';
        if (confirmBtn) {
            confirmBtn.textContent = '닫기';
            confirmBtn.classList.remove('hidden');
        }
        
        // ⭐핵심: 알림창의 '닫기' 버튼을 눌렀을 때만 콜백 함수 실행⭐
        if (confirmBtn) confirmBtn.onclick = () => {
            modal.classList.add('hidden');
            if (callback) callback();
        };
    }

    modal.classList.remove('hidden');
}

function customAlert(message, callback = null) {
    showMessage(message, 'info', callback);
}

function customConfirm(message, callback) {
    showMessage(message, 'confirm', callback);
}

function customPrompt(message, initialValue, callback) {
    showMessage(message, 'prompt', callback, initialValue);
}

// =================================================================
// 게시글 검색 및 필터링 함수
// =================================================================
function filterPosts() {
    const criteriaElement = document.getElementById('search-criteria');
    const searchInput = document.getElementById('searchInput');

    if (!criteriaElement || !searchInput) return;

    const criteria = criteriaElement.value;
    const keyword = searchInput.value.toLowerCase().trim();

    if (!keyword) {
        currentDisplayedData = [...boardData];
        return;
    }

    currentDisplayedData = boardData.filter(post => {
        let value = '';
        if (criteria === 'title') {
            value = post.title.toLowerCase();
        } else if (criteria === 'authorName') { // ⭐수정: authorName 사용⭐
            value = post.authorName.toLowerCase();
        } else if (criteria === 'type') {
            value = post.type.toLowerCase();
        }

        return value.includes(keyword);
    });
}


// =================================================================
// 게시판 목록 렌더링 함수
// =================================================================
function renderBoardListHTML(page = 1) {
    currentPage = page;

    const data = currentDisplayedData;
    const totalPosts = data.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = Math.min(startIndex + postsPerPage, totalPosts);

    const currentPosts = data.slice(startIndex, endIndex);

    let tableRows = '';

    if (currentPosts.length > 0) {
        tableRows = currentPosts.map((post, index) => {
            // ⭐게시글 번호는 현재 페이지의 시작 번호부터 계산⭐
            const postNumber = startIndex + index + 1; 
            
            // ⭐중요: 원본 boardData에서 해당 게시글의 인덱스를 찾아 상세 페이지 연결⭐
            const originalIndex = boardData.findIndex(p => p.title === post.title && p.authorName === post.authorName);
            
            const clickHandler = originalIndex !== -1 ? `loadBoardContent('detail', ${originalIndex})` : '';

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
                        onclick="${clickHandler}">
                        ${post.title}
                    </td>
                    <td class="py-2 px-4 text-center text-sm text-gray-500">${post.authorName}</td> 
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
                    <option value="authorName">작성자</option> 
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
                            <th class="py-2 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">작성자</th>
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
// 새 게시글 작성 폼 렌더링 함수
// =================================================================
function renderPostWriteHTML(post = null, index = null) {
    const isEditing = post !== null;
    const title = isEditing ? '게시글 수정' : '새 게시글 작성';
    const saveButtonText = isEditing ? '수정 완료' : '저장';

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
                        <input type="text" id="postTitle" placeholder="제목을 입력하세요." value="${isEditing ? post.title : ''}" class="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
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
// 댓글 개별 항목 렌더링 함수 (수정/삭제 버튼 추가)
// =================================================================
function renderCommentItem(comment, postIndex, isReply = false, parentCommentId = null) {
    const marginClass = isReply ? 'ml-8 mt-3 border-l-2 pl-4 border-gray-100' : 'mt-4';
    const replyFormId = `reply-form-${comment.id}`;

    // 시간 포맷팅
    const timeAgo = (timestamp) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        let interval = seconds / 31536000;

        if (interval > 1) return Math.floor(interval) + "년 전";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "개월 전";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "일 전";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "시간 전";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "분 전";
        return Math.floor(seconds) + "초 전";
    }
    
    // 현재 사용자가 작성자인지 확인
    const isCurrentUserAuthor = comment.authorName === currentUserName;
    
    // 수정/삭제 버튼 HTML
    const actionButtons = isCurrentUserAuthor ? `
        <button onclick="editComment(${postIndex}, ${comment.id}, ${parentCommentId})" class="text-xs text-blue-500 hover:text-blue-700 font-medium">수정</button>
        <button onclick="deleteComment(${postIndex}, ${comment.id}, ${parentCommentId})" class="text-xs text-red-500 hover:text-red-700 font-medium">삭제</button>
    ` : '';

    let html = `
        <div class="comment-item p-4 ${marginClass} bg-gray-50 rounded-lg border border-gray-100 shadow-sm" data-comment-id="${comment.id}">
            <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-semibold text-gray-800">${comment.authorName}</span>
                <div class="flex items-center space-x-3">
                    <span class="text-xs text-gray-500">${timeAgo(comment.timestamp)}</span>
                    ${actionButtons}
                    ${!isReply ? `<button onclick="toggleReplyForm('${replyFormId}')" class="text-xs text-indigo-500 hover:text-indigo-700 font-medium">답글</button>` : ''}
                </div>
            </div>
            <p id="comment-content-${comment.id}" class="text-gray-700 text-sm">${comment.content}</p>
        </div>
        ${!isReply ? `
        <div id="${replyFormId}" class="reply-form ${marginClass} hidden mt-3">
            <div class="flex items-start space-x-2 p-3 bg-white rounded-lg shadow-inner">
                <textarea id="reply-content-${comment.id}" class="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-indigo-500 focus:border-indigo-500" rows="2" placeholder="답글을 입력하세요. (현재: ${currentUserName})"></textarea>
                <button onclick="addReply(${postIndex}, ${comment.id})" class="mt-0.5 py-2 px-3 bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors duration-150 flex-shrink-0">등록</button>
            </div>
        </div>
        ` : ''}
    `;

    // 대댓글 렌더링 (재귀 호출 시 parentCommentId 전달)
    if (comment.replies && comment.replies.length > 0) {
        html += comment.replies.map(reply => renderCommentItem(reply, postIndex, true, comment.id)).join('');
    }

    return html;
}

// =================================================================
// 댓글 목록 전체 렌더링 함수
// =================================================================
function renderCommentsHTML(comments, postIndex) {
    if (!comments || comments.length === 0) {
        return `<p class="text-gray-500 text-center py-6">아직 댓글이 없습니다. 첫 댓글을 남겨보세요.</p>`;
    }

    return comments.map(comment => renderCommentItem(comment, postIndex, false)).join('');
}


// =================================================================
// 새 댓글 추가 함수
// =================================================================
function addComment(postIndex) {
    const commentInput = document.getElementById('newCommentContent');
    const content = commentInput.value.trim();

    if (!content) {
        customAlert('댓글 내용을 입력해 주세요.');
        return;
    }

    const newComment = {
        id: nextCommentId++,
        authorName: currentUserName, // ⭐수정: authorName 사용⭐
        content: content,
        timestamp: Date.now(),
        replies: []
    };

    boardData[postIndex].comments.push(newComment);

    commentInput.value = '';

    refreshComments(postIndex);
}

// =================================================================
// 대댓글 폼 토글 함수
// =================================================================
function toggleReplyForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.classList.toggle('hidden');
        if (!form.classList.contains('hidden')) {
            const commentId = formId.replace('reply-form-', '');
            const replyInput = document.getElementById(`reply-content-${commentId}`);
            if (replyInput) replyInput.focus();
        }
    }
}

// =================================================================
// 대댓글 추가 함수
// =================================================================
function addReply(postIndex, parentCommentId) {
    const replyInput = document.getElementById(`reply-content-${parentCommentId}`);
    const content = replyInput.value.trim();

    if (!content) {
        customAlert('답글 내용을 입력해 주세요.');
        return;
    }

    const newReply = {
        id: nextCommentId++,
        authorName: currentUserName, // ⭐수정: authorName 사용⭐
        content: content,
        timestamp: Date.now(),
    };

    const postComments = boardData[postIndex].comments;
    const parentComment = postComments.find(c => c.id === parentCommentId);

    if (parentComment) {
        if (!parentComment.replies) {
            parentComment.replies = [];
        }
        parentComment.replies.push(newReply);

        replyInput.value = '';

        const replyFormId = `reply-form-${parentCommentId}`;
        document.getElementById(replyFormId).classList.add('hidden');

        refreshComments(postIndex);
    } else {
        customAlert('부모 댓글을 찾을 수 없습니다.');
    }
}


// =================================================================
// 댓글 및 대댓글 삭제 함수
// =================================================================
function deleteComment(postIndex, commentId, parentCommentId = null) {
    customConfirm('정말로 이 댓글을 삭제하시겠습니까?', (result) => {
        if (result) {
            const comments = boardData[postIndex].comments;
            let targetArray = comments;

            if (parentCommentId !== null) {
                // 대댓글인 경우: 부모 댓글을 찾아서 replies 배열에서 삭제
                const parentComment = comments.find(c => c.id === parentCommentId);
                if (parentComment && parentComment.replies) {
                    targetArray = parentComment.replies;
                } else {
                    customAlert('부모 댓글을 찾을 수 없습니다.');
                    return;
                }
            }

            const indexToDelete = targetArray.findIndex(c => c.id === commentId);

            if (indexToDelete !== -1) {
                targetArray.splice(indexToDelete, 1);
                customAlert('댓글이 삭제되었습니다.', () => {
                    refreshComments(postIndex);
                });
            } else {
                customAlert('댓글을 찾을 수 없습니다.');
            }
        }
    });
}


// =================================================================
// 댓글 및 대댓글 수정 함수
// =================================================================
function editComment(postIndex, commentId, parentCommentId = null) {
    const comments = boardData[postIndex].comments;
    let targetComment = null;
    
    if (parentCommentId !== null) {
        // 대댓글인 경우: 부모 댓글을 찾아서 replies 배열에서 대상 댓글 찾기
        const parentComment = comments.find(c => c.id === parentCommentId);
        if (parentComment && parentComment.replies) {
            targetComment = parentComment.replies.find(c => c.id === commentId);
        }
    } else {
        // 일반 댓글인 경우: comments 배열에서 대상 댓글 찾기
        targetComment = comments.find(c => c.id === commentId);
    }

    if (!targetComment) {
        customAlert('수정할 댓글을 찾을 수 없습니다.');
        return;
    }

    customPrompt('댓글 내용을 수정하세요.', targetComment.content, (newContent) => {
        if (newContent && newContent.trim().length > 0) {
            targetComment.content = newContent.trim();
            customAlert('댓글이 성공적으로 수정되었습니다.', () => {
                refreshComments(postIndex);
            });
        } else if (newContent === false) {
            // 취소
            return;
        } else {
            customAlert('수정할 내용을 입력해 주세요.');
        }
    });
}


// =================================================================
// 댓글 영역만 새로고침하는 함수
// =================================================================
function refreshComments(postIndex) {
    const post = boardData[postIndex];
    if (post) {
        const commentsContainer = document.getElementById('commentsContainer');
        if (commentsContainer) {
            commentsContainer.innerHTML = renderCommentsHTML(post.comments, postIndex);

            // 총 댓글 수 업데이트
            const totalComments = post.comments.reduce((count, c) => count + 1 + (c.replies ? c.replies.length : 0), 0);
            const commentCountElement = document.getElementById('commentCount');
            if (commentCountElement) {
                commentCountElement.textContent = `${totalComments}개의 댓글`;
            }
        }
    }
}

// =================================================================
// 게시글 상세 보기 렌더링 함수
// =================================================================
function renderPostDetailHTML(post, index) {
    const typeClass = typeColors[post.type] || 'bg-gray-200 text-gray-800 border border-gray-400 rounded-lg';

    // 총 댓글 수 계산 (댓글 + 모든 대댓글)
    const totalComments = post.comments.reduce((count, c) => count + 1 + (c.replies ? c.replies.length : 0), 0);

    return `
    <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">${post.title}</h1>
    
    <div class="flex items-center space-x-4 border-b border-gray-200 pb-3 mb-6">
    <span class="inline-flex items-center px-3 py-1 text-sm font-semibold ${typeClass}">
    ${post.type}
    </span>
    <span class="text-sm text-gray-500">작성자: ${post.authorName}</span> 
    <span class="text-sm text-gray-500">작성일: ${new Date().toLocaleDateString()}</span> 
    </div>
    
    <div class="prose max-w-none text-gray-800 min-h-[300px] border-b border-gray-200 pb-8 mb-8">
    ${post.content}
    </div>
    
    <div class="pt-4 border-b border-gray-200 pb-6 mb-8">
    <h3 class="text-lg font-semibold text-gray-700 mb-2">첨부 파일</h3>
    <p class="text-gray-500">첨부 파일이 없습니다.</p>
    <div class="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
        <button id="backToListButton" 
            class="py-2 px-4 rounded-lg font-semibold text-gray-700 bg-gray-300 hover:bg-gray-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            목록으로
        </button>

        <div class="flex space-x-3">
            <button id="deletePostButton" onclick="loadBoardContent('delete', ${index})" class="py-2 px-4 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                삭제
            </button>
            <button id="editPostButton" onclick="loadBoardContent('write', ${index})" class="py-2 px-4 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                수정
            </button>
        </div>
    </div>
    </div>

        <div id="comment-section">
            <h3 class="text-xl font-bold text-gray-800 mb-4" id="commentCount">${totalComments}개의 댓글</h3>
            
            <div class="new-comment-form flex items-start space-x-2 p-4 bg-gray-100 rounded-xl mb-6">
                <textarea id="newCommentContent" class="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-indigo-500 focus:border-indigo-500" rows="3" placeholder="댓글을 입력하세요. (현재: ${currentUserName})"></textarea>
                <button id="addCommentButton" data-post-index="${index}" class="mt-0.5 py-3 px-5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors duration-150 flex-shrink-0">등록</button>
            </div>
            
            <div id="commentsContainer" class="space-y-4">
                ${renderCommentsHTML(post.comments, index)}
            </div>
        </div>
    </div>
    `;
}

// =================================================================
// 게시판 상태(목록/작성/상세/삭제) 관리 함수
// =================================================================
function loadBoardContent(state, identifier = null) {
    // 페이지 전환 시 기존 TinyMCE 인스턴스 제거
    if (typeof tinymce !== 'undefined' && tinymce.get('postContentEditor')) {
        tinymce.get('postContentEditor').remove();
    }

    // 메인 콘텐츠 영역을 찾아서 초기화
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
        console.error("Error: .main-content element not found.");
        return;
    }


    if (state === 'list') {
        const page = identifier !== null ? identifier : 1;
        mainContent.innerHTML = renderBoardListHTML(page);

        const writeButton = document.getElementById('writePostButton');
        if (writeButton) {
            writeButton.addEventListener('click', () => {
                loadBoardContent('write');
            });
        }

        // 검색 기능 이벤트 리스너 추가
        const searchButton = document.getElementById('searchButton');
        const searchInput = document.getElementById('searchInput');

        const performSearch = () => {
            filterPosts();
            loadBoardContent('list', 1);
        };

        if (searchButton) {
            searchButton.addEventListener('click', performSearch);
        }

        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performSearch();
                }
            });
        }

    } else if (state === 'write') {
        let postToEdit = null;
        let indexToEdit = null;

        if (identifier !== null) {
            indexToEdit = identifier;
            postToEdit = boardData[indexToEdit];
        }

        mainContent.innerHTML = renderPostWriteHTML(postToEdit, indexToEdit);

        // ⭐TinyMCE 초기화 로직 (글쓰기 및 수정 화면에 에디터 표시)⭐
        if (typeof tinymce !== 'undefined') {
            tinymce.init({
                selector: '#postContentEditor',
                menubar: false,
                language: 'ko',
                plugins: 'advlist autolink lists link charmap print preview anchor searchreplace visualblocks code fullscreen table paste code help wordcount',
                toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | removeformat | help',
                height: 350
            });
        } else {
            console.error("TinyMCE 라이브러리를 찾을 수 없습니다. HTML에 TinyMCE CDN이 포함되었는지 확인하세요.");
        }

        // 파일 첨부, 취소 버튼 로직
        const fileInput = document.getElementById('file-upload');
        const displaySpan = document.getElementById('fileNameDisplay');
        const statusParagraph = document.getElementById('currentFileStatus');

        if (fileInput && displaySpan && statusParagraph) {
            fileInput.addEventListener('change', (e) => {
                const files = e.target.files;
                let displayText;
                let statusText;

                if (files.length === 0) {
                    displayText = '선택된 파일 없음';
                    statusText = '현재 파일 첨부: 없음';
                } else if (files.length === 1) {
                    displayText = files[0].name;
                    statusText = `현재 파일 첨부: ${files[0].name}`;
                } else {
                    displayText = `${files.length}개 파일 선택됨`;
                    statusText = `현재 파일 첨부: ${files.length}개 파일`;
                }

                displaySpan.textContent = displayText;
                statusParagraph.textContent = statusText;
            });
        }

        const cancelButton = document.getElementById('cancelPostButton');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                customConfirm('작성 중인 내용이 저장되지 않습니다. 취소하고 목록으로 돌아가시겠습니까?', (result) => {
                    if (result) {
                        loadBoardContent('list', currentPage);
                    }
                });
            });
        }

        // '저장' 또는 '수정 완료' 버튼에 이벤트 연결
        const saveButton = document.getElementById('savePostButton');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const postType = document.getElementById('postType').value;
                const postTitle = document.getElementById('postTitle').value;

                let content = '';
                const editorElement = document.getElementById('postContentEditor');
                
                // 1. TinyMCE 에디터에서 내용 가져오기 (초기화 성공 시)
                if (typeof tinymce !== 'undefined' && tinymce.get('postContentEditor')) {
                    content = tinymce.get('postContentEditor').getContent();
                } else if (editorElement) {
                    // 2. TinyMCE가 없거나 초기화 실패 시, 일반 textarea에서 내용 가져오기
                    content = editorElement.value;
                }

                // ⭐강화된 유효성 검사: HTML 태그와 공백 엔티티를 제거하여 순수 텍스트 유무 확인⭐
                const plainContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim();

                if (!postType.trim() || !postTitle.trim() || plainContent.length === 0) {
                    customAlert('유형, 제목, 내용을 모두 입력해 주세요.');
                    return; // 저장을 막고 함수 종료
                }
                
                const postData = {
                    type: postType,
                    title: postTitle,
                    content: content,
                    // ⭐작성자 이름은 현재 로그인된 사용자 이름 사용⭐
                    authorName: indexToEdit !== null ? boardData[indexToEdit].authorName : currentUserName,
                    comments: indexToEdit !== null ? boardData[indexToEdit].comments : []
                };

                // 모드에 따른 데이터 처리 (저장/수정)
                if (saveButton.getAttribute('data-mode') === 'edit' && indexToEdit !== null) {
                    boardData[indexToEdit] = postData;
                    customAlert('게시글이 성공적으로 수정되었습니다! 상세 페이지로 돌아갑니다.', () => {
                        // 수정 후에는 상세 페이지로 이동
                        loadBoardContent('detail', indexToEdit);
                    });
                } else {
                    // ⭐새 게시글 저장 (unshift로 최상단에 배치)⭐
                    boardData.unshift(postData);
                    
                    // ⭐핵심: 저장 성공 알림 후 목록으로 이동 및 새 게시글 표시 보장⭐
                    customAlert('게시글이 성공적으로 저장되었습니다! 목록으로 돌아갑니다.', () => {
                        // 1. 현재 목록 데이터(검색 필터)를 새로운 boardData로 갱신
                        currentDisplayedData = [...boardData];
                        // 2. 1페이지로 이동하여 새 게시글이 최상단에 보이게 함
                        loadBoardContent('list', 1);
                    });
                }
            });
        }

    } else if (state === 'detail') {
        const index = identifier;
        const post = boardData[index];
        if (post) {
            mainContent.innerHTML = renderPostDetailHTML(post, index);

            // 댓글 등록 버튼 이벤트 연결
            const addCommentButton = document.getElementById('addCommentButton');
            if (addCommentButton) {
                addCommentButton.addEventListener('click', () => {
                    const postIndex = parseInt(addCommentButton.getAttribute('data-post-index'));
                    addComment(postIndex);
                });
            }

            // '목록으로' 버튼 이벤트 연결
            const backButton = document.getElementById('backToListButton');
            if (backButton) {
                backButton.addEventListener('click', () => {
                    loadBoardContent('list', currentPage);
                });
            }
        } else {
            customAlert('게시글을 찾을 수 없습니다.', () => {
                loadBoardContent('list', currentPage);
            });
        }
    } else if (state === 'delete') {
        const index = identifier;
        customConfirm('정말로 이 게시글을 삭제하시겠습니까?', (result) => {
            if (result) {
                boardData.splice(index, 1);
                customAlert('게시글이 삭제되었습니다.', () => {
                    filterPosts();

                    const totalPages = Math.ceil(currentDisplayedData.length / postsPerPage);
                    let targetPage = currentPage;
                    if (targetPage > totalPages && totalPages > 0) {
                        targetPage = totalPages;
                    } else if (totalPages === 0) {
                        targetPage = 1;
                        currentDisplayedData = [...boardData];
                    }

                    loadBoardContent('list', targetPage);
                });
            }
        });
    }
}