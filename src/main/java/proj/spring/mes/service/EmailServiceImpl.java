package proj.spring.mes.service;

import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

	@Autowired
    private JavaMailSender mailSender;

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
	
}
