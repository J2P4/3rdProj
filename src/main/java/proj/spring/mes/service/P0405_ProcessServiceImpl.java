package proj.spring.mes.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import proj.spring.mes.dao.mapper.P0405_ProcessMapperDAO;
import proj.spring.mes.dto.P0405_ProcessDTO;

import java.util.Objects;

@Service
public class P0405_ProcessServiceImpl implements P0405_ProcessService {

    @Autowired private P0405_ProcessMapperDAO mapper;

    @Override public List<P0405_ProcessDTO> processList(P0405_ProcessDTO searchCondition){
    	return mapper.selectProcess(searchCondition); 
    	}
    
    @Override public List<P0405_ProcessDTO> processItem(){ 
    	return mapper.selectProcessItem(); 
    	}
    
    @Override public P0405_ProcessDTO getOneprocess(String process_id){
    	return mapper.selectOneProcess(process_id);
    	}
    
    @Override public int editprocess(P0405_ProcessDTO dto){ 
    	return mapper.updateProcess(dto); 
    	}
    
    @Override public int removeprocesss(List<String> processIds){ 
    	return mapper.deleteProcesss(processIds);
    	}
    
    @Override public int addprocess(P0405_ProcessDTO dto){
    	return mapper.insertProcess(dto);
    	}
    
    @Override public List<P0405_ProcessDTO> list(int page, int pagePerRows, P0405_ProcessDTO searchFilter){
        int limit = pagePerRows;
        int offset = (page-1) * pagePerRows;
        return mapper.selectprocessPage(offset, limit, searchFilter);
    }
    
    @Override public long count(P0405_ProcessDTO searchFilter){ return mapper.selectprocessCount(searchFilter); }

   
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
            String ext      = guessExt(file);
            String fileName = id + ext; // 파일명 = 공정ID


            List<String> targets = new ArrayList<String>();
            // (1) 배포된 웹앱의 실제 경로 (정적 서빙 가능)
            String realDeployed = safeRealPath(sc.getRealPath(webPath));
            if (realDeployed != null) targets.add(realDeployed);
            targets.add("D:/proj_v3/src/main/webapp/resources/img/04_5_process");


            boolean wroteAtLeastOnce = saveIntoTargets(file, targets, fileName);

            if (!wroteAtLeastOnce) {
                throw new IllegalStateException("이미지 저장 실패: 후보 경로들에 모두 쓰기 실패");
            }
            // DB에는 웹 접근 가능한 상대경로 저장
            imgUrl = unifySlash(webPath + "/" + fileName);
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

        String ext      = guessExt(file);
        String fileName = processId + ext;

        List<String> targets = new ArrayList<String>();
        String realDeployed = safeRealPath(sc.getRealPath(webPath));
        if (realDeployed != null) targets.add(realDeployed);
        targets.add("D:/proj_v3/src/main/webapp/resources/img/04_5_process");
        targets.add("C:/mes_upload/resources/img/04_5_process");

        boolean wroteAtLeastOnce = saveIntoTargets(file, targets, fileName);
        if (!wroteAtLeastOnce) {
            throw new IllegalStateException("이미지 저장 실패: 후보 경로들에 모두 쓰기 실패");
        }
        return unifySlash(webPath + "/" + fileName);
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

    private String unifySlash(String p) {
        return p == null ? null : p.replace("\\", "/");
    }

    private String safeRealPath(String p) {
        if (p == null) return null;
        // 일부 톰캣/IDE에서 getRealPath가 빈 문자열을 줄 수 있어 보정
        String norm = p.trim();
        return norm.isEmpty() ? null : norm;
    }

    /** 대상 경로들에 동일한 파일명으로 모두 저장. 하나라도 성공하면 true */
    private boolean saveIntoTargets(MultipartFile file, List<String> targets, String fileName) throws Exception {
        boolean ok = false;
        for (String root : targets) {
            if (root == null) continue;
            File dir = new File(root);
            if (!dir.exists() && !dir.mkdirs()) {
                // 디렉토리 못 만들면 다음 후보로
                continue;
            }
            File saved = new File(dir, fileName);
            try {
                file.transferTo(saved);
                ok = true; // 최소 한 곳 성공
            } catch (Exception e) {
                // 한 경로 실패해도 다른 경로 계속 시도
            }
        }
        return ok;
    }
}
