package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.P0404_BOMDTO;

public interface P0404_BOMService {

	public List<P0404_BOMDTO> bomList(P0404_BOMDTO searchCondition);
	public P0404_BOMDTO getOneBOM(String bom_id);
	public int editBOM(P0404_BOMDTO dto);
	public int removeBOM(String bom_id);
	public int addBOM(P0404_BOMDTO dto);
	
}
