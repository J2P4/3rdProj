package proj.spring.mes.service;

import java.util.List;

import java.util.Map;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.P0401_StockMapperDAO;
import proj.spring.mes.dto.P0401_StockDTO;

@Service
public class P0401_StockServiceImpl implements P0401_StockService {

	@Autowired
	P0401_StockMapperDAO stockMapperDAO;
	
	@Override
	public List<P0401_StockDTO> stockList(P0401_StockDTO searchCondition) {
		return stockMapperDAO.selectStock(searchCondition);
	}
	
	@Override
	public P0401_StockDTO getOneStock(String stock_id) {
		return stockMapperDAO.selectOneStock(stock_id);
	}
	
	@Override
	public List<P0401_StockDTO> getStockHistory(String stock_id) {
		return stockMapperDAO.selectHistory(stock_id); 
	}
	
	@Override
	public Map<String, Object> getStockDetailWithHistory(String stock_id) {
		Map<String, Object> map = new HashMap<String, Object>();
        
        // 재고 상세 정보 조회
        map.put("detail", this.getOneStock(stock_id));
        
        // 재고 이력 정보 조회
        map.put("history", this.getStockHistory(stock_id));
        
        return map;
	}
	
	@Override
	public List<P0401_StockDTO> stockItem() {
		return stockMapperDAO.selectStockItem();
	}
	
	@Override
	public int editStock(P0401_StockDTO dto) {
		return stockMapperDAO.updateStock(dto);
	}
	
//	@Override
//	public int removeStock(String stock_id) {
//		return stockMapperDAO.deleteStock(stock_id);
//	}
	
    @Override
	public int removeStocks(List<String> stockIds) {
		return stockMapperDAO.deleteStocks(stockIds);
	}
	
	@Override
	public int addStock(P0401_StockDTO dto) {
		return stockMapperDAO.insertStock(dto);
	}
	
	// 페이징
	@Override
	public List<P0401_StockDTO> list(int page, int pagePerRows, P0401_StockDTO searchFilter) {
        int size = Math.max(1, Math.min(pagePerRows, 100));
        int p = Math.max(1, page);
        int offset = (p - 1) * size;
        
        System.out.println(size);
        System.out.println(p);
        System.out.println(offset);
        
        return stockMapperDAO.selectStockPage(size, offset, searchFilter);
	}
	
	@Override
	public long count(P0401_StockDTO searchFilter) {
		return stockMapperDAO.selectStockCount(searchFilter);
	}
	
}
