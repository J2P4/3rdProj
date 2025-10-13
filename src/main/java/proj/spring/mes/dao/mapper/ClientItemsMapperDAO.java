package proj.spring.mes.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import proj.spring.mes.dto.ClientitemsDTO;

public interface ClientItemsMapperDAO {

	
	List<ClientitemsDTO> selectClientitemsByItem(@Param("itemId") String itemId);

}
