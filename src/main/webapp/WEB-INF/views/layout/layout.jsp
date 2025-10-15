<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title><tiles:insertAttribute name="title" /></title>

  <!-- Inter 폰트 -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind (유틸 클래스 사용) -->
  <script src="https://cdn.tailwindcss.com"></script>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <style>
    body {
     font-family: 'Inter', sans-serif; background-color: #f3f4f6; }
     
    canvas { max-height: 200px; }
    
    :root {
     --header-bg: rgb(24, 33, 49);
      --nav-bg: rgb(17, 24, 39);
    }
    
    .header-bg {
    	background-color: var(--header-bg);
    	}
    	
    .nav-bg { 
    	background-color: var(--nav-bg);
    	}
    	
    .mainList li {
	    position: relative;
	    transition-property: 
	    background-color, border-left-color; 
	    transition-duration: 200ms; 
    }
    
    .mainList li:hover {
    	background-color: rgb(24, 33, 49);
    }
    
    .active-parent {
    	background-color: rgb(24, 33, 49); 
    	border-left: 4px solid #3b82f6; 
    	padding-left: 12px; 
    	}
    	
    .active-link { 
    	background-color: rgb(24, 33, 49); 
    	border-left: 4px solid #3b82f6; 
    	padding-left: 12px; 
    	}
    	
    .subList { 
    	max-height: 0; 
    	opacity: 0; 
    	overflow: hidden; 
    	transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out; 
    	}
    	
    .subList.visible { 
    	max-height: 200px; 
    	opacity: 1; 
    	}
    	
    .drop { 
    	text-align:center; 
    	font-weight:bold; 
    	height:100px; 
    	font-size:20px; 
    	padding:8px; 
    	}
    .drop2 { 
    	text-align:center; 
    	font-weight:bold; 
    	height:70px; 
    	font-size:20px; 
    	padding:8px; 
    	}
    	
    .row { margin:10px; }

    .hidden { display: none; }
    
    #sess-box {
    	padding:5px 12px; 
    	background-color: rgb(24, 33, 49);
        border-radius:8px;
        font-size:14px; 
        font-weight: bold; 
        color: white;
    }
    #sess-extend{
    	border: 1px solid #ffffff;
    	margin-left:8px; 
    	border-radius:5px; 
    	padding: 2px 10px; 
    	color: rgb(250, 250, 0);
    }
  </style>
</head>

<body class="bg-gray-100 text-gray-800 flex flex-col min-h-screen">
  <!-- header -->
  <header>
    <tiles:insertAttribute name="header" />
  </header>

  <!-- main -->
  <section class="main_wrapper flex flex-1">
    <!-- side -->
    <aside class="side nav-bg text-white p-4 w-56 shadow-inner flex-shrink-0">
      <tiles:insertAttribute name="side" />
    </aside>

    <!-- content -->
    <article class="content flex-1 p-8 overflow-y-auto bg-transparent">
      <tiles:insertAttribute name="content" />
    </article>
  </section>

  <!-- footer -->
  <footer>
    <tiles:insertAttribute name="footer" />
  </footer>
</body>
</html>
