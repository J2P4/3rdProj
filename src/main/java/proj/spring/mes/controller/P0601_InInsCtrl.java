package proj.spring.mes.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import proj.spring.mes.dto.P0601_InInsDTO;
import proj.spring.mes.service.P0601_InInsService;

@Controller
public class P0601_InInsCtrl {
	
	private static final Logger logger = LoggerFactory.getLogger(P0601_InInsCtrl.class);
	
	@Autowired
	P0601_InInsService service;
	
	// 기간 조회시 빈 문자열 들어오면 null로 허용
    @InitBinder
    public void allowEmptyDate(WebDataBinder binder) {
        binder.registerCustomEditor(java.sql.Date.class, new org.springframework.beans.propertyeditors.CustomDateEditor(
            new java.text.SimpleDateFormat("yyyy-MM-dd"), true)); 
    }
	
	@RequestMapping("/inInslist")
	public String inInsList(Model model,
    		@RequestParam(value = "size", required = false, defaultValue = "10") int pagePerRows, // 페이지당 행 수 파라미터 (기본 10)
            @RequestParam(value = "page", required = false, defaultValue = "1")  int page,         // 현재 페이지 번호 파라미터 (기본 1, 1-base)
			P0601_InInsDTO searchFilter) {
		
		System.out.println("입고 검사 기본 조회");
		System.out.println("입고 검사 조회 조건: " + searchFilter);
		
	     // ===================== 1) 입력값 방어/보정 =====================
        int minSize = 1;                                 // 한 페이지 최소 1행
        int maxSize = 100;                               // 과도한 요청 방지: 최대 100행까지만 허용
        pagePerRows = Math.max(minSize, Math.min(pagePerRows, maxSize)); // 범위를 벗어나면 보정
        page = Math.max(page, 1);                        // 페이지는 1보다 작을 수 없음(1-base 유지)
		
        // ===================== 2) 전체 레코드 수 조회 =====================
        long totalCount = service.count(searchFilter);
        
        // ===================== 3) 총 페이지 수 계산 및 현재 페이지 보정 =====================
        int totalPages = (int) Math.ceil((double) totalCount / pagePerRows); // 총 페이지 수 = 올림(총건수/페이지당수)
        if (totalPages == 0) totalPages = 1;             // 데이터 0건일 때도 1페이지로 표시
        if (page > totalPages) page = totalPages;       // 요청 페이지가 마지막 페이지 초과하면 마지막 페이지로 보정
        
        // ===================== 4) 목록(+작업자, 재고) 조회 =====================
		List<P0601_InInsDTO> list = service.list(page, pagePerRows, searchFilter);
		List<P0601_InInsDTO> wnlist = service.workerNameList();
		List<P0601_InInsDTO> stlist = service.stockList();
		
        // ===================== 5) 블록 페이지네이션 계산(10개 단위) =====================
        final int blockSize = 10;                        // 페이지 번호를 묶어서 보여주기
        int currentBlock = (int) Math.ceil((double) page / blockSize); // 현재 페이지가 속한 블록 번호
        int startPage = (currentBlock - 1) * blockSize + 1;            // 블록 시작 페이지: …
        int endPage   = Math.min(startPage + blockSize - 1, totalPages); // 블록 끝 페이지

        // 블록 이동 가능 여부/대상 계산
        boolean hasPrevBlock  = startPage > 1;           // 시작 페이지가 1보다 크면 이전 블록 존재 (예: 11~20 블록이면 이전 블록은 1~10)
        boolean hasNextBlock  = endPage < totalPages;    // 끝 페이지가 총 페이지보다 작으면 다음 블록 존재
        int prevBlockStart    = Math.max(startPage - blockSize, 1);     // 이전 블록의 시작 페이지 (예: 11→1)
        int nextBlockStart    = Math.min(startPage + blockSize, totalPages); // 다음 블록의 시작 페이지 (예: 1→11)
        
        // ===================== 6) JSP로 전달할 모델 속성들 =====================
        model.addAttribute("pagePerRows", pagePerRows);  // 페이지당 행 수 (JSP: Rows 셀렉터 selected 처리)
        model.addAttribute("page", page);                // 현재 페이지 번호 (JSP: 현재 페이지 강조)
        model.addAttribute("totalCount", totalCount);    // 총 레코드 수 (JSP: 총계 표기)
        model.addAttribute("totalPages", totalPages);    // 총 페이지 수   (JSP: 루프/표기)
        model.addAttribute("startPage", startPage);      // 현재 블록 시작 번호
        model.addAttribute("endPage", endPage);          // 현재 블록 끝 번호
        model.addAttribute("hasPrevBlock", hasPrevBlock);// 이전 블록 존재 여부 (JSP: "이전" 활성/비활성)
        model.addAttribute("hasNextBlock", hasNextBlock);// 다음 블록 존재 여부 (JSP: "다음" 활성/비활성)
        model.addAttribute("prevBlockStart", prevBlockStart); // 이전 블록이동 시 타깃 페이지(예: 11→1)
        model.addAttribute("nextBlockStart", nextBlockStart); // 다음 블록이동 시 타깃 페이지(예: 1→11)
        model.addAttribute("filter", searchFilter); 			// 필터 사용

        ObjectMapper objectMapper = new ObjectMapper();
        
        String stockListJson = null;
        
        try {
			objectMapper.configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, false);
			
			String rawJson = objectMapper.writeValueAsString(stlist);
			
			stockListJson = rawJson.replaceAll("[\n\r]", "");
			stockListJson = stockListJson.replaceAll("'", "\\\\'");
			stockListJson = stockListJson.replaceAll("\"", "\\\\\""); 
			stockListJson = stockListJson.replaceAll("`", "\\\\`");        	
        }
		catch (JsonProcessingException e) {
			e.printStackTrace();
			stockListJson = "[]"; 
		}
        
        model.addAttribute("list", list);
        model.addAttribute("wnlist", wnlist); 
        model.addAttribute("stockList", stlist);
        model.addAttribute("stockListJson", stockListJson);
		
		return "06_quality/06_1_in_inspection.tiles";
	}
	
//	//  작업자 조회용
//	public String selectWorkerName(Model model) {
//		
//		System.out.println("작업자 조회용");
//		
//		List<WorkerDTO> wnlist = service.workerNameList();
//		
//		model.addAttribute("wnlist", wnlist);
//		
//		// 여긴 바꿔야 함
//		return "06_quality/06_1_in_inspection.tiles";
//	}
	
 	@RequestMapping("/inInsdetail")
 	@ResponseBody
	public P0601_InInsDTO detail(@RequestParam("inspection_result_id") String inspection_result_id) {
		P0601_InInsDTO dto = service.getOneInIns(inspection_result_id);
	    System.out.println(dto);
	    return dto;
	}
	
 	// 등록
	@RequestMapping("/inInsinsert")
	@ResponseBody
	public String insertInIns(P0601_InInsDTO dto) {
	    logger.info("입고 검사 등록 요청 DTO: {}", dto);

	    try {
	        int result = service.addInIns(dto);
	        if(result > 0) {
	            return "success";
	        } else {
	            return "fail";
	        }
	    } catch (Exception e) {
	        logger.error("입고 검사 등록 실패", e);
	        return "fail";
	    }
	}
	
	// 수정
	@RequestMapping("/inInsupdate")
	@ResponseBody
	public String updateInIns(P0601_InInsDTO dto) {
	    logger.info("입고 검사 수정 요청 DTO: {}", dto);

	    try {
	        int result = service.editInIns(dto);
	        if(result > 0) {
	            return "success";
	        } else {
	            // 업데이트 대상 ID가 없거나, 변경 사항이 없어 0이 반환될 수 있음
	            return "fail"; 
	        }
	    } catch (Exception e) {
	        logger.error("입고 검사 수정 실패", e);
	        return "fail";
	    }
	}
	
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
