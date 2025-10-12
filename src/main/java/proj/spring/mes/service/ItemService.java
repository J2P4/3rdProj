package proj.spring.mes.service;

import java.util.List;
import proj.spring.mes.dto.ItemDTO;

public interface ItemService {
    // 목록
    List<ItemDTO> list();

    // 페이징 목록 (컨트롤러에서 쓰는 시그니처 추가)
    List<ItemDTO> list(int page, int pagePerRows);

    // 단건
    ItemDTO get(String itemId);

    // CUD
    int add(ItemDTO dto);
    int edit(ItemDTO dto);
    int remove(String itemId);
    int removeAll(List<String> itemIds);

    // 총 레코드 수
    long count();
}
