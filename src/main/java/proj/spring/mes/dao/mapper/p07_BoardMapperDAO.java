package proj.spring.mes.dao.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Param;
import proj.spring.mes.dto.P07_BoardDTO;

public interface p07_BoardMapperDAO {

    List<P07_BoardDTO> selectList(
        @Param("offset") int offset,
        @Param("size") int size,
        @Param("keyword") String keyword
    );

    int count(@Param("keyword") String keyword);

    P07_BoardDTO selectById(@Param("id") String id);

    // insert는 Mapper XML의 <selectKey>에서 문자 PK('B'+LPAD(seq,10,'0'))를 만들어 dto.board_id에 세팅함
    int insert(P07_BoardDTO dto);

    int update(P07_BoardDTO dto);

    int delete(@Param("id") String id);
}
