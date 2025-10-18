package proj.spring.mes.dao.mapper;

import org.apache.ibatis.annotations.Param;

import proj.spring.mes.dto.ItemDTO;

import java.util.List;
import java.util.Map;

public interface ItemMapperDAO {

    long count();

    // 페이징
    List<Map<String,Object>> list(@Param("start") int start,
                                  @Param("end")   int end);

    // 단건
    ItemDTO selectItemOne(@Param("itemId") String itemId); // ← 단일 파라미터도 명시

    // 등록/수정/삭제
    int insertItem(ItemDTO dto);
    int updateItem(ItemDTO dto);
    int deleteItems(@Param("ids") List<String> ids);        // foreach collection="ids"와 일치

    // 생성/매핑
    String nextItemIdByDiv(@Param("itemDiv") String itemDiv);
    int insertClientItem(@Param("itemId") String itemId,    // ★ 여기 추가
                         @Param("clientId") String clientId);

    // 조회
    List<Map<String,Object>> selectClientsByItemId(@Param("itemId") String itemId);

    // 검색
    long countBySearch(Map<String,Object> params);
    List<Map<String,Object>> searchList(Map<String,Object> params);
}
