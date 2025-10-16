package proj.spring.mes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.P0603_ErrorMapperDAO;
import proj.spring.mes.dto.P0603_ErrorDTO;

@Service
public class P0603_ErrorServiceImpl implements P0603_ErrorService {

	@Autowired
	P0603_ErrorMapperDAO errorMapperDAO;
	
	@Override
	public List<P0603_ErrorDTO> errorList(P0603_ErrorDTO searchCondition) {
		return errorMapperDAO.selectError(searchCondition);
	}
	
	@Override
	public P0603_ErrorDTO getOneError(String defect_id) {
		return errorMapperDAO.selectOneError(defect_id);
	}
	
	@Override
	public int editError(P0603_ErrorDTO dto) {
		return errorMapperDAO.updateError(dto);
	}
	
//	@Override
//	public int removeError(String defect_id) {
//		return errorMapperDAO.deleteError(defect_id);
//	}
	
	@Override
	public int removeErrors(List<String> defectIds) {
		return errorMapperDAO.deleteErrors(defectIds);
	}
	
	@Override
	public int addError(P0603_ErrorDTO dto) {
		return errorMapperDAO.insertError(dto);
	}	
	
}
