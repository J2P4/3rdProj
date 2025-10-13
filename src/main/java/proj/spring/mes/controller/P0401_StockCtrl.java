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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import proj.spring.mes.dto.P0401_StockDTO;
import proj.spring.mes.service.P0401_StockService;

@Controller
public class P0401_StockCtrl {
	
	private static final Logger logger = LoggerFactory.getLogger(P0401_StockCtrl.class);
	
	@Autowired
	P0401_StockService service;
	
	@SuppressWarnings("deprecation")
	@RequestMapping("/stocklist")
	public String stockList(Model model, P0401_StockDTO searchCondition) {
		System.out.println("재고 기본 조회");
		System.out.println("재고 조회 조건: " + searchCondition);
		
		List<P0401_StockDTO> list = service.stockList(searchCondition);
		
//		// 재고 목록 조회
//		List<P0401_StockDTO> list = service.stockList();
		
		// 품목 목록 조회
		List<P0401_StockDTO> itemList = service.stockItem(); 
		
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
		
		return "04_standard/04_1_standard_stock.tiles";
	}
	
	@RequestMapping("/stockdetail")
	@ResponseBody
	public P0401_StockDTO detail(@RequestParam("stock_id") String stock_id) {
	    P0401_StockDTO dto = service.getOneStock(stock_id);
	    System.out.println(dto);
	    return dto;
	}
	
	@RequestMapping("/stockinsert")
	@ResponseBody
	public String insert(P0401_StockDTO dto) {
	    int result = service.addStock(dto);
	    if(result > 0) {
	    	return "success";
	    }
	    else {
	    	return "fail";
	    }
	}

	@RequestMapping("/stockupdate")
	@ResponseBody
	public String update(P0401_StockDTO dto) {
	    int result = service.editStock(dto);
	    if(result > 0) {
	    	return "success";
	    }
	    else {
	    	return "fail";
	    }
	}

	// 한 번 수업 전에 여쭤봤으니 하나쯤은 써보자는 마음으로 넣었거든요
	// 문제 생기면 바꿈
	@PostMapping("/stockdelete")
//	@RequestMapping(method = RequestMethod.POST) 얘 써도 되긴 함
	@ResponseBody
	public String deleteStocks(@RequestBody List<String> stockIds) { // JSON 배열을 List<String>으로 받음
		logger.info("선택된 재고 ID 삭제 요청: " + stockIds);
		
		if (stockIds == null || stockIds.isEmpty()) {
            return "fail: No IDs provided"; // 방어 코드
        }
        
		// Service의 다중 삭제 메소드 호출
		int deletedCount = service.removeStocks(stockIds); 
		
		if (deletedCount == stockIds.size()) {
			return "success";
		} else {
            // 일부 또는 전체 삭제 실패 시
            logger.error("재고 삭제 실패. 요청 ID 수: {}, 실제 삭제 수: {}", stockIds.size(), deletedCount);
			return "fail"; 
		}
	}
	
	
//	@RequestMapping("/stockdelete")
//	public String delete(String stock_id) {
//		service.removeStock(stock_id);
//		return "redirect:stocklist";
//	}
	
//	그냥 전체 조회 쪽에 합칠 것.
//	@RequestMapping("/stockitem")
//	public String stockItem(Model model) {
//		System.out.println("재고 등록 : 품목 id 선택 영역");
//		List<P0401_StockDTO> list = service.stockItem();
//		
//		model.addAttribute("itemList", list);
//		
//		return "04_standard/04_1_standard_stock.tiles";
//	}
}
