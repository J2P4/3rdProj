package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.WorkerDTO;

public interface WorkerService {

    // CRUD
    List<WorkerDTO> list();
    WorkerDTO get(String workerId);
    int add(WorkerDTO dto);
    int edit(WorkerDTO dto);
    int remove(String workerId);
	
}
