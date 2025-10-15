package proj.spring.mes.dao.mapper;

import org.apache.ibatis.annotations.Param;
import proj.spring.mes.dto.P0402_ClientDTO;
import java.util.List;

// MyBatis가 이 인터페이스의 구현체를 자동으로 생성합니다. (DAO 역할)
public interface P0402_ClientMapperDAO {

    // 1. 목록 조회 (검색 조건 및 페이징 포함)
    List<P0402_ClientDTO> findClients(@Param("client_id") String client_id,
                                      @Param("clientName") String clientName,
                                      @Param("clientTel") String clientTel,
                                      @Param("workerId") String workerId,
                                      @Param("startRow") int startRow,
                                      @Param("endRow") int endRow);

    // 2. 검색 조건에 맞는 거래처 수 카운트
    int countClients(@Param("client_id") String client_id,
                     @Param("clientName") String clientName,
                     @Param("clientTel") String clientTel,
                     @Param("workerId") String workerId);

    // 3. 새로운 거래처 등록 (INSERT)
    int insertClient(P0402_ClientDTO dto);

    // 4. 선택된 ID 목록을 받아 거래처 삭제 (DELETE)
    int deleteByIds(@Param("ids") java.util.List<Long> ids);
    
    // 5. 특정 거래처 ID로 하나의 상세 정보 조회
    P0402_ClientDTO selectClientOne(@Param("client_id") String client_id);
    
    // 6. 거래처 정보 수정 (UPDATE) - 영향받은 행의 수를 반환합니다.
    int updateClient(P0402_ClientDTO dto); 

}