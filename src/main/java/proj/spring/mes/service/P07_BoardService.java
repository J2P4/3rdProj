package proj.spring.mes.service;

import java.util.Map;

import proj.spring.mes.dto.P07_BoardDTO;

public interface P07_BoardService {


    Map<String, Object> findList(int page, int size, String keyword);

     P07_BoardDTO findById(String id);

     String create(P07_BoardDTO dto);

     boolean update(P07_BoardDTO dto);

     boolean delete(String id);
}
