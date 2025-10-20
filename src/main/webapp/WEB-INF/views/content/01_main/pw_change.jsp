<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>J2P4 비밀번호 변경</title>
  <style>
    	:root { 
		--border:#9aa0a6;
		--text:#222;
		--muted:#666;
		--button:#111827;
		--button-text:#fff;
		--field-border:#999;
		--card-bg:#fff;
		--page-bg:#fff;
		--radius:10px; 
		--box-shadow: 0 4px 16px rgba(0, 0, 0, 0.162),
			  0 0 2px rgba(0, 0, 0, 0.06);
	}
	
	*{ box-sizing:border-box } 
	html,body{ height:100% }
	
	body{
		margin:0;
		color:var(--text);
		background:var(--page-bg);
		display:flex;
		flex-direction: column;
		justify-content:center;
		align-items:center;
	}
	
	.wrap{
		width:700px;
		max-width:92vw;
		text-align:center;
		display:flex;
		flex-direction:column;
		align-items:center;
	}
	
	h1.title{
		margin:0 0 28px;
		font-size:60px;
		font-weight:700;
		letter-spacing:-0.02em;
	}
	.title > span { color:#111827 }
	
	.card{
		margin:0 auto;
		width:450px;
		max-width:92vw;
		background:var(--card-bg);
		border-radius:var(--radius);
		padding:28px 28px 24px;
		text-align:left;
		box-shadow:var(--box-shadow);
		display:flex;
		flex-direction:column;
		align-items:stretch;
	}
	
	.form-row{
		display:flex;
		align-items:center;
		gap:14px;
		margin-bottom:16px;
		height:70px;
	}
	.form-row label{
		width:100px;
		font-size:16px;
		color:var(--muted);
		padding-left:8px;
	}
	.form-row input[type="text"],
	.form-row input[type="password"]{
		flex:1;
		height:40px;
		border:1.5px solid var(--field-border);
		border-radius:8px;
		padding:0 12px;
		font-size:16px;
		outline:none;
	}
	input:focus{ border-color:#6b6b6b; }
	
	.actions{ margin-top:18px }
	
	#userid, #userpw{ height:50px; }
	
	.btn{
		height:60px;
		border:none;
		border-radius:8px;
		background:var(--button);
		color:var(--button-text);
		font-size:24px;
		font-weight:700;
		cursor:pointer;
		width:100%;
		margin-top:1%;
	}
	.btn:active{ transform:translateY(1px) }
	
	.pw_reset{
		text-align:center;
		margin-top:3%;
		font-weight:bold;
		color:#6b6b6b;
	}
	.error {
		color : red;
		font-weight: bold;
	}
	@media (max-width:768px){
		.form-row{
			flex-direction:column;
			align-items:flex-start;
			gap:8px;
		}
		.form-row label{ padding-left:2px }
	}
  </style>
</head>
<body>
<form method="post" action="change_page">
  <div class="wrap">
    <h1 class="title">J2P4 <span>MES</span></h1>

    <div class="card">
      <div class="form-row">
        <label for="userid">아이디</label>
        <input id="userid" type="text" value="${sessionScope.loginUser.worker_id}" readonly>
        <input type="hidden" name="worker_id" value="${sessionScope.loginUser.worker_id}">
      </div>

      <div class="form-row">
        <label for="currentPw">현재 비밀번호</label>
        <input id="currentPw" name="current_pw" type="password" required>
      </div>

      <div class="form-row">
        <label for="newPw">비밀번호</label>
        <input id="newPw" name="new_pw" type="password" placeholder="변경할 비밀번호를 입력하세요" autocomplete="new-password">
      </div>

      <div class="form-row">
        <label for="pw-confirm">비밀번호 확인</label>
        <input id="pw-confirm" name="confirm_pw" type="password" autocomplete="new-password">
      </div>

      <!-- 상태 문구: 빨강→주황→초록 -->
      <div class="confirm-text" id="pw-status" style="min-height:22px; text-align:center; font-weight:600; color:#e74c3c;">
        영문·숫자·특수문자를 포함해야 합니다.
      </div>

      <div class="actions">
        <button type="submit" class="btn" id="btn-submit" disabled>비밀번호 변경</button>
      </div>
    </div>
  </div>
</form>

<c:if test="${not empty msg}">
  <div class="alert success">${msg}</div>
</c:if>
<c:if test="${not empty error}">
  <div class="alert error">${error}</div>
</c:if>
<c:if test="${not empty alert}">
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      alert('${fn:escapeXml(alert)}');  // 한 번만 뜸
    });
  </script>
</c:if>
<!-- 실시간 검사 스크립트 -->
<script>
document.addEventListener('DOMContentLoaded', () => {
  const input        = document.getElementById('newPw');
  const confirmInput = document.getElementById('pw-confirm');
  const currentInput = document.getElementById('currentPw');
  const status       = document.getElementById('pw-status');
  const submitBtn    = document.getElementById('btn-submit');

  const SPECIAL = /[!@#$%^&*()_\-+=]/;
  const REPEAT3 = /(.)\1\1/;

  const evaluate = () => {
    const val        = input.value || '';
    const currentVal = currentInput.value || '';
    const confirmVal = confirmInput.value || '';

    const hasAlpha   = /[A-Za-z]/.test(val);
    const hasNum     = /[0-9]/.test(val);
    const hasSpecial = SPECIAL.test(val);
    const lenOK      = val.length >= 8 && val.length <= 20;
    const repeatOK   = !REPEAT3.test(val);
    const confirmOK  = confirmVal === val && val.length > 0;

    // 남은 조건 모으기
    const missing = [];
    if (!hasAlpha)   missing.push('영문');
    if (!hasNum)     missing.push('숫자');
    if (!hasSpecial) missing.push('특수문자');

    // 1) 현재 비밀번호와 동일 금지
    if (val && currentVal && val === currentVal) {
      status.textContent = '현재 비밀번호와 동일합니다. 다른 비밀번호를 사용하세요.';
      status.style.color = '#e74c3c';
      submitBtn.disabled = true;
      return;
    }

    // 2) 아무 입력 없음
    if (!val) {
      status.textContent = '영문·숫자·특수문자를 포함해야 합니다.';
      status.style.color = '#e74c3c';
      submitBtn.disabled = true;
      return;
    }

    // 3) 길이
    if (!lenOK) {
      status.textContent = '8~20자 사이로 입력하세요.';
      status.style.color = '#e74c3c';
      submitBtn.disabled = true;
      return;
    }

    // 4) 조합 미흡 시
    if (missing.length > 0) {
      status.textContent = `\${missing.join('·')}를 포함해야 합니다.`;
      status.style.color = '#e67e22';
      submitBtn.disabled = true;
      return;
    }

    // 5) 반복 문자
    if (!repeatOK) {
      status.textContent = '같은 문자를 3번 이상 연속으로 사용할 수 없어요.';
      status.style.color = '#e67e22';
      submitBtn.disabled = true;
      return;
    }

    // 6) 확인 불일치
    if (confirmVal.length > 0 && confirmVal !== val) {
      status.textContent = '새 비밀번호와 일치하지 않습니다.';
      status.style.color = '#e67e22';
      submitBtn.disabled = true;
      return;
    }

    // 7) 완벽
    status.textContent = '안전한 비밀번호입니다.';
    status.style.color = '#27ae60';
    submitBtn.disabled = false;
  };

  ['input','change','paste'].forEach(ev => {
    input.addEventListener(ev, evaluate);
    confirmInput.addEventListener(ev, evaluate);
    currentInput.addEventListener(ev, evaluate);
  });

  evaluate();
});
</script>


</body>
</html>
