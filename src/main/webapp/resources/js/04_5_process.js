// 04_5_process.js
// 컨트롤러/엔드포인트 매핑
//  - 상세:   GET  /process/detail?process_id=... (JSON)
//  - 등록:   POST /processinsert                 (multipart/form-data → JSON {status, process_id, process_img})
//  - 수정:   POST /processupdate                 (text: "success"/"fail")
//  - 삭제:   POST /processdelete                 (JSON ["ID1","ID2",...], text: "success"/"fail")
//  - 업로드: POST /processimageupload            (multipart/form-data) -> { image_url: "/resources/img/04_5_process/{process_id}.{ext}" }

document.addEventListener('DOMContentLoaded', () => {
  // ===== 공통 DOM =====
  const tableBody  = document.querySelector('.table tbody');

  // 상세/등록 슬라이드
  const detail     = document.getElementById('slide-detail');
  const slideInput = document.getElementById('slide-input');
  const titleEl    = detail ? detail.querySelector('.silde-title h2') : null;

  const ctx = (typeof contextPath === 'string') ? contextPath : '';
  const detailApi = `${ctx}/process/detail`;
  const updateUrl = `${ctx}/processupdate`;
  const createUrl = `${ctx}/processinsert`;
  const deleteUrl = `${ctx}/processdelete`;
  const uploadUrl = `${ctx}/processimageupload`;

  // ===== 유틸 =====
  const text    = (el) => (el ? (el.textContent || '').trim() : '');
  const setHTML = (el, html) => { if (el) el.innerHTML = html; };
  const safe    = (v) => (v == null ? '' : String(v));

  // ===== 상세 채우기 (뷰: 이미지 1개 + 공정 상세[process_info]) =====
  async function fillprocessDetail(slide, payload = {}) {
    if (!slide) return;
    const row = (Array.isArray(payload) ? payload[0] : payload) || {};

    const process_id    = row.process_id   ?? row.id ?? '';
    const process_seq   = row.process_seq  ?? '';
    const process_name  = row.process_name ?? '';
    const department_id = row.department_id ?? row.department ?? '';

    //  DB 컬럼 우선
    const imgUrl = row.process_img
                || row.process_image_url
                || row.image_url
                || row.imagePath
                || row.image
                || '';

    const rawDesc = row.process_info ?? row.process_content ?? row.description ?? row.process_desc ?? '';
    const desc    = String(rawDesc).replace(/\\n/g, '\n');

    setHTML(slide.querySelector('#d-process-id'),   safe(process_id));
    setHTML(slide.querySelector('#d-process-seq'),  safe(process_seq));
    setHTML(slide.querySelector('#d-process-name'), safe(process_name));
    setHTML(slide.querySelector('#d-dept-id'),      safe(department_id));

    const processBox = slide.querySelector('.process-box');
    if (processBox) {
      processBox.innerHTML = `
        <div class="image-section">
          <img class="image" id="d-process-image" alt="" ${imgUrl ? `src="${safe(imgUrl)}"` : 'style="display:none"'} />
          <div id="d-process-image-helper" class="helper-text">${imgUrl ? '' : '이미지 없음'}</div>
        </div>
        <div class="specific">
          <div class="specific-box" id="d-process-desc" aria-label="공정 상세"></div>
        </div>
      `;
      const descEl = processBox.querySelector('#d-process-desc');
      if (descEl) descEl.textContent = desc;
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

  // ===== 수정 모드 진입 (좌 현재 / 우 새 미리보기 + 아래 파일 / 하단 설명) =====
  function enterEdit() {
    if (!detail || state.mode === 'edit') return;
    state.mode = 'edit';
    if (titleEl) titleEl.textContent = '공정 수정';
    state.pendingFile = null;

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

    const processBox = detail.querySelector('.process-box');
    if (processBox) {
      const currentImgSrc = state.backup.imageUrl;
      processBox.innerHTML = `
        <div class="process-edit-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;width:100%;">


          <!-- 우: 새 업로드 미리보기 + 파일버튼(미리보기 아래) -->
          <div class="image-section" style="min-height:auto;">
            <img class="image" id="e-process-image-preview" alt="업로드 미리보기" style="display:none" />
            <div class="helper-text">업로드 미리보기</div>
            <div style="margin-top:8px;">
              <input type="file" id="e-process-image-file" accept="image/*" />
            </div>
            <div class="helper-text">* 저장 시 공정ID 파일명으로 저장됩니다.</div>
          </div>

          <!-- 하단 전체: 공정 상세(process_info) -->
          <div style="grid-column:1 / -1;">
            <div class="specific">
              <div class="specific-box" style="padding:0; border:none; background:transparent;">
                <textarea id="e-process-desc" class="w-100"
                  style="min-height:240px; width:100%; box-sizing:border-box; border:1px solid #ccc; background:#f9f9f9; padding:12px;">${safe(state.backup.desc)}</textarea>
              </div>
            </div>
          </div>
        </div>
      `;

      const fileInp   = processBox.querySelector('#e-process-image-file');
      const previewEl = processBox.querySelector('#e-process-image-preview');

      if (fileInp) {
        fileInp.addEventListener('change', () => {
          const f = fileInp.files && fileInp.files[0];
          if (!f) {
            if (previewEl) { previewEl.removeAttribute('src'); previewEl.style.display = 'none'; }
            state.pendingFile = null;
            return;
          }
          state.pendingFile = f;
          const reader = new FileReader();
          reader.readAsDataURL(f);
          reader.onload = (ev) => {
            if (previewEl) {
              previewEl.src = ev.target.result;
              previewEl.style.display = '';
            }
          };
        });
      }
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
    const descEl = detail.querySelector('#e-process-desc');

    const newSeq  = seqEl  ? seqEl.value  : state.backup.processSeq;
    const newName = nameEl ? nameEl.value : state.backup.processName;
    const newDept = deptEl ? deptEl.value : state.backup.deptId;
    const newDesc = descEl ? descEl.value : state.backup.desc;

    setHTML(detail.querySelector('#d-process-seq'),  safe(newSeq));
    setHTML(detail.querySelector('#d-process-name'), safe(newName));
    setHTML(detail.querySelector('#d-dept-id'),      safe(newDept));

    const processBox = detail.querySelector('.process-box');
    if (processBox) {
      const currentImgSrc = detail.querySelector('#d-process-image')?.getAttribute('src') || state.backup.imageUrl || '';
      processBox.innerHTML = `
        <div class="image-section">
          <img class="image" id="d-process-image" alt="" ${currentImgSrc ? `src="${safe(currentImgSrc)}"` : 'style="display:none"'} />
          <div id="d-process-image-helper" class="helper-text">${currentImgSrc ? '' : '이미지 없음'}</div>
        </div>
        <div class="specific">
          <div class="specific-box" id="d-process-desc" aria-label="공정 상세"></div>
        </div>
      `;
      const d = processBox.querySelector('#d-process-desc');
      if (d) d.textContent = String(newDesc).replace(/\\n/g, '\n');
    }

    if (btnEdit) btnEdit.value = '수정';
    state.pendingFile = null;
  }

  // ===== 저장(수정): 파일 업로드(파일명=공정ID) → 경로 반영하여 update =====
  async function saveEdit() {
    if (!detail) return;

    const process_id = text(detail.querySelector('#d-process-id'));
    const vSeq  = detail.querySelector('#e-process-seq')?.value?.trim()
               ?? text(detail.querySelector('#d-process-seq'));
    const vName = detail.querySelector('#e-process-name')?.value?.trim()
               ?? text(detail.querySelector('#d-process-name'));
    const vDept = detail.querySelector('#e-dept-id')?.value?.trim()
               ?? text(detail.querySelector('#d-dept-id'));

    let vImg  = detail.querySelector('#d-process-image')?.getAttribute('src') || '';
    const vDesc = detail.querySelector('#e-process-desc')?.value?.trim()
               ?? text(detail.querySelector('#d-process-desc'));

    if (!vName) { alert('공정명을 입력하세요.'); return; }

    if (state.pendingFile) {
      try {
        const fd = new FormData();
        fd.append('file', state.pendingFile);
        fd.append('process_id', process_id); // ★ 파일명 = 공정ID
        const res = await fetch(uploadUrl, { method: 'POST', body: fd });
        const raw = await res.text();
        if (!res.ok) throw new Error(`upload ${res.status}: ${raw}`);
        let data = {};
        try { data = raw ? JSON.parse(raw) : {}; } catch (_) {}
        vImg = data.image_url || data.url || data.process_image_url || '';
        if (!vImg) throw new Error('업로드 응답에 image_url 없음');
      } catch (e) {
        console.error('upload error', e);
        alert('이미지 업로드 중 오류가 발생했습니다.');
        return;
      }
    }

    const body = new URLSearchParams();
    if (process_id) body.set('process_id', process_id);
    body.set('process_seq',  vSeq || '');
    body.set('process_name', vName || '');
    body.set('department_id', vDept || '');
    body.set('process_img',  vImg || '');   // ★ 컬럼명에 맞춤
    body.set('process_info', vDesc || '');

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

      exitEdit(false);
      updateTableRow(process_id, { process_id, process_seq: vSeq, process_name: vName });
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
// 등록 슬라이드: 멀티파트 1회 요청으로 서버에서 ID발급 + 파일명=ID 저장
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const form       = document.getElementById('processInsertForm');
  const btnNew     = document.querySelector('.btm-btn.new');
  const slideInput = document.getElementById('slide-input');
  const fileInput  = document.getElementById('img');
  const previewImg = document.getElementById('preview');
  const ctx        = (typeof contextPath === 'string') ? contextPath : '';

  if (btnNew && slideInput) {
    btnNew.addEventListener('click', () => {
      slideInput.classList.add('open');
    });
  }

  // 미리보기
  document.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'img') {
      const f = e.target.files && e.target.files[0];
      if (!f) { previewImg?.removeAttribute('src'); return; }
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = (ev) => { previewImg?.setAttribute('src', ev.target.result); };
    }
  });

  if (!form) return;

  // 등록: 멀티파트 1회(서버에서 ID 생성 + 파일명=ID로 저장)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const seq  = form.querySelector('input[name="process_seq"]')?.value?.trim() || '';
    const name = form.querySelector('input[name="process_name"]')?.value?.trim() || '';
    const dept = form.querySelector('input[name="department_id"]')?.value?.trim() || '';
    const desc = document.getElementById('create-process-desc')?.textContent?.trim() || '';
    const file = fileInput?.files?.[0] || null;

    if (!name) { alert('공정명을 입력하세요.'); return; }

    const fd = new FormData();
    fd.append('process_seq',  seq);
    fd.append('process_name', name);
    fd.append('department_id', dept);
    fd.append('process_info', desc);
    if (file) fd.append('file', file); 

    try {
      const res = await fetch(`${ctx}/processinsert`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: fd
      });
      const raw = await res.text();
      if (!res.ok) throw new Error(`insert ${res.status}: ${raw}`);
      let data = {};
      try { data = raw ? JSON.parse(raw) : {}; } catch {}
      if (data.status !== 'success') throw new Error(raw);

      alert('등록되었습니다.');
      location.reload();
    } catch (err) {
      console.error('[등록] 오류:', err);
      alert('등록 중 오류가 발생했습니다. (콘솔/서버 로그 확인)');
    }
  });

  const btnClose = slideInput?.querySelector('.close-btn.slide-btn');
  if (btnClose && slideInput) {
    btnClose.addEventListener('click', () => {
      slideInput.classList.remove('open');
    });
  }
});
