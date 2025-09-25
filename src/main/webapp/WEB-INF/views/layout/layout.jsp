<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title><tiles:insertAttribute name="title" /></title>
</head>
<body>
    <%-- <%@ import %> --%>
    <%-- <jsp:include page> --%>

    <!-- header -->
    <header>
		<tiles:insertAttribute name="header" />
	</header>
	
	
    <!-- main -->
    <section class="main_wrapper">
        <!-- side -->
        <aside class = "side">
			<tiles:insertAttribute name="side" />
		</aside>
		
        <!-- content -->
        <article class = "content">
			<tiles:insertAttribute name="content" />
		</article>    
    </section>
    
    
    <!-- footer -->
    <footer>
		<tiles:insertAttribute name="footer" />
	</footer>
</body>
</html>