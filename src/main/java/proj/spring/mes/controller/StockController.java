package proj.spring.mes.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class StockController {
	
	private static final Logger logger = LoggerFactory.getLogger(StockController.class);
	
	@RequestMapping("/stocklist")
	public String stockList() {
		return "content/04_standard/04_1_standard_stock";
	}
	
	@RequestMapping("/bomlist")
	public String bomList() {
		return "content/04_standard/04_4_standard_bom";
	}
	
	@RequestMapping("/inInslist")
	public String inInsList() {
		return "content/06_quality/06_1_in_inspection";
	}
	
	@RequestMapping("/outInslist")
	public String outInsList() {
		return "content/06_quality/06_2_out_inspection";
	}
	
	@RequestMapping("/errorlist")
	public String errorList() {
		return "content/06_quality/06_3_error_report";
	}
	
}
