package proj.spring.mes.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import proj.spring.mes.dto.P0503_CPListDTO;

public interface P0503_CPListMapperDAO {
	// 신규(페이징) 및 필터
    List<P0503_CPListDTO> selectCL(@Param("limit") int limit, @Param("offset") int offset, @Param("filter") P0503_CPListDTO searchFilter);
	// 신규(총계)
	long selectCPListCount(@Param("filter") P0503_CPListDTO searchFilter);
}
