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
		return "04_standard/04_1_standard_stock.tiles";
	}
	
	@RequestMapping("/bomlist")
	public String bomList() {
		return "04_standard/04_4_standard_bom.tiles";
	}
	
	@RequestMapping("/inInslist")
	public String inInsList() {
		return "06_quality/06_1_in_inspection.tiles";
	}
	
	@RequestMapping("/outInslist")
	public String outInsList() {
		return "06_quality/06_2_out_inspection.tiles";
	}
	
	@RequestMapping("/errorlist")
	public String errorList() {
		return "06_quality/06_3_error_report.tiles";
	}
	
}
