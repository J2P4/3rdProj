package proj.spring.mes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import proj.spring.mes.dto.WorkerDTO;
import proj.spring.mes.service.EmailService;
import proj.spring.mes.service.PwResetService;
import proj.spring.mes.service.WorkerService;

@Controller
public class PwResetController {

    @Autowired
    private PwResetService pwResetService;

    @Autowired
    private WorkerService workerService;

    @Autowired
    private EmailService emailService;
    
    /**
     * 임시 비밀번호를 생성/저장하고, 새 페이지에 출력한다.
     * 
     * @param worker_id 대상 사번
     * @param model     뷰로 전달할 데이터
     * @return          /WEB-INF/views/tempPw.jsp
     */
    @RequestMapping(value="/temp", method = RequestMethod.POST)
    public String showTempPw(Model model, String worker_id ) {

        // 1) 서비스 호출: 임시비밀번호 생성 → 해시 저장 → 평문 반환
        String tempPw = pwResetService.updateTempPw(worker_id);

        // 1-1) JSP에서 사용할 값 세팅
        model.addAttribute("worker_id", worker_id);

        if (tempPw == null) {
            // 업데이트 실패(없는 사번, DB 문제 등)
            model.addAttribute("success", false);
            model.addAttribute("message", "비밀번호 초기화에 실패했습니다. 사번을 확인하거나 잠시 후 다시 시도하세요.");
            return "content/01_main/tempPw";
        }

        // 2) 이메일 주소 조회
        WorkerDTO worker = workerService.get(worker_id);
        
        if (worker == null || worker.getWorker_email() == null || worker.getWorker_email().isEmpty()) {
            model.addAttribute("success", true);
            model.addAttribute("tempPw", tempPw);
            model.addAttribute("message", "이메일이 등록되어 있지 않아, 화면으로만 임시 비밀번호를 안내합니다.");
            
            return "content/01_main/tempPw";
        }

        // 3) 이메일 발송 시도
        try {
            emailService.sendTempPassword(worker.getWorker_email(), worker_id, tempPw);
        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("message", "이메일 발송에 실패했습니다. 화면에 표시된 임시 비밀번호를 직접 전달해 주세요.");
        }

        // 4) 성공 시 JSP에 표시할 데이터 세팅
        model.addAttribute("success", true);
        model.addAttribute("tempPw", tempPw);
        return "redirect:/detail";
    }
}