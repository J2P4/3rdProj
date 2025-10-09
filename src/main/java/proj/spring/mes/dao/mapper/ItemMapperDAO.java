package proj.spring.mes.dao.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Param;
import proj.spring.mes.dto.ItemDTO;

public interface ItemMapperDAO {
    List<ItemDTO> selectItemList();
    ItemDTO selectItemOne(@Param("item_id") String itemId);
    int insertItem(ItemDTO dto);
    int updateItem(ItemDTO dto);
    int deleteItem(@Param("item_id") String itemId);
}
