package proj.spring.mes.service;

public interface EmailService {

	/**
     * 임시 비밀번호 메일 발송
     * 
     * @param to 수신자 이메일
     * @param worker_id 사번
     * @param tempPw 임시 비밀번호 (평문)
     */
    void sendTempPassword(String to, String worker_id, String tempPw);
	
}
