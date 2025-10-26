package proj.spring.mes.dao.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import proj.spring.mes.dto.P0404_BOMDTO;

@Mapper
public interface P0404_BomMapperDAO {

	List<P0404_BOMDTO> selectBOM(P0404_BOMDTO serarchCondition);
	P0404_BOMDTO selectOneBOM(String bom_id);
	List<P0404_BOMDTO> selectBOMsByItem(String item_id);
	List<P0404_BOMDTO> selectOneBOMItemF(P0404_BOMDTO serarchCondition);
	List<P0404_BOMDTO> selectOneBOMItemM();
	List<P0404_BOMDTO> selectBOMPro();
	
	// 품목 고르기용 2개 넣어놔야 함
	
	int updateBOM(P0404_BOMDTO dto);
//	int deleteBOM(String bom_id);
	int deleteBOMs(List<String> itemIds); // 이거는 완제 기준
	int insertBOM(P0404_BOMDTO dto);
	
	// 여기는 bom 기준. map으로 통합 구현할 거라 추가해둠.
	int deleteBOMByIds(List<String> bomIds);
	int updateBOMByMap(Map<String, Object> bomMap);
	int insertBOMByMap(Map<String, Object> bomMap);
	
}
