package proj.spring.mes.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import proj.spring.mes.dto.P0502_WorkOrderDTO;

public interface P0502_WorkOrderMapperDAO {
	// 신규(페이징) 및 필터
    List<P0502_WorkOrderDTO> selectWO(@Param("limit") int limit, @Param("offset") int offset, @Param("filter") P0502_WorkOrderDTO searchFilter);
	// 신규(총계)
	long selectWOCount(@Param("filter") P0502_WorkOrderDTO searchFilter);
	P0502_WorkOrderDTO selectOneWO(String work_order_id);
	
	
	int insertWO(P0502_WorkOrderDTO dto);
	int deleteWOs(List<String> wos);
}
