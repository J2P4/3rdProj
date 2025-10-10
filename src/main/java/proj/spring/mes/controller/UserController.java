package proj.spring.mes.controller;

import java.text.SimpleDateFormat;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import proj.spring.mes.dto.DeptDTO;
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
    public String list(Model model) {
        List<WorkerDTO> list = workerService.list();
        List<DeptDTO> deptList = workerService.deptList();
        
        model.addAttribute("list", list);
        model.addAttribute("deptList", deptList);
        System.out.println("목록페이지");
        return "02_user/02_user.tiles"; 
    }

    /** 상세 */
	@RequestMapping("/detail")
    public String detail(Model model, String worker_id) {
		
        WorkerDTO dto = workerService.get(worker_id);
        List<DeptDTO> deptList = workerService.deptList();
        
        model.addAttribute("dto", dto);
        model.addAttribute("deptList", deptList);
        
//        model.addAttribute("mode", "view"); // 읽기모드
        
        System.out.println("상세페이지");
        System.out.println("worker_id: "+worker_id);
        return "02_user/02_userDetail.tiles";
    }

    /** 등록 */
	@RequestMapping("/insert")
	public String insert(Model model, WorkerDTO dto, String person_email, String domain_email) {
        
        
        // worker_birth(Date) → 6자리 문자열 변환 (YYMMDD)
        String birth6 = "";
        if (dto.getWorker_birth() != null) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyMMdd");
            birth6 = sdf.format(dto.getWorker_birth());
            // 초기 비밀번호 세팅
            dto.setWorker_pw(birth6); 
        } 
        
        // 이메일 합치기
        if (person_email != null && !person_email.isEmpty() && domain_email != null && !domain_email.isEmpty()) {
                dto.setWorker_email(person_email + "@" + domain_email);
        }
        
        workerService.add(dto);
        List<DeptDTO> deptList = workerService.deptList();
        
        // JSP에서 ${worker_id}로 접근 가능하도록 model에 담기
        model.addAttribute("worker_id", dto.getWorker_id());
        model.addAttribute("worker_birth6", birth6);
        model.addAttribute("worker_email", dto.getWorker_email());
        model.addAttribute("worker", dto);
        model.addAttribute("deptList", deptList);
        
//        model.addAttribute("mode", "add"); // 등록 모드
        
        // 결과 페이지로 이동 
        return "02_user/02_userResult.tiles";
	}

	/** 수정 후 상세 */
	@RequestMapping("/modify")
	public String modify(Model model, WorkerDTO dto) {
		WorkerDTO workerdto = workerService.get(dto.getWorker_id());
		List<DeptDTO> deptList = workerService.deptList();
		model.addAttribute("dto", workerdto);
		model.addAttribute("deptList", deptList);
		
		return "02_user/02_userModify.tiles";
	}
    /** 수정 후 상세 */
	@RequestMapping("/modifyDetail")
    public String modifyDetail(Model model, WorkerDTO dto, String person_email, String domain_email) {
		
		if (domain_email != null && domain_email.startsWith("@")) {
			domain_email = domain_email.substring(1);
	    }

	    // 최종 이메일 합치기
	    if (person_email != null && !person_email.isEmpty()) {
	        dto.setWorker_email(person_email + "@" + domain_email);
	    } else {
	        dto.setWorker_email(null); 
	    }
        
	    workerService.edit(dto);
	    List<DeptDTO> deptList = workerService.deptList();

	    model.addAttribute("dto", dto);
        model.addAttribute("deptList", deptList);
        
        return "redirect:/detail?worker_id=" + dto.getWorker_id();
    }

    /** 삭제 */
	@RequestMapping("/delete")
    public String delete(Model model, String worker_id) {
        int result = workerService.remove(worker_id);
        System.out.println("삭제결과 : "+ result);
        return "redirect:/list";
    }
	
}
