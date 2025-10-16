package proj.spring.mes.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import proj.spring.mes.dto.WorkerDTO;
import proj.spring.mes.service.WorkerService;

@Controller
public class LoginController {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
	
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
	public String login(Model model, String worker_id, String worker_pw, HttpServletRequest request) {

	    WorkerDTO user = workerService.get(worker_id);
	    
	    // 아이디가 null인 경우
	    if (user == null) {
	        model.addAttribute("loginError","아이디가 존재하지 않습니다.");
	        return "redirect:/loginPage";
	    }

	    // 비밀번호가져와서 암호화로 저장
	    String hashed = user.getWorker_pw();
	    
	    // 입력된 pw와 해시로 저장된 pw를 match를 통해 비교
	    boolean ok = workerService.match(worker_pw, hashed);

	    if (!ok) {
	        model.addAttribute("loginError","비밀번호가 올바르지 않습니다.");
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
        
        // 초기비밀번호인지 확인 (생년월일 6자리와 현재 해시가 같은지)
        String birth6 = null;
        
        if (user.getWorker_birth() != null) {
            java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyMMdd");
            birth6 = sdf.format(user.getWorker_birth());
        }
        
        boolean mustChange = (birth6 != null) && workerService.match(birth6, hashed);
        
        // 초기비밀번호라면 변경페이지로 이동
        if (mustChange) {
            // 강제 변경 모드 URL에 mode=force
        	newSession.setAttribute("mustChangePw", true);
            return "redirect:/pw_change?mode=force"; 
        } else {
            // 일반 로그인 성공 시 
        	newSession.setAttribute("mustChangePw", false); 
        }
        
	    return "redirect:/stocklist";
	}
	
	@RequestMapping("/change_page")
	public String forceChange(Model model, String worker_id, String currentPw, String newPw, String pw_confirm, HttpSession session) {

	    if (!newPw.equals(pw_confirm)) {
	        model.addAttribute("msg", "새 비밀번호가 일치하지 않습니다.");
	        return "redirect:/pw_change";
	    }
	    if (newPw.length() < 8) {
	        model.addAttribute("msg", "새 비밀번호는 8자 이상이어야 합니다.");
	        return "redirect:/pw_change";
	    }

	    WorkerDTO user = workerService.get(worker_id);
	    if (user == null) return "redirect:/login";

	    // 현재 비번 검증
	    if (!workerService.match(currentPw, user.getWorker_pw())) {
	        model.addAttribute("msg", "현재 비밀번호가 올바르지 않습니다.");
	        return "redirect:/pw_change";
	    }

	    // 초기비번(생년월일 6자리) 재사용 금지(선택)
	    if (user.getWorker_birth() != null) {
	        String birth6 = new java.text.SimpleDateFormat("yyMMdd").format(user.getWorker_birth());
	        if (newPw.equals(birth6)) {
	            model.addAttribute("msg","초기 비밀번호와 다른 값으로 설정해주세요.");
	            return "redirect:/pw_change";
	        }
	    }

	    // 저장 (서비스에서 암호화)
	    workerService.updatePassword(worker_id, newPw);

	    // 강제 변경 플래그 해제
	    session.removeAttribute("mustChangePw");

	    return "redirect:/loginPage";
	}
	
	/** 로그아웃 */
	@RequestMapping("/logout")
	public String logout(HttpSession session) {
	    if (session != null) session.invalidate(); 
	    return "redirect:/loginPage";
	}
}
