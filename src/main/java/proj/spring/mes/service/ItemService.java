package proj.spring.mes.service;

import java.util.List;
import java.util.Map;
import proj.spring.mes.dto.ItemDTO;

public interface ItemService {
    // 기본 목록/카운트
    long count();
    List<Map<String,Object>> list(int page, int pagePerRows);

    // LIKE 검색 전용
    long countBySearch(Map<String,Object> params);
    List<Map<String,Object>> searchList(Map<String,Object> params);

    // 단건/CRUD
    ItemDTO get(String itemId);
    ItemDTO create(ItemDTO dto, String clientId);
    int editWithClient(ItemDTO dto, String clientId);
    int removeAll(List<String> ids);

    // 부가
    List<Map<String,Object>> selectClientsByItemId(String itemId);
}
