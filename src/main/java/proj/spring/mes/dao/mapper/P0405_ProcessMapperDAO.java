package proj.spring.mes.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import proj.spring.mes.dto.P0405_ProcessDTO;

@Mapper
public interface P0405_ProcessMapperDAO {

    // 전체/검색 조회
    List<P0405_ProcessDTO> selectProcess(P0405_ProcessDTO searchCondition);

    // 상세
    P0405_ProcessDTO selectOneProcess(String process_id);

    // 등록 화면용 조회(유지)
    List<P0405_ProcessDTO> selectProcessItem();

    // 등록/수정/삭제
    int insertProcess(P0405_ProcessDTO dto);
    int updateProcess(P0405_ProcessDTO dto);
    int deleteProcesss(List<String> processIds);

    // 페이징 목록: limit/offset + filter
    List<P0405_ProcessDTO> selectprocessPage(
            @Param("limit") int limit,
            @Param("offset") int offset,
            @Param("filter") P0405_ProcessDTO searchFilter
    );

    // filter만 받음
    long selectprocessCount(
            @Param("filter") P0405_ProcessDTO searchFilter
    );
}
