package proj.spring.mes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class P0603_ErrorCtrl {
	@RequestMapping("/errorlist")
	public String errorList() {
		System.out.println("불량 보고서 기본 조회");
		return "06_quality/06_3_error_report.tiles";
	}
}
