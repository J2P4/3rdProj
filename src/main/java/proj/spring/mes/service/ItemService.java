package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.ItemDTO;

public interface ItemService {
    // 기존 메서드
    List<ItemDTO> list();
    ItemDTO get(String ItemId);
    int add(ItemDTO dto);
    int edit(ItemDTO dto);
    int remove(String ItemId);
    int removeAll(List<String> itemIds);
    
    
    
    
    
    
    
    //추가할것
    //페이징 목록
    List<ItemDTO> list(int page, int pagePerRows);

    //총 레코드 수
    long count();
}
