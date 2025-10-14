package proj.spring.mes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import proj.spring.mes.dto.P0601_InInsDTO;
import proj.spring.mes.dto.P0603_ErrorDTO;
import proj.spring.mes.service.P0603_ErrorService;

@Controller
public class P0603_ErrorCtrl {
	
	@Autowired
	P0603_ErrorService service;
	
	@RequestMapping("/errorlist")
	public String errorList(Model model, P0603_ErrorDTO searchCondition) {
		System.out.println("불량 보고서 기본 조회");
		
		List<P0603_ErrorDTO> list = service.errorList(searchCondition);
		
		model.addAttribute("list", list);
		
		return "06_quality/06_3_error_report.tiles";
	}
	
 	@RequestMapping("/errordetail")
	public String detail(Model model, String defect_id) {
		P0603_ErrorDTO dto = service.getOneError(defect_id);
		model.addAttribute("Error", dto);
		return "06_quality/06_3_error_report.tiles";
	}
	
//	@RequestMapping("/errorinsert")
//	@RequestMapping("/errorupdate")
	
	@RequestMapping("/errordelete")
	public String delete(String inspection_result_id) {
		service.removeError(inspection_result_id);
		return "redirect:outInslist";
	}
	
}
