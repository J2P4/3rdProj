package proj.spring.mes.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import proj.spring.mes.dao.mapper.P0402_ClientMapperDAO;
import proj.spring.mes.dto.P0402_ClientDTO;

import java.util.List;

@Service
public class P0402_ClientServiceImpl implements P0402_ClientService {

    private static final Logger log = LoggerFactory.getLogger(P0402_ClientServiceImpl.class);
    private final P0402_ClientMapperDAO clientDAO;

    // 생성자 주입
    public P0402_ClientServiceImpl(P0402_ClientMapperDAO clientDAO) { this.clientDAO = clientDAO; }

    // 헬퍼 메서드: 빈 문자열을 null로 변환합니다. (검색 조건 처리에 사용)
    private String blankToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.length() == 0 ? null : t;
    }

    // 1. 목록 조회 메서드 구현
    @Override
    public List<P0402_ClientDTO> findClients(String client_id, String clientName, String clientTel,
                                             String workerId, int offset, int size) {
        if (offset < 0) offset = 0;
        if (size < 1) size = 1;
        int startRow = offset;        // 0부터 시작
        int endRow = offset + size;   // 포함 상한
        return clientDAO.findClients(
                blankToNull(client_id), blankToNull(clientName),
                blankToNull(clientTel), blankToNull(workerId),
                startRow, endRow
        );
    }

    // 2. 카운트 조회 메서드 구현
    @Override
    public int countClients(String client_id, String clientName, String clientTel, String workerId) {
        return clientDAO.countClients(
                blankToNull(client_id), blankToNull(clientName),
                blankToNull(clientTel), blankToNull(workerId)
        );
    }

    // 3. 등록 메서드 구현
    @Override
    public void insertClient(P0402_ClientDTO dto) {
        if (dto == null) throw new IllegalArgumentException("dto must not be null");
        int affected = clientDAO.insertClient(dto);
        log.debug("insertClient affected={}", new Object[]{affected});
    }

    // 4. 삭제 메서드 구현
    @Override
    public void deleteByIds(java.util.List<String> ids) {
        if (ids == null || ids.isEmpty()) return;
        int affected = clientDAO.deleteByIds(ids);
        log.debug("deleteByIds size={}, affected={}", new Object[]{ids.size(), affected});
    }

    // 5. 단건 조회 메서드 구현
    @Override
    public P0402_ClientDTO get(String client_Id) {
        return clientDAO.selectClientOne(client_Id);
    }

    // 6. 거래처 수정 메서드 구현 (핵심 로직)
    @Override
    public P0402_ClientDTO update(P0402_ClientDTO dto) {
        // 1. 필수 값 검증
        if (dto == null || dto.getClient_id() == null || dto.getClient_id().trim().isEmpty()) {
            throw new IllegalArgumentException("거래처 ID는 필수 값입니다.");
        }

        // 2. DB 업데이트 실행. DAO는 영향받은 행 수(int)를 반환합니다.
        int affected = clientDAO.updateClient(dto);

        log.debug("updateClient affected={}", affected);

        if (affected == 0) {
            // 3. 업데이트 실패 시 (해당 ID가 DB에 없음) null 반환
            return null;
        }

        // 4. 업데이트 성공 시, 최신 정보를 다시 조회하여 Controller에 반환
        return clientDAO.selectClientOne(dto.getClient_id());
    }
}