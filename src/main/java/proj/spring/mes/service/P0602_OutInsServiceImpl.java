package proj.spring.mes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.P0602_OutInsMapperDAO;
import proj.spring.mes.dto.P0601_InInsDTO;
import proj.spring.mes.dto.P0602_OutInsDTO;
import proj.spring.mes.dto.WorkerDTO;

@Service
public class P0602_OutInsServiceImpl implements P0602_OutInsService {

	@Autowired
	P0602_OutInsMapperDAO outInsMapperDAO;
	
	@Override
	public List<P0602_OutInsDTO> outInsList(P0602_OutInsDTO searchCondition) {
		return outInsMapperDAO.selectOutIns(searchCondition);
	}
	
	@Override
	public P0602_OutInsDTO getOneOutIns(String inspection_result_id) {
		return outInsMapperDAO.selectOneOutIns(inspection_result_id);
	}
	
	@Override
	public int editOutIns(P0602_OutInsDTO dto) {
		return outInsMapperDAO.updateOutIns(dto);
	}
	
	@Override
	public int removeOutIns(List<String> outInsIds) {
		return outInsMapperDAO.deleteOutIns(outInsIds);
	}
	
	@Override
	public int addOutIns(P0602_OutInsDTO dto) {
		return outInsMapperDAO.insertOutIns(dto);
	}
	
	@Override
	public List<P0602_OutInsDTO> workerNameList() {
		return outInsMapperDAO.selectWorkerName();
	}
	
	@Override
	public List<P0602_OutInsDTO> stockList() {
		return outInsMapperDAO.selectStock();
	}
	
	// 페이징
	@Override
	public List<P0602_OutInsDTO> list(int page, int pagePerRows, P0602_OutInsDTO searchFilter) {
        int size = Math.max(1, Math.min(pagePerRows, 100));
        int p = Math.max(1, page);
        int offset = (p - 1) * size;
        
        System.out.println(size);
        System.out.println(p);
        System.out.println(offset);
        
        return outInsMapperDAO.selectOutInsPage(size, offset, searchFilter);		
	}
	
	@Override
	public long count(P0602_OutInsDTO searchFilter) {
		return outInsMapperDAO.selectOutInsCount(searchFilter);
	}
	
}
