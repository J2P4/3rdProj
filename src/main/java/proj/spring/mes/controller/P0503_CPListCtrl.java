package proj.spring.mes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import proj.spring.mes.service.P0503_CPListService;

@Controller
public class P0503_CPListCtrl {

	@Autowired
	P0503_CPListService CPListService;
	
	
	/** 목록 */
	@RequestMapping("/cplist")
    public String list() {
        

        System.out.println("목록페이지");
        
        return "05_production/05_3_cplist.tiles"; 
	}
	
}
