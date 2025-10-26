package proj.spring.mes.service;

import java.util.List;
import java.util.Map;
import proj.spring.mes.dto.P07_BoardDTO;

public interface P07_BoardService {
    List<P07_BoardDTO> findList(Map<String,Object> p);
    int count(Map<String,Object> p);
    P07_BoardDTO findById(String id);
    int add(P07_BoardDTO dto);
    int modify(P07_BoardDTO dto);
    int remove(String id);
}
