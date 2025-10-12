package proj.spring.mes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.WorkerMapperDAO;
import proj.spring.mes.dto.DeptDTO;
import proj.spring.mes.dto.WorkerDTO;

@Service
public class WorkerServiceImpl implements WorkerService{
	
	private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
	
	@Autowired
	WorkerMapperDAO workerMapperDao;   // MapperDAO 인터페이스를 받아오기


	@Override
    public List<WorkerDTO> list() {
       return workerMapperDao.selectWorker();
    }

	@Override
	public List<DeptDTO> deptList() {
		return workerMapperDao.selectDept();
	}

    @Override
    public WorkerDTO get(String worker_id) {
        return workerMapperDao.selectOneWorker(worker_id);
    }

    @Override
    public int add(WorkerDTO dto) {
    	// 저장 직전에 반드시 해시
        if (dto.getWorker_pw() != null && !dto.getWorker_pw().isBlank()) {
            dto.setWorker_pw( encoder.encode(dto.getWorker_pw()) );
        }
        
        return workerMapperDao.insertWorker(dto);
    }

    @Override
    public int edit(WorkerDTO dto) {
        return workerMapperDao.updateWorker(dto);
    }

    @Override
    public int deleteWorkers(List<String> worker_ids) {
        if (worker_ids == null || worker_ids.isEmpty()) return 0;
        return workerMapperDao.deleteWorkers(worker_ids);
    }

    // 암호화
    @Override
    public int updatePassword(String worker_id, String rawPw) {
    	// 여기서 암호화 해시처리
        String hashed = encoder.encode(rawPw);  
        return workerMapperDao.updatePassword(worker_id, hashed);
    }
    
    @Override
    public boolean match(String rawPw, String hashed) {
        return encoder.matches(rawPw, hashed);
    }
	
    
    // 신규: 페이징 전용 목록
    @Override
    public List<WorkerDTO> list(int page, int pagePerRows) {
        int size = Math.max(1, Math.min(pagePerRows, 100));
        int p = Math.max(1, page);
        int offset = (p - 1) * size;

        // Mapper는 LIMIT/OFFSET 받는 메서드가 필요함
        return workerMapperDao.selectWorkerListPage(size, offset);
    }

    //  총 레코드 수
    @Override
    public long count() {
        return workerMapperDao.selectWorkerCount();
    }
}
