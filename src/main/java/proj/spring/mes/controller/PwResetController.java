package proj.spring.mes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import proj.spring.mes.service.PwResetService;

@Controller
public class PwResetController {

    @Autowired
    private PwResetService pwResetService;

    /**
     * 임시 비밀번호를 생성/저장하고, 새 페이지에 출력한다.
     * 
     * @param worker_id 대상 사번
     * @param model     뷰로 전달할 데이터
     * @return          /WEB-INF/views/tempPw.jsp
     */
    @RequestMapping("/temp")
    public String showTempPw(Model model, String worker_id ) {

        // 1) 서비스 호출: 임시비밀번호 생성 → 해시 저장 → 평문 반환
        String tempPw = pwResetService.updateTempPw(worker_id);

        // 2) JSP에서 사용할 값 세팅
        model.addAttribute("worker_id", worker_id);

        if (tempPw == null) {
            // 업데이트 실패(없는 사번, DB 문제 등)
            model.addAttribute("success", false);
            model.addAttribute("message", "비밀번호 초기화에 실패했습니다. 사번을 확인하거나 잠시 후 다시 시도하세요.");
            // tempPwPage.jsp에서 success=false 분기 처리
        } else {
            model.addAttribute("success", true);
            model.addAttribute("tempPw", tempPw); // 새 창에 표시할 평문 임시비번
        }

        return "content/01_main/tempPw";
    }
}