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

    
    @Override
    public void changePassword(String worker_id, PwDTO dto) {
        if (worker_id == null || worker_id.trim().isEmpty())
            throw new IllegalArgumentException("세션이 만료되었습니다. 다시 로그인해주세요.");
        if (dto == null) throw new IllegalArgumentException("요청이 올바르지 않습니다.");

        final String currentPw = nvl(dto.getCurrent_pw());
        final String newPw     = nvl(dto.getNew_pw());
        final String confirmPw = nvl(dto.getConfirm_pw());

        // 1) 현재 비밀번호 해시 조회
        String currentHash = workerMapperDao.selectWorkerPw(worker_id);
        if (currentHash == null) throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");

        // 2) 현재 비밀번호 일치
        if (!encoder.matches(currentPw, currentHash))
            throw new IllegalArgumentException("현재 비밀번호가 올바르지 않습니다.");

        // 3) 간단 정책 (쉬운방법 선호: 8~20, 영문+숫자, 공백금지)
        if (newPw.length() < 8 || newPw.length() > 20)
            throw new IllegalArgumentException("비밀번호는 8~20자여야 합니다.");
        if (!newPw.matches(".*[A-Za-z].*") || !newPw.matches(".*\\d.*"))
            throw new IllegalArgumentException("비밀번호는 영문과 숫자를 모두 포함해야 합니다.");
        if (newPw.contains(" "))
            throw new IllegalArgumentException("비밀번호에는 공백을 사용할 수 없습니다.");

        // 4) 새 비밀번호 확인 일치
        if (!newPw.equals(confirmPw))
            throw new IllegalArgumentException("새 비밀번호와 확인이 일치하지 않습니다.");

        // 5) 기존 비밀번호와 동일 금지
        if (encoder.matches(newPw, currentHash))
            throw new IllegalArgumentException("이전 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.");

        // 6) 해시 후 업데이트
        String newHash = encoder.encode(newPw);
        int updated = workerMapperDao.updatePassword(worker_id, newHash);
        if (updated != 1) throw new IllegalStateException("비밀번호 변경 중 오류가 발생했습니다.");
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
    
    // 화면에서 현재 비번 확인만 필요할 때
    public boolean verifyCurrentPw(String worker_id, String rawCurrentPw) {
    	String currentHash = workerMapperDao.selectWorkerPw(worker_id);
    	return currentHash != null && encoder.matches(nvl(rawCurrentPw), currentHash);
    }
    
    // null 방지
    public class StringUtil {
        public static String nvl(String s) {
            return s == null ? "" : s.trim();
        }
    }
}
