package proj.spring.mes.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws Exception {
        HttpSession session = req.getSession(false);
        Object loginUser = (session == null) ? null : session.getAttribute("loginUser");
        
        // 1) 로그인 여부 체크
        if (loginUser == null) {
            res.sendRedirect(req.getContextPath() + "/loginPage");
            return false; // 로그인 안 된 사용자 → 차단
        }

        
        System.out.println("--------------------------------------------------");
        System.out.println("요청 URI   : " + req.getRequestURI());
        System.out.println("컨텍스트경로 : " + req.getContextPath());
        System.out.println("HTTP 메서드 : " + req.getMethod());
        System.out.println("--------------------------------------------------");
        
        // 2) 권한 체크
        String role = (String) session.getAttribute("role"); // "ADMIN" / "HEAD" / "STAFF"
        String method = req.getMethod();                     // GET/POST/PUT/DELETE...
        String uri = req.getRequestURI();                    // 예: /mes/workerlist/modify
        String ctx = req.getContextPath();                   // 예: /mes

        boolean staffAllowedPost = uri.startsWith(ctx + "/session/extend"); // 연장 POST 허용
        
        if ("STAFF".equals(role)) {
            // STAFF는 조회만 허용 (GET 외 차단)
            if (!"GET".equalsIgnoreCase(method) && !staffAllowedPost) {

                // --- 차단 방식 : alert 후 뒤로가기 ---
                res.setContentType("text/html; charset=UTF-8");
                res.getWriter().write("<script>alert('권한이 없습니다.'); history.back();</script>");
                res.getWriter().flush();
                
                return false;
            }
        }
        
        return true; // 통과
    }
    
    @Override
    public void postHandle(HttpServletRequest req, HttpServletResponse res, Object handler,
                           ModelAndView modelAndView) throws Exception {
        // 필요 없으면 비워두기
    }

    @Override
    public void afterCompletion(HttpServletRequest req, HttpServletResponse res, Object handler,
                                Exception ex) throws Exception {
        // 요청 완료 후 리소스 정리 등 필요 시 사용, 아니면 비워두기
    }
}