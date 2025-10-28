package proj.spring.mes.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import proj.spring.mes.dto.DataDTO;
import proj.spring.mes.dto.P07_BoardDTO;
import proj.spring.mes.service.DataService;
import proj.spring.mes.service.MainService;
import proj.spring.mes.service.P07_BoardService;


@Controller
public class MainController {

private static final Logger logger = LoggerFactory.getLogger(MainController.class);
	
	@Autowired
	private P07_BoardService boardService;

	@Autowired
	private MainService mainService;
	@Autowired
	private DataService dataService;

	@RequestMapping("/main")
	public String mainPage(Model model, @RequestParam(required = false, defaultValue = "1")int id) {
		System.out.println("메인페이지");
		
		// 메인 게시판
		List<P07_BoardDTO> list = boardService.mainlist();
		model.addAttribute("list",list);
		
		// 메인 대시보드
		Map<String, Object> data = mainService.getMainDashboard();
	    model.addAttribute("data", data);
	    logger.info("data={}", data);
	    
	    // 차트
	    List<DataDTO> datalist = dataService.getDataById(id);
        model.addAttribute("datalist", datalist);
        model.addAttribute("id", id);
	    
		return "01_main/01_main.tiles";
	}
	
	 // 사용 가능한 ID 목록 
	@RequestMapping("/chart/ids")
    @ResponseBody
    public List<Integer> getIds() {
        return dataService.getDistinctIds();
    }

    // 특정 ID의 시계열 데이터 
	@RequestMapping("/chart/byId")
    @ResponseBody
    public List<DataDTO> getId(@RequestParam("id") int id) {
        return dataService.getDataById(id);
    }
	
	
}
