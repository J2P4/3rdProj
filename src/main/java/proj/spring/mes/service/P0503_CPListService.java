package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.P0503_CPListDTO;

public interface P0503_CPListService {
	public List<P0503_CPListDTO> list(int page, int pagePerRows, P0503_CPListDTO searchFilter);
	public long count(P0503_CPListDTO searchFilter);
	
	public int removeCPLists(List<String> cpListIds);
}
