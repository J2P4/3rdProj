package proj.spring.mes.service;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import proj.spring.mes.dao.mapper.WorkerMapperDAO;

/**
 * 비밀번호 초기화(메일 없이, 새 페이지에 표시) 서비스 구현
 *
 * 흐름:
 *   1) workerId 유효성 검사
 *   2) 임시 비밀번호 생성 (대/소문자+숫자+특수 각 1자 이상, 길이 10)
 *   3) BCrypt 해시
 *   4) MyBatis로 DB 업데이트 (parameterType=map)
 *   5) 컨트롤러로 "평문 임시비번" 반환 → JSP 새 창에서 노출
 *
 * 주의:
 *   - 여기서는 이메일 발송을 하지 않음.
 *   - DAO 메서드는 Map 파라미터를 받도록 설계(다음 턴에 worker.xml 제공).
 */
@Service
public class PwResetServiceImpl implements PwResetService {

	private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
	
    @Autowired
    private WorkerMapperDAO workerMapperDAO;

    // 정책 상수 (필요하면 외부 설정으로 분리 가능)
    private static final int TEMP_LEN = 10;
    private static final boolean NEED_UPPER = true;
    private static final boolean NEED_LOWER = true;
    private static final boolean NEED_DIGIT = true;
//    private static final boolean NEED_SPECIAL = true;

    /**
     * 임시 비밀번호를 생성하여 DB에 저장하고, "평문 임시비번"을 반환한다.
     * Controller는 이 값을 JSP에 출력한다.
     *
     * @param workerId 사번(ID)
     * @return 평문 임시 비밀번호 (실패 시 null)
     */
    @Override
    @Transactional
    public String updateTempPw(String worker_id) {
        // 1) 유효성
        if (!StringUtils.hasText(worker_id)) {
            return null;
        }

        // 2) 임시 비밀번호 생성
        String tempPw = tempPassword(
                TEMP_LEN, NEED_UPPER, NEED_LOWER, NEED_DIGIT
//                , NEED_SPECIAL
        );

        // 3) 해시
        String new_pw = encoder.encode(tempPw);

        // 4) DB 업데이트 (MyBatis: parameterType="map")
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("worker_id", worker_id);
        param.put("new_pw", new_pw);
        // 최초 로그인 시 강제 변경 플래그를 쓰고 싶다면 여기에 함께 넣고 SQL에서 처리
         param.put("mustChangePw", 1);

        int updated = workerMapperDAO.updatePassword(param);
        if (updated != 1) {
            // 업데이트 실패 시 null 반환 (컨트롤러에서 에러 처리)
            return null;
        }

        // 5) 컨트롤러에서 새 페이지로 표시할 수 있게 "평문" 임시비번 반환
        return tempPw;
    }

    // ───────────── 임시 비밀번호 생성기 ─────────────
    /**
     * 간단 정책:
     *  - 길이 length
     *  - 대문자/소문자/숫자/특수문자 최소 1개 포함 (플래그별)
     *  - 동일 문자 3회 연속 금지
     *  - 공백 미허용
     */
    private String tempPassword(int length,
                                        boolean mustUpper,
                                        boolean mustLower,
                                        boolean mustDigit
//                                      , boolean mustSpecial
    ) {

        final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        final String LOWER = "abcdefghijklmnopqrstuvwxyz";
        final String DIGIT = "0123456789";
//        final String SPECIAL = "!@#$%^&*-_;:,.?";
        final String BASE = (mustUpper ? UPPER : "")
                          + (mustLower ? LOWER : "")
                          + (mustDigit ? DIGIT : "");
//                          + (mustSpecial ? SPECIAL : "");

        SecureRandom rnd = new SecureRandom();

        // 1) 필수군 각 1자 보장
        StringBuilder sb = new StringBuilder(length);
        if (mustUpper)   sb.append(UPPER.charAt(rnd.nextInt(UPPER.length())));
        if (mustLower)   sb.append(LOWER.charAt(rnd.nextInt(LOWER.length())));
        if (mustDigit)   sb.append(DIGIT.charAt(rnd.nextInt(DIGIT.length())));
//        if (mustSpecial) sb.append(SPECIAL.charAt(rnd.nextInt(SPECIAL.length())));

        // 2) 나머지 채우기
        while (sb.length() < length) {
            char c = BASE.charAt(rnd.nextInt(BASE.length()));
            if (c == ' ') continue; // 공백 방지
            int n = sb.length();
            // 동일 문자 3회 연속 금지
            if (n >= 2 && sb.charAt(n - 1) == c && sb.charAt(n - 2) == c) {
                continue;
            }
            sb.append(c);
        }

        // 3) 셔플 (앞쪽 필수문자 위치 랜덤화)
        char[] arr = sb.toString().toCharArray();
        for (int i = arr.length - 1; i > 0; i--) {
            int j = rnd.nextInt(i + 1);
            char t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }

        return new String(arr);
    }

}
