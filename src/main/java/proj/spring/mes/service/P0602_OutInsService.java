package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.P0602_OutInsDTO;
import proj.spring.mes.dto.WorkerDTO;

public interface P0602_OutInsService {

	public List<P0602_OutInsDTO> outInsList(P0602_OutInsDTO searchCondition);
	public P0602_OutInsDTO getOneOutIns(String inspection_result_id);
	public int editOutIns(P0602_OutInsDTO dto);
//	public int removeOutIns(String inspection_result_id);
	public int removeOutIns(List<String> outInsIds);
	public int addOutIns(P0602_OutInsDTO dto);
	public List<WorkerDTO> workerNameList();
	
}
