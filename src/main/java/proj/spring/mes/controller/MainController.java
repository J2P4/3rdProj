package proj.spring.mes.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import proj.spring.mes.dto.P07_BoardDTO;
import proj.spring.mes.service.MainService;
import proj.spring.mes.service.P07_BoardService;


@Controller
public class MainController {

private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	@Autowired
	private P07_BoardService boardService;

	@Autowired
	private MainService mainService;

	@RequestMapping("/main")
	public String mainPage(Model model) {
		System.out.println("메인페이지");
		
		// 메인 게시판
		List<P07_BoardDTO> list = boardService.mainlist();
		model.addAttribute("list",list);
		
		// 메인 대시보드
		Map<String, Object> data = mainService.getMainDashboard();
	    model.addAttribute("data", data);
	    logger.info("data={}", data);
		return "01_main/01_main.tiles";
	}
	
	
	
	
}
