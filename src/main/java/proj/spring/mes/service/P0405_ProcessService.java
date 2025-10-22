package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.P0405_ProcessDTO;

public interface P0405_ProcessService {
	
	
	public List<P0405_ProcessDTO> processList(P0405_ProcessDTO searchCondition);
	public List<P0405_ProcessDTO> processItem();
	public P0405_ProcessDTO getOneprocess(String process_id);
	public int editprocess(P0405_ProcessDTO dto);
//	public int removeprocess(String process_id);
	public int removeprocesss(List<String> processIds);
	public int addprocess(P0405_ProcessDTO dto);
	
	// 페이징
	List<P0405_ProcessDTO> list(int page, int pagePerRows, P0405_ProcessDTO searchFilter);
	long count(P0405_ProcessDTO searchFilter);
	
	
}
