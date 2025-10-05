package proj.spring.mes.controller;

// import org.springframework.beans.factory.annotation.Autowired; // ← 불필요
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class OrderListController {

    @RequestMapping("/orderlist")
    public String login() {
        System.out.println("발주조회");
        return "03_order/Order_list.tiles";
    }
}
