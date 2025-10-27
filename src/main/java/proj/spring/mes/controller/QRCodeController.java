package proj.spring.mes.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import Qr_test.QRCodeGenerator;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;

@Controller
public class QRCodeController {

    private final QRCodeGenerator qrCodeGenerator = new QRCodeGenerator();

    @GetMapping("/qr")
    public ResponseEntity<byte[]> qrCode(
            @RequestParam(defaultValue = "https://www.google.com") String url) throws Exception {

        int width = 200;
        int height = 200;

        BufferedImage qrImage = qrCodeGenerator.generateQrCodeBufferedImage(url, width, height);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(qrImage, "PNG", baos);

        byte[] bytes = baos.toByteArray();

        return ResponseEntity
                .ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(bytes);
    }
}
