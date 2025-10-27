package proj.spring.mes.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.p07_BoardMapperDAO;
import proj.spring.mes.dto.P07_BoardDTO;

@Service
public class P07_BoardServiceImpl implements P07_BoardService {

    @Autowired
    private p07_BoardMapperDAO mapper;

    @Override
    public List<P07_BoardDTO> findList(Map<String,Object> p) {
        int offset  = (Integer)p.get("offset");
        int size    = (Integer)p.get("size");
        String keyword = (String)p.get("keyword");
        return mapper.selectList(offset, size, keyword);
        // 또는 mapper.selectList(p);  ← 인터페이스에 맞춰 둘 중 하나만 사용
    }

    @Override
    public int count(Map<String,Object> p) {
        String keyword = (String)p.get("keyword");
        return mapper.count(keyword);
        // 또는 mapper.count(p);
    }

    @Override
    public P07_BoardDTO findById(String id) {
        return mapper.selectById(id);
    }

    @Override
    public int add(P07_BoardDTO dto) {
        return mapper.insert(dto);
    }

    @Override
    public int modify(P07_BoardDTO dto) {
        return mapper.update(dto);
    }

    @Override
    public int remove(String id) {
        return mapper.delete(id);
    }

	@Override
	public List<P07_BoardDTO> mainlist() {
		return mapper.mainList();
	}
}
