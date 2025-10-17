package proj.spring.mes.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import proj.spring.mes.dto.ItemDTO;
import proj.spring.mes.dto.P0501_CPDTO;
import proj.spring.mes.service.P0501_CPService;
import proj.spring.mes.service.P0502_WorkOrderService;

@Controller
public class P0502_WorkOrderCtrl {
	
	
	@Autowired
	P0502_WorkOrderService WorkOrderService;
	
	
	/** 목록 */
	@RequestMapping("/workorder")
    public String list() {
        

        
        System.out.println("목록페이지");
        
        
        return "05_production/05_2_workorder.tiles"; 
	
	
	
	
	
	

}
	}
