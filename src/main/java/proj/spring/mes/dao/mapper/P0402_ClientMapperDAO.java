// 수정본
package proj.spring.mes.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper; // MyBatis 매퍼 인터페이스
import proj.spring.mes.dto.P0402_ClientDTO;


@Mapper
public interface P0402_ClientMapperDAO {
    List<P0402_ClientDTO> selectClientList();
}
