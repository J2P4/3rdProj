package proj.spring.mes.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.P0404_BomMapperDAO;
import proj.spring.mes.dto.P0404_BOMDTO;

@Service
public class P0404_BOMServiceImpl implements P0404_BOMService {

	@Autowired
	P0404_BomMapperDAO bomMapperDAO;
	
	@Override
	public List<P0404_BOMDTO> bomList(P0404_BOMDTO searchCondition) {
		return bomMapperDAO.selectBOM(searchCondition);
	}
	
	@Override
	public List<P0404_BOMDTO> itemList(P0404_BOMDTO searchCondition) {
		return bomMapperDAO.selectOneBOMItemF(searchCondition);
	}
	
	@Override
    public List<P0404_BOMDTO> selectBOMByItem(String item_id) {
        return bomMapperDAO.selectBOMsByItem(item_id);
    }
	
	@Override
	public P0404_BOMDTO getOneBOM(String bom_id) {
		return bomMapperDAO.selectOneBOM(bom_id);
	}
	
	@Override
	public int editBOM(P0404_BOMDTO dto) {
		return bomMapperDAO.updateBOM(dto);
	}
	
//	@Override
//	public int removeBOM(String bom_id) {
//		return bomMapperDAO.deleteBOM(bom_id);
//	}
	
	@Override
	public int removeBOMs(List<String> bomIds) {
		return bomMapperDAO.deleteBOMs(bomIds);
	}
	
	@Override
	public int addBOM(List<P0404_BOMDTO> bomList) {
	    int insertedCount = 0;
	    for (P0404_BOMDTO dto : bomList) {
	        insertedCount += bomMapperDAO.insertBOM(dto);
	    }
	    return insertedCount;
	}
	
	@Override
	public List<P0404_BOMDTO> bomLists() {
		return bomMapperDAO.selectOneBOMItemM();
	}
	
	@Override
	public List<P0404_BOMDTO> proLists() {
		return bomMapperDAO.selectBOMPro();
	}
	
	@Override
	public boolean processBomUpdates(Map<String, Object> payload) {
		
		// Map 형태 그대로 받아서 DAO 처리
		List<Map<String, Object>> newBOMs = (List<Map<String, Object>>) payload.get("newBOMs");
		List<Map<String, Object>> updatedBOMs = (List<Map<String, Object>>) payload.get("updatedBOMs");
		List<String> deletedBOMs = (List<String>) payload.get("deletedBOMs");

		boolean success = true;
		int totalAffectedRows = 0;
		
		// 삭제 처리
		if (deletedBOMs != null && !deletedBOMs.isEmpty()) {
			// BOM ID 기준 삭제 DAO 호출
			totalAffectedRows += bomMapperDAO.deleteBOMByIds(deletedBOMs);
		}

		// 수정 처리
		if (updatedBOMs != null && !updatedBOMs.isEmpty()) {
			for (Map<String, Object> bom : updatedBOMs) {
				// Map을 DTO로 변환하여 사용하거나, DAO에 Map을 직접 전달
				totalAffectedRows += bomMapperDAO.updateBOMByMap(bom);
			}
		}

		// 등록 처리
		if (newBOMs != null && !newBOMs.isEmpty()) {
			for (Map<String, Object> bom : newBOMs) {
				totalAffectedRows += bomMapperDAO.insertBOMByMap(bom);
			}
		}
		
		// 모든 작업이 성공적으로 수행되었다고 가정하고, 부분적인 실패 처리는 JS로 넘김
		return success; 
	}

	
}
