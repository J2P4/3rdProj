package proj.spring.mes.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import proj.spring.mes.dto.ItemDTO;
import proj.spring.mes.dto.P0503_CPDTO;

@Mapper
public interface P0503_CPMapperDAO {

	// CRUD
    List<P0503_CPDTO> selectCP();                 	// 전체 조회
    List<ItemDTO> selectItem();                 	// 부서 조회
    P0503_CPDTO selectOneCP(String cp_id);    // 하나만 조회
    int insertCP(P0503_CPDTO dto);                // 등록
    int updateCP(P0503_CPDTO dto);                // 수정
    int deleteCPs(@Param("cp_ids") List<String> cp_ids);
	
	// 신규(페이징)
    List<P0503_CPDTO> selectCPListPage(@Param("limit") int limit, @Param("offset") int offset);
	// 신규(총계)
    long selectCPCount();
}
