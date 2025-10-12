package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.P0401_StockDTO;

public interface P0401_StockService {

	public List<P0401_StockDTO> stockList();
	public List<P0401_StockDTO> stockItem();
	public P0401_StockDTO getOneStock(String stock_id);
	public int editStock(P0401_StockDTO dto);
	public int removeStock(String stock_id);
	public int addStock(P0401_StockDTO dto);
	
}
