package proj.spring.mes.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.ui.Model;
import org.springframework.beans.factory.annotation.Autowired;

import proj.spring.mes.service.ItemService;

@Controller
public class ItemController {

    @Autowired
    private ItemService itemService;

    @RequestMapping("/itemlist")
    public String itemlist(Model model) {
        model.addAttribute("list", itemService.list());
        return "04_standard/04_3_standard_item.tiles";
    }
}
