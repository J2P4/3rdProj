
(function() {
	// 로그인 안 되어 있으면 바로 중단
	if (!sessionInfo.isLogin) return;
	
	let remain = sessionInfo.remainSec;          // 남은 시간(초)
	const ctx = sessionInfo.contextPath || '';   // 컨텍스트 루트
	const stime = document.getElementById('sess-remaining');
	const sbtn = document.getElementById('sess-extend');
	
	const POLL_MS = 1000;        // 1초 단위 카운트
	const SYNC_INTERVAL = 60;    // 60초마다 서버 동기화
	let tickCount = 0;
	let timer = null;
	
    /** 시간 형식 MM:SS */
    function fmt(sec) {
	    sec = Math.max(0, sec|0);
	    const m = Math.floor(sec / 60);
	    const s = sec % 60;
    	
    	return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	}

	/** 남은 시간 서버에서 동기화 */
	async function syncRemain() {
	    try {
		    const r = await fetch(ctx + "/session/remain", { credentials: "same-origin" });
		    const j = await r.json();
		    
		    if (!j.authenticated) { hardLogout(); return false; }
		    
		    remain = Number(j.remainSec) || 0;
		    render();
		    return true;
	    } catch (e) {
	    	return false;
	    }
	}

	/** 세션 연장 요청 */
	async function extendSession(){
	
		if (!sbtn) return;
		sbtn.disabled = true;            // 중복 클릭 방지
	
		try {
		    const r = await fetch(ctx + "/session/extend", {
		        method:"POST",
		        credentials:"same-origin",
		        headers: { "Content-Type":"application/x-www-form-urlencoded" },
		        body:""
		    });
		    const j = await r.json();
		    if(!j.authenticated) return hardLogout();
		
		    // 서버가 내려준 값으로 즉시 갱신
		    remain = j.remainSec;
		    render();
		    
		} finally {
		    sbtn.disabled = false;
		}
	}

	/** 세션 만료 시 자동 로그아웃 */
	function hardLogout() {
	    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
	    window.location.href = ctx + "/logout";
	}
	
	/** UI 업데이트 */
	function render() {
	    stime.textContent = fmt(remain);
	}
	
	/** 버튼 클릭 이벤트 */
    if (sbtn) {
    	// 버튼 타입 보정(폼 submit 방지)
    	if (!sbtn.getAttribute('type')) sbtn.setAttribute('type','button');
    	sbtn.addEventListener('click', extendSession);
  	}

    // 새로고침/페이지 진입 시 서버와 1회 동기화 → 그 다음 카운트다운 시작
    syncRemain().then(() => {
    	render();

	    timer = setInterval(() => {
	    	remain--;
	        render();
	        tickCount++;
	
	        // 0초 → 자동 로그아웃
	        if (remain <= 0) {
	        	clearInterval(timer);
	        	hardLogout();
	        	return;
	        }
	
	        // 60초마다 서버와 동기화 (탭 슬립/시간 드리프트 방지)
	        if (tickCount % SYNC_INTERVAL === 0) syncRemain();

       }, POLL_MS);
    });
})();
