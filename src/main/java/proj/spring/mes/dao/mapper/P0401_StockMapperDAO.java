package proj.spring.mes.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import proj.spring.mes.dto.P0401_StockDTO;
import proj.spring.mes.dto.WorkerDTO;

@Mapper
public interface P0401_StockMapperDAO {
	
	List<P0401_StockDTO> selectStock(P0401_StockDTO searchCondition);	// 전체 조회 겸 필터링 조회
	P0401_StockDTO selectOneStock(String stock_id);						// 상세 조회
	List<P0401_StockDTO> selectStockItem();								// 조회 : 등록 시 품목 확인용
	int updateStock(P0401_StockDTO dto);								// 수정
//	int deleteStock(String stock_id);									// 삭제 - 개별
	int deleteStocks(List<String> stockIds);							// 삭제 - 전체
	int insertStock(P0401_StockDTO dto);								// 등록

	// 신규(페이징) 및 필터
    List<P0401_StockDTO> selectStockPage(@Param("limit") int limit, @Param("offset") int offset, @Param("filter") P0401_StockDTO searchFilter);
	// 신규(총계)
	long selectStockCount(@Param("filter") P0401_StockDTO searchFilter);
}
