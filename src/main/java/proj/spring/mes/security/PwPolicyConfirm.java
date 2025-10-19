package proj.spring.mes.security;

import java.util.Collection;
import java.util.regex.Pattern;

public class PwPolicyConfirm {

	private PwPolicyConfirm() {}

    private static final Pattern BASE    = Pattern.compile(PasswordPolicy.BASE_REGEX);
    private static final Pattern REPEAT3 = Pattern.compile(PasswordPolicy.REPEAT_3_REGEX);

    // 기본 정책 검사: 길이/조합/공백/반복
    public static void check(String newPw) {
        if (newPw == null || newPw.isEmpty()) {
            throw new IllegalArgumentException("비밀번호가 비어있습니다.");
        }
        // 공백 금지
        if (newPw.indexOf(' ') >= 0) {
            throw new IllegalArgumentException("비밀번호에 공백은 사용할 수 없습니다.");
        }
        // 기본 조합 + 길이
        if (!BASE.matcher(newPw).matches()) {
            throw new IllegalArgumentException(
                "영문+숫자+특수문자(" + PasswordPolicy.SPECIAL_SET + ") 포함, "
                + PasswordPolicy.MIN_LEN + "~" + PasswordPolicy.MAX_LEN + "자로 입력하세요."
            );
        }
        // 동일문자 3회 이상 반복 금지
        if (REPEAT3.matcher(newPw).matches()) {
            throw new IllegalArgumentException("동일 문자를 3회 이상 반복할 수 없습니다.");
        }
    }

    // 사용자 정보 포함 금지까지 함께 검사할 때 사용 (아이디/이름 등)
    public static void checkAgainstUserInfo(String newPw,
                                            String worker_id,
                                            String worker_name,
                                            String extraBan /* 생일 등 추가 금지어 필요 시 */) {
        check(newPw); // 기본 정책 선검사

        if (notEmpty(worker_id)   && containsIgnoreCase(newPw, worker_id)) {
            throw new IllegalArgumentException("비밀번호에 아이디(worker_id)를 포함할 수 없습니다.");
        }
        if (notEmpty(worker_name) && containsIgnoreCase(newPw, worker_name)) {
            throw new IllegalArgumentException("비밀번호에 이름을 포함할 수 없습니다.");
        }
        if (notEmpty(extraBan)    && containsIgnoreCase(newPw, extraBan)) {
            throw new IllegalArgumentException("비밀번호에 금지된 문자열이 포함되어 있습니다.");
        }

        // 초기 비밀번호 j2p4mes 재사용 금지(정책상 고정)
        if ("j2p4mes".equals(newPw)) {
            throw new IllegalArgumentException("초기 비밀번호와 다른 값으로 설정해주세요.");
        }
    }
    
    // 여러 금지어 한 번에 검사
    public static void checkAgainstUserInfoAll(String newPw,
                                               String worker_id,
                                               String worker_name,
                                               Collection<String> extraBans) {
        // 기본 + 아이디/이름 선검사 (extraBan은 일단 null)
        checkAgainstUserInfo(newPw, worker_id, worker_name, null);

        // 리스트가 있으면 하나씩 검사 (대소문자 무시)
        if (extraBans != null) {
            for (String word : extraBans) {
                if (notEmpty(word) && containsIgnoreCase(newPw, word)) {
                    throw new IllegalArgumentException("비밀번호에 금지된 문자열이 포함되어 있습니다.");
                }
            }
        }
    }

    // null 또는 길이 0이 아닌지(=의미 있는 값인지)
    private static boolean notEmpty(String s) { return s != null && !s.isEmpty(); }
    
    // 대소문자 무시 포함 검사
    private static boolean containsIgnoreCase(String text, String part) {
        return text.toLowerCase().contains(part.toLowerCase());
    }
	
}
