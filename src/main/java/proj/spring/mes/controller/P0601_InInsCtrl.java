package proj.spring.mes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import proj.spring.mes.dto.P0401_StockDTO;
import proj.spring.mes.dto.P0601_InInsDTO;
import proj.spring.mes.dto.WorkerDTO;
import proj.spring.mes.service.P0601_InInsService;

@Controller
public class P0601_InInsCtrl {
	
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
	
	@RequestMapping("/inInsdelete")
	public String delete(String inspection_result_id) {
		service.removeInIns(inspection_result_id);
		return "redirect:inInslist";
	}
}
