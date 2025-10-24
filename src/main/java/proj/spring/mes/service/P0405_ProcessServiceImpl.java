package proj.spring.mes.service;

import java.io.File;
import java.util.List;

import javax.servlet.ServletContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import proj.spring.mes.dao.mapper.P0405_ProcessMapperDAO;
import proj.spring.mes.dto.P0405_ProcessDTO;

@Service
public class P0405_ProcessServiceImpl implements P0405_ProcessService {

    @Autowired private P0405_ProcessMapperDAO mapper;

    @Override
    public List<P0405_ProcessDTO> processList(P0405_ProcessDTO searchCondition) {
        return mapper.selectProcess(searchCondition);
    }
    @Override
    public List<P0405_ProcessDTO> processItem() {
        return mapper.selectProcessItem();
    }
    @Override
    public P0405_ProcessDTO getOneprocess(String process_id) {
        return mapper.selectOneProcess(process_id);
    }
    @Override
    public int editprocess(P0405_ProcessDTO dto) {
        return mapper.updateProcess(dto);
    }
    @Override
    public int removeprocesss(List<String> processIds) {
        return mapper.deleteProcesss(processIds);
    }
    @Override
    public int addprocess(P0405_ProcessDTO dto) {
        return mapper.insertProcess(dto);
    }
    @Override
    public List<P0405_ProcessDTO> list(int page, int pagePerRows, P0405_ProcessDTO searchFilter){
        int limit = pagePerRows;
        int offset = (page-1) * pagePerRows;
        return mapper.selectprocessPage(offset, limit, searchFilter);
    }
    @Override
    public long count(P0405_ProcessDTO searchFilter){
        return mapper.selectprocessCount(searchFilter);
    }

    @Override
    public String nextProcessId() {
        return mapper.selectNextProcessId();
    }

    @Override
    @Transactional(rollbackFor=Exception.class)
    public String createWithFile(MultipartFile file, P0405_ProcessDTO dto,
                                 String webPath, String placeholder, ServletContext sc) throws Exception {

        // 1) 유일 ID 발급
        String id = mapper.selectNextProcessId();
        dto.setProcess_id(id);

        // 2) 파일 저장 (없으면 placeholder)
        String imgUrl = placeholder;
        if (file != null && !file.isEmpty()) {

            // 톰캣이 서비스하는 실제 경로(배포 디렉토리)
            String realDir = sc.getRealPath(webPath); // ex) .../wtpwebapps/mes/resources/img/04_5_process
            if (realDir == null) throw new IllegalStateException("real path null for " + webPath);

            File dir = new File(realDir);
            if (!dir.exists() && !dir.mkdirs()) {
                throw new IllegalStateException("mkdirs fail: " + realDir);
            }

            // 같은 ID의 기존 이미지들(확장자 상관없이) 정리
            deleteAllImageVariants(dir, id);

            String ext = guessExt(file);
            File savedFile = new File(dir, id + ext);
            file.transferTo(savedFile);

            // DB 저장용 URL (컨텍스트 미포함)
            imgUrl = webPath + "/" + id + ext;
        }

        dto.setProcess_img(imgUrl);
        mapper.insertProcess(dto);
        return id;
    }

    @Override
    public String saveImageForId(MultipartFile file, String processId,
                                 String webPath, ServletContext sc) throws Exception {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("empty file");
        if (processId == null || processId.trim().isEmpty()) throw new IllegalArgumentException("process_id required");

        String realDir = sc.getRealPath(webPath);
        if (realDir == null) throw new IllegalStateException("real path null for " + webPath);

        File dir = new File(realDir);
        if (!dir.exists() && !dir.mkdirs()) {
            throw new IllegalStateException("mkdirs fail: " + realDir);
        }

        // 확장자 변경 대비해 기존 파일 전부 삭제
        deleteAllImageVariants(dir, processId);

        String ext = guessExt(file);
        File saved = new File(dir, processId + ext);
        file.transferTo(saved);

        // DB에는 /resources/... 형태로 저장
        return webPath + "/" + processId + ext;
    }

    // ---- helpers ----
    private void deleteAllImageVariants(File dir, String processId) {
        String[] exts = new String[] { ".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp" };
        for (int i = 0; i < exts.length; i++) {
            File f = new File(dir, processId + exts[i]);
            if (f.exists()) {
                try {
                    if (!f.delete()) f.deleteOnExit();
                } catch (Exception ignore) {}
            }
        }
    }

    private String guessExt(MultipartFile f) {
        String ext = "";
        String original = f.getOriginalFilename();
        if (original != null && original.lastIndexOf('.') >= 0) {
            ext = original.substring(original.lastIndexOf('.')).toLowerCase();
        } else {
            String ct = f.getContentType();
            if ("image/jpeg".equalsIgnoreCase(ct)) ext = ".jpg";
            else if ("image/png".equalsIgnoreCase(ct)) ext = ".png";
            else if ("image/webp".equalsIgnoreCase(ct)) ext = ".webp";
            else if ("image/gif".equalsIgnoreCase(ct)) ext = ".gif";
            else if ("image/bmp".equalsIgnoreCase(ct)) ext = ".bmp";
            else ext = ".png";
        }
        return ext;
    }
}
