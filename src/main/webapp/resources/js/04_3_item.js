// 04_3_item.js
document.addEventListener('DOMContentLoaded', () => {
  // 메인 테이블/슬라이드
  const tableBody = document.querySelector('.table tbody');
  const detail = document.querySelector('#slide-detail');
  if (!tableBody || !detail) return;

  // contextPath (JSP에서 전역으로 내려오는 값 사용)
  const ctx = (typeof contextPath === 'string') ? contextPath : '';

  // === API 경로 설정 ===
  // 프로젝트가 *.do 규칙이면 USE_DOT_DO = true로 바꾸고, 서버도 /item/detail.do에 매핑해.
  const USE_DOT_DO = false;
  const API_PATH = '/item/detail' + (USE_DOT_DO ? '.do' : '');

  // 슬라이드 내부 클릭 시 닫힘 방지
  const slideContents = detail.querySelector('.slide-contents');
  if (slideContents) slideContents.addEventListener('click', e => e.stopPropagation());

  // 행 클릭 → 상세 호출
  tableBody.addEventListener('click', async (evt) => {
    const row = evt.target.closest('tr');
    if (!row) return;

    // 첫 번째 열(체크박스) 클릭은 무시
    const td = evt.target.closest('td');
    const cellIndex = td ? Array.from(row.cells).indexOf(td) : -1;
    if (cellIndex === 0) return;

    // 품목 ID는 <tr data-id="...">
    const itemId = row.dataset.id;
    if (!itemId) {
      console.warn('data-id(품목 ID)가 없습니다.');
      return;
    }

    // 요청 URL
    const url = `${ctx}${API_PATH}?item_id=${encodeURIComponent(itemId)}`;
    console.log('[DETAIL-REQ]', url);

    try {
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      const raw = await res.text();
      console.log('[DETAIL-RES]', res.status, res.headers.get('content-type'), raw?.slice(0, 200));

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      let data = null;
      try { data = raw ? JSON.parse(raw) : null; }
      catch (e) { throw new Error(`JSON 파싱 실패: ${e.message}`); }

      // 상세 채우기
      fillItemDetail(detail, data || {});

      // 슬라이드 열기 + 배경 클릭 한 번으로 닫기
      detail.classList.add('open');
      const closeOnBackdrop = (e) => { if (e.target === detail) detail.classList.remove('open'); };
      detail.addEventListener('click', closeOnBackdrop, { once: true });

    } catch (err) {
      console.error('상세 정보 로드 중 오류:', err);
      alert('상세 정보를 불러오는 중 오류가 발생했습니다.');
    }
  });

  // 닫기 버튼
  detail.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => detail.classList.remove('open'));
  });
});

// ============================
// 상세 슬라이드 데이터 채우기 (현재 JSP 구조용: 테이블 1개)
// ============================
function fillItemDetail(slide, data) {
  if (!data) data = {};

  // 숫자 포맷터
  const nf = new Intl.NumberFormat();

  // 상단 라벨 2줄: "품목 ID:", "품목 이름:"
  const idLines = slide.querySelectorAll('.slide-id'); // [0]=품목 ID, [1]=품목 이름
  if (idLines[0]) idLines[0].textContent = `품목 ID: ${safe(data.item_id)}`;
  if (idLines[1]) idLines[1].textContent = `품목 이름: ${safe(data.item_name)}`;

  // 테이블 1개: [거래처ID, 거래처이름, 품목구분, 단가, 단위]
  const table = slide.querySelector('.slide-tb table');
  const tr = table ? table.querySelector('tbody tr') : null;
  if (tr) {
    // 열 인덱스: 0=거래처ID, 1=거래처이름, 2=품목구분, 3=단가, 4=단위
    setCellText(tr, 0, data.client_id || data.vendor_id); // 서버에서 어떤 이름으로 오든 커버
    setCellText(tr, 1, data.client_name || data.vendor_name);
    setCellText(tr, 2, data.item_div);
    setCellText(tr, 3, (data.item_price != null) ? nf.format(data.item_price) : '');
    setCellText(tr, 4, data.item_unit);
  }
}

function setCellText(tr, index, val) {
  const td = tr && tr.children && tr.children[index];
  if (td) td.textContent = safe(val);
}

function safe(v) { return (v ?? '').toString(); }
