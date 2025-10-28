package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.DataDTO;

public interface DataService {

	List<DataDTO> getDataById(int id);
	List<Integer> getDistinctIds();
}
