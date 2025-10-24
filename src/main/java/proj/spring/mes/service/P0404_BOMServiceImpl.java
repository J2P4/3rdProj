package proj.spring.mes.service;

import java.util.List;

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
	public int addBOM(P0404_BOMDTO dto) {
		return bomMapperDAO.insertBOM(dto);
	}
	
	@Override
	public List<P0404_BOMDTO> bomLists() {
		return bomMapperDAO.selectOneBOMItemM();
	}
	
	@Override
	public List<P0404_BOMDTO> proLists() {
		return bomMapperDAO.selectBOMPro();
	}

	
}
