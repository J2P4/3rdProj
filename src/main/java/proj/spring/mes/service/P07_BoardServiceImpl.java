package proj.spring.mes.service;

import java.nio.file.AccessDeniedException;
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
	
	/**
     * 수정: 본인만 가능
     */
    @Override
    public void modifyWithAuth(P07_BoardDTO dto, String sessionWorkerId, String role) { 
        // 1) 원본 조회
        P07_BoardDTO origin = mapper.selectById(dto.getBoard_id());
        if (origin == null) {
            throw new RuntimeException("존재하지 않는 글입니다.");
        }

        // 2) 본인 여부 확인
        if (sessionWorkerId == null || !origin.getWorker_id().equals(sessionWorkerId)) {
            throw new RuntimeException("본인 글만 수정할 수 있습니다.");
        }

        // 3) 작성자 변조 방지: 클라이언트가 worker_id 바꿔보내도 원본으로 고정
        dto.setWorker_id(origin.getWorker_id());

        // 4) DB 가드 UPDATE: WHERE에 worker_id 일치 조건 포함
        int n = mapper.updateOwnerGuard(dto); // ★ 변경: mapper 가드 쿼리 호출
        if (n == 0) {
            // 동시성/권한 문제 등으로 WHERE 불일치
            throw new RuntimeException("수정 권한이 없거나 글이 존재하지 않습니다.");
        }
    }

    /**
     * 삭제: 본인 또는 ADMIN 가능
     */
    @Override
    public void removeWithAuth(String boardId, String sessionWorkerId, String role) { 
        // 1) 원본 조회
        P07_BoardDTO origin = mapper.selectById(boardId);
        if (origin == null) {
            throw new RuntimeException("존재하지 않는 글입니다.");
        }

        // 2) 권한 판단
        boolean isOwner = sessionWorkerId != null && origin.getWorker_id().equals(sessionWorkerId);
        boolean isAdmin = role != null && "ADMIN".equalsIgnoreCase(role);

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        // 3) DB 가드 DELETE
        //    - ADMIN이면 작성자 조건 없이 삭제
        //    - 그 외에는 worker_id 일치 필요
        int n = mapper.deleteWithGuard(boardId, sessionWorkerId, role);


        // ADMIN은 작성자 조건을 타지 않으므로 n==0이어도 별도 에러 처리 불필요.

	
    }
	
	
	
	
	
	
}
