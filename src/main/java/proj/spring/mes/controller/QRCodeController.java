package proj.spring.mes.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Qr_test.QRCodeGenerator;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@RestController
public class QRCodeController {

    private final QRCodeGenerator qrCodeGenerator = new QRCodeGenerator();

    // 허용할 호스트 목록 — 필요한 호스트만 넣어 보안 강화
    private static final Set<String> ALLOWED_HOSTS =
            Collections.unmodifiableSet(new HashSet<String>(Arrays.asList("118.34.45.10", "localhost", "127.0.0.1")));

    @GetMapping(value = "/qr", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> qrCode(
            @RequestParam(required = false) String url,
            @RequestParam(required = false) String urlBase64,
            HttpServletRequest req) throws Exception {

        String target = null;

        // 1) 우선 urlBase64 파라가 있으면 그걸 디코드 (클라이언트가 Base64로 보낸 경우)
        if (urlBase64 != null && !urlBase64.isBlank()) {
            // urlBase64는 클라이언트가 URL-encode 했을 수 있으니 먼저 URL디코드
            String b64 = URLDecoder.decode(urlBase64, StandardCharsets.UTF_8.name());
            byte[] decoded = Base64.getDecoder().decode(b64);
            target = new String(decoded, StandardCharsets.UTF_8);
        }

        // 2) 다음으로 일반 url 파라: 하지만 브라우저가 &로 잘라버리는 경우가 있으니
        //    queryString에서 'url=' 이후 전체를 잘라 재조립한다.
        if (target == null) {
            String qs = req.getQueryString(); // ex: "url=http://118.34.45.10:8080/mes/itemlist?page=1&itemNo=..."
            if (qs != null) {
                int idx = qs.indexOf("url=");
                if (idx >= 0) {
                    String after = qs.substring(idx + 4); // url= 뒤 전체
                    // 필요하면 양끝의 <> 제거
                    if (after.startsWith("<") && after.endsWith(">") && after.length() > 1) {
                        after = after.substring(1, after.length() - 1);
                    }
                    // URL이 URL-encoded 되어있다면 디코드, 아니면 그대로 반환
                    String decoded = URLDecoder.decode(after, StandardCharsets.UTF_8.name());
                    target = decoded;
                }
            }
        }

        if (target == null || target.isBlank()) {
            throw new IllegalArgumentException("Missing url parameter");
        }

        // 기본 검증: http/https 만 허용
        if (!(target.startsWith("http://") || target.startsWith("https://"))) {
            throw new IllegalArgumentException("Only http/https URLs allowed");
        }

        // 호스트 허용 체크 (선택적, 보안을 위해 권장)
        try {
            URL parsed = new URL(target);
            String host = parsed.getHost();
            if (!ALLOWED_HOSTS.contains(host)) {
                throw new IllegalArgumentException("Host not allowed: " + host);
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid URL: " + target);
        }

        // QR 생성 및 응답
        BufferedImage qrImage = qrCodeGenerator.generateQrCodeBufferedImage(target, 300, 300);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(qrImage, "PNG", baos);
        byte[] bytes = baos.toByteArray();

        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(bytes);
    }
}
