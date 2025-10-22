package proj.spring.mes.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import proj.spring.mes.dto.P0405_ProcessDTO;



public interface P0405_ProcessMapperDAO {
	List<P0405_ProcessDTO> selectProcess(P0405_ProcessDTO searchCondition);	// 전체 조회 겸 필터링 조회
	P0405_ProcessDTO selectOneProcess(String process_id);						// 상세 조회
	List<P0405_ProcessDTO> selectProcessItem();								// 조회 : 등록 시 품목 확인용
	int updateProcess(P0405_ProcessDTO dto);								// 수정
//	int deleteprocess(String process_id);									// 삭제 - 개별
	int deleteProcesss(List<String> processIds);							// 삭제 - 전체
	int insertProcess(P0405_ProcessDTO dto);								// 등록

	// 신규(페이징) 및 필터
    List<P0405_ProcessDTO> selectprocessPage(@Param("limit") int limit, @Param("offset") int offset, @Param("filter") P0405_ProcessDTO searchFilter);
	// 신규(총계)
	long selectprocessCount(@Param("filter") P0405_ProcessDTO searchFilter);
	
	
	
}
