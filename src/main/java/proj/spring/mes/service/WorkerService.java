package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.DeptDTO;
import proj.spring.mes.dto.PwDTO;
import proj.spring.mes.dto.WorkerDTO;

public interface WorkerService {

    // CRUD
    List<WorkerDTO> list();
    List<DeptDTO> deptList();
    WorkerDTO get(String worker_id);
    int add(WorkerDTO dto);
    int edit(WorkerDTO dto);
    int deleteWorkers(List<String> ids);
    
    DeptDTO getDeptName(String department_id);	// 부서명 조회
    
    int updatePassword(String worker_id, String rawPw); // 해시 저장용
	boolean match(String rawPw, String hashed);
	
	//페이징 목록
    List<WorkerDTO> list(int page, int pagePerRows, WorkerDTO searchFilter);

    //총 레코드 수
    long count(WorkerDTO searchFilter);
    
    void changePassword(String worker_id, PwDTO dto);
    
    // DB 플래그 조회
    boolean isPwMustChange(String worker_id); 
    // 단순 해시 저장용
    int updateClearPw(String worker_id, String newPw);
    
    // 로그인 시 만료/강제변경 필요 여부 판단 (PW_MUST_CHANGE, PW_EXPIRES_AT, 초기비번 해시 일치 등)
    boolean mustChangeNow(String worker_id, String currentHashed);

    // 만료일 도달 후 나중에 변경 선택시
    void extendPwExpiry(String worker_id, int days);
    
    // 이메일 중복
	boolean emailExists(String worker_email);

}


