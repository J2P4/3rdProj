package proj.spring.mes.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import proj.spring.mes.dto.P0401_StockDTO;
import proj.spring.mes.dto.P0603_ErrorDTO;

@Mapper
public interface P0603_ErrorMapperDAO {

	List<P0603_ErrorDTO> selectError(P0603_ErrorDTO searchCondition);
	P0603_ErrorDTO selectOneError(String defect_reason_id);
	int updateError(P0603_ErrorDTO dto);
	int deleteError(String defect_id);
	int insertError(P0603_ErrorDTO dto);

	
}
