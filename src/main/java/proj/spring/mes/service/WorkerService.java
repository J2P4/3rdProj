package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.DeptDTO;
import proj.spring.mes.dto.WorkerDTO;

public interface WorkerService {

    // CRUD
    List<WorkerDTO> list();
    List<DeptDTO> deptList();
    WorkerDTO get(String worker_id);
    int add(WorkerDTO dto);
    int edit(WorkerDTO dto);
    int remove(String worker_id);
	
}
