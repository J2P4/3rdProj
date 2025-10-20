/******************************************************
 * J2P4 생산계획(CP) 스크립트
 *  - init() → bindcp(), bindcpInsert()
 ******************************************************/

const ctx = (typeof window.contextPath === 'string') ? window.contextPath : "";

/* ========================= 유틸 ========================= */

// YYYY-MM-DD (TZ 보정용 — 필요 시 사용)
function fmtDateYYYYMMDD(d) {
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// cp_start ≤ cp_end 보장 (등록/상세 내 각 TR 기준으로 상호 제약)
function applyDateGuards(root) {
    if (!root) return;
    const startInputs = root.querySelectorAll('input[name="cp_start"]');
    const endInputs = root.querySelectorAll('input[name="cp_end"]');

    for (let i = 0; i < startInputs.length; i++) {
        const s = startInputs[i];
        s.addEventListener('change', function () {
            const e = s.closest('tr') ? s.closest('tr').querySelector('input[name="cp_end"]') : root.querySelector('input[name="cp_end"]');
            if (!e) return;
            if (e.value && s.value && s.value > e.value) e.value = s.value;
            e.min = s.value || '';
        });
    }

    for (let i = 0; i < endInputs.length; i++) {
        const e = endInputs[i];
        e.addEventListener('change', function () {
            const s = e.closest('tr') ? e.closest('tr').querySelector('input[name="cp_start"]') : root.querySelector('input[name="cp_start"]');
            if (!s) return;
            if (e.value && s.value && s.value > e.value) s.value = e.value;
            s.max = e.value || '';
        });
    }
}

// Insert 슬라이드의 품목 select(#itemSelectInsert)에서 window.itemList 구성
function ensureItemListFromInsertSelect() {
    if (!Array.isArray(window.itemList)) window.itemList = [];
    if (window.itemList.length > 0) return;

    const sel = document.getElementById('itemSelectInsert');
    if (!sel) return;

    const arr = [];
    const opts = sel.options;
    for (let i = 0; i < opts.length; i++) {
        const o = opts[i];
        if (o.value && o.value !== "") {
            arr.push({ item_id: String(o.value), item_name: (o.textContent || "").trim() });
        }
    }
    window.itemList = arr;
}

// 상세 패널 채우기(품목명 비어있을 때 철벽 fallback 포함)
function openCpDetail(detailSlide, data, fallbackName) {
    if (!detailSlide) return;
    detailSlide.classList.add('open');

    // 타이틀/ID
    const idLabel = detailSlide.querySelector('.slide-cp, .slide-id');
    if (idLabel) idLabel.textContent = '생산계획ID : ' + (data.cp_id ? data.cp_id : '');

    // hidden cp_id
    let hid = document.getElementById('detail-cp-id');
    if (!hid) {
        hid = document.createElement('input');
        hid.type = 'hidden';
        hid.id = 'detail-cp-id';
        detailSlide.appendChild(hid);
    }
    hid.value = data.cp_id ? String(data.cp_id) : '';

    // hidden item_id
    let hidItem = document.getElementById('detail-item-id');
    if (!hidItem) {
        hidItem = document.createElement('input');
        hidItem.type = 'hidden';
        hidItem.id = 'detail-item-id';
        detailSlide.appendChild(hidItem);
    }
    hidItem.value = data.item_id ? String(data.item_id) : '';

    // 품목명 결정(서버값 → item_id 매핑 → 목록셀 텍스트 → 테이블 조회 → 단일옵션 추정 → 역매핑)
    let itemName = '';
    // 1) 서버가 item_name을 줬으면 그걸 사용
    if (data.item_name && String(data.item_name).trim() !== '') {
        itemName = String(data.item_name).trim();
    }

    // 2) 서버가 item_id만 줬다면, itemList로 매핑
    if (!itemName && data.item_id && Array.isArray(window.itemList)) {
        const foundById = window.itemList.find(function (i) { return String(i.item_id) === String(data.item_id); });
        if (foundById) itemName = foundById.item_name;
    }

    // 3) 목록 셀에서 전달받은 fallbackName
    if (!itemName && fallbackName && fallbackName !== '') {
        itemName = fallbackName;
    }

    // 4) 그래도 없으면 테이블에서 직접 조회
    if (!itemName && data.cp_id) {
        const cellFromTable = document.querySelector('.cp-row[data-id="' + data.cp_id + '"]');
        if (cellFromTable) {
            const txt = (cellFromTable.textContent || '').trim();
            if (txt !== '') itemName = txt;
        }
    }

    // 5) item_id도 없는데 itemList가 정확히 1개뿐이면 그걸로 추정
    if (!itemName && (!data.item_id || data.item_id === '') && Array.isArray(window.itemList) && window.itemList.length === 1) {
        itemName = window.itemList[0].item_name;
        hidItem.value = String(window.itemList[0].item_id);
    }

    // 6) item_id 비었고 itemName만 있다면 역매핑해서 hidden item_id 채움
    if ((!hidItem.value || hidItem.value === '') && itemName && Array.isArray(window.itemList)) {
        const byName = window.itemList.find(function (i) { return i.item_name === itemName; });
        if (byName) hidItem.value = String(byName.item_id);
    }

    // 값 렌더
    const tds = detailSlide.querySelectorAll('tbody tr td'); // 0 start, 1 end, 2 item_name, 3 amount
    if (tds.length >= 4) {
        tds[0].textContent = data.cp_start ? String(data.cp_start) : '';
        tds[1].textContent = data.cp_end ? String(data.cp_end) : '';
        tds[2].textContent = itemName ? itemName : '';
        tds[3].textContent = data.cp_amount ? String(data.cp_amount) : '';
    }
}

// 목록의 해당 행 갱신
function updateListRowInTableCp(row) {
    if (!row || !row.cp_id) return;

    const tr = document.querySelector('.table tbody tr[data-id="' + row.cp_id + '"]');
    if (!tr) return;

    const tds = tr.querySelectorAll('td'); // [0]=chk,[1]=cp_id,[2]=item_name(.cp-row),[3]=range,[4]=amount

    if (tds[2]) {
        tds[2].textContent = row.item_name ? row.item_name : tds[2].textContent;
        tds[2].classList.add('cp-row');
        tds[2].dataset.id = row.cp_id;
    }

    if (tds[3]) {
        const s = tds[3].querySelector('span:nth-child(1)');
        const e = tds[3].querySelector('span:nth-child(2)');
        if (s) s.textContent = row.cp_start ? row.cp_start : s.textContent;
        if (e) e.textContent = row.cp_end ? row.cp_end : e.textContent;
    }

    if (tds[4]) {
        tds[4].textContent = row.cp_amount ? row.cp_amount : tds[4].textContent;
    }
}

/* ========================= 진입점 ========================= */

window.addEventListener('load', init);

function init() {
    // 1) 페이지 전체에 날짜 가드 1차 적용
    applyDateGuards(document);

    // 2) 바인딩
    bindcp();
    bindcpInsert();
}

/* ========================= bindcp =========================
 * - 삭제, 전체체크
 * - 신규 슬라이드 열기
 * - 상세 슬라이드 열기/닫기
 * - 상세 수정/저장/취소
 * ========================================================*/
function bindcp() {
    if (bindcp._bound) return;
    bindcp._bound = true;

    const detailSlide = document.getElementById('slide-detail');
    const btnNew = document.querySelector('.btm-btn.new');
    const btnDelete = document.querySelector('.btm-btn.del');
    const chkAll = document.getElementById('chkAll');
    const formDelete = document.getElementById('deleteForm');
    const slideInput = document.getElementById('slide-input');

    // 삭제
    if (btnDelete && formDelete) {
        btnDelete.addEventListener('click', function () {
            const checks = document.querySelectorAll('.rowChk:checked');
            if (checks.length === 0) { alert('삭제할 항목을 선택하세요.'); return; }
            if (!confirm(checks.length + '건을 삭제하시겠습니까?')) return;
            formDelete.submit();
        });
    }

    // 전체선택
    if (chkAll) {
        chkAll.addEventListener('change', function () {
            const rows = document.querySelectorAll('.rowChk');
            for (let i = 0; i < rows.length; i++) rows[i].checked = chkAll.checked;
        });
    }

    // 신규 열기
    if (btnNew && slideInput) {
        btnNew.addEventListener('click', function () {
            slideInput.classList.add('open');
            applyDateGuards(slideInput);
        });
    }

    // 상세 열기 (위임) — .cp-row 클릭
    if (detailSlide) {
        document.addEventListener('click', async function (e) {
            if (e.target.closest('input[type="checkbox"]') || e.target.closest('button') || e.target.closest('a')) return;

            const cell = e.target.closest('.cp-row');
            if (!cell) return;

            const cpId = cell.dataset.id;
            if (!cpId) return;

            try {
                const res = await fetch(ctx + '/cpdetail?cp_id=' + encodeURIComponent(cpId), {
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-store'
                });
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const data = await res.json(); // {cp_id,cp_start,cp_end,item_id?,item_name?,cp_amount?}

                ensureItemListFromInsertSelect();

                // 목록에 보이는 품목명도 fallback으로 전달
                const fallbackName = (cell.textContent || '').trim();
                openCpDetail(detailSlide, data, fallbackName);

            } catch (err) {
                console.error('상세 불러오기 실패:', err);
                alert('상세 정보를 불러오는 중 오류가 발생했습니다.');
            }
        });

        // 상세 닫기
        const cancelBtn = detailSlide.querySelector('.close-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function (e) {
                e.preventDefault();
                detailSlide.classList.remove('open');
            });
        }

        // ===== 상세 수정/저장/취소 =====
        const btnModify = document.getElementById('btn-modify');
        const btnSave = document.getElementById('btn-save');
        const btnCancel = detailSlide.querySelector('.close-btn');

        const state = { mode: 'view', original: null };

        function getTds() {
            return detailSlide.querySelectorAll('tbody tr td');
        }

        function snap() {
            const tds = getTds();
            const hid = document.getElementById('detail-cp-id');
            const hidItem = document.getElementById('detail-item-id');
            return {
                cp_id: hid ? hid.value : '',
                cp_start: tds[0] ? (tds[0].textContent || '').trim() : '',
                cp_end: tds[1] ? (tds[1].textContent || '').trim() : '',
                item_id: hidItem ? hidItem.value : '',
                item_name: tds[2] ? (tds[2].textContent || '').trim() : '',
                cp_amount: tds[3] ? (tds[3].textContent || '').trim() : ''
            };
        }

        function enterEdit() {
            if (state.mode === 'edit') return;
            const tds = getTds();
            if (tds.length < 4) return;

            ensureItemListFromInsertSelect();

            state.original = snap();
            state.mode = 'edit';

            // item_id 기준으로 select 옵션 구성
            let opts = '';
            const list = window.itemList || [];
            for (let i = 0; i < list.length; i++) {
                const irow = list[i];
                const selected = (String(irow.item_id) === String(state.original.item_id)) ? ' selected' : '';
                opts += '<option value="' + irow.item_id + '"' + selected + '>' + irow.item_name + '</option>';
            }

            tds[0].innerHTML = '<input type="date" name="cp_start" class="edit-input" value="' + state.original.cp_start + '">';
            tds[1].innerHTML = '<input type="date" name="cp_end" class="edit-input" value="' + state.original.cp_end + '">';
            tds[2].innerHTML = '<select name="item_id" class="edit-select" id="itemSelectDetail">' + opts + '</select>';
            tds[3].innerHTML = '<input type="number" name="cp_amount" class="edit-input" value="' + state.original.cp_amount + '">';

            applyDateGuards(detailSlide);

            if (btnModify) btnModify.classList.add('hide');
            if (btnSave) btnSave.classList.remove('hide');
        }

        function exitEdit(restore) {
            if (state.mode !== 'edit') return;
            const tds = getTds();
            if (tds.length < 4) return;

            const v = restore ? state.original : snap();

            if (!restore) {
                const s0 = tds[0].querySelector('input[name="cp_start"]');
                const s1 = tds[1].querySelector('input[name="cp_end"]');
                const sel = tds[2].querySelector('select[name="item_id"]');
                const n3 = tds[3].querySelector('input[name="cp_amount"]');

                const getVal = function (el) { return el ? (el.value || '').trim() : ''; };

                v.cp_start = getVal(s0) || v.cp_start;
                v.cp_end = getVal(s1) || v.cp_end;

                const itemId = getVal(sel) || v.item_id;
                v.item_id = itemId;

                if (itemId && Array.isArray(window.itemList)) {
                    const found = window.itemList.find(function (i) { return String(i.item_id) === String(itemId); });
                    if (found) v.item_name = found.item_name;
                }

                v.cp_amount = getVal(n3) || v.cp_amount;
            }

            tds[0].textContent = v.cp_start || '';
            tds[1].textContent = v.cp_end || '';
            tds[2].textContent = v.item_name || '';
            tds[3].textContent = v.cp_amount || '';

            // hidden 최신화
            const hidItem = document.getElementById('detail-item-id');
            if (hidItem) hidItem.value = v.item_id || '';

            if (btnSave) btnSave.classList.add('hide');
            if (btnModify) btnModify.classList.remove('hide');
            state.mode = 'view';
        }

        if (btnModify) {
            btnModify.addEventListener('click', function (e) {
                e.preventDefault();
                enterEdit();
            });
        }

        if (btnSave) {
            btnSave.addEventListener('click', async function (e) {
                e.preventDefault();
                if (state.mode !== 'edit') return;

                const tds = getTds();
                const hid = document.getElementById('detail-cp-id');
                const cp_id = hid ? hid.value : '';

                const startEl = tds[0].querySelector('input[name="cp_start"]');
                const endEl = tds[1].querySelector('input[name="cp_end"]');
                const itemEl = tds[2].querySelector('select[name="item_id"]');
                const amtEl = tds[3].querySelector('input[name="cp_amount"]');

                const start = startEl ? (startEl.value || '').trim() : '';
                const end = endEl ? (endEl.value || '').trim() : '';
                const itemId = itemEl ? (itemEl.value || '').trim() : '';
                const amount = amtEl ? (amtEl.value || '').trim() : '';

                if (!start) { alert('시작일을 입력하세요.'); return; }
                if (!end) { alert('종료일을 입력하세요.'); return; }
                if (!itemId) { alert('품목을 선택하세요.'); return; }
                if (!amount) { alert('수량을 입력하세요.'); return; }

                const fd = new FormData();
                fd.append('cp_id', cp_id);
                fd.append('cp_start', start);
                fd.append('cp_end', end);
                fd.append('item_id', itemId);
                fd.append('cp_amount', amount);

                try {
                    const res = await fetch(ctx + '/cpupdate', {
                        method: 'POST',
                        body: fd,
                        headers: { 'Accept': 'application/json' },
                        credentials: 'same-origin'
                    });
                    const txt = await res.text();
                    if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + txt);
                    const data = txt ? JSON.parse(txt) : {};
                    if (!data.ok) { alert(data.message || '수정에 실패했습니다.'); return; }

                    // item_id → item_name 매핑
                    let itemName = '';
                    if (Array.isArray(window.itemList)) {
                        const found = window.itemList.find(function (i) { return String(i.item_id) === String(itemId); });
                        if (found) itemName = found.item_name;
                    }

                    exitEdit(false);

                    const row = { cp_id: cp_id, cp_start: start, cp_end: end, item_name: itemName, cp_amount: amount };
                    updateListRowInTableCp(row);
                    window.dispatchEvent(new CustomEvent('cp:updated', { detail: row }));

                    alert('수정되었습니다.');
                } catch (err) {
                    console.error('저장 오류:', err);
                    alert('수정 처리 중 오류가 발생했습니다.');
                }
            });
        }

        if (btnCancel) {
            btnCancel.addEventListener('click', function (e) {
                e.preventDefault();
                if (state.mode === 'edit') {
                    if (!confirm('수정을 취소하시겠습니까? 변경 사항이 저장되지 않습니다.')) return;
                    exitEdit(true);
                }
                detailSlide.classList.remove('open');
            });
        }
    }

    // 다른 코드에서 갱신 브로드캐스트 수신 시 목록 업데이트
    window.addEventListener('cp:updated', function (e) {
        if (!e || !e.detail) return;
        updateListRowInTableCp(e.detail);
    });
}

/* ========================= bindcpInsert =========================
 * - 등록 슬라이드 등록 처리(성공 시 목록 새로고침)
 * ===============================================================*/
function bindcpInsert() {
    if (bindcpInsert._bound) return;
    bindcpInsert._bound = true;

    const slideInput = document.getElementById('slide-input');
    const btnInsert = document.getElementById('btn-insert');
    const form = document.getElementById('cpInsertForm');

    if (btnInsert && form) {
        btnInsert.addEventListener('click', async function () {
            const fd = new FormData(form);

            if (!fd.get('cp_start')) { alert('시작일을 입력하세요.'); return; }
            if (!fd.get('cp_end')) { alert('종료일을 입력하세요.'); return; }
            if (!fd.get('item_id')) { alert('품목을 선택하세요.'); return; }
            if (!fd.get('cp_amount')) { alert('수량을 입력하세요.'); return; }

            try {
                const res = await fetch(ctx + '/cpinsert', {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: fd,
                    credentials: 'same-origin'
                });
                const txt = await res.text();
                if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + txt);
                const data = txt ? JSON.parse(txt) : {};
                if (!data.ok) { alert(data.message || '등록 실패'); return; }

                if (slideInput) slideInput.classList.remove('open');
                form.reset();

                alert('등록되었습니다.');
                // 목록 새로고침(현재 필터/페이지 유지)
                location.reload();

            } catch (e) {
                console.error('등록 중 오류:', e);
                alert('등록 처리 중 오류가 발생했습니다.');
            }
        });
    }
}
