package proj.spring.mes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.P0401_StockMapperDAO;
import proj.spring.mes.dto.P0401_StockDTO;

@Service
public class P0401_StockServiceImpl implements P0401_StockService {

	@Autowired
	P0401_StockMapperDAO stockMapperDAO;
	
	@Override
	public List<P0401_StockDTO> stockList() {
		return stockMapperDAO.selectStock();
	}
	
	@Override
	public P0401_StockDTO getOneStock(String stock_id) {
		return stockMapperDAO.selectOneStock(stock_id);
	}
	
	@Override
	public int editStock(P0401_StockDTO dto) {
		return stockMapperDAO.updateStock(dto);
	}
	
	@Override
	public int removeStock(String stock_id) {
		return stockMapperDAO.deleteStock(stock_id);
	}
	
	@Override
	public int addStock(P0401_StockDTO dto) {
		return stockMapperDAO.insertStock(dto);
	}
	
}
