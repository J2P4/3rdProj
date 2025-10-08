package proj.spring.mes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.OrderMapperDAO;
import proj.spring.mes.dto.OrderDTO;
import proj.spring.mes.dto.WorkerDTO;

@Service
public class OrderServiceImpl implements OrderService{
	@Autowired
	OrderMapperDAO orderMapperDao;   // MapperDAO 인터페이스를 받아오기
	
	@Override
	public List<OrderDTO> list() {
	       return orderMapperDao.selectOrder();
	   }
	
    @Override
    public OrderDTO get(String orderId) {
        return orderMapperDao.selectOneorder(orderId);
    }

    @Override
    public int add(OrderDTO dto) {
        return orderMapperDao.insertOrder(dto);
    }

    @Override
    public int edit(OrderDTO dto) {
        return orderMapperDao.updateOrder(dto);
    }

    @Override
    public int remove(String orderId) {
        return orderMapperDao.deleteOrder(orderId);
    }
	
}
