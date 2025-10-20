package proj.spring.mes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import proj.spring.mes.service.OrderService;
import proj.spring.mes.dto.OrderDTO;
import java.util.List;

@Controller
public class OrderListController {

    @Autowired
    private OrderService orderService; // Service 연결

    @RequestMapping("/orderlist")
    public String login(Model model) {
        System.out.println("발주 목록");
        List<OrderDTO> orders = orderService.list(); // 목록 조회
        model.addAttribute("orders", orders);        // JSP로 전달
        return "03_order/Order_list.tiles";
    }

 
    @GetMapping("/orderlist/detail")
    @ResponseBody
    public List<OrderDTO> detail(@RequestParam("order_id") String id) {
    	List<OrderDTO> orders = orderService.get(id);
        return orders;
    }
}
