package proj.spring.mes.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import proj.spring.mes.dto.P0404_BOMDTO;
import proj.spring.mes.service.P0404_BOMService;

@Controller
public class P0404_BOMCtrl {
	
	private static final Logger logger = LoggerFactory.getLogger(P0404_BOMCtrl.class);
	
	@Autowired
	P0404_BOMService service;
	
	@RequestMapping("/bomlist")
	public String bomList(Model model,
			@RequestParam(value = "size", required = false, defaultValue = "10") int pagePerRows, // 페이지당 행 수 파라미터 (기본 10)
            @RequestParam(value = "page", required = false, defaultValue = "1")  int page,         // 현재 페이지 번호 파라미터 (기본 1, 1-base)
            P0404_BOMDTO searchFilter) {
		
		System.out.println("BOM 기본 조회");
		System.out.println("BOM 조회 조건: " + searchFilter);
		
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
        List<P0404_BOMDTO> list = service.list(page, pagePerRows, searchFilter);
        
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
		
		List<P0404_BOMDTO> materialList = service.bomLists();
		List<P0404_BOMDTO> proList = service.proLists();
		
		ObjectMapper objectMapper = new ObjectMapper();
		
		String materialListJson = null;
		String proListJson = null;
		try {
			
			// 한국어 깨짐 방지
			objectMapper.configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, false);
			
			String rawJson = objectMapper.writeValueAsString(materialList);
			String rawJsonPro = objectMapper.writeValueAsString(proList);
			// JSON 난리 나서 이스케이프...
			// 진짜 가만 안 둬.
			// 아마 품목 조회처럼 특문 많은 경우 아니면 이 영역은 지워도 될 듯.
			materialListJson = rawJson.replaceAll("[\n\r]", "");
			materialListJson = materialListJson.replaceAll("'", "\\\\'");
			materialListJson = materialListJson.replaceAll("\"", "\\\\\""); 
			materialListJson = materialListJson.replaceAll("`", "\\\\`");
			
			proListJson = rawJsonPro.replaceAll("[\n\r]", "");
			proListJson = proListJson.replaceAll("'", "\\\\'");
			proListJson = proListJson.replaceAll("\"", "\\\\\""); 
			proListJson = proListJson.replaceAll("`", "\\\\`");
		}
		catch (JsonProcessingException e) {
			e.printStackTrace();
			materialListJson = "[]"; 
			proListJson = "[]";
		}
		
		model.addAttribute("list", list);
		model.addAttribute("materialList", materialList);
		model.addAttribute("materialListJson", materialListJson);
		model.addAttribute("proList", proList);
		model.addAttribute("proListJson", proListJson);
		
		return "04_standard/04_4_standard_bom.tiles";
	}
	
	// 완제 ID 기반 조회
	@RequestMapping("/bomdetails")
    @ResponseBody
    public List<P0404_BOMDTO> getBOMDetailsByItem(String item_id) {
        logger.info("완제 기준 BOM 상세 조회: {}", item_id);
        
        // Service에 selectBOMByItem(String item_id) 메소드를 추가했다고 가정하고 사용합니다.
        List<P0404_BOMDTO> bomDetails = service.selectBOMByItem(item_id);
        
        return bomDetails; // Spring이 자동으로 JSON으로 변환하여 응답
    }

	@RequestMapping("/bomdetail")
	@ResponseBody
	public P0404_BOMDTO detail(String bom_id) {
		logger.info("BOM 상세 조회 요청: {}", bom_id);
		P0404_BOMDTO dto = service.getOneBOM(bom_id);
		return dto;
	}
	
    @PostMapping("/bominsert")
    @ResponseBody
    public String insertBOMs(@RequestBody List<P0404_BOMDTO> bomList) {
        logger.info("BOM 등록 항목 수: {}", bomList.size());
        
        if (bomList == null || bomList.isEmpty()) {
            return "bom 없음";
        }
        
        try {
            int insertedCount = service.addBOM(bomList);
            
            if (insertedCount == bomList.size()) {
                return "success";
            } else {
                logger.error("BOM 등록 실패. 요청 수: {}, 실제 등록 수: {}", bomList.size(), insertedCount);
                return "fail: Partial insertion";
            }
        } catch (Exception e) {
            logger.error("BOM 등록 중 예외 발생:", e);
            return "fail: " + e.getMessage();
        }
    }

    @PostMapping("/bomupdate")
	@ResponseBody
		public String updateBOM(@RequestBody Map<String, Object> payload) {
    	logger.info("BOM 일괄 수정/추가/삭제 요청 (/bomupdate)");

    	try {
    		// Service의 processBomUpdates 메소드를 사용하여 모든 CRUD 작업 처리
    		boolean result = service.processBomUpdates(payload);

    		if (result) {
    			return "success";
    		}
    		else {
    			// 부분적인 실패는 예외로 처리되지 않고 boolean으로 반환될 경우 대비
    			return "fail: Partial failure or no changes processed";
    		}
    	}
    	catch (Exception e) {
    		logger.error("BOM 일괄 처리 중 예외 발생:", e);
    		return "fail: " + e.getMessage();
    	}
    }
	
	@PostMapping("/bomdelete")
	@ResponseBody
	public String deleteBOMs(@RequestBody List<String> itemIds) {
		logger.info("선택된 완제품 ID 내 bom 전체 삭제 요청: " + itemIds);
		
		if (itemIds == null || itemIds.isEmpty()) {
			return "fail: No IDs provided";
		}
		// 완제품 item_id 기준 다중 삭제
		int deletedCount = service.removeBOMs(itemIds);
		if (deletedCount > 0) {
			// 하나라도 삭제되면 성공으로 처리
			return "success";
		}
		else {
			logger.error("완제품 BOM 삭제 실패. 요청 ID 수: {}, 실제 삭제 수: {}", itemIds.size(), deletedCount);
			return "fail";
		}
	}
	
}
