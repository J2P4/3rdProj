package proj.spring.mes.dao.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Param;
import proj.spring.mes.dto.OrderDTO;

public interface OrderMapperDAO {
    List<OrderDTO> selectOrderList();
    OrderDTO selectOrderOne(@Param("order_id") String orderId);
    int insertOrder(OrderDTO dto);
    int updateOrder(OrderDTO dto);
    int deleteOrder(@Param("order_id") String orderId);
}
