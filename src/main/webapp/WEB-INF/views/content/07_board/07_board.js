// 07_board.js

// 게시판 데이터 (샘플)
const boardData = [
    { type: '자유', title: '2024년 1분기 생산 목표 달성 축하 이벤트', content: '축하 이벤트 상세 내용입니다.', authorId: 'N24101413' },
    { type: '공유', title: '재고 관리 최적화: FIFO 원칙 적용 성공 사례 공유', content: 'FIFO 원칙을 적용한 재고 관리 성공 사례에 대한 상세 내용입니다.', authorId: 'N24101412' },
    { type: '안내', title: '[필독] 11월 MES 시스템 정기 업데이트 및 서버 점검 일정 공지', content: '11월 MES 시스템 업데이트 및 점검에 대한 상세 안내입니다.', authorId: 'N24100103' },
    { type: '긴급', title: '🚨 라인 5 품질 센서 오작동, 수동 검사 전환 완료!', content: '라인 5의 품질 센서 오작동으로 인한 긴급 수동 검사 전환 상황에 대한 보고입니다.', authorId: 'N24092598' },
    { type: '자유', title: '생산성 향상에 도움이 된 도서 \'린 제조의 정석\' 후기', content: '도서 \'린 제조의 정석\'을 읽고 작성한 후기입니다.', authorId: 'N24100345' },
    { type: '안내', title: '신규 입고 도서의 품목 등록 기준 및 규격 안내', content: '신규 입고 도서의 품목 등록 기준에 대한 상세 안내입니다.', authorId: 'N24101267' },
    { type: '안내', title: '4분기 공정별 안전 교육 의무 이수 대상자 명단 공지', content: '4분기 공정별 안전 교육 의무 이수 대상자 명단 및 일정에 대한 공지입니다.', authorId: 'N24090120' },
    { type: '자유', title: '공장 물류센터 자동화 로봇 이용 공모합니다!', content: '공장 물류센터 자동화 로봇 이용에 대한 아이디어 공모 안내입니다.', authorId: 'N24100574' },
    { type: '공유', title: '품질 불량률 10% 감소 달성! 공정 개선 아이디어 제안', content: '품질 불량률 감소를 위한 공정 개선 아이디어 제안 상세 내용입니다.', authorId: 'N24091531' },
    { type: '자유', title: '현장 작업 시 필요한 개인 보호 장비 개선 건의', content: '현장 작업 시 개인 보호 장비 개선에 대한 건의 사항입니다.', authorId: 'N24100856' },
    { type: '자유', title: '이번 주 가장 힘들었던 공정은 무엇이었는지 자유롭게 이야기해 보세요.', content: '이번 주 힘들었던 공정에 대한 자유로운 의견 공유입니다.', authorId: 'N24100910' },
    { type: '공유', title: '새로운 롤모델 교육 자료 공유', content: '새로운 롤모델 교육 자료 공유입니다.', authorId: 'N24010101' },
    { type: '안내', title: '월간 시스템 점검 예정', content: '월간 시스템 점검 예정 안내입니다.', authorId: 'N24020202' }
].reverse(); 

// 메인 콘텐츠 영역 DOM
const mainContent = document.querySelector('.main-content');

// ⭐현재 화면에 표시할 게시글 데이터 (검색 결과에 따라 변경됨)⭐
let currentDisplayedData = [...boardData]; 
let currentPage = 1; 


// 유형별 색상 매핑 (은은하고 프로페셔널한 톤 유지)
const typeColors = {
    // 공유: Muted Green
    '공유': 'bg-green-100 text-green-800 border border-green-300 rounded-lg', 
    // 안내: Muted Blue
    '안내': 'bg-blue-100 text-blue-800 border border-blue-300 rounded-lg', 
    // 긴급: Muted Red/Orange
    '긴급': 'bg-red-100 text-red-800 border border-red-300 rounded-lg', 
    // 자유: Muted Gray
    '자유': 'bg-gray-200 text-gray-800 border border-gray-400 rounded-lg', 
    '공지': 'bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg',
    '보고': 'bg-purple-100 text-purple-800 border border-purple-300 rounded-lg',
    '기타': 'bg-gray-100 text-gray-800 border border-gray-300 rounded-lg',
};

// 페이징 관련 상수 및 변수 정의
const postsPerPage = 10; 


// =================================================================
// 게시글 검색 및 필터링 함수
// =================================================================
function filterPosts() {
    const criteriaElement = document.getElementById('search-criteria');
    const searchInput = document.getElementById('searchInput');

    // DOM이 로드되지 않았을 경우를 대비
    if (!criteriaElement || !searchInput) return;

    const criteria = criteriaElement.value;
    const keyword = searchInput.value.toLowerCase().trim();

    if (!keyword) {
        currentDisplayedData = [...boardData]; // 키워드가 없으면 전체 목록
        return;
    }

    currentDisplayedData = boardData.filter(post => {
        let value = '';
        if (criteria === 'title') {
            value = post.title.toLowerCase();
        } else if (criteria === 'authorId') {
            value = post.authorId.toLowerCase();
        } else if (criteria === 'type') {
            value = post.type.toLowerCase();
        }
        
        // 검색 조건에 해당하는 값에 키워드가 포함되어 있는지 확인
        return value.includes(keyword);
    });
}


// =================================================================
// 게시판 목록 렌더링 함수
// =================================================================
function renderBoardListHTML(page = 1) {
    currentPage = page; 

    const data = currentDisplayedData; // 필터링된 데이터 사용
    const totalPosts = data.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = Math.min(startIndex + postsPerPage, totalPosts);

    const currentPosts = data.slice(startIndex, endIndex);

    let tableRows = '';
    
    if (currentPosts.length > 0) {
        tableRows = currentPosts.map((post, index) => {
            // 수정된 순번 계산 로직: 페이지 순서에 맞는 오름차순 순번 계산 (1, 2, 3... 11, 12, 13...)
            const postNumber = startIndex + index + 1; 
            
            // 필터링된 목록에서 원본 boardData의 인덱스를 찾아 상세 페이지 연결
            const originalIndex = boardData.findIndex(p => p.title === post.title && p.authorId === post.authorId);
            
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
                    <td class="py-2 px-4 text-center text-sm text-gray-500">${post.authorId}</td> 
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
    
    // 페이지네이션은 필터링된 데이터의 총 페이지 수 사용
    const paginationHTML = generatePaginationHTML(totalPages, currentPage);

    return `
        <h2 class="text-3xl font-bold text-gray-800 mb-6">게시판 목록</h2>

        <div class="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-lg mb-6 border border-gray-200 space-y-4 sm:space-y-0">
            <div class="flex items-center space-x-2 w-full sm:w-auto">
                <select id="search-criteria" class="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                    <option value="title">제목</option>
                    <option value="authorId">작성자 ID</option>
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
                            <th class="py-2 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">작성자 ID</th>
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
// 새 게시글 작성 폼 렌더링 함수 (TinyMCE 설정 반영)
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
// 게시글 상세 보기 렌더링 함수 (변경 없음)
// =================================================================
function renderPostDetailHTML(post, index) { 
    const typeClass = typeColors[post.type] || 'bg-gray-200 text-gray-800 border border-gray-400 rounded-lg';

    return `
        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h1 class="text-3xl font-bold text-gray-800 mb-4">${post.title}</h1>
            
            <div class="flex items-center space-x-4 border-b border-gray-200 pb-3 mb-6">
                <span class="inline-flex items-center px-3 py-1 text-sm font-semibold ${typeClass}">
                    ${post.type}
                </span>
                <span class="text-sm text-gray-500">작성자 ID: ${post.authorId}</span> 
                <span class="text-sm text-gray-500">작성일: ${new Date().toLocaleDateString()}</span> 
            </div>

            <div class="prose max-w-none text-gray-800 min-h-[300px] border-b border-gray-200 pb-8 mb-8">
                ${post.content}
            </div>

            <div class="pt-4">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">첨부 파일</h3>
                <p class="text-gray-500">첨부 파일이 없습니다.</p>
            </div>

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

    if (state === 'list') {
        const page = identifier !== null ? identifier : 1;
        mainContent.innerHTML = renderBoardListHTML(page);

        const writeButton = document.getElementById('writePostButton');
        if (writeButton) {
            writeButton.addEventListener('click', () => {
                // 검색 상태를 초기화하지 않음 (목록으로 돌아왔으니 검색 결과를 유지)
                loadBoardContent('write'); 
            });
        }
        
        // 검색 기능 이벤트 리스너 추가 (목록 렌더링 시마다)
        const searchButton = document.getElementById('searchButton');
        const searchInput = document.getElementById('searchInput');

        const performSearch = () => {
            filterPosts(); // 필터링 실행, currentDisplayedData 업데이트
            loadBoardContent('list', 1); // 1페이지부터 다시 목록 렌더링
        };

        if (searchButton) {
            searchButton.addEventListener('click', performSearch);
        }
        
        if (searchInput) {
            // Enter 키 이벤트 추가
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); // 기본 폼 제출 방지
                    performSearch();
                }
            });
        }
        // 검색 필드의 초기 상태를 유지
        if (searchInput) {
            // 필터링된 목록을 표시하는 경우, 검색어는 이미 반영되었음
            // 필요하다면 이곳에 마지막 검색어/조건을 로드하는 로직을 추가할 수 있음
        }

    } else if (state === 'write') {
        let postToEdit = null;
        let indexToEdit = null;

        if (identifier !== null) {
            indexToEdit = identifier;
            postToEdit = boardData[indexToEdit];
        }
        
        mainContent.innerHTML = renderPostWriteHTML(postToEdit, indexToEdit);
        
        // TinyMCE 초기화 로직
        if (typeof tinymce !== 'undefined') {
            tinymce.init({
                selector: '#postContentEditor', 
                // ⭐1. 상단 영어 메뉴바 완전히 제거⭐
                menubar: false,
                // ⭐2. TinyMCE 한국어 설정 유지⭐
                language: 'ko',
                // 3. 'table' 플러그인 포함
                plugins: 'advlist autolink lists link charmap print preview anchor searchreplace visualblocks code fullscreen table paste code help wordcount',
                // ⭐4. 툴바에 표(table) 기능 추가 및 기본 기능 간소화⭐
                toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | removeformat | help',
                height: 350
            });
        } else {
             console.error("TinyMCE 라이브러리를 찾을 수 없습니다.");
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
                if (confirm('작성 중인 내용이 저장되지 않습니다. 취소하고 목록으로 돌아가시겠습니까?')) {
                    // 검색 결과가 있는 경우, 현재 페이지와 필터링된 목록 상태 유지
                    loadBoardContent('list', currentPage); 
                }
            });
        }
        
        // '저장' 또는 '수정 완료' 버튼에 이벤트 연결
        const saveButton = document.getElementById('savePostButton');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                
                const postType = document.getElementById('postType').value;
                const postTitle = document.getElementById('postTitle').value;
                
                let content = '';
                if (typeof tinymce !== 'undefined' && tinymce.get('postContentEditor')) {
                    content = tinymce.get('postContentEditor').getContent();
                }

                const plainContent = content.replace(/<[^>]*>/g, '').trim();

                if (!postType || postType === '유형 선택' || !postTitle.trim() || plainContent.length === 0) {
                    alert('유형, 제목, 내용을 모두 입력해 주세요.');
                    return; 
                }

                const postData = {
                    type: postType,
                    title: postTitle,
                    content: content,
                    authorId: indexToEdit !== null ? boardData[indexToEdit].authorId : 'N24000000' 
                };

                // 모드에 따른 데이터 처리 (저장/수정)
                if (saveButton.getAttribute('data-mode') === 'edit' && indexToEdit !== null) {
                    boardData[indexToEdit] = postData;
                    alert('게시글이 성공적으로 수정되었습니다!');
                    // 수정 후 상세 보기로 이동
                    loadBoardContent('detail', indexToEdit); 
                } else {
                    boardData.unshift(postData); 
                    alert('게시글이 성공적으로 저장되었습니다!');
                    // 새 글 작성 후 검색 상태 초기화하고 1페이지로 이동 (새 글은 1페이지에 나타나야 함)
                    currentDisplayedData = [...boardData];
                    loadBoardContent('list', 1); 
                }
            });
        }

    } else if (state === 'detail') { 
        const index = identifier;
        const post = boardData[index];
        if (post) {
            mainContent.innerHTML = renderPostDetailHTML(post, index); 

            // '목록으로' 버튼 이벤트 연결
            const backButton = document.getElementById('backToListButton');
            if (backButton) {
                backButton.addEventListener('click', () => {
                    // 검색 결과가 있는 경우, 현재 페이지와 필터링된 목록 상태 유지
                    loadBoardContent('list', currentPage); 
                });
            }
        } else {
            alert('게시글을 찾을 수 없습니다.');
            loadBoardContent('list', currentPage);
        }
    } else if (state === 'delete') { 
        const index = identifier;
        if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            boardData.splice(index, 1); 
            alert('게시글이 삭제되었습니다.');
            
            // 삭제 후 검색 결과 업데이트
            filterPosts();
            
            const totalPages = Math.ceil(currentDisplayedData.length / postsPerPage);
            let targetPage = currentPage;
            if (targetPage > totalPages && totalPages > 0) {
                targetPage = totalPages; 
            } else if (totalPages === 0) {
                targetPage = 1; 
                currentDisplayedData = [...boardData]; // 빈 페이지가 되면 전체 목록으로 리셋
            }
            
            loadBoardContent('list', targetPage); 
        }
    }
}
