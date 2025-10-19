package proj.spring.mes.dao.mapper;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import proj.spring.mes.dto.DeptDTO;
import proj.spring.mes.dto.WorkerDTO;

@Mapper
public interface WorkerMapperDAO {

	// CRUD
    List<WorkerDTO> selectWorker();                 // 전체 조회
    List<DeptDTO> selectDept();                 	// 부서 조회
    WorkerDTO selectOneWorker(String worker_id);    // 하나만 조회
    int insertWorker(WorkerDTO dto);                // 등록
    int updateWorker(WorkerDTO dto);                // 수정
    int deleteWorkers(@Param("worker_ids") List<String> worker_ids);
	
    DeptDTO selectDeptName(String department_id);
    
	// 신규(페이징) 및 필터
    List<WorkerDTO> selectWorkerListPage(@Param("limit") int limit, @Param("offset") int offset, @Param("filter") WorkerDTO searchFilter);
	// 신규(총계)
    long selectWorkerCount(@Param("filter") WorkerDTO searchFilter);

    // 비밀번호 변경
    String selectWorkerPw(@Param("worker_id") String worker_id);

    // 비밀번호 해시로 교체 
    int updatePassword(Map<String, Object> param);
    
    Integer isPwMustChange(@Param("worker_id") String worker_id);
    
    int updateClearPw(Map<String, Object> param);
    
    // 최근 N개 비번 해시 조회
    List<String> selectRecentPwHashes(@Param("worker_id") String worker_id, @Param("limit") int limit);
    // 이력 삽입
    int insertPwHistory(@Param("worker_id") String worker_id, @Param("pw_hash") String pw_hash);

    int updateClearPwWithExpiry(@Param("worker_id") String worker_id, @Param("new_pw") String new_pw, @Param("expires_at") java.util.Date expires_at);
	int updateTempPw(@Param("worker_id") String worker_id, @Param("new_pw") String new_pw, @Param("expires_at") java.util.Date expires_at);
	Map<String, Object> selectPwState(@Param("worker_id") String worker_id);
	
	// 유효기간 만료
	void updatePwExpiry(String worker_id, Timestamp timestamp);

    
}
