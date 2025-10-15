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

import proj.spring.mes.dto.P0404_BOMDTO;
import proj.spring.mes.service.P0404_BOMService;

@Controller
public class P0404_BOMCtrl {
	
	private static final Logger logger = LoggerFactory.getLogger(P0404_BOMCtrl.class);
	
	@Autowired
	P0404_BOMService service;
	
	@RequestMapping("/bomlist")
	public String bomList(Model model, P0404_BOMDTO searchCondition) {
		System.out.println("BOM 기본 조회");
		
		List<P0404_BOMDTO> list = service.bomList(searchCondition);
		
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
	
	@PostMapping("/bomdelete")
	@ResponseBody
	public String deleteBOMs(@RequestBody List<String> bomIds) {
		logger.info("선택된 재고 ID 삭제 요청: " + bomIds);
		
		if (bomIds == null || bomIds.isEmpty()) {
            return "fail: No IDs provided"; // 방어 코드
        }
        
		// Service의 다중 삭제 메소드 호출
		int deletedCount = service.removeBOMs(bomIds); 
		
		if (deletedCount == bomIds.size()) {
			return "success";
		} else {
            // 일부 또는 전체 삭제 실패 시
            logger.error("재고 삭제 실패. 요청 ID 수: {}, 실제 삭제 수: {}", bomIds.size(), deletedCount);
			return "fail"; 
		}
	}
	
}
