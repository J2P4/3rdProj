package proj.spring.mes.controller;

// import org.springframework.beans.factory.annotation.Autowired; // �� ���ʿ�
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class OrderListController {

    @RequestMapping("/orderlist")
    public String login() {
        System.out.println("������ȸ");
        return "03_order/Order_list.tiles";
    }
}
