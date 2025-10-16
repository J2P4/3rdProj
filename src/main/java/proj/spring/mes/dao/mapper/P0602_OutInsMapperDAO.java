package proj.spring.mes.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.web.bind.annotation.RequestMapping;

import proj.spring.mes.dto.P0601_InInsDTO;
import proj.spring.mes.dto.P0602_OutInsDTO;
import proj.spring.mes.dto.WorkerDTO;

@Mapper
public interface P0602_OutInsMapperDAO {

	List<P0602_OutInsDTO> selectOutIns(P0602_OutInsDTO searchCondition);
	P0602_OutInsDTO selectOneOutIns(String inspection_result_id);
	int updateOutIns(P0602_OutInsDTO dto);
//	int deleteOutIns(String inspection_result_id);
	int deleteOutIns(List<String> outInsIds);
	int insertOutIns(P0602_OutInsDTO dto);

	//  작업자 조회용
	List<WorkerDTO> selectWorkerName();
	
}
