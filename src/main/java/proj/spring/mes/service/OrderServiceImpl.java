package proj.spring.mes.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import proj.spring.mes.dto.OrderDTO;
import proj.spring.mes.dao.mapper.OrderMapperDAO; // ★ 실제 존재하는 매퍼 타입

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderMapperDAO orderMapper; // ★ 타입 확정 (OrderMapper 아님)

    // 인터페이스 시그니처와 100% 일치시키기
    @Override
    public List<OrderDTO> list() {
        return orderMapper.selectOrderList();
    }

    @Override
    public OrderDTO get(String orderId) {
        return orderMapper.selectOrderOne(orderId);
    }

    @Override
    public int add(OrderDTO dto) {
        return orderMapper.insertOrder(dto);
    }

    @Override
    public int edit(OrderDTO dto) {
        return orderMapper.updateOrder(dto);
    }

    @Override
    public int remove(String orderId) {
        return orderMapper.deleteOrder(orderId);
    }

    /* ↓ 과거에 만들었던 메서드(이름 find/create/update/delete)는 전부 제거
    @Override public OrderDTO find(String order_id) { ... }
    @Override public int create(OrderDTO dto) { ... }
    @Override public int update(OrderDTO dto) { ... }
    @Override public int delete(String order_id) { ... }
    */
}
