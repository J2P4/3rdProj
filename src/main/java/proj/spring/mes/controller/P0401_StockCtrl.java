package proj.spring.mes.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import proj.spring.mes.dto.P0401_StockDTO;
import proj.spring.mes.service.P0401_StockService;

@Controller
public class P0401_StockCtrl {
	
	private static final Logger logger = LoggerFactory.getLogger(P0401_StockCtrl.class);
	
	@Autowired
	P0401_StockService service;
	
	@RequestMapping("/stocklist")
	public String stockList(Model model) {
		System.out.println("재고 기본 조회");
		
		List<P0401_StockDTO> list = service.stockList();
		
		model.addAttribute("list", list);
		
		return "04_standard/04_1_standard_stock.tiles";
	}
	
	@RequestMapping("/stockdetail")
	public String detail(Model model, String stock_id) {
		P0401_StockDTO dto = service.getOneStock(stock_id);
		model.addAttribute("stock", dto);
		return "04_standard/04_1_standard_stock.tiles";
	}
	
//	@RequestMapping("/stockinsert")
//	@RequestMapping("/stockupdate")
// 	
	
	@RequestMapping("/stockdelete")
	public String delete(String stock_id) {
		service.removeStock(stock_id);
		return "redirect:stocklist";
	}
	
}
