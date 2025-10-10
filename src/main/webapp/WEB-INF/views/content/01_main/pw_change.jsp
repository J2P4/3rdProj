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
    	--page-bg:#fff; --radius:10px; 
        --box-shadow: 0 4px 16px rgba(0, 0, 0, 0.162),
              0 0 2px rgba(0, 0, 0, 0.06);
   	}
    
    *{
        box-sizing:border-box
    } 
    html,
    body{
        height:100%
    }
    
    body{
    	margin:0;
    	color:var(--text);
    	background:var(--page-bg);
    	display:grid;place-items:
    	start center;
    }
    
    .wrap{
    	margin-top:10%;
    	width:700px;
    	max-width:92vw;
    	text-align:center;
    }
    
    h1.title{
    	margin:0 0 28px;
    	font-size:60px;
    	font-weight:700;
    	letter-spacing:-0.02em;
    }
    .title > span {
        color:#111827
    }
    
    .card{
        margin:0 auto;
    	width:450px;
    	max-width:92vw;
    	background:var(--card-bg);
    	/* border:1.5px solid var(--border); */
    	border-radius:var(--radius);
    	padding:28px 28px 24px;
    	text-align:left;
        box-shadow: var(--box-shadow);
    }
    
    
    .form-row{
    	display:grid;
    	grid-template-columns:100px 1fr;
    	align-items:center;
    	gap:14px;
    	margin-bottom:
    	16px;height:70px;
    }
    
    label{
    	font-size:16px;
    	color:var(--muted);
    }
    
    input[type="text"],input[type="password"]{
    	height:40px;
    	border:1.5px solid var(--field-border);
    	border-radius:8px;
    	padding:0 12px;
    	font-size:16px;
    	outline:none;
    	
    }
    
    input:focus{
        border-color:#6b6b6b;
    }
    .actions{
        margin-top:18px
    }
    #userid,
    #userpw{
        height:50px;
    }
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
    .btn:active{
        transform:translateY(1px)
    }
    .pw_reset {
        text-align: center;
        margin-top: 3%;
        font-weight: bold;
        color: #6b6b6b;
    }
    .confirm-text {
    	text-align: center;
    }
    @media (max-width:768px){
        .form-row{
            grid-template-columns:1fr;
            gap:8px
        }
        label{
            padding-left:2px
        }
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
        	<input id="currentPw" name="currentPw" type="password" required>
        </div>
        
        <div class="form-row">
          <label for="newPw">비밀번호</label>
          <input id="newPw" name="newPw" type="password" placeholder="변경할 비밀번호를 입력하세요">
        </div>

        <div class="form-row">
          <label for="pw-confirm">비밀번호 확인</label>
          <input id="pw-confirm" name="pw_confirm" type="password" >
        </div>
        <div class="confirm-text">
        	안전한 암호입니다.
        </div>

        <div class="actions">
          <button type="submit" class="btn">비밀번호 변경</button>
        </div>
    </div>
  </div>
 </form>
</body>
</html>
