package proj.spring.mes.service;

import java.util.List;
import java.util.Map;

import proj.spring.mes.dto.P0404_BOMDTO;

public interface P0404_BOMService {

	public List<P0404_BOMDTO> bomList(P0404_BOMDTO searchCondition);
	public List<P0404_BOMDTO> itemList(P0404_BOMDTO searchCondition);
	public P0404_BOMDTO getOneBOM(String bom_id);
	List<P0404_BOMDTO> selectBOMByItem(String item_id);
	public List<P0404_BOMDTO> bomLists();
	public List<P0404_BOMDTO> proLists();
	public int editBOM(P0404_BOMDTO dto);
//	public int removeBOM(String bom_id);
	public int removeBOMs(List<String> bomIds);
	public int addBOM(List<P0404_BOMDTO> bomList);
	
	// bom 추가 삭제 수정 일괄 처리용
	boolean processBomUpdates(Map<String, Object> payload);
	
}
