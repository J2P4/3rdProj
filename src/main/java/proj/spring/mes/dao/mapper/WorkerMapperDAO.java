package proj.spring.mes.dao.mapper;

import java.util.List;

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
    int deleteWorker(String worker_id);             // 삭제
	int updatePassword(@Param("worker_id") String worker_id, @Param("hashed") String hashed);
	
	// 신규(페이징)
    List<WorkerDTO> selectWorkerListPage(@Param("limit") int limit, @Param("offset") int offset);
	// 신규(총계)
    long selectWorkerCount();
}
