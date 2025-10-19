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

    // 상세 JSON (JS에서 /po/detail?id= 로 호출 중이면 여기 매핑만 /po/detail로 잡아도 됨)
    @GetMapping("/po/detail")
    @ResponseBody
    public OrderDTO detail(@RequestParam("id") String id) {
        return orderService.get(id);
    }
}
