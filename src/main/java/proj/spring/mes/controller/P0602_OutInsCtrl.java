package proj.spring.mes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import proj.spring.mes.dto.P0601_InInsDTO;
import proj.spring.mes.dto.P0602_OutInsDTO;
import proj.spring.mes.dto.WorkerDTO;
import proj.spring.mes.service.P0602_OutInsService;

@Controller
public class P0602_OutInsCtrl {
	@Autowired
	P0602_OutInsService service;
	
	@RequestMapping("/outInslist")
	public String inInsList(Model model, P0602_OutInsDTO searchCondition) {
		System.out.println("출고 검사 기본 조회");
		
		List<P0602_OutInsDTO> list = service.outInsList(searchCondition);
		
		model.addAttribute("list", list);
		
		return "06_quality/06_2_out_inspection.tiles";
	}
	
	//  작업자 조회용
	public String selectWorkerName(Model model) {
		
		System.out.println("작업자 조회용");
		
		List<WorkerDTO> wnlist = service.workerNameList();
		
		model.addAttribute("wnlist", wnlist);
		
		// 여긴 바꿔야 함
		return "06_quality/06_2_out_inspection.tiles";
	}
	
 	@RequestMapping("/outInsdetail")
	public String detail(Model model, String inspection_result_id) {
		P0602_OutInsDTO dto = service.getOneOutIns(inspection_result_id);
		model.addAttribute("OutIns", dto);
		return "06_quality/06_2_out_inspection.tiles";
	}
	
//	@RequestMapping("/outInsinsert")
//	@RequestMapping("/outInsupdate")
	
	@RequestMapping("/outInsdelete")
	public String delete(String inspection_result_id) {
		service.removeOutIns(inspection_result_id);
		return "redirect:outInslist";
	}
}
