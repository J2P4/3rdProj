package proj.spring.mes.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import proj.spring.mes.dto.DataDTO;

public interface DataMapperDAO {
	
    List<DataDTO> selectDataById(@Param("id") int id);
    
    List<Integer> selectDistinctIds();
}