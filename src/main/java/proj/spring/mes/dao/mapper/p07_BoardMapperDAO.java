package proj.spring.mes.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import proj.spring.mes.dto.P07_BoardDTO;

@Mapper
public interface p07_BoardMapperDAO {

    List<P07_BoardDTO> selectList(
            @Param("offset") int offset,
            @Param("size") int size,
            @Param("keyword") String keyword);

    int count(@Param("keyword") String keyword);

    P07_BoardDTO selectById(@Param("id") Long id);

    int insert(P07_BoardDTO dto); // useGeneratedKeys로 id 세팅

    int update(P07_BoardDTO dto);

    int delete(@Param("id") Long id);
}
