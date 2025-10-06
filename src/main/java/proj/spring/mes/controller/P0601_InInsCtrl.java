package proj.spring.mes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class P0601_InInsCtrl {
	@RequestMapping("/inInslist")
	public String inInsList() {
		System.out.println("입고 검사 기본 조회");
		return "06_quality/06_1_in_inspection.tiles";
	}
}
