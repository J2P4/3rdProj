// 컨트롤러/엔드포인트 매핑:
//  - 상세:   GET  /process/detail?process_id=... (JSON)
//  - 등록:   POST /processinsert                 (text: "success"/"fail")
//  - 수정:   POST /processupdate                 (text: "success"/"fail")
//  - 삭제:   POST /processdelete                 (JSON body: ["ID1","ID2",...], text: "success"/"fail")
//  - 업로드: POST /processimageupload            (multipart/form-data) -> JSON { image_url: "..." } 형태로 응답(권장)

document.addEventListener('DOMContentLoaded', () => {
  // ===== 공통 DOM =====
  const tableBody  = document.querySelector('.table tbody');

  // 상세/등록 슬라이드
  const detail     = document.getElementById('slide-detail');   // 상세 패널
  const slideInput = document.getElementById('slide-input');    // 등록 패널
  const titleEl    = detail ? detail.querySelector('.silde-title h2') : null;

  const ctx = (typeof contextPath === 'string') ? contextPath : '';
  const detailApi = `${ctx}/process/detail`;
  const updateUrl = `${ctx}/processupdate`;
  const createUrl = `${ctx}/processinsert`;
  const deleteUrl = `${ctx}/processdelete`;
  const uploadUrl = `${ctx}/processimageupload`;  // ★ 서버에 이 엔드포인트 하나만 추가해줘

  // ===== 유틸 =====
  const text    = (el) => (el ? (el.textContent || '').trim() : '');
  const setHTML = (el, html) => { if (el) el.innerHTML = html; };
  const safe    = (v) => (v == null ? '' : String(v));

  // ===== 상세 채우기 (이미지/설명 포함) =====
  async function fillprocessDetail(slide, payload = {}) {
    if (!slide) return;
    const row = (Array.isArray(payload) ? payload[0] : payload) || {};

    const process_id    = row.process_id   ?? row.id ?? '';
    const process_seq   = row.process_seq  ?? '';
    const process_name  = row.process_name ?? '';
    const department_id = row.department_id ?? row.department ?? '';

    // 이미지/설명 후보 필드명 대응
    const imgUrl = row.process_image_url || row.image_url || row.imagePath || row.image || '';
    const desc   = row.process_content   || row.description || row.process_desc || '';

    setHTML(slide.querySelector('#d-process-id'),   safe(process_id));
    setHTML(slide.querySelector('#d-process-seq'),  safe(process_seq));
    setHTML(slide.querySelector('#d-process-name'), safe(process_name));
    setHTML(slide.querySelector('#d-dept-id'),      safe(department_id));

    const imgEl    = slide.querySelector('#d-process-image');
    const imgHelp  = slide.querySelector('#d-process-image-helper');
    const descEl   = slide.querySelector('#d-process-desc');

    if (imgEl) {
      if (imgUrl) {
        imgEl.src = imgUrl;
        imgEl.style.display = '';
        if (imgHelp) imgHelp.textContent = '';
      } else {
        imgEl.removeAttribute('src');
        imgEl.style.display = 'none';
        if (imgHelp) imgHelp.textContent = '이미지 없음';
      }
    }
    if (descEl) {
      descEl.textContent = desc || '';
    }

    if (titleEl) titleEl.textContent = '공정 상세';
  }

  // ===== 상태 =====
  const state = { mode: 'view', backup: {}, pendingFile: null };
  const btnEdit  = document.getElementById('detailEditBtn');
  const btnClose = detail ? detail.querySelector('.close-btn.slide-btn') : null;
  let allowClose = false;

  // 상세 바깥 닫힘 방지
  document.addEventListener('click', (e) => {
    if (!detail || !detail.classList.contains('open')) return;
    if (!detail.contains(e.target)) {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    }
  }, true);
  document.addEventListener('keydown', (e) => {
    if (!detail || !detail.classList.contains('open')) return;
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    }
  }, true);
  if (detail) {
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.attributeName === 'class') {
          if (!detail.classList.contains('open') && !allowClose) detail.classList.add('open');
        }
      });
    }).observe(detail, { attributes: true, attributeFilter: ['class'] });
  }

  // ===== 상세 열기 =====
  async function openDetail(process_id) {
    const url = `${detailApi}?process_id=${encodeURIComponent(process_id)}`;
    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const raw = await res.text();
      if (!res.ok) throw new Error(`detail ${res.status}: ${raw || ''}`);
      const data = raw ? JSON.parse(raw) : {};
      await fillprocessDetail(detail, data);
    } catch (e) {
      await fillprocessDetail(detail, [{ process_id }]);
      console.warn('detail 폴백 표시:', e);
    }
    detail.classList.add('open');
    state.mode = 'view';
    if (titleEl) titleEl.textContent = '공정 상세';
    if (btnEdit) btnEdit.value = '수정';
    return { process_id };
  }

  // ===== 목록 행 갱신 =====
  function updateTableRow(process_id, dto) {
    const tr = document.querySelector(`.table tbody tr[data-id="${process_id}"]`);
    if (!tr) return;
    const tds = tr.querySelectorAll('td'); // [0]=chk, [1]=순서, [2]=ID, [3]=이름
    if (tds[1]) tds[1].textContent = dto.process_seq  ?? tds[1].textContent;
    if (tds[2]) tds[2].textContent = dto.process_id   ?? process_id;
    if (tds[3]) tds[3].textContent = dto.process_name ?? tds[3].textContent;
  }

  // ===== 파일 업로드 호출 =====
  async function uploadImage(file, processId) {
    const fd = new FormData();
    fd.append('file', file);              // 서버에서 @RequestParam("file") MultipartFile file
    if (processId) fd.append('process_id', processId); // 파일명 규칙 등에 쓰고 싶으면

    const res = await fetch(uploadUrl, {
      method: 'POST',
      body: fd
      // 헤더에 Content-Type 설정하지 말 것: 브라우저가 boundary 포함 자동 설정
    });
    const ct = res.headers.get('content-type') || '';
    const raw = await res.text();
    if (!res.ok) throw new Error(`upload ${res.status}: ${raw}`);

    // JSON 파싱 시도
    let data = {};
    try { data = raw ? JSON.parse(raw) : {}; } catch (_) { data = {}; }

    // 허용 키: image_url / url / process_image_url / location
    const url = data.image_url || data.url || data.process_image_url || data.location || '';
    if (!url) throw new Error('업로드 응답에 이미지 URL이 없습니다.');
    return url;
  }

  // ===== 수정 모드 진입 (이미지URL/파일/설명 편집) =====
  function enterEdit() {
    if (!detail || state.mode === 'edit') return;
    state.mode = 'edit';
    if (titleEl) titleEl.textContent = '공정 수정';
    state.pendingFile = null; // 새 편집 시작 시 초기화

    state.backup = {
      processId:   text(detail.querySelector('#d-process-id')),
      processSeq:  text(detail.querySelector('#d-process-seq')),
      processName: text(detail.querySelector('#d-process-name')),
      deptId:      text(detail.querySelector('#d-dept-id')),
      imageUrl:    (detail.querySelector('#d-process-image')?.getAttribute('src')) || '',
      desc:        text(detail.querySelector('#d-process-desc'))
    };

    setHTML(detail.querySelector('#d-process-seq'),
      `<input type="text" id="e-process-seq" class="w-100" value="${safe(state.backup.processSeq)}">`);
    setHTML(detail.querySelector('#d-process-name'),
      `<input type="text" id="e-process-name" class="w-100" value="${safe(state.backup.processName)}">`);
    setHTML(detail.querySelector('#d-dept-id'),
      `<input type="text" id="e-dept-id" class="w-100" value="${safe(state.backup.deptId)}">`);

    // 이미지: URL + 파일 업로드 + 미리보기
    const imgWrap = detail.querySelector('.image-section');
    if (imgWrap) {
      imgWrap.innerHTML = `
        <img class="image" id="d-process-image" alt="" ${state.backup.imageUrl ? `src="${safe(state.backup.imageUrl)}"` : 'style="display:none"'} />
        <input type="text" id="e-process-image-url" class="w-100 mt-8" placeholder="이미지 URL을 입력하세요" value="${safe(state.backup.imageUrl)}" />
        <input type="file" id="e-process-image-file" class="mt-8" accept="image/*" />
        <div class="helper-text">* 파일을 선택하면 미리보기 및 업로드 후 URL로 자동 저장됩니다.</div>
      `;
      const urlInp = imgWrap.querySelector('#e-process-image-url');
      const fileInp= imgWrap.querySelector('#e-process-image-file');
      const imgEl  = imgWrap.querySelector('#d-process-image');

      if (urlInp && imgEl) {
        urlInp.addEventListener('input', () => {
          const v = urlInp.value.trim();
          if (v) { imgEl.src = v; imgEl.style.display = ''; state.pendingFile = null; }
          else { imgEl.removeAttribute('src'); imgEl.style.display = 'none'; }
        });
      }
      if (fileInp && imgEl) {
        fileInp.addEventListener('change', () => {
          const f = fileInp.files && fileInp.files[0];
          if (!f) return;
          state.pendingFile = f; // 저장 시 업로드
          const reader = new FileReader();
          reader.readAsDataURL(f);
          reader.onload = (ev) => {
            imgEl.src = ev.target.result;
            imgEl.style.display = '';
          };
          // 파일을 고르면 URL 입력란은 비워 두는 편이 충돌 적음(선택사항)
          if (urlInp) urlInp.value = '';
        });
      }
    }

    const descBox = detail.querySelector('#d-process-desc');
    if (descBox) {
      descBox.innerHTML = `<textarea id="e-process-desc" class="w-100" style="min-height:240px;">${safe(state.backup.desc)}</textarea>`;
    }

    const first = detail.querySelector('#e-process-name') || detail.querySelector('#e-process-seq');
    if (first) first.focus();

    if (btnEdit) btnEdit.value = '저장';
  }

  // ===== 수정 모드 종료 =====
  function exitEdit(restore) {
    if (!detail || state.mode !== 'edit') return;
    state.mode = 'view';
    if (titleEl) titleEl.textContent = '공정 상세';

    const seqEl  = detail.querySelector('#e-process-seq');
    const nameEl = detail.querySelector('#e-process-name');
    const deptEl = detail.querySelector('#e-dept-id');
    const urlEl  = detail.querySelector('#e-process-image-url');
    const descEl = detail.querySelector('#e-process-desc');

    const newSeq  = seqEl  ? seqEl.value  : state.backup.processSeq;
    const newName = nameEl ? nameEl.value : state.backup.processName;
    const newDept = deptEl ? deptEl.value : state.backup.deptId;
    const newUrl  = urlEl  ? urlEl.value  : state.backup.imageUrl;
    const newDesc = descEl ? descEl.value : state.backup.desc;

    if (restore) {
      setHTML(detail.querySelector('#d-process-seq'),  safe(state.backup.processSeq));
      setHTML(detail.querySelector('#d-process-name'), safe(state.backup.processName));
      setHTML(detail.querySelector('#d-dept-id'),      safe(state.backup.deptId));
      const imgWrap = detail.querySelector('.image-section');
      if (imgWrap) {
        imgWrap.innerHTML = `
          <img class="image" id="d-process-image" alt="" ${state.backup.imageUrl ? `src="${safe(state.backup.imageUrl)}"` : 'style="display:none"'} />
          <div id="d-process-image-helper" class="helper-text">${state.backup.imageUrl ? '' : '이미지 없음'}</div>
        `;
      }
      const descBox = detail.querySelector('.specific #d-process-desc');
      if (descBox) descBox.textContent = state.backup.desc || '';
    } else {
      setHTML(detail.querySelector('#d-process-seq'),  safe(newSeq));
      setHTML(detail.querySelector('#d-process-name'), safe(newName));
      setHTML(detail.querySelector('#d-dept-id'),      safe(newDept));
      const imgWrap = detail.querySelector('.image-section');
      if (imgWrap) {
        imgWrap.innerHTML = `
          <img class="image" id="d-process-image" alt="" ${newUrl ? `src="${safe(newUrl)}"` : 'style="display:none"'} />
          <div id="d-process-image-helper" class="helper-text">${newUrl ? '' : '이미지 없음'}</div>
        `;
      }
      const descBox = detail.querySelector('.specific #d-process-desc');
      if (descBox) descBox.textContent = newDesc || '';
    }

    if (btnEdit) btnEdit.value = '수정';
    state.pendingFile = null; // 종료 시 초기화
  }

  // ===== 저장(수정) =====
  async function saveEdit() {
    if (!detail) return;

    const process_id = text(detail.querySelector('#d-process-id'));
    const vSeq  = detail.querySelector('#e-process-seq')?.value?.trim()
               ?? text(detail.querySelector('#d-process-seq'));
    const vName = detail.querySelector('#e-process-name')?.value?.trim()
               ?? text(detail.querySelector('#d-process-name'));
    const vDept = detail.querySelector('#e-dept-id')?.value?.trim()
               ?? text(detail.querySelector('#d-dept-id'));

    // 1) 현재 URL 입력값
    let vImg  = detail.querySelector('#e-process-image-url')?.value?.trim()
             ?? (detail.querySelector('#d-process-image')?.getAttribute('src') || '');
    const vDesc = detail.querySelector('#e-process-desc')?.value?.trim()
               ?? text(detail.querySelector('#d-process-desc'));

    if (!vName) { alert('공정명을 입력하세요.'); return; }

    // 2) 파일이 있으면 먼저 업로드 → 받은 URL로 vImg 대체
    if (state.pendingFile) {
      try {
        const uploadedUrl = await uploadImage(state.pendingFile, process_id);
        vImg = uploadedUrl;
      } catch (e) {
        console.error('upload error', e);
        alert('이미지 업로드 중 오류가 발생했습니다.');
        return; // 업로드 실패 시 저장 중단(원하면 계속 진행하도록 바꿀 수 있음)
      }
    }

    // 3) 수정 API 호출
    const body = new URLSearchParams();
    if (process_id) body.set('process_id', process_id);
    body.set('process_seq',  vSeq || '');
    body.set('process_name', vName || '');
    body.set('department_id', vDept || '');
    body.set('process_image_url', vImg || '');
    body.set('process_content',   vDesc || '');

    try {
      const res = await fetch(updateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Accept': 'text/plain'
        },
        body: body.toString()
      });
      const raw = (await res.text()).trim();
      if (!res.ok || raw !== 'success') throw new Error(`update failed: ${raw}`);

      // UI 동기화
      exitEdit(false);
      updateTableRow(process_id, {
        process_id,
        process_seq: vSeq,
        process_name: vName
      });
      alert('저장되었습니다.');
    } catch (e) {
      console.error('update error', e);
      alert('저장 중 오류가 발생했습니다.');
    }
  }

  // ===== 버튼 이벤트 =====
  if (btnEdit) {
    btnEdit.addEventListener('click', () => {
      if (btnEdit.value === '수정') enterEdit();
      else saveEdit();
    });
  }
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      if (state.mode === 'edit') {
        if (!confirm('수정을 취소하시겠습니까? 변경 내용은 저장되지 않습니다.')) return;
        exitEdit(true);
      }
      allowClose = true;
      detail.classList.remove('open');
      setTimeout(() => { allowClose = false; }, 0);
    });
  }

  // ===== 행 클릭 → 상세 열기 =====
  if (tableBody) {
    tableBody.addEventListener('click', async (evt) => {
      const row = evt.target.closest('tr');
      if (!row) return;

      const td  = evt.target.closest('td');
      const cells = Array.from(row.cells || []);
      const idx = td ? cells.indexOf(td) : -1;
      if (idx === 0) return; // 체크박스 열 무시

      const process_id = row.getAttribute('data-id');
      if (!process_id) { console.warn('data-id(공정 ID)가 없습니다.'); return; }

      try {
        await openDetail(process_id);
        if (state.mode === 'edit') exitEdit(true);
      } catch (e) {
        console.error('상세 로드 실패:', e);
        alert('상세 정보를 불러오는 중 오류가 발생했습니다.');
      }
    });
  }

  // ===== 체크박스 전체선택/삭제(JSON POST) =====
  (function setupCheckAndDelete(){
    const chkAll = document.getElementById('chkAll');
    const btnDel = document.getElementById('btnDelete');

    if (chkAll) {
      chkAll.addEventListener('change', () => {
        document.querySelectorAll('tbody input.rowChk:not(:disabled)')
          .forEach(n => { n.checked = chkAll.checked; });
      });
    }

    document.addEventListener('change', (e) => {
      const t = e.target;
      if (t?.classList?.contains('rowChk')) {
        const rows = document.querySelectorAll('tbody input.rowChk:not(:disabled)');
        const checked = document.querySelectorAll('tbody input.rowChk:not(:disabled):checked');
        if (chkAll && rows.length) chkAll.checked = (rows.length === checked.length);
      }
    });

    if (btnDel) {
      btnDel.addEventListener('click', async () => {
        const checks = Array.from(document.querySelectorAll('tbody input.rowChk:checked'));
        if (!checks.length) { alert('삭제할 항목을 선택하세요.'); return; }

        const ids = checks.map(chk => (chk.value || '').trim()).filter(Boolean);
        if (!ids.length) {
          checks.forEach(chk => {
            const tr = chk.closest('tr');
            const id = tr?.getAttribute('data-id') || '';
            if (id) ids.push(id);
          });
        }

        if (!ids.length) { alert('선택된 행에서 공정 ID를 찾지 못했습니다.'); return; }
        if (!confirm(ids.length + '건 삭제하시겠습니까?')) return;

        try {
          const res = await fetch(deleteUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              'Accept': 'text/plain'
            },
            body: JSON.stringify(ids)
          });
          const raw = (await res.text()).trim();
          if (!res.ok || raw !== 'success') throw new Error(`delete failed: ${raw}`);

          alert('삭제되었습니다.');
          location.reload();
        } catch (err) {
          console.error('[삭제] 오류:', err);
          alert('삭제 중 오류가 발생했습니다.');
        }
      });
    }
  })();
});


// ──────────────────────────────────────────────
// 등록 슬라이드: 신규 등록 저장 (설명 포함)
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('processInsertForm');
  const btnNew = document.querySelector('.btm-btn.new');
  const slideInput = document.getElementById('slide-input');
  const ctx = (typeof contextPath === 'string') ? contextPath : '';
  const createUrl = `${ctx}/processinsert`;

  if (btnNew && slideInput) {
    btnNew.addEventListener('click', () => {
      slideInput.classList.add('open');
    });
  }

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const seq  = form.querySelector('input[name="process_seq"]')?.value?.trim() || '';
    const name = form.querySelector('input[name="process_name"]')?.value?.trim() || '';
    const dept = form.querySelector('input[name="department_id"]')?.value?.trim() || '';
    const desc = document.getElementById('create-process-desc')?.textContent?.trim() || '';

    if (!name) { alert('공정명을 입력하세요.'); return; }

    const body = new URLSearchParams();
    body.set('process_seq', seq);
    body.set('process_name', name);
    body.set('department_id', dept);
    body.set('process_content', desc); // DTO에 필드 추가 필요

    try {
      const res = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Accept': 'text/plain'
        },
        body: body.toString()
      });
      const raw = (await res.text()).trim();
      if (!res.ok || raw !== 'success') throw new Error(`create failed: ${raw}`);

      alert('등록되었습니다.');
      location.reload();
    } catch (err) {
      console.error('[등록] 저장 오류:', err);
      alert('저장 중 오류가 발생했습니다.');
    }
  });

  const btnClose = slideInput?.querySelector('.close-btn.slide-btn');
  if (btnClose && slideInput) {
    btnClose.addEventListener('click', () => {
      slideInput.classList.remove('open');
    });
  }
});
