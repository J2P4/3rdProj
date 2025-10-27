package Qr_test;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;

public class QRCodeGenerator {

    public void generateQrCodeImage(String text, int width, int height, String filePath) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
        
        // BufferedImage로 변환
        BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix);

        // 파일로 저장
        File outputfile = new File(filePath);
        ImageIO.write(image, "PNG", outputfile); // PNG 형식으로 저장 (JPG도 가능)
    }

    // Spring Controller에서 이 메서드를 호출하여 QR코드 이미지 파일을 생성하고 응답합니다.
    public BufferedImage generateQrCodeBufferedImage(String text, int width, int height) throws Exception {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
        return MatrixToImageWriter.toBufferedImage(bitMatrix);
    }
}
