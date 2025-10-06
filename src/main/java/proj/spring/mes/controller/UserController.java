package proj.spring.mes.controller;

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
	
	@RequestMapping("/user")
	public String list() {
		System.out.println("계정관리");
		return "02_user/02_user.tiles";
	}
	
//	/** 목록 */
//	@RequestMapping("/list")
//    public String list(Model model, String workerId, String deptCode, String workerName, String roleCode) {
//        List<WorkerDTO> list = workerService.list();
//        model.addAttribute("list", list);
//        return "02_user/02_user.tiles"; 
//    }
//
//    /** 상세 */
//	@RequestMapping("/view")
//    public String view(Model model, String workerId) {
//        WorkerDTO dto = workerService.get(workerId);
//        model.addAttribute("worker", dto);
//        return "02_user/02_user.tiles";
//    }
//
//    /** 등록 폼 */
//	@RequestMapping("/insertForm")
//    public String insertForm(Model model) {
//        // 기본값이 필요하면 model에 put
//        return "02_user/02_user.tiles";
//    }
//
//    /** 등록 처리*/
//	@RequestMapping("/insert")
//    public String insert(WorkerDTO dto) {
//        // WorkerService.add에서 비번 해시 처리/시퀀스 ID 생성(MyBatis selectKey) 수행
//        workerService.add(dto);
//        return "redirect: list";
//    }
//
//    /** 수정 폼 */
//	@RequestMapping("/updateForm")
//    public String updateForm(Model model, String workerId) {
//        WorkerDTO dto = workerService.get(workerId);
//        model.addAttribute("worker", dto);
//        return "02_user/02_user.tiles";
//    }
//
//    /** 수정 처리 (x-www-form-urlencoded) */
//	@RequestMapping("/update")
//    public String update(WorkerDTO dto) {
//        workerService.edit(dto);
//        return "redirect:list";
//    }
//
//    /** 삭제 (단건) */
//	@RequestMapping("/delete")
//    public String delete(String workerId) {
//        workerService.remove(workerId);
//        return "redirect:list";
//    }
	
}
