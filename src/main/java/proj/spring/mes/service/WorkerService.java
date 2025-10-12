package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.DeptDTO;
import proj.spring.mes.dto.ItemDTO;
import proj.spring.mes.dto.WorkerDTO;

public interface WorkerService {

    // CRUD
    List<WorkerDTO> list();
    List<DeptDTO> deptList();
    WorkerDTO get(String worker_id);
    int add(WorkerDTO dto);
    int edit(WorkerDTO dto);
    int remove(String worker_id);
    int updatePassword(String workerId, String rawPw); // 해시 저장용
	boolean match(String rawPw, String hashed);
	
	//페이징 목록
    List<WorkerDTO> list(int page, int pagePerRows);

    //총 레코드 수
    long count();
}
