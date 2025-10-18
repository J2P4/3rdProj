package proj.spring.mes.service;

import java.util.List;
import java.util.Map;
import proj.spring.mes.dto.ItemDTO;

public interface ItemService {
    long count();
    List list(int page, int pagePerRows);
    ItemDTO get(String itemId);
    ItemDTO create(ItemDTO dto, String clientId);
    int editWithClient(ItemDTO dto, String clientId);
    int removeAll(List ids);
    List selectClientsByItemId(String itemId);
}
