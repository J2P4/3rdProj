package proj.spring.mes.dao.mapper;

import org.apache.ibatis.annotations.Param;
import proj.spring.mes.dto.P0402_ClientDTO;
import java.util.List;

public interface P0402_ClientMapperDAO {

    List<P0402_ClientDTO> findClients(@Param("clientNo") String clientNo,
                                      @Param("clientName") String clientName,
                                      @Param("clientTel") String clientTel,
                                      @Param("workerId") String workerId,
                                      @Param("startRow") int startRow,
                                      @Param("endRow") int endRow);

    int countClients(@Param("clientNo") String clientNo,
                     @Param("clientName") String clientName,
                     @Param("clientTel") String clientTel,
                     @Param("workerId") String workerId);

    int insertClient(P0402_ClientDTO dto);

    int deleteByIds(@Param("ids") java.util.List<Long> ids);
}
