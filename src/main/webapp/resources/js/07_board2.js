// === 컨텍스트/베이스 URL 자동 인식 ===
const CTX =
  (document.body && document.body.getAttribute('data-ctx')) ||
  (function () {
    const parts = (window.location.pathname || '/').split('/');
    return parts.length > 1 && parts[1] ? '/' + parts[1] : '';
  })();

// === 유틸: 응답을 안전하게 JSON으로 변환(HTML 에러페이지 방어) ===
async function toJSONorThrow(r) {
  const ct = r.headers.get('content-type') || '';
  const text = await r.text();
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${text.substring(0, 200)}`);
  if (ct.indexOf('application/json') === -1)
    throw new Error(`Not JSON: ${text.substring(0, 200)}`);
  return JSON.parse(text);
}

// === 전역 상태 ===
let currentDisplayedData = [];
let currentPage = 1;
const postsPerPage = 10;
let currentEditingPostId = null; // 수정 모드에서 사용

// === 세션 기반 현재 사용자 아이디 (JSP에서 window.sessionInfo로 주입함) ===
const currentUserName = window.sessionInfo?.userId || ''; // <-- 여기가 핵심 변경점

// ★ 목록 렌더 동시요청 방지 토큰(레이스 가드)
let listRenderSeq = 0;

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

    if (!tbody) {
      console.error('renderList: #list-tbody not found in DOM');
      return;
    }

    const mySeq = ++listRenderSeq;

    tbody.innerHTML = '';
    if (emptyBox) emptyBox.classList.add('hidden');

    const res = await API.list(page, postsPerPage, keyword);

    if (mySeq !== listRenderSeq) return;

    currentDisplayedData = res.list || [];
    const total = res.totalCount || 0;

    if (currentDisplayedData.length === 0) {
      if (emptyBox) emptyBox.classList.remove('hidden');
    } else {
      const tpl = $('#tpl-list-row');
      if (!tpl || !tpl.content) {
        console.error('renderList: #tpl-list-row template not found or invalid');
      } else {
        currentDisplayedData.forEach((post, idx) => {
          const clone = document.importNode(tpl.content, true);
          const numberTd = clone.querySelector('.td-number');
          const typeSpan = clone.querySelector('.td-type');
          const titleTd = clone.querySelector('.td-title');
          const authorTd = clone.querySelector('.td-author');

          if (numberTd) numberTd.textContent = (total - ((page - 1) * postsPerPage)) - idx;
          if (typeSpan) typeSpan.textContent = post.board_type || '-';
          if (titleTd) {
            titleTd.textContent = post.board_title || '(제목 없음)';
            titleTd.addEventListener('click', () => openDetail(post.board_id));
          }
          if (authorTd) authorTd.textContent = post.worker_id || '-';

          tbody.appendChild(clone);
        });
      }
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
  if (!container) {
    console.warn('renderPagination: #pagination not found in DOM');
    return;
  }
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

    const detailTitle = $('#detail-title');
    if (detailTitle) detailTitle.textContent = post.board_title || '';

    const typeEl = $('#detail-type');
    if (typeEl) {
      typeEl.textContent = post.board_type || '';
      typeEl.className = 'inline-flex items-center px-3 py-1 text-sm font-semibold rounded-lg bg-indigo-50 text-indigo-700';
    } else {
      console.warn('openDetail: #detail-type not found');
    }

    const authorEl = $('#detail-author');
    if (authorEl) authorEl.textContent = post.worker_id || '';
    else console.warn('openDetail: #detail-author not found');

    const dateEl = $('#detail-date');
    if (dateEl) dateEl.textContent = post.board_date || '';
    else console.warn('openDetail: #detail-date not found');

    const contentEl = $('#detail-content');
    if (contentEl) contentEl.innerHTML = post.board_content || '';
    else console.warn('openDetail: #detail-content not found');

    // 버튼들: 존재 여부 체크 후 안전하게 할당
    const backBtn = $('#backToListButton');
    const editBtn = $('#editPostButton');
    const deleteBtn = $('#deletePostButton');

    if (backBtn) {
      backBtn.onclick = () => renderList(currentPage);
    } else {
      console.warn('openDetail: #backToListButton not found');
    }

    if (editBtn) {
      editBtn.onclick = () => openWrite(post);
    } else {
      console.warn('openDetail: #editPostButton not found');
    }

    if (deleteBtn) {
      deleteBtn.onclick = () => {
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
    } else {
      console.warn('openDetail: #deletePostButton not found');
    }
  } catch (err) {
    alert(`[상세 조회 실패] ${err.message}`);
    console.error(err);
  }
}

// === 글쓰기/수정 폼 ===
function openWrite(post) {
  setView('write');
  currentEditingPostId = post ? post.board_id : null;

  const writeTitleEl = $('#write-title');
  if (writeTitleEl) writeTitleEl.textContent = post ? '게시글 수정' : '새 게시글 작성';

  const postTypeEl = $('#postType');
  const postTitleEl = $('#postTitle');
  const postContentEditorEl = $('#postContentEditor');

  if (postTypeEl) postTypeEl.value = post ? (post.board_type || '') : '';
  if (postTitleEl) postTitleEl.value = post ? (post.board_title || '') : '';
  if (postContentEditorEl) postContentEditorEl.value = post ? (post.board_content || '') : '';

  // TinyMCE 사용 시 초기화
  if (window.tinymce) {
    if (tinymce.get('postContentEditor')) {
      tinymce.get('postContentEditor').setContent(post ? (post.board_content || '') : '');
    } else {
      tinymce.init({
        selector: '#postContentEditor',
        language: 'ko',
        // 언어파일은 프로젝트에 호스팅해서 사용 권장:
        // 예: `${CTX}/resources/js/tinymce/langs/ko.js`
        // 만약 해당 파일을 호스팅하지 않으면 language_url 삭제(또는 language:'en' 사용)
        language_url: `${CTX}/resources/js/tinymce/langs/ko.js`,
        menubar: false,
        plugins: 'link lists code',
        toolbar: 'undo redo | bold italic underline | bullist numlist | link | code',
        setup: (ed) => {
          if (post) ed.on('init', () => ed.setContent(post.board_content || ''));
        }
      });
    }
  }

  const cancelBtn = $('#cancelPostButton');
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      if (post && post.board_id) openDetail(post.board_id);
      else renderList(currentPage);
    };
  } else {
    console.warn('openWrite: #cancelPostButton not found');
  }
}

// === 저장 버튼 핸들러 ===
async function onSave() {
  try {
    const typeEl = $('#postType');
    const titleEl = $('#postTitle');
    const contentEditorEl = $('#postContentEditor');

    const type = typeEl ? typeEl.value.trim() : '';
    const title = titleEl ? titleEl.value.trim() : '';
    const content = (window.tinymce && tinymce.get('postContentEditor'))
      ? tinymce.get('postContentEditor').getContent()
      : (contentEditorEl ? contentEditorEl.value.trim() : '');

    if (!type || !title || !content) {
      customAlert('유형, 제목, 내용을 모두 입력하세요.');
      return;
    }

    const dto = {
      board_title: title,
      board_content: content,
      board_type: type,
      board_attatch: ''
    };

    if (currentEditingPostId) {
      dto.board_id = currentEditingPostId;
      await API.update(currentEditingPostId, dto);
      customAlert('게시글이 수정되었습니다.', () => openDetail(currentEditingPostId));
    } else {
      await API.create(dto);
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
  else console.warn('bindEvents: #writePostButton not found');

  const saveBtn = $('#savePostButton');
  if (saveBtn) saveBtn.addEventListener('click', onSave);
  else console.warn('bindEvents: #savePostButton not found');

  const searchBtn = $('#searchButton');
  if (searchBtn) searchBtn.addEventListener('click', onSearch);
  else console.warn('bindEvents: #searchButton not found');
}

// === 시작 ===
document.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  renderList(1);
});
