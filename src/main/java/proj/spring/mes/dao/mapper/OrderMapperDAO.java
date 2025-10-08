package proj.spring.mes.dao.mapper;

import java.util.List;

import proj.spring.mes.dto.OrderDTO;


public interface OrderMapperDAO {

	// CRUD
	
	//전체 조회
    List<OrderDTO> selectOrder();
    
    //하나만 추출할떄
    OrderDTO selectOneorder(String order_id);
    
    //삽입
    int insertOrder(OrderDTO dto);
    
    //수정
    int updateOrder(OrderDTO dto);
    
    //삭제
    int deleteOrder(String order_id);
    
	
	
}
