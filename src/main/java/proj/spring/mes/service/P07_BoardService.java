package proj.spring.mes.service;

import java.util.Map;

import proj.spring.mes.dto.P07_BoardDTO;

public interface P07_BoardService {

    /**
     * 게시글 목록 + 전체 개수 반환
     * 반환 Map 예시:
     *  - "list": List<P07_BoardDTO>
     *  - "totalCount": Integer
     *  - "page": Integer
     *  - "size": Integer
     *  - "keyword": String
     */
    Map<String, Object> findList(int page, int size, String keyword);

     P07_BoardDTO findById(Long id);

     String create(P07_BoardDTO dto);

     boolean update(P07_BoardDTO dto);

     boolean delete(Long id);
}
