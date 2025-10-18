package proj.spring.mes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.P0601_InInsMapperDAO;
import proj.spring.mes.dto.P0601_InInsDTO;
import proj.spring.mes.dto.WorkerDTO;

@Service
public class P0601_InInsServiceImpl implements P0601_InInsService {

	@Autowired
	P0601_InInsMapperDAO inInsMapperDAO;
	
	@Override
	public List<P0601_InInsDTO> inInsList(P0601_InInsDTO searchCondition) {
		return inInsMapperDAO.selectInIns(searchCondition);
	}
	
	@Override
	public P0601_InInsDTO getOneInIns(String inspection_result_id) {
		return inInsMapperDAO.selectOneInIns(inspection_result_id);
	}
	
	@Override
	public int editInIns(P0601_InInsDTO dto) {
		return inInsMapperDAO.updateInIns(dto);
	}
	
//	@Override
//	public int removeInIns(String inspection_result_id) {
//		return inInsMapperDAO.deleteInIns(inspection_result_id);
//	}
	
	@Override
	public int removeInIns(List<String> inInsIds) {
		return inInsMapperDAO.deleteInIns(inInsIds);
	}
	
	@Override
	public int addInIns(P0601_InInsDTO dto) {
		return inInsMapperDAO.insertInIns(dto);
	}
	
	@Override
	public List<WorkerDTO> workerNameList() {
		return inInsMapperDAO.selectWorkerName();
	}
	
	// 페이징
	@Override
	public List<P0601_InInsDTO> list(int page, int pagePerRows, P0601_InInsDTO searchFilter) {
        int size = Math.max(1, Math.min(pagePerRows, 100));
        int p = Math.max(1, page);
        int offset = (p - 1) * size;
        
        System.out.println(size);
        System.out.println(p);
        System.out.println(offset);
        
        return inInsMapperDAO.selectInInsPage(size, offset, searchFilter);		
	}
	
	@Override
	public long count(P0601_InInsDTO searchFilter) {
		return inInsMapperDAO.selectInInsCount(searchFilter);
	}
	
}
