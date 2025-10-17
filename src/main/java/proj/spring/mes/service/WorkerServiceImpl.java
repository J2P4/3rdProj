package proj.spring.mes.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.WorkerMapperDAO;
import proj.spring.mes.dto.DeptDTO;
import proj.spring.mes.dto.PwDTO;
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

    
    @Override
    public void changePassword(String worker_id, PwDTO dto) {
        if (worker_id == null || worker_id.trim().isEmpty())
            throw new IllegalArgumentException("세션이 만료되었습니다. 다시 로그인해주세요.");
        if (dto == null) throw new IllegalArgumentException("요청이 올바르지 않습니다.");

    }

    
    // 암호화
    @Override
    public int updatePassword(String worker_id, String rawPw) {
    	// 여기서 암호화 해시처리
        String new_pw = encoder.encode(rawPw);  
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("worker_id", worker_id);
        param.put("new_pw", new_pw);

        return workerMapperDao.updatePassword(param);
    }
    
    @Override
    public boolean match(String rawPw, String hashed) {
        return encoder.matches(rawPw, hashed);
    }
	
    
    // 신규: 페이징 전용 목록
    @Override
    public List<WorkerDTO> list(int page, int pagePerRows, WorkerDTO searchFilter) {
        int size = Math.max(1, Math.min(pagePerRows, 100));
        int p = Math.max(1, page);
        int offset = (p - 1) * size;

        // Mapper는 LIMIT/OFFSET 받는 메서드가 필요함
        return workerMapperDao.selectWorkerListPage(size, offset, searchFilter);
    }

    //  총 레코드 수
    @Override
    public long count(WorkerDTO searchFilter) {
        return workerMapperDao.selectWorkerCount(searchFilter);
    }

    /** DB 플래그 조회: PW_MUST_CHANGE == 1 이면 true */
    @Override
    public boolean isPwMustChange(String worker_id) {
        Integer val = workerMapperDao.isPwMustChange(worker_id); // null 안전
        return val != null && val.intValue() == 1;
    }

	@Override
	public int updateClearPw(String worker_id, String rawPw) {
    	// 여기서 암호화 해시처리
        String new_pw = encoder.encode(rawPw);  
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("worker_id", worker_id);
        param.put("new_pw", new_pw);

        return workerMapperDao.updateClearPw(param);
		
	}
    
}
