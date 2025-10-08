package proj.spring.mes.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import proj.spring.mes.dto.P0404_BOMDTO;

@Mapper
public interface P0404_BomMapperDAO {

	List<P0404_BOMDTO> selectBOM();
	P0404_BOMDTO selectOneBOM(String bom_id);
	
	// 품목 고르기용 2개 넣어놔야 함
	
	int updateBOM(P0404_BOMDTO dto);
	int deleteBOM(P0404_BOMDTO dto);
	int insertBOM(P0404_BOMDTO dto);
	
}
