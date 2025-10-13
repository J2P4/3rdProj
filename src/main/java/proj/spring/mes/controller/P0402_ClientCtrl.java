package proj.spring.mes.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping; // GET 매핑 사용

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
        // 뷰 리졸버 설정에 맞는 논리 뷰명으로 교체하세요.
        // 예: /WEB-INF/views/client/list.jsp → "client/list"
        return "client/list";
    }
}
