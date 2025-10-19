package proj.spring.mes.service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
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
import proj.spring.mes.security.PasswordPolicy;
import proj.spring.mes.security.PwPolicyConfirm;

@Service
public class WorkerServiceImpl implements WorkerService{
	
	private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
	
	// 비밀번호 만료일. 현재 90일 세팅
	private static final int EXPIRY_DAYS = 90;
	
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
    public DeptDTO getDeptName(String department_id) {
        return workerMapperDao.selectDeptName(department_id);
    }
    
    
    @Override
    public void changePassword(String worker_id, PwDTO dto) {
    	if (worker_id == null || worker_id.trim().isEmpty())
            throw new IllegalArgumentException("세션이 만료되었습니다. 다시 로그인해주세요.");
        if (dto == null) throw new IllegalArgumentException("요청이 올바르지 않습니다.");

        final String currentPw = dto.getCurrent_pw();
        final String newPw     = dto.getNew_pw();
        final String confirm   = dto.getConfirm_pw();

        // 1) 새 비번 일치 확인
        if (newPw == null || confirm == null || !newPw.equals(confirm)) {
            throw new IllegalArgumentException("새 비밀번호가 일치하지 않습니다.");
        }

        // 2) 사용자 조회
        WorkerDTO user = get(worker_id);
        if (user == null) throw new IllegalArgumentException("사용자 정보를 찾을 수 없습니다.");

        // 3) 현재 비번 확인
        if (currentPw == null || !encoder.matches(currentPw, user.getWorker_pw())) {
            throw new IllegalArgumentException("현재 비밀번호가 올바르지 않습니다.");
        }

        if (encoder.matches(newPw, user.getWorker_pw())) {
            throw new IllegalArgumentException("현재 비밀번호와 동일한 비밀번호로는 변경할 수 없습니다.");
        }
        
        // 동일 비밀번호 금지
        if (encoder.matches(newPw, user.getWorker_pw()))
            throw new IllegalArgumentException("현재 비밀번호와 동일한 비밀번호로는 변경할 수 없습니다.");

        // 최근 N개 재사용 금지
        final int HISTORY_N = 3; // 필요 시 설정값으로 빼도 OK
        if (HISTORY_N > 0) {
            List<String> recentHashes = workerMapperDao.selectRecentPwHashes(worker_id, HISTORY_N);
            if (recentHashes != null) {
                for (String h : recentHashes) {
                    if (h != null && encoder.matches(newPw, h)) {
                        throw new IllegalArgumentException("최근 " + HISTORY_N + "개 내에 사용한 비밀번호는 다시 사용할 수 없습니다.");
                    }
                }
            }
        }
        
        // 사용자 생년월일을 다양한 형태로 금지어 리스트에 추가
        List<String> banned = new ArrayList<String>(PasswordPolicy.BANNED_WORDS);
        if (user.getWorker_birth() != null) {
            String birth = new SimpleDateFormat("yyyyMMdd").format(user.getWorker_birth()); // 19970421
            banned.add(birth);                         // 19970421
            banned.add(birth.substring(2));            // 970421
            banned.add(birth.substring(0, 4));         // 1997
            banned.add(birth.substring(4));            // 0421
        }

        // 정책 검사 (기본 + 금지어 전체)
        PwPolicyConfirm.checkAgainstUserInfoAll(
            newPw,
            worker_id,
            user.getWorker_name(),
            banned  // ← 생년월일 포함된 전체 금지어 리스트
        );

        // 해시 후 DB 저장
        String hashed = encoder.encode(newPw);
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("worker_id", worker_id);
        param.put("new_pw", hashed);
        
        // 만료일 계산
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, EXPIRY_DAYS);
        Date expiresAt = cal.getTime();

        // 만료일까지 같이 저장 
        int updated = workerMapperDao.updateClearPwWithExpiry(
            worker_id,
            hashed,
            new Timestamp(expiresAt.getTime())
        );
        if (updated != 1)
            throw new IllegalStateException("비밀번호 변경에 실패했습니다. (updated=" + updated + ")");


        // 이력 테이블에 새 해시 저장
        workerMapperDao.insertPwHistory(worker_id, hashed);
    }

    
    // 암호화
    @Override
    public int updatePassword(String worker_id, String rawPw) {
    	// 여기서 암호화 해시처리
    	String hash = encoder.encode(rawPw);

        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, EXPIRY_DAYS);
        Date expiresAt = cal.getTime();

        int updated = workerMapperDao.updateTempPw(
            worker_id, hash, new Timestamp(expiresAt.getTime())
        );
        if (updated == 1) {
            workerMapperDao.insertPwHistory(worker_id, hash);
        }
        return updated;
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
    
	// 로그인 만료/강제변경 판단
	public boolean mustChangeNow(String worker_id, String currentHashed) {
	    boolean must = false;
	    Map<String, Object> m = workerMapperDao.selectPwState(worker_id);
	    if (m != null) {
	        Object flag = m.get("must_change");
	        if (flag instanceof Number && ((Number)flag).intValue() == 1) must = true;
	        java.util.Date exp = (java.util.Date) m.get("expires_at");
	        if (exp != null && !new java.util.Date().before(exp)) must = true; // today >= exp
	    }
	    if (encoder.matches("j2p4mes", currentHashed)) must = true;
	    return must;
	}

	@Override
	public void extendPwExpiry(String worker_id, int days) {
	    Calendar cal = Calendar.getInstance();
	    cal.add(Calendar.DAY_OF_MONTH, days);
	    Date expiresAt = cal.getTime();
	    workerMapperDao.updatePwExpiry(worker_id, new Timestamp(expiresAt.getTime()));
	}

	
}
