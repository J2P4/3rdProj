package proj.spring.mes.controller;

import java.text.SimpleDateFormat;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import proj.spring.mes.dto.WorkerDTO;
import proj.spring.mes.service.WorkerService;

@Controller
public class UserController {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	@Autowired
	WorkerService workerService;
	
//	@RequestMapping("/user")
//	public String list() {
//		System.out.println("계정관리");
//		return "02_user/02_user.tiles";
//	}
	
	/** 목록 */
	@RequestMapping("/list")
    public String list(Model model, String workerId, String deptCode, String workerName, String roleCode) {
        List<WorkerDTO> list = workerService.list();
        model.addAttribute("list", list);
        return "02_user/02_user.tiles"; 
    }

    /** 상세 */
	@RequestMapping("/detail")
    public String detail(Model model, String workerId) {
        WorkerDTO dto = workerService.get(workerId);
        model.addAttribute("worker", dto);
        return "02_user/02_user.tiles";
    }

    /** 등록 */
	@RequestMapping("/insert")
	public String insert(WorkerDTO dto, Model model) {
        
        
        // worker_birth(Date) → 6자리 문자열 변환 (YYMMDD)
        String birth6 = "";
        if (dto.getWorker_birth() != null) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyMMdd");
            birth6 = sdf.format(dto.getWorker_birth());
            // 초기 비밀번호 세팅
            dto.setWorker_pw(birth6); 
        } 
        
        // 이메일 합치기
        if (dto.getWorker_email() != null && !dto.getWorker_email().isEmpty()) {
            dto.setWorker_email(dto.getWorker_email() + "@naver.com");
        }
        
        workerService.add(dto);
        
        // JSP에서 ${worker_id}로 접근 가능하도록 model에 담기
        model.addAttribute("worker_id", dto.getWorker_id());
        model.addAttribute("worker_birth6", birth6);
        model.addAttribute("worker_email", dto.getWorker_email());
        model.addAttribute("worker", dto);
        // 결과 페이지로 이동 
        return "02_user/02_userResult.tiles";
	}

//    /** 수정 폼 */
//	@RequestMapping("/updateForm")
//    public String updateForm(Model model, String workerId) {
//        WorkerDTO dto = workerService.get(workerId);
//        model.addAttribute("worker", dto);
//        return "02_user/02_user.tiles";
//    }
//
    /** 삭제 */
	@RequestMapping("/delete")
    public String delete(String workerId) {
        workerService.remove(workerId);
        return "redirect:list";
    }
	
}
