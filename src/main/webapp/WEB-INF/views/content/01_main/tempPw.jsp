<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>임시 비밀번호 발급</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root { --brand:#6366f1; --text:#111; --sub:#666; --bg:#f6f7fb; }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--bg); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",Arial,sans-serif; color:var(--text); }
    .wrap { max-width:520px; margin:26px auto; background:#fff; border:1px solid #eceefa; border-radius:14px; box-shadow:0 12px 28px rgba(0,0,0,.06); overflow:hidden; }
    .head { padding:16px 18px; border-bottom:1px solid #eceefa; display:flex; align-items:center; gap:10px; }
    .head h1 { font-size:16px; margin:0; }
    .body { padding:20px 18px 18px; }
    .row { margin:8px 0; color:var(--sub); font-size:13px; }
    .row strong { color:#333; }
    .code { display:inline-flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px; background:#111; color:#fff; font-weight:700; letter-spacing:.4px; font-size:16px; margin:10px 0 6px; }
    .btns { display:flex; gap:10px; margin-top:16px; }
    .btn { height:38px; padding:0 14px; border-radius:10px; border:1px solid #dfe3ff; background:#fff; cursor:pointer; font-weight:700; font-size:13px; }
    .btn.primary { background:var(--brand); color:#fff; border-color:transparent; }
    .note { margin-top:10px; font-size:12px; color:#777; line-height:1.7; }
    .alert { padding:14px; border-radius:10px; background:#fff3f3; border:1px solid #ffd6d6; color:#a33; }
    code.small { background:#f0f1fb; padding:2px 6px; border-radius:6px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="head">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 5h-2v7h2V7Zm0 8h-2v2h2v-2Z" fill="#6366f1"/>
      </svg>
      <h1>임시 비밀번호 발급</h1>
    </div>
    <div class="body">
      <c:choose>
        <c:when test="${success}">
          <div class="row">사번: <strong>${worker_id}</strong></div>
          <div class="code" id="pwBox"><span id="pwText">${tempPw}</span></div>
          <div class="btns">
            <button class="btn primary" onclick="copyPw()">비밀번호 복사</button>
            <button class="btn" onclick="window.close()">창 닫기</button>
          </div>
          <div class="note">
            • 로그인 후 반드시 <code class="small">비밀번호 변경</code>을 진행해 주세요.<br>
            • 화면 또는 출력물은 외부에 노출되지 않게 주의하세요.
          </div>
          <c:if test="${not empty message}">
            <div class="note" style="color:#555;">${message}</div>
          </c:if>
        </c:when>
        <c:otherwise>
          <div class="alert">
            <strong>처리에 실패했습니다.</strong><br>
            <span><c:out value="${message != null ? message : '사번을 확인하거나 잠시 후 다시 시도해 주세요.'}"/></span>
          </div>
          <div class="btns">
            <button class="btn" onclick="window.close()">창 닫기</button>
          </div>
        </c:otherwise>
      </c:choose>
    </div>
  </div>

  <script>
    // 비밀번호 클립보드 복사
    function copyPw() {
      try {
        var text = document.getElementById('pwText').innerText || '';
        if (!text) { alert('복사할 비밀번호가 없습니다.'); return; }
        navigator.clipboard.writeText(text).then(function() {
          alert('임시 비밀번호가 복사되었습니다.');
        }).catch(function() {
          var range = document.createRange();
          range.selectNode(document.getElementById('pwText'));
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          var ok = document.execCommand('copy');
          sel.removeAllRanges();
          alert(ok ? '임시 비밀번호가 복사되었습니다.' : '복사에 실패했습니다. 수동으로 복사해 주세요.');
        });
      } catch (e) {
        alert('복사 중 오류가 발생했습니다.');
      }
    }
  </script>
</body>
</html>
