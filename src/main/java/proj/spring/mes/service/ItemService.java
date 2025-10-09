package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.ItemDTO;

public interface ItemService {

    List<ItemDTO> list();
    ItemDTO get(String ItemId);
    int add(ItemDTO dto);
    int edit(ItemDTO dto);
    int remove(String ItemId);
}
