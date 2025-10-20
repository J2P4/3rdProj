package proj.spring.mes.security;

import java.util.Arrays;
import java.util.List;

public class PasswordPolicy {

	private PasswordPolicy() {}	// 생성자 호출방지

    // 길이
    public static final int MIN_LEN = 8;
    public static final int MAX_LEN = 20;

    // 허용 특수문자
    public static final String SPECIAL_SET = "!@#$%^&*()_+=-";

    // 영문 + 숫자 + 특수문자(최소 1개씩) + 길이
    public static final String BASE_REGEX =
        "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+=-]).{" + MIN_LEN + "," + MAX_LEN + "}$";

    // 동일 문자 3회 이상 반복 금지
    public static final String REPEAT_3_REGEX = ".*(.)\\1\\1.*";
	
    // 추가 금지어(대소문자 무시, 포함 금지)
    // - 필요 시 여기에 단어를 추가/삭제만 하면 전체 정책에 반영됨
    public static final List<String> BANNED_WORDS = Arrays.asList(
        "j2p4", "admin", "password"
    );
}
