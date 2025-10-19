// ================================================
// 페이지 초기화, 삭제

document.addEventListener('DOMContentLoaded', function () {
    const ctx = typeof contextPath === 'string' ? contextPath : '';

    const slideInput = document.getElementById('slide-input');
    const btnNew = document.querySelector('.btm-btn.new');
    const btnDelete = document.querySelector('.btm-btn.del');
    const chkAll = document.getElementById('chkAll');
    const formDelete = document.getElementById('deleteForm');

    // ---------------- 삭제 버튼 ----------------
    if (btnDelete) {
        btnDelete.addEventListener('click', () => {
            const checks = document.querySelectorAll('.rowChk:checked');
            if (checks.length === 0) return alert('삭제할 항목을 선택하세요.');
            if (!confirm(checks.length + '건을 삭제하시겠습니까?')) return;
            formDelete.submit();
        });
    }
});

// === 날짜 포맷 유틸 (TZ 보정) ===
function fmtDateYYYYMMDD(d) {
    return new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,10);
}

// === 특정 컨테이너(root) 안의 date input들에 제한 적용 ===
function applyDateGuards(root) {
    const today = fmtDateYYYYMMDD(new Date());
    const births = root.querySelectorAll('input[name="worker_birth"]');
    const joins  = root.querySelectorAll('input[name="worker_join"]');

    // 1) 입사일: 오늘 이후 선택 불가
    joins.forEach(j => {
        j.setAttribute('max', today);
        // 이미 값이 미래면 잘라냄
        if (j.value && j.value > today) j.value = today;

        // 입사일 변경 시, 생년월일 max를 동기화
        j.addEventListener('change', () => {
            const joinVal = j.value || today;
            births.forEach(b => {
            // 생년월일은 입사일보다 늦을 수 없음
            b.setAttribute('max', joinVal);
            if (b.value && b.value > joinVal) b.value = joinVal;
            });
        }, { once:false });
    });

}

// === 최초 진입 시 전체 문서에 1차 적용 ===
document.addEventListener('DOMContentLoaded', () => {
    applyDateGuards(document);
});

// === "신규" 슬라이드 열릴 때마다 재적용 ===
document.addEventListener('click', (e) => {
    if (e.target?.classList?.contains('new')) {
        const slide = document.getElementById('slide-input');
        if (slide) {
            slide.classList.add('open');
            applyDateGuards(slide);     // <- 여기 매우 중요!
        }
    }
});

// === 상세 슬라이드 수정모드로 전환할 때 동적 인풋 생성 후 재적용 예시 ===
function onEnterEditMode() {
    const detail = document.getElementById('slide-detail');
    applyDateGuards(detail);        // <- 동적 DOM에 재적용!
}

// ================================================
// 등록 슬라이드 AJAX 등록 처리 + 모달 표시

document.addEventListener('DOMContentLoaded', function () {
    const ctx = (typeof window.contextPath === 'string') ? window.contextPath : '';
    const btn = document.getElementById('btn-insert');
    const form = document.getElementById('workerInsertForm');
    const modal = document.querySelector('.modal-bg');

    // ---------------- 모달 열기 ----------------
    function openModal(payload) {
        const fields = modal.querySelectorAll('.modal-content .field');
        if (fields.length >= 3) {
            fields[0].innerHTML = `<span>아이디 :</span> ${payload.worker_id || ''}`;
            fields[1].innerHTML = `<span>초기 비밀번호 :</span> ${payload.temp_pw || 'j2p4mes'}`;
            fields[2].innerHTML = `<span>이메일 :</span> ${payload.worker_email || ''}`;
        }
        modal.classList.remove('hide');
    }

    // ---------------- 모달 닫기 ----------------
    const closeBtn = document.querySelector('.m-btn.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
        modal.classList.add('hide');
        location.reload();
        });
    }

    // ---------------- 등록 버튼 ----------------
    if (btn) {
        btn.addEventListener('click', async () => {
        const fd = new FormData(form);

        // 이메일 합치기
        const person = (fd.get('person_email') || '').trim();
        const domain = (fd.get('domain_email') || '').trim();
        if (person && domain) fd.set('worker_email', `${person}@${domain}`);
        fd.delete('person_email');
        fd.delete('domain_email');

        // 필수값 검증
        if (!fd.get('worker_name')) return alert('이름을 입력하세요.');
        if (!fd.get('worker_birth')) return alert('생년월일을 입력하세요.');
        if (!fd.get('worker_join')) return alert('입사일을 입력하세요.');
        if (!fd.get('department_id')) return alert('부서를 선택하세요.');
        if (!fd.get('worker_code') || fd.get('worker_code') === '1') return alert('권한을 선택하세요.');

        try {
            const res = await fetch(`${ctx}/workerinsert`, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: fd,
            credentials: 'same-origin'
            });

            const txt = await res.text();
            console.log('INSERT status=', res.status, 'body=', txt);

            if (!res.ok) throw new Error(`HTTP ${res.status}: ${txt}`);
            const data = txt ? JSON.parse(txt) : {};
            if (!data.ok) return alert(data.message || '등록 실패');

            // 슬라이드 닫기 + 폼 초기화 + 모달 열기
            document.getElementById('slide-input')?.classList.remove('open');
            form.reset();
            openModal(data);
        } catch (e) {
            console.error('등록 중 오류:', e);
            alert('등록 처리 중 오류가 발생했습니다.');
        }
        });
    }
});

// ================================================
// 상세 보기 슬라이드 열기 / 닫기

document.addEventListener('DOMContentLoaded', function () {
    const ctx = (typeof window.contextPath === 'string') ? window.contextPath : '';
    const detailSlide = document.getElementById('slide-detail');

    // 상세 열기 함수
    function openDetail(data) {
        if (!detailSlide) return;

        detailSlide.classList.add('open');
        detailSlide.querySelector('.slide-worker, .slide-id').textContent = '사번 : ' + (data.worker_id || '');
        document.getElementById('detail-worker-id').value = data.worker_id || '';

        const tds = detailSlide.querySelectorAll('tbody tr td');
        if (tds.length >= 6) {
        tds[0].textContent = data.worker_name || '';
        tds[1].textContent = data.worker_birth || '';
        tds[2].textContent = data.worker_email || '';
        tds[3].textContent = data.worker_join || '';
        tds[4].textContent = data.department_name || '';
        tds[5].textContent = data.worker_code || '';
        }
    }

    // td 클릭 시 상세 열기
    document.addEventListener('click', async (e) => {
        // 체크박스, 버튼 클릭은 제외
        if (e.target.closest('input[type="checkbox"], button, a')) return;

        const cell = e.target.closest('.worker-row');
        if (!cell) return;

        const workerId = cell.dataset.id;
        if (!workerId) return;

        try {
        const res = await fetch(`${ctx}/workerDetail?worker_id=${encodeURIComponent(workerId)}`, {
            headers: { 'Accept': 'application/json' },
            cache: 'no-store'
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        openDetail(data);
        } catch (err) {
        console.error('상세 불러오기 실패:', err);
        alert('상세 정보를 불러오는 중 오류가 발생했습니다.');
        }
    });

    // 상세 슬라이드 닫기 (취소 버튼)
    const cancelDetailBtn = document.querySelector('#slide-detail .close-btn');
    if (cancelDetailBtn) {
        cancelDetailBtn.addEventListener('click', (e) => {
        e.preventDefault();
        detailSlide.classList.remove('open');
        });
    }
});

// ================================================
// 상세 슬라이드 수정 모드 토글 + 저장(AJAX) + 취소(원복/닫기)

document.addEventListener('DOMContentLoaded', function () {
    const ctx = (typeof window.contextPath === 'string') ? window.contextPath : '';
    const detailSlide = document.getElementById('slide-detail');
    if (!detailSlide) return;

    const btnModify = document.getElementById('btn-modify'); // 수정
    const btnSave   = document.getElementById('btn-save');   // 저장
    const btnCancel = document.querySelector('#slide-detail .close-btn'); // 취소(닫기)

    // deptList 폴백: Part 0에서 window.deptList가 없으면 상단 필터에서 생성
    if (!Array.isArray(window.deptList)) window.deptList = [];
    if (window.deptList.length === 0) {
        const sel = document.getElementById('deptSelect');
        if (sel) {
        window.deptList = Array.from(sel.options)
            .filter(o => o.value && o.value !== '')
            .map(o => ({ department_id: o.value, department_name: o.textContent.trim() }));
        }
    }

    const state = {
        original: null,  // 보기 모드 스냅샷
        mode: 'view'
    };

    function getDetailTds() {
        return detailSlide.querySelectorAll('tbody tr td'); // 6칸(이름/생년월일/이메일/입사일/부서/권한)
    }

    function snapshotDetail() {
        const tds = getDetailTds();
        const hid = document.getElementById('detail-worker-id');
        return {
        worker_id: (hid && hid.value) || '',
        worker_name:   (tds[0] && tds[0].textContent.trim()) || '',
        worker_birth:  (tds[1] && tds[1].textContent.trim()) || '',
        worker_email:  (tds[2] && tds[2].textContent.trim()) || '',
        worker_join:   (tds[3] && tds[3].textContent.trim()) || '',
        department_name: (tds[4] && tds[4].textContent.trim()) || '',
        worker_code:   (tds[5] && tds[5].textContent.trim()) || ''
        };
    }

    function enterEditMode() {
        if (state.mode === 'edit') return;
        const tds = getDetailTds();
        if (tds.length < 6) return;

        state.original = snapshotDetail();
        state.mode = 'edit';

        const deptOptions = (window.deptList || []).map(d => {
        const selected = (d.department_name === state.original.department_name) ? 'selected' : '';
        return `<option value="${d.department_id}" ${selected}>${d.department_name}</option>`;
        }).join('');

        const code = state.original.worker_code || '';
        const codeOpts = `
        <option value="ADMIN" ${code==='ADMIN'?'selected':''}>ADMIN</option>
        <option value="HEAD"  ${code==='HEAD' ?'selected':''}>HEAD</option>
        <option value="STAFF" ${code==='STAFF'?'selected':''}>STAFF</option>
        `;

        const [emailId, emailDomain] = (state.original.worker_email || '').split('@');
        const emailOptions = ['naver.com', 'gmail.com', 'daum.net', 'hotmail.com']
        .map(dom => `<option value="${dom}" ${emailDomain===dom?'selected':''}>${dom}</option>`)
        .join('');

        // td → 입력 UI로 치환
        tds[0].innerHTML = `<input type="text"  name="worker_name"  class="edit-input"  value="${state.original.worker_name}">`;
        tds[1].innerHTML = `<input type="date"  name="worker_birth" class="edit-input"  value="${state.original.worker_birth}">`;
        tds[2].innerHTML = `
        <div class="email-edit">
            <input type="text" name="email_id" class="edit-input short" value="${emailId || ''}"> @
            <select name="email_domain" class="edit-select short">${emailOptions}</select>
        </div>
        `;
        tds[3].innerHTML = `<input type="date"  name="worker_join"  class="edit-input"  value="${state.original.worker_join}">`;
        tds[4].innerHTML = `<select name="department_id" class="edit-select">${deptOptions}</select>`;
        tds[5].innerHTML = `<select name="worker_code"    class="edit-select">${codeOpts}</select>`;

        // 버튼 토글
        btnModify && btnModify.classList.add('hide');
        btnSave   && btnSave.classList.remove('hide');
    }

    function exitEditMode(restoreOriginal) {
        if (state.mode !== 'edit') return;
        const tds = getDetailTds();
        if (tds.length < 6) return;

        const v = restoreOriginal ? state.original : snapshotDetail();

        // input/select에서 값 읽어 최신화 (취소 시에도 안전)
        const getVal = (el) => el ? (el.value || '').trim() : '';

        if (!restoreOriginal) {
        const inp0 = tds[0].querySelector('input');
        const inp1 = tds[1].querySelector('input');
        const emailIdInp = tds[2].querySelector('input[name="email_id"]');
        const emailDomSel= tds[2].querySelector('select[name="email_domain"]');
        const inp3 = tds[3].querySelector('input');
        const sel4 = tds[4].querySelector('select');
        const sel5 = tds[5].querySelector('select');

        v.worker_name  = getVal(inp0) || v.worker_name;
        v.worker_birth = getVal(inp1) || v.worker_birth;
        const eid = getVal(emailIdInp);
        const edm = getVal(emailDomSel);
        v.worker_email = (eid && edm) ? `${eid}@${edm}` : v.worker_email;
        v.worker_join  = getVal(inp3) || v.worker_join;

        const deptId = getVal(sel4);
        if (deptId && Array.isArray(window.deptList)) {
            const found = window.deptList.find(d => d.department_id === deptId);
            if (found) v.department_name = found.department_name;
        }
        v.worker_code  = getVal(sel5) || v.worker_code;
        }

        // 텍스트 모드로 복구
        tds[0].textContent = v.worker_name || '';
        tds[1].textContent = v.worker_birth || '';
        tds[2].textContent = v.worker_email || '';
        tds[3].textContent = v.worker_join  || '';
        tds[4].textContent = v.department_name || '';
        tds[5].textContent = v.worker_code || '';

        btnSave   && btnSave.classList.add('hide');
        btnModify && btnModify.classList.remove('hide');
        state.mode = 'view';
    }

    // 수정
    btnModify && btnModify.addEventListener('click', (e) => {
        e.preventDefault();
        enterEditMode();
    });

    // 저장 (AJAX)
    btnSave && btnSave.addEventListener('click', async (e) => {
        e.preventDefault();
        if (state.mode !== 'edit') return;

        const tds = getDetailTds();
        const hid = document.getElementById('detail-worker-id');
        const worker_id = (hid && hid.value) || '';

        const name  = tds[0].querySelector('input')?.value.trim() || '';
        const birth = tds[1].querySelector('input')?.value.trim() || '';
        const emailId = tds[2].querySelector('input[name="email_id"]')?.value.trim() || '';
        const emailDomain = tds[2].querySelector('select[name="email_domain"]')?.value.trim() || '';
        const email = (emailId && emailDomain) ? `${emailId}@${emailDomain}` : '';
        const join  = tds[3].querySelector('input')?.value.trim() || '';
        const deptId= tds[4].querySelector('select')?.value.trim() || '';
        const code  = tds[5].querySelector('select')?.value.trim() || '';

        if (!name)   return alert('이름을 입력하세요.');
        if (!birth)  return alert('생년월일을 입력하세요.');
        if (!join)   return alert('입사일을 입력하세요.');
        if (!deptId) return alert('부서를 선택하세요.');
        if (!code || code === '1') return alert('권한을 선택하세요.');

        const fd = new FormData();
        fd.append('worker_id', worker_id);
        fd.append('worker_name', name);
        fd.append('worker_birth', birth);
        fd.append('worker_email', email);
        fd.append('worker_join', join);
        fd.append('department_id', deptId);
        fd.append('worker_code', code);

        try {
        const res = await fetch(`${ctx}/workerUpdate`, {
            method: 'POST',
            body: fd,
            headers: { 'Accept': 'application/json' },
            credentials: 'same-origin'
        });
        const txt = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${txt}`);
        const data = txt ? JSON.parse(txt) : {};
        if (!data.ok) {
            alert(data.message || '수정에 실패했습니다.');
            return;
        }

        // 부서명 계산
        const deptName = (() => {
            const found = (window.deptList || []).find(d => d.department_id === deptId);
            return found ? found.department_name : (state.original?.department_name || '');
        })();

        // 보기모드로 전환 (새 값 반영)
        const viewValues = {
            worker_name: name,
            worker_birth: birth,
            worker_email: email,
            worker_join: join,
            department_name: deptName,
            worker_code: code
        };
        state.original = Object.assign({}, state.original, viewValues);
        exitEditMode(false);

        // 목록 행 갱신 + 이벤트 브로드캐스트
        const workerForList = {
            worker_id,
            worker_name: name,
            worker_join: join,
            worker_code: code,
            department_name: deptName
        };
        updateListRowInTable(workerForList);
        window.dispatchEvent(new CustomEvent('worker:updated', { detail: workerForList }));

        alert('수정되었습니다.');
        } catch (err) {
        console.error('저장 오류:', err);
        alert('수정 처리 중 오류가 발생했습니다.');
        }
    });

    // 취소
    btnCancel && btnCancel.addEventListener('click', (e) => {
        e.preventDefault();
        if (state.mode === 'edit') {
        if (!confirm('수정을 취소하시겠습니까? 변경 사항이 저장되지 않습니다.')) return;
        exitEditMode(true); // 원복
        }
        detailSlide.classList.remove('open'); // 슬라이드 닫기 (CSS 트랜지션)
    });
});
// ================================================
// 저장 성공 직후, 목록 테이블의 해당 행을 즉시 갱신

function updateListRowInTable(worker) {
    // worker: { worker_id, worker_name, worker_join, worker_code, department_name }
    if (!worker || !worker.worker_id) return;

    const tr = document.querySelector(`.table tbody tr[data-id="${worker.worker_id}"]`);
    if (!tr) return;

    // 테이블 구조: [0]=chk, [1]=사번, [2]=이름, [3]=부서, [4]=입사일, [5]=권한
    const tds = tr.querySelectorAll('td');

    if (tds[2]) {
        // 클릭 이벤트를 위해 클래스/데이터 유지하며 텍스트만 갱신
        tds[2].textContent = worker.worker_name ?? tds[2].textContent;
        tds[2].classList.add('worker-row');
        tds[2].dataset.id = worker.worker_id;
    }
    if (tds[3]) tds[3].textContent = worker.department_name ?? tds[3].textContent;
    if (tds[4]) tds[4].textContent = worker.worker_join ?? tds[4].textContent;
    if (tds[5]) tds[5].textContent = worker.worker_code ?? tds[5].textContent;
}
// ======================= 02_user.js Part 4C =========================
// 다른 코드가 저장/변경했을 때도 목록이 즉시 갱신되도록 이벤트 수신

window.addEventListener('worker:updated', (e) => {
    if (!e || !e.detail) return;
    updateListRowInTable(e.detail);
});


