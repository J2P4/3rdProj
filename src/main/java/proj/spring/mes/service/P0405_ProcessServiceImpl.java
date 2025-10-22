package proj.spring.mes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import proj.spring.mes.dao.mapper.P0405_ProcessMapperDAO;
import proj.spring.mes.dto.P0405_ProcessDTO;

public class P0405_ProcessServiceImpl implements P0405_ProcessService {
	@Autowired
	P0405_ProcessMapperDAO ProcessMapperDAO;
	
	@Override
	public List<P0405_ProcessDTO> processList(P0405_ProcessDTO searchCondition) {
		return ProcessMapperDAO.selectProcess(searchCondition);
	}
	
	@Override
	public P0405_ProcessDTO getOneprocess(String Process_id) {
		return ProcessMapperDAO.selectOneProcess(Process_id);
	}
	
	@Override
	public List<P0405_ProcessDTO> processItem() {
		return ProcessMapperDAO.selectProcessItem();
	}
	
	@Override
	public int editprocess(P0405_ProcessDTO dto) {
		return ProcessMapperDAO.updateProcess(dto);
	}
	
//	@Override
//	public int removeProcess(String Process_id) {
//		return ProcessMapperDAO.deleteProcess(Process_id);
//	}
	
    @Override
	public int removeprocesss(List<String> ProcessIds) {
		return ProcessMapperDAO.deleteProcesss(ProcessIds);
	}
	
	@Override
	public int addprocess(P0405_ProcessDTO dto) {
		return ProcessMapperDAO.insertProcess(dto);
	}
	
	// 페이징
	@Override
	public List<P0405_ProcessDTO> list(int page, int pagePerRows, P0405_ProcessDTO searchFilter) {
        int size = Math.max(1, Math.min(pagePerRows, 100));
        int p = Math.max(1, page);
        int offset = (p - 1) * size;
        
        System.out.println(size);
        System.out.println(p);
        System.out.println(offset);
        
        return ProcessMapperDAO.selectprocessPage(size, offset, searchFilter);
	}
	
	@Override
	public long count(P0405_ProcessDTO searchFilter) {
		return ProcessMapperDAO.selectprocessCount(searchFilter);
	}
}
