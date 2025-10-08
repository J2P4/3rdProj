package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.P0404_BOMDTO;
import proj.spring.mes.dto.P0603_ErrorDTO;

public interface P0603_ErrorService {
	
	public List<P0603_ErrorDTO> errorList();
	public P0603_ErrorDTO getOneStock(String defect_id);
	public int editStock(P0603_ErrorDTO dto);
	public int removeStock(P0603_ErrorDTO dto);
	public int addStock(P0603_ErrorDTO dto);
	
}
