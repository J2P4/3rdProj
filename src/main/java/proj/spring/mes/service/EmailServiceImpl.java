package proj.spring.mes.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import proj.spring.mes.dto.WorkerDTO;

@Service
public class EmailServiceImpl implements EmailService {

	@Autowired
    private JavaMailSender mailSender;

	// KST/포맷터 정의 
    private static final ZoneId KST = ZoneId.of("Asia/Seoul");
    private static final DateTimeFormatter TS = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
	
    @Override
    public void sendTempPassword(String to, String worker_id, String tempPw) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("[J2P4 MES] 임시 비밀번호 안내 (" + worker_id + ")");
            helper.setText(buildHtml(worker_id, tempPw), true);
            helper.setFrom("a0420ra@gmail.com", "J2P4 MES 관리자");
            
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("메일 발송 실패: " + e.getMessage(), e);
        }
    }

    /**
     * HTML 본문 구성
     */
    private String buildHtml(String worker_id, String tempPw) {
        return ""
        + "<div style='font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Apple SD Gothic Neo,Noto Sans KR,Malgun Gothic,Arial,sans-serif;"
        + "background:#f6f7fb;padding:24px;'>"
        + " <div style='max-width:520px;margin:0 auto;background:#fff;border:1px solid #eceefa;border-radius:14px;"
        + " box-shadow:0 12px 28px rgba(0,0,0,.06);overflow:hidden'>"
        + "  <div style='padding:16px 18px;border-bottom:1px solid #eceefa;display:flex;align-items:center;gap:10px'>"
        + "   <span style='display:inline-block;width:18px;height:18px;background:#6366f1;border-radius:50%'></span>"
        + "   <h1 style='font-size:16px;margin:0;color:#111'>임시 비밀번호 발급</h1>"
        + "  </div>"
        + "  <div style='padding:20px 18px 18px'>"
        + "   <div style='margin:8px 0;color:#666;font-size:13px'>아이디(사원번호): <strong style='color:#333; font-size:16px'>" + worker_id + "</strong></div>"
        + "   <div style='display:inline-flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;background:#111;color:#fff;"
        + "        font-weight:700;letter-spacing:.4px;font-size:16px;margin:10px 0 6px'>" + tempPw + "</div>"
        + "   <div style='margin-top:10px;font-size:12px;color:#777;line-height:1.7'>"
        + "     • 로그인 후 반드시 <span style='background:#f0f1fb;padding:2px 6px;border-radius:6px'>비밀번호 변경</span>을 진행해 주세요.<br>"
        + "     • 이 메일은 자동 발송되었습니다."
        + "   </div>"
        + "  </div>"
        + " </div>"
        + "</div>";
    }
	
    
    
    
    @Override
    public void sendPwChangedMail(WorkerDTO worker) {
        if (worker == null) return;
        String to = worker.getWorker_email();
        if (to == null || to.trim().isEmpty()) return;

        String when = LocalDateTime.now(KST).format(TS);
        String subject = "[J2P4 MES] 비밀번호 변경 안내";

        String plain =
            "J2P4 MES 보안 알림\n\n" +
            "회원님의 비밀번호가 " + when + " 에 정상적으로 변경되었습니다.\n" +
            "사번: " + safe(worker.getWorker_id()) + "\n" +
            "본인이 변경한 것이 아니라면 즉시 비밀번호를 재설정하고 관리자에게 문의해주세요.\n\n" +
            "감사합니다.\n J2P4 MES 보안관리팀";

        String html = buildPwChangedHtml(
        	    "J2P4 MES",      // 브랜드명
        	    "#2563eb",       // 브랜드 색상
        	    safe(worker.getWorker_id()),
        	    when
        	);

        	try {
        	    MimeMessage msg = mailSender.createMimeMessage();
        	    MimeMessageHelper h = new MimeMessageHelper(msg, true, "UTF-8");
        	    h.setTo(to);
        	    h.setSubject("[J2P4 MES] 비밀번호 변경 안내");
        	    h.setFrom(mailSenderUsername(), "J2P4 MES 관리자");
        	    h.setText(plain, html);
        	    mailSender.send(msg);
        	} catch (Exception e) {
        	    e.printStackTrace();
        	}
    }

    private String buildPwChangedHtml(String appName, String brandHex,
                                      String workerId, String changedAtKst) {
        // 자리표시자 %1~%4만 사용
        return String.format(
            "<!DOCTYPE html>"
          + "<html lang='ko'>"
          + "<head>"
          + "  <meta charset='UTF-8'>"
          + "  <meta name='viewport' content='width=device-width,initial-scale=1'>"
          + "  <title>비밀번호 변경 안내</title>"
          + "  <style>"
          + "    body{margin:0;padding:0;background:#f6f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,'Apple SD Gothic Neo','Noto Sans KR','맑은 고딕',sans-serif;color:#111;}"
          + "    .wrap{padding:24px 12px;}"
          + "    .card{max-width:560px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;"
          + "      box-shadow:0 6px 24px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.06);overflow:hidden;padding:20px 18px;}"
          + "    h1{font-size:18px;margin:0 0 12px 0;}"
          + "    .meta{font-size:13px;color:#111;border:1px solid #e5e7eb;border-radius:10px;padding:12px 14px;line-height:1.7;}"
          + "    .btn{background:%2$s;color:#fff;padding:10px 16px;border-radius:10px;font-weight:600;text-decoration:none;display:inline-block;}"
          + "  </style>"
          + "</head>"
          + "<body>"
          + "  <div class='wrap'>"
          + "    <div class='card'>"
          + "      <h1>%1$s 비밀번호 변경 알림</h1>"
          + "      <div class='meta'>사번: %3$s<br>변경 일시: %4$s </div>"
          + "      <p style='font-size:13px;color:#374151;margin-top:14px;'>"
          + "        본인이 요청하지 않은 변경이라면 즉시 관리자에게 연락해 주세요."
          + "      </p>"
          + "    </div>"
          + "  </div>"
          + "</body>"
          + "</html>",
          appName, brandHex, workerId, changedAtKst
        );
    }

    /* ====================== 유틸 ====================== */
    private String mailSenderUsername() {
        try {
            return (String) mailSender.getClass()
                    .getMethod("getUsername")
                    .invoke(mailSender);
        } catch (Exception ignore) {
            return "noreply@example.com";
        }
    }

    private static String safe(String s) {
        return (s == null) ? "" : s;
    } 
    
}
