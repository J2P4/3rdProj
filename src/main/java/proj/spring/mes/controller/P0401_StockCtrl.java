package proj.spring.mes.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class P0401_StockCtrl {
	
	private static final Logger logger = LoggerFactory.getLogger(P0401_StockCtrl.class);
	
	@RequestMapping("/stocklist")
	public String stockList() {
		System.out.println("재고 기본 조회");
		return "04_standard/04_1_standard_stock.tiles";
	}
	
}
