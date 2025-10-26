package proj.spring.mes.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import proj.spring.mes.dao.mapper.p07_BoardMapperDAO;
import proj.spring.mes.dto.P07_BoardDTO;

// import org.springframework.beans.factory.annotation.Autowired;
// import proj.spring.mes.mapper.P07_BoardMapper; // MyBatis 사용 시
// import proj.spring.mes.dto.P07_BoardDTO;

@Service // ★ 이 애노테이션이 있어야 컨테이너가 빈으로 등록함
@Transactional(readOnly = true)
public class P07_BoardServiceImpl implements P07_BoardService {

    // (DB 연결 시 주석 해제)
     @Autowired
     private p07_BoardMapperDAO boardMapper;

    @Override
    public Map<String, Object> findList(int page, int size, String keyword) {
        // 페이지 보정
        if (page < 1) page = 1;
        if (size < 1) size = 10;

        // (DB 연결 시)
        // int offset = (page - 1) * size;
        // List<P07_BoardDTO> list = boardMapper.selectList(offset, size, keyword);
        // int total = boardMapper.count(keyword);

        // 임시값(애플리케이션 부팅용 더미)
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("page", page);
        result.put("size", size);
        result.put("keyword", keyword);
        result.put("totalCount", Integer.valueOf(0));
        result.put("list", Collections.emptyList());
        return result;
    }

     @Override
     public P07_BoardDTO findById(Long id) {
         return boardMapper.selectById(id);
     }

     @Override
     @Transactional
     public String create(P07_BoardDTO dto) {
         boardMapper.insert(dto);
         return dto.getBoard_id(); 
     }

     @Override
     @Transactional
     public boolean update(P07_BoardDTO dto) {
         return boardMapper.update(dto) == 1;
     }

     @Override
     @Transactional
     public boolean delete(Long id) {
         return boardMapper.delete(id) == 1;
     }
}
