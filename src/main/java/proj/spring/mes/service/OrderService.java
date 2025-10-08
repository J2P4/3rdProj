package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.OrderDTO;

public interface OrderService {
    // CRUD
    List<OrderDTO> list();
    OrderDTO get(String OrderId);
    int add(OrderDTO dto);
    int edit(OrderDTO dto);
    int remove(String OrderId);
}
