package proj.spring.mes.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import proj.spring.mes.dto.P0601_InInsDTO;
import proj.spring.mes.dto.WorkerDTO;
import proj.spring.mes.service.P0601_InInsService;

@Controller
public class P0601_InInsCtrl {
	
	private static final Logger logger = LoggerFactory.getLogger(P0601_InInsCtrl.class);
	
	@Autowired
	P0601_InInsService service;
	
	@RequestMapping("/inInslist")
	public String inInsList(Model model, P0601_InInsDTO searchCondition) {
		System.out.println("입고 검사 기본 조회");
		
		List<P0601_InInsDTO> list = service.inInsList(searchCondition);
		
		model.addAttribute("list", list);
		
		return "06_quality/06_1_in_inspection.tiles";
	}
	
	//  작업자 조회용
	public String selectWorkerName(Model model) {
		
		System.out.println("작업자 조회용");
		
		List<WorkerDTO> wnlist = service.workerNameList();
		
		model.addAttribute("wnlist", wnlist);
		
		// 여긴 바꿔야 함
		return "06_quality/06_1_in_inspection.tiles";
	}
	
 	@RequestMapping("/inInsdetail")
	public String detail(Model model, String inspection_result_id) {
		P0601_InInsDTO dto = service.getOneInIns(inspection_result_id);
		model.addAttribute("InIns", dto);
		return "06_quality/06_1_in_inspection.tiles";
	}
	
//	@RequestMapping("/inInsinsert")
//	@RequestMapping("/inInsupdate")
	
//	@RequestMapping("/inInsdelete")
//	public String delete(String inspection_result_id) {
//		service.removeInIns(inspection_result_id);
//		return "redirect:inInslist";
//	}
 	
 	@PostMapping("/inInsdelete")
 	@ResponseBody
 	public String deleteInIns(@RequestBody List<String> inInsIds) {
 		logger.info("선택된 입고 검사 ID 삭제 요청: " + inInsIds);
 		
 		if(inInsIds == null || inInsIds.isEmpty()) {
 			return "fail: No IDs provided";
 		}
 		
 		int deletedCount = service.removeInIns(inInsIds);
 		
 		if(deletedCount == inInsIds.size()) {
 			return "success";
 		}
 		else {
 			logger.error("재고 삭제 실패. 요청 ID 수: {}, 실제 삭제 수: {}", inInsIds.size(), deletedCount);
 			return "fail";
 		}
 	}
}
