package proj.spring.mes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
    
    // 임시 비밀번호를 생성/저장하고, 새 페이지에 출력한다.
     
    @RequestMapping(value="/temp", method = RequestMethod.POST)
    public String showTempPw(Model model, String worker_id, RedirectAttributes ra) {

    	// 임시비밀번호 생성
        String tempPw = pwResetService.updateTempPw(worker_id);
        if (tempPw == null) {
            ra.addFlashAttribute("alert", "비밀번호 초기화에 실패했습니다. 사번을 확인하거나 잠시 후 다시 시도하세요.");
            return "redirect:/workerlist";
        }
        
        // 사원정보
        WorkerDTO worker = workerService.get(worker_id);

        boolean mailOk = false;
        if (worker != null && worker.getWorker_email() != null && !worker.getWorker_email().isEmpty()) {
            try {
            	// 메일 전송
                emailService.sendTempPassword(worker.getWorker_email(), worker_id, tempPw);
                mailOk = true;
            } catch (Exception e) {
                // 꼭 로그 남기기
                e.printStackTrace();
            }
        }

        if (mailOk) {
            ra.addFlashAttribute("alert", "비밀번호가 초기화되었습니다. 이메일을 확인하세요.");
        } else {
            ra.addFlashAttribute("alert", "이메일 발송에 실패했거나 이메일 미등록입니다. 화면의 임시 비밀번호를 직접 전달하세요.");
        }

        return "redirect:/workerlist";
    }
}