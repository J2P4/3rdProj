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
	public String bomList(Model model, P0404_BOMDTO searchCondition) {
		System.out.println("BOM 기본 조회");
		
		List<P0404_BOMDTO> list = service.itemList(searchCondition);
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
	public String detail(Model model, String bom_id) {
		P0404_BOMDTO dto = service.getOneBOM(bom_id);
		model.addAttribute("bom", dto);
		return "04_standard/04_4_standard_bom.tiles";
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
