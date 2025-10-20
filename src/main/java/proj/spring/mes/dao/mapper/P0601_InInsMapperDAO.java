package proj.spring.mes.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import proj.spring.mes.dto.P0401_StockDTO;
import proj.spring.mes.dto.P0601_InInsDTO;
import proj.spring.mes.dto.WorkerDTO;

@Mapper
public interface P0601_InInsMapperDAO {
	
	List<P0601_InInsDTO> selectInIns(P0601_InInsDTO searchCondition);
	P0601_InInsDTO selectOneInIns(String inspection_result_id);
	int updateInIns(P0601_InInsDTO dto);
//	int deleteInIns(String inspection_result_id);
	int deleteInIns(List<String> inInsIds);
	int insertInIns(P0601_InInsDTO dto);

	//  작업자 & 재고 조회용
	List<WorkerDTO> selectWorkerName();
	List<WorkerDTO> selectStock();
	
	// 페이징 및 필터
	List<P0601_InInsDTO> selectInInsPage(@Param("limit") int limit, @Param("offset") int offset, @Param("filter") P0601_InInsDTO searchFilter);
	// 총계
	long selectInInsCount(@Param("filter") P0601_InInsDTO searchFilter);
}
