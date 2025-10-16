package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.P0404_BOMDTO;
import proj.spring.mes.dto.P0603_ErrorDTO;

public interface P0603_ErrorService {
	
	public List<P0603_ErrorDTO> errorList(P0603_ErrorDTO searchCondition);
	public P0603_ErrorDTO getOneError(String defect_id);
	public int editError(P0603_ErrorDTO dto);
//	public int removeError(String defect_id);
	public int removeErrors(List<String> defectIds);
	public int addError(P0603_ErrorDTO dto);
	
}
