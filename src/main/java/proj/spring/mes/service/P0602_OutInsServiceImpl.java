package proj.spring.mes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.P0602_OutInsMapperDAO;
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
	public int removeOutIns(String inspection_result_id) {
		return outInsMapperDAO.deleteOutIns(inspection_result_id);
	}
	
	@Override
	public int addOutIns(P0602_OutInsDTO dto) {
		return outInsMapperDAO.insertOutIns(dto);
	}
	
	@Override
	public List<WorkerDTO> workerNameList() {
		return outInsMapperDAO.selectWorkerName();
	}
	
}
