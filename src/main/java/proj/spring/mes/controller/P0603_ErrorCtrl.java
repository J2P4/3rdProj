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

import proj.spring.mes.dto.P0603_ErrorDTO;
import proj.spring.mes.service.P0603_ErrorService;

@Controller
public class P0603_ErrorCtrl {
	
	private static final Logger logger = LoggerFactory.getLogger(P0603_ErrorCtrl.class);
	
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
	
	@RequestMapping("/errorinsert")
	@ResponseBody
	public String insertError(P0603_ErrorDTO dto) {
		logger.info("불량 보고서 등록 요청 DTO: {}", dto);
		
		try {
	        int result = service.addError(dto);
	        if(result > 0) {
	            return "success";
	        } else {
	            return "fail";
	        }			
		}
		catch (Exception e) {
	        logger.error("불량 보고서 등록 실패", e);
	        return "fail";
	    }
	}
	@RequestMapping("/errorupdate")
	@ResponseBody
	public String updateError(P0603_ErrorDTO dto) {
	    logger.info("불량 보고서 수정 요청 DTO: {}", dto);

	    try {
	        int result = service.editError(dto);
	        if(result > 0) {
	            return "success";
	        }
	        else {
	            return "fail"; 
	        }
	    }
	    catch (Exception e) {
	        logger.error("입고 검사 수정 실패", e);
	        return "fail";
	    }		
	}
	
//	@RequestMapping("/errordelete")
//	public String delete(String inspection_result_id) {
//		service.removeError(inspection_result_id);
//		return "redirect:outInslist";
//	}
 	
	@PostMapping("/errordelete")
	@ResponseBody
	public String deleteErrors(@RequestBody List<String> defectIds) { // JSON 배열을 List<String>으로 받음
		logger.info("선택된 재고 ID 삭제 요청: " + defectIds);
		
		if (defectIds == null || defectIds.isEmpty()) {
            return "fail: No IDs provided"; // 방어 코드
        }
        
		// Service의 다중 삭제 메소드 호출
		int deletedCount = service.removeErrors(defectIds); 
		
		if (deletedCount == defectIds.size()) {
			return "success";
		} else {
            // 일부 또는 전체 삭제 실패 시
            logger.error("불량 보고서 삭제 실패. 요청 ID 수: {}, 실제 삭제 수: {}", defectIds.size(), deletedCount);
			return "fail"; 
		}
	}
	
}
