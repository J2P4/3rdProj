package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.P0601_InInsDTO;
import proj.spring.mes.dto.WorkerDTO;

public interface P0601_InInsService {

	public List<P0601_InInsDTO> inInsList(P0601_InInsDTO searchCondition);
	public P0601_InInsDTO getOneInIns(String inspection_result_id);
	public int editInIns(P0601_InInsDTO dto);
//	public int removeInIns(String inspection_result_id);
	public int removeInIns(List<String> inInsIds);
	public int addInIns(P0601_InInsDTO dto);
	public List<P0601_InInsDTO> workerNameList();
	public List<P0601_InInsDTO> stockList();
	
	// 페이징
	List<P0601_InInsDTO> list(int page, int pagePerRows, P0601_InInsDTO searchFilter);
	long count(P0601_InInsDTO searchFilter);
}
