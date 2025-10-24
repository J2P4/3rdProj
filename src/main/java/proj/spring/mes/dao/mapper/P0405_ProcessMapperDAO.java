package proj.spring.mes.dao.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Param;

import proj.spring.mes.dto.P0405_ProcessDTO;

public interface P0405_ProcessMapperDAO {

    // 신규
    String selectNextProcessId();

    // 기존
    List<P0405_ProcessDTO> selectProcess(P0405_ProcessDTO filter);
    P0405_ProcessDTO selectOneProcess(String process_id);
    List<P0405_ProcessDTO> selectProcessItem();

    int insertProcess(P0405_ProcessDTO dto);
    int updateProcess(P0405_ProcessDTO dto);

    int deleteProcesss(@Param("list") List<String> ids);

    // 페이징
    List<P0405_ProcessDTO> selectprocessPage(@Param("offset") int offset,
                                             @Param("limit") int limit,
                                             @Param("filter") P0405_ProcessDTO filter);
    long selectprocessCount(@Param("filter") P0405_ProcessDTO filter);
}
