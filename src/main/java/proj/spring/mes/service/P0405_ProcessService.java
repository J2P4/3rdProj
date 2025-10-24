package proj.spring.mes.service;

import java.util.List;
import javax.servlet.ServletContext;

import org.springframework.web.multipart.MultipartFile;

import proj.spring.mes.dto.P0405_ProcessDTO;

public interface P0405_ProcessService {

    // 기존
    List<P0405_ProcessDTO> processList(P0405_ProcessDTO searchCondition);
    List<P0405_ProcessDTO> processItem();
    P0405_ProcessDTO getOneprocess(String process_id);
    int editprocess(P0405_ProcessDTO dto);
    int removeprocesss(List<String> processIds);
    int addprocess(P0405_ProcessDTO dto);
    List<P0405_ProcessDTO> list(int page, int pagePerRows, P0405_ProcessDTO searchFilter);
    long count(P0405_ProcessDTO searchFilter);

    // 신규(멀티파트 등록 핵심)
    String createWithFile(MultipartFile file, P0405_ProcessDTO dto,
                          String webPath, String placeholder, ServletContext sc) throws Exception;

    // 수정 슬라이드에서 파일만 재업로드할 때 사용(파일명=공정ID)
    String saveImageForId(MultipartFile file, String processId,
                          String webPath, ServletContext sc) throws Exception;

    // 시퀀스로 ID 선발급이 필요할 때 노출(내부에서만 써도 됨)
    String nextProcessId();
}
