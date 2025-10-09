package proj.spring.mes.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import proj.spring.mes.dto.P0601_InInsDTO;
import proj.spring.mes.dto.WorkerDTO;

@Mapper
public interface P0601_InInsMapperDAO {
	
	List<P0601_InInsDTO> selectInIns();
	P0601_InInsDTO selectOneInIns(String inspection_result_id);
	int updateInIns(P0601_InInsDTO dto);
	int deleteInIns(String inspection_result_id);
	int insertInIns(P0601_InInsDTO dto);

	//  작업자 조회용
	List<WorkerDTO> selectWorkerName();
	
}
