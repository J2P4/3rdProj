package proj.spring.mes.service;

import java.io.File;

import javax.servlet.ServletContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import proj.spring.mes.dao.mapper.P0405_ProcessMapperDAO;
import proj.spring.mes.dto.P0405_ProcessDTO;

import java.util.List;

@Service
public class P0405_ProcessServiceImpl implements P0405_ProcessService {

    @Autowired private P0405_ProcessMapperDAO mapper;

    // ===== 기존 메서드들 =====
    @Override public List<P0405_ProcessDTO> processList(P0405_ProcessDTO searchCondition){ return mapper.selectProcess(searchCondition); }
    @Override public List<P0405_ProcessDTO> processItem(){ return mapper.selectProcessItem(); }
    @Override public P0405_ProcessDTO getOneprocess(String process_id){ return mapper.selectOneProcess(process_id); }
    @Override public int editprocess(P0405_ProcessDTO dto){ return mapper.updateProcess(dto); }
    @Override public int removeprocesss(List<String> processIds){ return mapper.deleteProcesss(processIds); }
    @Override public int addprocess(P0405_ProcessDTO dto){ return mapper.insertProcess(dto); }
    @Override public List<P0405_ProcessDTO> list(int page, int pagePerRows, P0405_ProcessDTO searchFilter){
        int limit = pagePerRows;
        int offset = (page-1) * pagePerRows;
        return mapper.selectprocessPage(offset, limit, searchFilter);
    }
    @Override public long count(P0405_ProcessDTO searchFilter){ return mapper.selectprocessCount(searchFilter); }

    // ===== 신규 =====
    @Override
    public String nextProcessId() {
        return mapper.selectNextProcessId();
    }

    @Override
    @Transactional(rollbackFor=Exception.class)
    public String createWithFile(MultipartFile file, P0405_ProcessDTO dto,
                                 String webPath, String placeholder, ServletContext sc) throws Exception {
        // 1) 유일 ID 발급 (동시성 안전: 시퀀스)
        String id = mapper.selectNextProcessId();
        dto.setProcess_id(id);

        // 2) 파일 저장 (있으면 ID로, 없으면 플레이스홀더)
        String imgUrl = placeholder;
        File saved = null;
        if (file != null && !file.isEmpty()) {
            String realDir = sc.getRealPath(webPath);
            if (realDir == null) throw new IllegalStateException("real path null for " + webPath);
            File dir = new File(realDir);
            if (!dir.exists() && !dir.mkdirs()) throw new IllegalStateException("mkdirs fail: " + realDir);

            String ext = guessExt(file);
            String fileName = id + ext; // 파일명 = 공정ID
            saved = new File(dir, fileName);
            try {
                file.transferTo(saved);
            } catch (Exception e) {
                // 저장 실패 → 트랜잭션 롤백 + 파일 정리
                if (saved.exists()) saved.delete();
                throw e;
            }
            imgUrl = webPath + "/" + fileName;
        }
        dto.setProcess_img(imgUrl);

        // 3) INSERT
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
        if (!dir.exists() && !dir.mkdirs()) throw new IllegalStateException("mkdirs fail: " + realDir);

        String ext = guessExt(file);
        String fileName = processId + ext;
        File saved = new File(dir, fileName);
        file.transferTo(saved);
        return webPath + "/" + fileName;
    }

    // ---- helpers ----
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
            else ext = ".png";
        }
        return ext;
    }
}
