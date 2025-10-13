package proj.spring.mes.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;              
import java.util.List;                                              

import proj.spring.mes.dto.P0402_ClientDTO;                        
import proj.spring.mes.service.P0402_ClientService;

@Controller
public class P0402_ClientCtrl {

    private static final Logger logger = LoggerFactory.getLogger(P0402_ClientCtrl.class);

    @Autowired
    P0402_ClientService clientService;

    @GetMapping("/clientlist")
    public String clientlist(Model model) {
        model.addAttribute("clients", clientService.clientList());
        logger.info("Loaded client list");
        return "client/list";
    }

    // 슬라이드에서 쓸 JSON 엔드포인트
    @GetMapping(value="/api/clients", produces="application/json;charset=UTF-8")
    @ResponseBody
    public List<P0402_ClientDTO> apiClientList() {
        List<P0402_ClientDTO> list = clientService.clientList();
        logger.info("Loaded client list (api): {}", list.size());
        return list; // [{client_id, client_name, ...}]
    }
}
