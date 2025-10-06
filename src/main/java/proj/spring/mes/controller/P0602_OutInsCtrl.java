package proj.spring.mes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class P0602_OutInsCtrl {
	@RequestMapping("/outInslist")
	public String outInsList() {
		System.out.println("출고 검사 기본 조회");
		return "06_quality/06_2_out_inspection.tiles";
	}
}
