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
  <title>J2P4 로그인</title>
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
	
	@media (max-width:768px){
		.form-row{
			flex-direction:column;
			align-items:flex-start;
			gap:8px;
		}
		.form-row label{ padding-left:2px }
	}
	.alert.success,
	.alert.error {
		color : red;
		font-weight: bold;
		text-align: center;
	}
/* ===== Modal ===== */
.pw-modal-backdrop {
  position: fixed;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.45);
  z-index: 9999;
}
.pw-modal-backdrop.is-open { display: flex; }

.pw-modal-dialog {
  width: 420px;
  max-width: 92vw;
  background: #fff;
  border-radius: 12px;
  padding: 24px 24px 18px;
  box-shadow: 0 12px 30px rgba(0,0,0,.20);
  font-family: inherit;
  color: inherit;
}

.pw-modal__title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
}

.pw-modal__desc {
  margin: 0 0 16px;
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}

.pw-modal__actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
}

/* 버튼 */
.pw-btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #f3f4f6;
  color: #111;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  transition: transform .15s ease, opacity .15s ease;
}
.pw-btn:hover { transform: translateY(-1px); }
.pw-btn:active { transform: translateY(0); opacity: .9; }

.pw-btn--primary {
  border: none;
  background: #2563eb;
  color: #fff;
}

@media (max-width: 480px) {
  .pw-modal-dialog { padding: 20px; }
  .pw-modal__title { font-size: 18px; }
  .pw-btn { font-size: 13px; }
}
</style>

</head>
<body>
<form method="post" action="login">
  <div class="wrap">
    <h1 class="title">J2P4 <span>MES</span></h1>
	
    <div class="card">
        <div class="form-row">
          <label for="userid">아이디</label>
          <input id="userid" name="worker_id" type="text" value="A25101468">
        </div>

        <div class="form-row">
          <label for="userpw">비밀번호</label>
          <input id="userpw" name="worker_pw" type="password" value="admin1234">
        </div>

		<c:if test="${not empty msg}">
			  <div class="alert success">${msg}</div>
			</c:if>
			<c:if test="${not empty error}">
			  <div class="alert error">${error}</div>
		</c:if>	

        <div class="actions">
          <button type="submit" class="btn">로 그 인</button>
        </div>
    </div>
    <div class="pw_reset">
        비밀번호 분실시 관리자에게 문의하세요
    </div>
  </div>
</form>

<!-- Password modal (namespaced) -->
<div id="pwModal" class="pw-modal-backdrop" aria-hidden="true">
  <div class="pw-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="pwModalTitle">
    <h3 id="pwModalTitle" class="pw-modal__title">비밀번호 변경 안내</h3>
    <p class="pw-modal__desc">
      비밀번호 유효기간이 만료되었거나 보안상 변경이 필요합니다.<br>
      지금 변경하시겠습니까?
    </p>
    <div class="pw-modal__actions">
      <button type="button" id="pwChangeLater" class="pw-btn">90일 후 변경</button>
      <button type="button" id="pwChangeNow"   class="pw-btn pw-btn--primary">지금 변경</button>
    </div>
  </div>
</div>
<script>
document.addEventListener('DOMContentLoaded', () => {
  const show = '${sessionScope.showPwModal}' === 'true';
  const modal = document.getElementById('pwModal');
  const btnNow = document.getElementById('pwChangeNow');
  const btnLater = document.getElementById('pwChangeLater');
  const base = '${pageContext.request.contextPath}';

  if (show && modal) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  if (btnNow) {
    btnNow.addEventListener('click', () => {
      location.href = `${base}/pw_change?mode=force`;
    });
  }

  if (btnLater) {
    btnLater.addEventListener('click', () => {
      location.href = `${base}/extend_pw`; // GET 방식(간단). 
    });
  }

  // 바깥 클릭 시 닫기 (선택)
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }
});
</script>

</body>
</html>
