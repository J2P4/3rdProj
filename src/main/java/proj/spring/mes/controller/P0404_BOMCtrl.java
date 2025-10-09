package proj.spring.mes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import proj.spring.mes.dto.P0401_StockDTO;
import proj.spring.mes.dto.P0404_BOMDTO;
import proj.spring.mes.service.P0404_BOMService;

@Controller
public class P0404_BOMCtrl {
	
	@Autowired
	P0404_BOMService service;
	
	@RequestMapping("/bomlist")
	public String bomList(Model model) {
		System.out.println("BOM 기본 조회");
		
		List<P0404_BOMDTO> list = service.bomList();
		
		model.addAttribute("list", list);
		
		return "04_standard/04_4_standard_bom.tiles";
	}

	@RequestMapping("/bomdetail")
	public String detail(Model model, String bom_id) {
		P0404_BOMDTO dto = service.getOneBOM(bom_id);
		model.addAttribute("bom", dto);
		return "04_standard/04_4_standard_bom.tiles";
	}
	
//	@RequestMapping("/bominsert")
//	@RequestMapping("/bomupdate")
	
	@RequestMapping("/bomdelete")
	public String delete(String bom_id) {
		service.removeBOM(bom_id);
		return "redirect:bomlist";
	}
	
}
