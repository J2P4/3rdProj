package proj.spring.mes.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import proj.spring.mes.dto.PwDTO;
import proj.spring.mes.dto.WorkerDTO;
import proj.spring.mes.service.WorkerService;

@Controller
public class LoginController {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	
 	@Autowired
	WorkerService workerService;
	
	@RequestMapping("/loginPage")
	public String loginPage() {
		System.out.println("로그인");
		return "forward:/login.jsp";
	}
	
	// 비밀번호 변경페이지 접속
	@RequestMapping("/pw_change")
	public String pwChange(HttpSession session, String mode) {
	    
	    Boolean must = (Boolean) session.getAttribute("mustChangePw");

	    // 강제 변경 모드일 때만 제한 걸기
	    if ("force".equals(mode)) {
	        if (!Boolean.TRUE.equals(must)) {
	            return "redirect:/stocklist"; // 강제 변경 아님 → 차단
	        }
	    }

	    // 자발적 변경(normal)은 누구나 접근 가능
	    return "content/01_main/pw_change";
	}
	
	@RequestMapping("/login")
	public String login(String worker_id, String worker_pw, HttpServletRequest request, RedirectAttributes ra) {

	    WorkerDTO user = workerService.get(worker_id);
	    
	    // 아이디가 null인 경우
	    if (user == null) {
	    	ra.addFlashAttribute("error", "존재하지 않는 아이디입니다.");
	        return "redirect:/loginPage";
	    }

	    // 비밀번호가져와서 암호화로 저장
	    String hashed = user.getWorker_pw();
	    
	    // 입력된 pw와 해시로 저장된 pw를 match를 통해 비교
	    boolean ok = workerService.match(worker_pw, hashed);

	    if (!ok) {
	    	ra.addFlashAttribute("error","비밀번호가 올바르지 않습니다.");
	        return "redirect:/loginPage";
	    }

	    // 세션 고정 공격 방지: 기존 세션 무효화 후 새 세션 발급
	    // 있는 세션 가져오기
        HttpSession old = request.getSession(false);
        if (old != null) old.invalidate();	// 기존세션 무효화
        
        // 필요시 새 새션 생성
        HttpSession newSession = request.getSession(true);
        newSession.setAttribute("loginUser", user);
        newSession.setMaxInactiveInterval(30*60);
        newSession.setAttribute("role", user.getWorker_code());		// 권한별 접근
        newSession.setAttribute("worker_id", user.getWorker_id());
        
        // 로그인 성공 직후
        boolean mustChange = workerService.mustChangeNow(worker_id);
        if (mustChange) {
            newSession.setAttribute("mustChangePw", true);   // 강제변경 플래그(유지)
            newSession.removeAttribute("showPwModal");    // 모달 띄우기 플래그
            
         // 초기/임시 여부를 DB 플래그로 구분 (PW_MUST_CHANGE == 1 이면 '임시/초기')
         boolean isTempOrInitial = workerService.isPwMustChange(worker_id);
         if (isTempOrInitial) {
             ra.addFlashAttribute("alert", "임시/초기 비밀번호로 로그인하셨습니다. 반드시 비밀번호를 변경해 주세요.");
         } else {
             ra.addFlashAttribute("alert", "비밀번호 유효기간이 만료되었습니다. 변경이 필요합니다.");
         }
         return "redirect:/pw_change?mode=force";

         } else {
            newSession.setAttribute("mustChangePw", false);
            newSession.removeAttribute("showPwModal");
            return "redirect:/stocklist";
         }
        
	}
	
	@RequestMapping("/change_page")
	public String forceChange(Model model, String worker_id, String current_pw, String new_pw, String confirm_pw, HttpSession session, RedirectAttributes ra) {

		if (new_pw == null || confirm_pw == null || !new_pw.equals(confirm_pw)) {
			ra.addFlashAttribute("error", "새 비밀번호가 일치하지 않습니다.");
	        return "redirect:/pw_change";
	    }
		try {
            // 서비스 한 곳에서: 현재PW 확인 + 정책검사 + 해시 + 저장
            PwDTO dto = new PwDTO();
            dto.setCurrent_pw(current_pw);
            dto.setNew_pw(new_pw);
            dto.setConfirm_pw(confirm_pw);

            workerService.changePassword(worker_id, dto);

            // 강제 변경 모드 해제
            session.setAttribute("mustChangePw", false);

            ra.addFlashAttribute("msg", "비밀번호가 변경되었습니다. 다시 로그인해주세요.");
            return "redirect:/loginPage";
        } catch (IllegalArgumentException ex) {
            // 정책 위반/현재PW 불일치/기타 서비스 메시지
            ra.addFlashAttribute("error", ex.getMessage());
            return "redirect:/pw_change";
        } catch (Exception ex) { // 예상 못한 예외는 일반 메시지로
            ra.addFlashAttribute("error", "처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
            return "redirect:/pw_change";
        }
	}
	
	// 만료일 도달 후 나중에 변경선택시
	@RequestMapping("/extend_pw")
	public String extendPw(HttpSession session, RedirectAttributes ra) {
	    String worker_id = (String) session.getAttribute("worker_id");
	    if (worker_id == null) return "redirect:/loginPage";

	    workerService.extendPwExpiry(worker_id, 90); // 원하는 일수
	    // 모달 한 번만 띄우도록 플래그 제거
	    session.removeAttribute("showPwModal");
	    session.setAttribute("mustChangePw", false);

	    ra.addFlashAttribute("msg", "비밀번호 변경을 90일 후로 연장했습니다.");
	    return "redirect:/stocklist";
	}

	
	// 로그아웃
	@RequestMapping("/logout")
	public String logout(HttpSession session) {
	    if (session != null) session.invalidate(); 
	    return "redirect:/loginPage";
	}
}
