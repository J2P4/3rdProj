// ===== 데이터 (샘플) =====
const boardData = [
  // ... (사용자가 준 샘플 그대로) ...
].reverse();

const typeColors = {
  '공유': 'bg-green-100 text-green-800 border border-green-300',
  '안내': 'bg-blue-100 text-blue-800 border border-blue-300',
  '긴급': 'bg-red-100 text-red-800 border border-red-300',
  '자유': 'bg-gray-200 text-gray-800 border border-gray-400',
  '공지': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  '보고': 'bg-purple-100 text-purple-800 border border-purple-300',
  '기타': 'bg-gray-100 text-gray-800 border border-gray-300',
};

let currentDisplayedData = [...boardData];
let currentPage = 1;
const postsPerPage = 10;
const currentUserName = '관리자(N24100001)';
let nextCommentId = 6;

// ===== 공통 DOM =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const viewList   = $('#view-list');
const viewWrite  = $('#view-write');
const viewDetail = $('#view-detail');

// ===== 모달 =====
function showMessage(message, type = 'info', callback = null, initialValue = '') {
  const modal = $('#customModal');
  const msg = $('#modalMessage');
  const ok = $('#modalConfirmBtn');
  const cancel = $('#modalCancelBtn');
  const title = $('#modalTitle');

  if (!modal) { // fallback
    if (type === 'confirm') return callback?.(confirm(message));
    if (type === 'prompt')  return callback?.(prompt(message, initialValue) ?? false);
    alert(message); return callback?.();
  }

  // reset
  cancel.classList.add('hidden');
  ok.classList.remove('hidden');
  ok.textContent = '확인';
  msg.textContent = message;

  let inputEl = modal.querySelector('#modalPromptInput');
  if (inputEl) inputEl.remove();

  if (type === 'prompt') {
    title.textContent = '수정';
    cancel.classList.remove('hidden');
    ok.textContent = '수정 완료';
    inputEl = document.createElement('textarea');
    inputEl.id = 'modalPromptInput';
    inputEl.className = 'w-full p-2 border rounded-lg mb-4 text-sm';
    inputEl.rows = 3;
    inputEl.value = initialValue;
    msg.insertAdjacentElement('afterend', inputEl);

    ok.onclick = () => { modal.classList.add('hidden'); callback?.(inputEl.value.trim()); };
    cancel.onclick = () => { modal.classList.add('hidden'); callback?.(false); };
  } else if (type === 'confirm') {
    title.textContent = '확인 필요';
    cancel.classList.remove('hidden');
    ok.onclick = () => { modal.classList.add('hidden'); callback?.(true); };
    cancel.onclick = () => { modal.classList.add('hidden'); callback?.(false); };
  } else {
    title.textContent = '알림';
    ok.onclick = () => { modal.classList.add('hidden'); callback?.(); };
  }

  modal.classList.remove('hidden');
}
const customAlert  = (m, cb) => showMessage(m, 'info', cb);
const customConfirm= (m, cb) => showMessage(m, 'confirm', cb);
const customPrompt = (m, init, cb)=> showMessage(m, 'prompt', cb, init);

// ===== 유틸 =====
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts)/1000);
  const u = [[31536000,'년'],[2592000,'개월'],[86400,'일'],[3600,'시간'],[60,'분']];
  for (const [sec,label] of u) if (s/sec>=1) return `${Math.floor(s/sec)}${label} 전`;
  return `${s}초 전`;
}
function setView(view) {
  viewList.classList.toggle('hidden', view!=='list');
  viewWrite.classList.toggle('hidden', view!=='write');
  viewDetail.classList.toggle('hidden', view!=='detail');
}
function clearChildren(node){ while(node.firstChild) node.removeChild(node.firstChild); }

function colorClassByType(type){
  return typeColors[type] ?? 'bg-gray-200 text-gray-800 border';
}

// ===== 검색 =====
function filterPosts() {
  const criteria = $('#search-criteria')?.value || 'title';
  const keyword = ($('#searchInput')?.value || '').toLowerCase().trim();
  if (!keyword) { currentDisplayedData = [...boardData]; return; }

  currentDisplayedData = boardData.filter(p=>{
    const m = (criteria==='title') ? p.title
            : (criteria==='authorName') ? p.authorName
            : (criteria==='type') ? p.type : '';
    return (m||'').toLowerCase().includes(keyword);
  });
}

// ===== 목록 렌더 =====
function renderList(page=1){
  currentPage = page;
  setView('list');

  const tbody = $('#list-tbody');
  const empty = $('#empty-list');
  const pagination = $('#pagination');
  clearChildren(tbody); clearChildren(pagination);

  const total = currentDisplayedData.length;
  const totalPages = Math.max(1, Math.ceil(total/postsPerPage));
  const startIndex = (page-1)*postsPerPage;
  const slice = currentDisplayedData.slice(startIndex, startIndex+postsPerPage);

  if (slice.length===0) {
    empty.classList.remove('hidden');
  } else {
    empty.classList.add('hidden');
    const rowTpl = $('#tpl-list-row').content;
    slice.forEach((post, idx)=>{
      const tr = rowTpl.cloneNode(true);
      tr.querySelector('.td-number').textContent = startIndex + idx + 1;

      const typeSpan = tr.querySelector('.td-type');
      typeSpan.textContent = post.type;
      typeSpan.className = `td-type inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg ${colorClassByType(post.type)}`;

      const titleTd = tr.querySelector('.td-title');
      titleTd.textContent = post.title;
      titleTd.onclick = ()=>{
        const originalIndex = boardData.findIndex(p=> p.title===post.title && p.authorName===post.authorName);
        loadBoardContent('detail', originalIndex);
      };

      tr.querySelector('.td-author').textContent = post.authorName;
      tbody.appendChild(tr);
    });
  }

  // pagination
  const btn = (text, disabled, onClick, highlighted=false)=>{
    const b = document.createElement('button');
    b.textContent = text;
    b.className = `px-3 py-1 text-sm rounded-lg ${highlighted ? 'bg-indigo-600 text-white font-bold':'text-gray-600 hover:bg-gray-100'} ${disabled?'opacity-50 cursor-not-allowed':''}`;
    if (!disabled) b.onclick = onClick;
    pagination.appendChild(b);
  };

  btn('이전', page===1, ()=>renderList(page-1));
  const visible=5;
  let sp = Math.max(1, page - Math.floor(visible/2));
  let ep = Math.min(totalPages, sp+visible-1);
  if (ep-sp+1<visible) sp = Math.max(1, ep-visible+1);
  for (let i=sp;i<=ep;i++) btn(String(i), false, ()=>renderList(i), i===page);
  btn('다음', page===totalPages, ()=>renderList(page+1));
}

// ===== 글쓰기/수정 =====
let editingIndex = null;
function openWrite(post=null, index=null){
  setView('write');
  editingIndex = (index??null);

  $('#write-title').textContent = post? '게시글 수정':'새 게시글 작성';
  $('#savePostButton').dataset.mode = post? 'edit':'new';
  $('#postType').value = post?.type ?? '';
  $('#postTitle').value = post?.title ?? '';

  const editorInit = () => {
    if (typeof tinymce !== 'undefined') {
      tinymce.init({
        selector:'#postContentEditor',
        menubar:false, language:'ko',
        plugins: 'advlist autolink lists link charmap preview searchreplace visualblocks code fullscreen table paste help wordcount',
        toolbar:'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | removeformat | help',
        height:350,
        setup: (ed)=> ed.on('init', ()=> ed.setContent(post?.content ?? ''))
      });
    } else console.error('TinyMCE not found');
  };

  // 에디터 재초기화
  if (typeof tinymce!=='undefined' && tinymce.get('postContentEditor')) {
    tinymce.get('postContentEditor').remove();
    setTimeout(editorInit);
  } else editorInit();

  // 파일 표시
  const fileInput = $('#file-upload');
  const fileDisp  = $('#fileNameDisplay');
  const fileStat  = $('#currentFileStatus');
  if (fileInput) {
    fileInput.onchange = (e)=>{
      const files = e.target.files;
      if (!files.length){ fileDisp.textContent='선택된 파일 없음'; fileStat.textContent='현재 파일 첨부: 없음'; return; }
      if (files.length===1){ fileDisp.textContent=files[0].name; fileStat.textContent=`현재 파일 첨부: ${files[0].name}`; }
      else { fileDisp.textContent=`${files.length}개 파일 선택됨`; fileStat.textContent=`현재 파일 첨부: ${files.length}개 파일`; }
    };
  }

  $('#cancelPostButton').onclick = ()=>{
    customConfirm('작성 중인 내용이 저장되지 않습니다. 취소하고 목록으로 돌아가시겠습니까?', (ok)=>{
      if (ok) renderList(currentPage);
    });
  };

  $('#savePostButton').onclick = ()=>{
    const type = $('#postType').value.trim();
    const title= $('#postTitle').value.trim();
    let content = '';
    if (typeof tinymce!=='undefined' && tinymce.get('postContentEditor')) {
      content = tinymce.get('postContentEditor').getContent();
    } else {
      content = $('#postContentEditor')?.value ?? '';
    }
    const plain = content.replace(/<[^>]*>/g,'').replace(/&nbsp;/g,'').trim();
    if (!type || !title || plain.length===0) {
      customAlert('유형, 제목, 내용을 모두 입력해 주세요.');
      return;
    }

    const postData = {
      type, title, content,
      authorName: editingIndex!==null ? boardData[editingIndex].authorName : currentUserName,
      comments: editingIndex!==null ? boardData[editingIndex].comments : []
    };

    if ($('#savePostButton').dataset.mode==='edit' && editingIndex!==null) {
      boardData[editingIndex] = postData;
      customAlert('게시글이 성공적으로 수정되었습니다! 상세 페이지로 돌아갑니다.', ()=>{
        openDetail(editingIndex);
      });
    } else {
      boardData.unshift(postData);
      currentDisplayedData = [...boardData];
      customAlert('게시글이 성공적으로 저장되었습니다! 목록으로 돌아갑니다.', ()=>{
        renderList(1);
      });
    }
  };
}

// ===== 상세 =====
function openDetail(index){
  const post = boardData[index];
  if (!post) { customAlert('게시글을 찾을 수 없습니다.', ()=> renderList(currentPage)); return; }

  setView('detail');
  $('#detail-title').textContent = post.title;
  const typeEl = $('#detail-type');
  typeEl.textContent = post.type;
  typeEl.className = `inline-flex items-center px-3 py-1 text-sm font-semibold rounded-lg ${colorClassByType(post.type)}`;

  $('#detail-author').textContent = `작성자: ${post.authorName}`;
  $('#detail-date').textContent   = `작성일: ${new Date().toLocaleDateString()}`;
  $('#detail-content').innerHTML  = post.content;

  // 버튼
  $('#backToListButton').onclick = ()=> renderList(currentPage);
  $('#editPostButton').onclick   = ()=> openWrite(post, index);
  $('#deletePostButton').onclick = ()=>{
    customConfirm('정말로 이 게시글을 삭제하시겠습니까?', (ok)=>{
      if (!ok) return;
      boardData.splice(index,1);
      customAlert('게시글이 삭제되었습니다.', ()=>{
        filterPosts();
        const totalPages = Math.ceil(currentDisplayedData.length / postsPerPage);
        currentPage = Math.min(Math.max(1,currentPage), Math.max(1,totalPages));
        renderList(currentPage);
      });
    });
  };

  // 댓글
  const addBtn = $('#addCommentButton');
  const input  = $('#newCommentContent');
  addBtn.onclick = ()=>{
    const content = (input.value||'').trim();
    if (!content) return customAlert('댓글 내용을 입력해 주세요.');
    const newComment = { id: nextCommentId++, authorName: currentUserName, content, timestamp: Date.now(), replies: [] };
    boardData[index].comments.push(newComment);
    input.value = '';
    refreshComments(index);
  };

  refreshComments(index);
}

// ===== 댓글 렌더 =====
function refreshComments(postIndex){
  const post = boardData[postIndex]; if (!post) return;
  const container = $('#commentsContainer');
  clearChildren(container);

  const total = post.comments.reduce((c,cm)=> c+1+(cm.replies?.length||0), 0);
  $('#commentCount').textContent = `${total}개의 댓글`;

  const cTpl = $('#tpl-comment').content;
  const rTpl = $('#tpl-reply-form').content;

  const renderOne = (comment, isReply=false, parentId=null)=>{
    const node = cTpl.cloneNode(true);
    const wrap = node.querySelector('.comment-item');
    if (isReply) wrap.classList.add('ml-8','mt-3','border-l-2','pl-4','border-gray-100');

    node.querySelector('.c-author').textContent = comment.authorName;
    node.querySelector('.c-time').textContent   = timeAgo(comment.timestamp);
    node.querySelector('.c-content').id         = `comment-content-${comment.id}`;
    node.querySelector('.c-content').textContent= comment.content;

    const btnEdit = node.querySelector('.btn-edit');
    const btnDel  = node.querySelector('.btn-delete');
    const btnReply= node.querySelector('.btn-reply');

    const isMine = comment.authorName===currentUserName;
    if (isMine){ btnEdit.classList.remove('hidden'); btnDel.classList.remove('hidden'); }
    if (isReply) btnReply.classList.add('hidden');

    btnReply.onclick = ()=>{
      // 토글 reply form
      const exists = wrap.parentElement.querySelector(`.reply-form[data-for="${comment.id}"]`);
      if (exists){ exists.remove(); return; }
      const f = rTpl.cloneNode(true);
      const formEl = f.querySelector('.reply-form');
      formEl.dataset.for = String(comment.id);
      const inp = f.querySelector('.reply-input');
      const submit = f.querySelector('.btn-reply-submit');
      submit.onclick = ()=>{
        const content = inp.value.trim();
        if (!content) return customAlert('답글 내용을 입력해 주세요.');
        const newReply = { id: nextCommentId++, authorName: currentUserName, content, timestamp: Date.now() };
        comment.replies = comment.replies || [];
        comment.replies.push(newReply);
        refreshComments(postIndex);
      };
      wrap.insertAdjacentElement('afterend', formEl);
      inp.focus();
    };

    btnEdit.onclick = ()=>{
      customPrompt('댓글 내용을 수정하세요.', comment.content, (newContent)=>{
        if (newContent===false) return; // cancel
        if (!newContent || !newContent.trim()) return customAlert('수정할 내용을 입력해 주세요.');
        comment.content = newContent.trim();
        customAlert('댓글이 성공적으로 수정되었습니다.', ()=> refreshComments(postIndex));
      });
    };

    btnDel.onclick = ()=>{
      customConfirm('정말로 이 댓글을 삭제하시겠습니까?', (ok)=>{
        if (!ok) return;
        if (parentId!==null) {
          const parent = post.comments.find(c=>c.id===parentId);
          if (!parent || !parent.replies) return customAlert('부모 댓글을 찾을 수 없습니다.');
          const idx = parent.replies.findIndex(r=>r.id===comment.id);
          if (idx>-1) parent.replies.splice(idx,1);
        } else {
          const idx = post.comments.findIndex(c=>c.id===comment.id);
          if (idx>-1) post.comments.splice(idx,1);
        }
        customAlert('댓글이 삭제되었습니다.', ()=> refreshComments(postIndex));
      });
    };

    container.appendChild(node);

    // 대댓글 렌더
    if (comment.replies?.length) {
      comment.replies.forEach(r=> renderOne(r, true, comment.id));
    }
  };

  post.comments.forEach(c=> renderOne(c, false, null));
}

// ===== 상태 진입 함수 (외부 호출 호환)
function loadBoardContent(state, identifier=null){
  if (typeof tinymce!=='undefined' && tinymce.get('postContentEditor')) {
    tinymce.get('postContentEditor').remove();
  }

  if (state==='list'){
    renderList(identifier ?? 1);
  } else if (state==='write'){
    const idx = identifier ?? null;
    openWrite(idx!==null ? boardData[idx] : null, idx);
  } else if (state==='detail'){
    openDetail(identifier);
  } else if (state==='delete'){
    customConfirm('정말로 이 게시글을 삭제하시겠습니까?', (ok)=>{
      if (!ok) return;
      boardData.splice(identifier,1);
      customAlert('게시글이 삭제되었습니다.', ()=>{
        filterPosts();
        const totalPages = Math.ceil(currentDisplayedData.length / postsPerPage);
        currentPage = Math.min(currentPage, Math.max(1,totalPages));
        renderList(currentPage || 1);
      });
    });
  }
}

// ===== 초기 바인딩 =====
window.addEventListener('DOMContentLoaded', ()=>{
  // 검색
  $('#searchButton').onclick = ()=>{ filterPosts(); renderList(1); };
  $('#searchInput').addEventListener('keydown', (e)=>{ if (e.key==='Enter'){ e.preventDefault(); filterPosts(); renderList(1);} });

  // 글쓰기 버튼
  $('#writePostButton').onclick = ()=> openWrite();

  // 첫 진입
  renderList(1);
});
