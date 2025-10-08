package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.P0601_InInsDTO;
import proj.spring.mes.dto.WorkerDTO;

public interface P0601_InInsService {

	public List<P0601_InInsDTO> inInsList();
	public P0601_InInsDTO getOneInIns(String inspection_result_id);
	public int editInIns(P0601_InInsDTO dto);
	public int removeInIns(P0601_InInsDTO dto);
	public int addInIns(P0601_InInsDTO dto);
	public List<WorkerDTO> workerNameList();
	
}
