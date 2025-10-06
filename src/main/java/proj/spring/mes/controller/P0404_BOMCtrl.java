package proj.spring.mes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class P0404_BOMCtrl {
	@RequestMapping("/bomlist")
	public String bomList() {
		System.out.println("BOM 기본 조회");
		return "04_standard/04_4_standard_bom.tiles";
	}
}
