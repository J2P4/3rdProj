package proj.spring.mes.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import proj.spring.mes.dto.P0405_ProcessDTO;
import proj.spring.mes.service.P0405_ProcessService;



public class P0405_ProcessCtrl {

	
	private static final Logger logger = LoggerFactory.getLogger(P0405_ProcessCtrl.class);
	
	@Autowired
	P0405_ProcessService service;
	
	@SuppressWarnings("deprecation")
	@RequestMapping("/processlist")
	public String processList(Model model,
    		@RequestParam(value = "size", required = false, defaultValue = "10") int pagePerRows, // 페이지당 행 수 파라미터 (기본 10)
            @RequestParam(value = "page", required = false, defaultValue = "1")  int page,         // 현재 페이지 번호 파라미터 (기본 1, 1-base)
            P0405_ProcessDTO searchFilter
			) {
		System.out.println("공정 기본 조회");
		System.out.println("공정 조회 조건: " + searchFilter);
		
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
        
        // ===================== 4) 목록 조회 =====================
        List<P0405_ProcessDTO> list = service.list(page, pagePerRows, searchFilter);
        
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
        
//		// 재고 목록 조회
//		List<P0405_ProcessDTO> list = service.processList();
		
		// 품목 목록 조회
		List<P0405_ProcessDTO> itemList = service.processItem(); 
		
		// ObjectMapper : 객체 <-> JSON용 코드. Jackson 라이브러리 사용 필요.
		// 헷갈리면 참고하자 : https://velog.io/@thisyoon97/ObjectMapper
		ObjectMapper objectMapper = new ObjectMapper();
		
		String itemListJson = null;
		try {
			
			// 한국어 깨짐 방지
			objectMapper.configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, false);
			
			String rawJson = objectMapper.writeValueAsString(itemList);
			
			// JSON 난리 나서 이스케이프...
			// 진짜 가만 안 둬.
			// 아마 품목 조회처럼 특문 많은 경우 아니면 이 영역은 지워도 될 듯.
			itemListJson = rawJson.replaceAll("[\n\r]", "");
			itemListJson = itemListJson.replaceAll("'", "\\\\'");
			itemListJson = itemListJson.replaceAll("\"", "\\\\\""); 
			itemListJson = itemListJson.replaceAll("`", "\\\\`");
		}
		catch (JsonProcessingException e) {
			e.printStackTrace();
			itemListJson = "[]"; 
		}
		
		model.addAttribute("list", list);
		model.addAttribute("itemList", itemList);
		model.addAttribute("itemListJson", itemListJson); 
		
		return "04_standard/04_5_standard_process.tiles";
	}
	
	@RequestMapping("/processdetail")
	@ResponseBody
	public P0405_ProcessDTO detail(@RequestParam("process_id") String process_id) {
	    P0405_ProcessDTO dto = service.getOneprocess(process_id);
	    System.out.println(dto);
	    return dto;
	}
	
	@RequestMapping("/processinsert")
	@ResponseBody
	public String insert(P0405_ProcessDTO dto) {
	    int result = service.addprocess(dto);
	    if(result > 0) {
	    	return "success";
	    }
	    else {
	    	return "fail";
	    }
	}

	@RequestMapping("/processupdate")
	@ResponseBody
	public String update(P0405_ProcessDTO dto) {
	    int result = service.editprocess(dto);
	    if(result > 0) {
	    	return "success";
	    }
	    else {
	    	return "fail";
	    }
	}

	// 한 번 수업 전에 여쭤봤으니 하나쯤은 써보자는 마음으로 넣었거든요
	// 문제 생기면 바꿈
	@PostMapping("/processdelete")
//	@RequestMapping(method = RequestMethod.POST) 얘 써도 되긴 함
	@ResponseBody
	public String deleteprocesss(@RequestBody List<String> processIds) { // JSON 배열을 List<String>으로 받음
		logger.info("선택된 재고 ID 삭제 요청: " + processIds);
		
		if (processIds == null || processIds.isEmpty()) {
            return "fail: No IDs provided"; // 방어 코드
        }
        
		// Service의 다중 삭제 메소드 호출
		int deletedCount = service.removeprocesss(processIds); 
		
		if (deletedCount == processIds.size()) {
			return "success";
		} else {
            // 일부 또는 전체 삭제 실패 시
            logger.error("재고 삭제 실패. 요청 ID 수: {}, 실제 삭제 수: {}", processIds.size(), deletedCount);
			return "fail"; 
		}
	}
	
	
}
