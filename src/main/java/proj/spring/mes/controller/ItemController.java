package proj.spring.mes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ItemController {

    @RequestMapping("/itemlist")
    public String login() {
        System.out.println("품목 목록");
        return "04_standard/04_3_standard_item.tiles";
    }
}
