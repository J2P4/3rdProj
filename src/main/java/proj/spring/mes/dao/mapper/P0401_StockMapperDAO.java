package proj.spring.mes.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import proj.spring.mes.dto.P0401_StockDTO;

@Mapper
public interface P0401_StockMapperDAO {
	
	List<P0401_StockDTO> selectStock();
	P0401_StockDTO selectOneStock(String stock_id);
	List<P0401_StockDTO> selectStockItem();
	int updateStock(P0401_StockDTO dto);
	int deleteStock(String stock_id);
	int insertStock(P0401_StockDTO dto);
	
}
