package proj.spring.mes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import proj.spring.mes.service.ItemService;

@Controller 
public class processCtrl {

	
    @Autowired                                         
    private ItemService processService;
	
    @RequestMapping("/processlist")
    public String processlist() {
    	return "04_standard/04_5_standard_process.tiles";
    }
	
	
	
}
