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

        if (loginUser == null) {
            res.sendRedirect(req.getContextPath() + "/loginPage");
            return false; // 로그인 안 된 사용자 → 차단
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