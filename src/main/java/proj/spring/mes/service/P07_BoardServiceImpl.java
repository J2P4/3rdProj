package proj.spring.mes.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import proj.spring.mes.dao.mapper.p07_BoardMapperDAO;
import proj.spring.mes.dto.P07_BoardDTO;

@Service
@Transactional(readOnly = true)
public class P07_BoardServiceImpl implements P07_BoardService {

    @Autowired
    private p07_BoardMapperDAO boardMapper; // 설정 변경 없이 자동 주입(스캔 경로 일치)

    /** 목록 + 페이징 + 검색 */
    @Override
    public Map<String, Object> findList(int page, int size, String keyword) {
        if (page < 1) page = 1;
        if (size < 1) size = 10;

        int offset = (page - 1) * size;

        List<P07_BoardDTO> list = boardMapper.selectList(offset, size, keyword);
        int total = boardMapper.count(keyword);

        Map<String, Object> result = new HashMap<String, Object>();
        result.put("page", Integer.valueOf(page));
        result.put("size", Integer.valueOf(size));
        result.put("keyword", keyword);
        result.put("totalCount", Integer.valueOf(total));
        result.put("list", list);
        return result;
    }

    /** 상세 */
    @Override
    public P07_BoardDTO findById(String id) {
        return boardMapper.selectById(id);
    }

    /** 등록: XML의 <selectKey>가 문자 PK(B+LPAD)를 dto.board_id에 세팅 */
    @Override
    @Transactional
    public String create(P07_BoardDTO dto) {
        boardMapper.insert(dto);
        return dto.getBoard_id(); // 예: B0000000001
    }

    /** 수정 */
    @Override
    @Transactional
    public boolean update(P07_BoardDTO dto) {
        return boardMapper.update(dto) == 1;
    }

    /** 삭제 */
    @Override
    @Transactional
    public boolean delete(String id) {
        return boardMapper.delete(id) == 1;
    }
}
