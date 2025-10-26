/* ============================
 *  07_board2.js (FULL)
 *  - 컨텍스트 경로 자동 인식
 *  - JSON 파싱 방어(HTML 에러페이지 대비)
 *  - /board REST API 연동
 * ============================ */

// === 컨텍스트/베이스 URL 자동 인식 ===
const CTX =
  (document.body && document.body.getAttribute('data-ctx')) ||
  (function () {
    const parts = (window.location.pathname || '/').split('/');
    // ['', 'mes', '...'] -> '/mes'
    return parts.length > 1 && parts[1] ? '/' + parts[1] : '';
  })();

// === 유틸: 응답을 안전하게 JSON으로 변환(HTML 에러페이지 방어) ===
async function toJSONorThrow(r) {
  const ct = r.headers.get('content-type') || '';
  const text = await r.text(); // 먼저 문자열로 받는다(404 HTML 방어)
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${text.substring(0, 200)}`);
  if (ct.indexOf('application/json') === -1)
    throw new Error(`Not JSON: ${text.substring(0, 200)}`);
  return JSON.parse(text);
}

// === 전역 상태 ===
let currentDisplayedData = [];
let currentPage = 1;
const postsPerPage = 10;
const currentUserName = '관리자(N24100001)';
let currentEditingPostId = null; // 수정 모드에서 사용

// === 서버 API ===
const API = {
  list: (page = 1, size = 10, keyword = '') =>
    fetch(`${CTX}/board/list?page=${page}&size=${size}&keyword=${encodeURIComponent(keyword || '')}`)
      .then(toJSONorThrow),
  get: (id) =>
    fetch(`${CTX}/board/${id}`).then(toJSONorThrow),
  create: (dto) =>
    fetch(`${CTX}/board`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    }).then(toJSONorThrow),
  update: (id, dto) =>
    fetch(`${CTX}/board/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    }).then(r => r.text()),
  delete: (id) =>
    fetch(`${CTX}/board/${id}`, { method: 'DELETE' }).then(r => r.text()),
};

// === DOM 헬퍼 ===
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// === 뷰 전환 ===
function setView(view) {
  $$('#view-list, #view-write, #view-detail').forEach((el) => el.classList.add('hidden'));
  const target = document.getElementById(`view-${view}`);
  if (target) target.classList.remove('hidden');
}

// === 목록 렌더 ===
async function renderList(page = 1) {
  try {
    currentPage = page;
    setView('list');

    const tbody = $('#list-tbody');
    const emptyBox = $('#empty-list');
    const keyword = ($('#searchInput')?.value || '').trim();

    tbody.innerHTML = '';
    emptyBox.classList.add('hidden');

    const res = await API.list(page, postsPerPage, keyword);
    currentDisplayedData = res.list || [];
    const total = res.totalCount || 0;

    if (currentDisplayedData.length === 0) {
      emptyBox.classList.remove('hidden');
    } else {
      // 템플릿 사용
      const tpl = $('#tpl-list-row');
      currentDisplayedData.forEach((post, idx) => {
        const clone = document.importNode(tpl.content, true);
        const numberTd = clone.querySelector('.td-number');
        const typeSpan = clone.querySelector('.td-type');
        const titleTd = clone.querySelector('.td-title');
        const authorTd = clone.querySelector('.td-author');

        numberTd.textContent = (total - ((page - 1) * postsPerPage)) - idx;
        typeSpan.textContent = post.board_type || '-';
        titleTd.textContent = post.board_title || '(제목 없음)';
        authorTd.textContent = post.worker_id || '-';

        titleTd.addEventListener('click', () => openDetail(post.board_id));
        tbody.appendChild(clone);
      });
    }

    renderPagination(total, page);
  } catch (err) {
    alert(`[목록 조회 실패] ${err.message}`);
    console.error(err);
  }
}

// === 페이지네이션 렌더 ===
function renderPagination(total, page) {
  const totalPages = Math.max(1, Math.ceil(total / postsPerPage));
  const container = $('#pagination');
  container.innerHTML = '';

  const makeBtn = (label, target, disabled = false, active = false) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = 'px-3 py-1 rounded border text-sm';
    if (active) btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');
    else btn.classList.add('bg-white', 'text-gray-700', 'border-gray-300');

    if (disabled) {
      btn.disabled = true;
      btn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      btn.addEventListener('click', () => renderList(target));
    }
    return btn;
  };

  container.appendChild(makeBtn('«', 1, page === 1));
  container.appendChild(makeBtn('‹', Math.max(1, page - 1), page === 1));

  const span = 2;
  const start = Math.max(1, page - span);
  const end = Math.min(totalPages, page + span);

  for (let i = start; i <= end; i++) {
    container.appendChild(makeBtn(String(i), i, false, i === page));
  }

  container.appendChild(makeBtn('›', Math.min(totalPages, page + 1), page === totalPages));
  container.appendChild(makeBtn('»', totalPages, page === totalPages));
}

// === 상세 화면 ===
async function openDetail(id) {
  try {
    const post = await API.get(id);
    if (!post) {
      alert('게시글을 찾을 수 없습니다.');
      renderList(currentPage);
      return;
    }
    setView('detail');

    $('#detail-title').textContent = post.board_title || '';
    const typeEl = $('#detail-type');
    typeEl.textContent = post.board_type || '';
    typeEl.className = 'inline-flex items-center px-3 py-1 text-sm font-semibold rounded-lg bg-indigo-50 text-indigo-700';

    $('#detail-author').textContent = post.worker_id || '';
    $('#detail-date').textContent = post.board_date || '';
    $('#detail-content').innerHTML = post.board_content || '';

    // 버튼 이벤트
    $('#backToListButton').onclick = () => renderList(currentPage);
    $('#editPostButton').onclick = () => openWrite(post);
    $('#deletePostButton').onclick = () => {
      customConfirm('정말로 이 게시글을 삭제하시겠습니까?', async (ok) => {
        if (!ok) return;
        try {
          await API.delete(post.board_id);
          customAlert('게시글이 삭제되었습니다.', () => renderList(currentPage));
        } catch (err) {
          alert(`[삭제 실패] ${err.message}`);
        }
      });
    };
  } catch (err) {
    alert(`[상세 조회 실패] ${err.message}`);
    console.error(err);
  }
}

// === 글쓰기/수정 폼 ===
function openWrite(post) {
  setView('write');
  currentEditingPostId = post ? post.board_id : null;

  $('#write-title').textContent = post ? '게시글 수정' : '새 게시글 작성';
  $('#postType').value = post ? (post.board_type || '') : '';
  $('#postTitle').value = post ? (post.board_title || '') : '';
  $('#postContentEditor').value = post ? (post.board_content || '') : '';

  // TinyMCE 사용 시 초기화
  if (window.tinymce) {
    if (tinymce.get('postContentEditor')) {
      tinymce.get('postContentEditor').setContent(post ? (post.board_content || '') : '');
    } else {
      tinymce.init({
        selector: '#postContentEditor',
        language: 'ko',
        menubar: false,
        plugins: 'link lists code',
        toolbar: 'undo redo | bold italic underline | bullist numlist | link | code',
        setup: (ed) => {
          if (post) ed.on('init', () => ed.setContent(post.board_content || ''));
        }
      });
    }
  }

  $('#cancelPostButton').onclick = () => {
    if (post && post.board_id) openDetail(post.board_id);
    else renderList(currentPage);
  };
}

// === 저장 버튼 핸들러 ===
async function onSave() {
  try {
    const type = $('#postType').value.trim();
    const title = $('#postTitle').value.trim();
    const content = (window.tinymce && tinymce.get('postContentEditor'))
      ? tinymce.get('postContentEditor').getContent()
      : $('#postContentEditor').value.trim();

    if (!type || !title || !content) {
      customAlert('유형, 제목, 내용을 모두 입력하세요.');
      return;
    }

    const dto = {
      board_title: title,
      board_content: content,
      board_type: type,
      board_attatch: '',
      worker_id: currentUserName
    };

    if (currentEditingPostId) {
      await API.update(currentEditingPostId, dto);
      customAlert('게시글이 수정되었습니다.', () => openDetail(currentEditingPostId));
    } else {
      const created = await API.create(dto); // { id: 'B0000000001' } 기대
      customAlert('게시글이 등록되었습니다.', () => renderList(1));
    }
  } catch (err) {
    alert(`[저장 실패] ${err.message}`);
    console.error(err);
  }
}

// === 검색 버튼 ===
function onSearch() {
  renderList(1);
}

// === 알림/확인 모달 (간단 래핑) ===
function customAlert(msg, callback) {
  // 간단히 window.alert로 처리 (필요 시 커스텀 모달 연동)
  alert(msg);
  if (callback) callback();
}
function customConfirm(msg, callback) {
  const ok = confirm(msg);
  callback(!!ok);
}

// === 초기 바인딩 ===
function bindEvents() {
  const writeBtn = $('#writePostButton');
  if (writeBtn) writeBtn.addEventListener('click', () => openWrite(null));

  const saveBtn = $('#savePostButton');
  if (saveBtn) saveBtn.addEventListener('click', onSave);

  const searchBtn = $('#searchButton');
  if (searchBtn) searchBtn.addEventListener('click', onSearch);

  const backBtn = $('#backToListButton');
  if (backBtn) backBtn.addEventListener('click', () => renderList(currentPage));
}

// === 시작 ===
document.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  renderList(1);
});
