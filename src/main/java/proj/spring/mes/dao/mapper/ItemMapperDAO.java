package proj.spring.mes.dao.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import proj.spring.mes.dto.ItemDTO;

public interface ItemMapperDAO {
    List<ItemDTO> selectItemList();
    ItemDTO selectItemOne(@Param("itemId") String itemId);
    int insertItem(ItemDTO dto);
    int updateItem(ItemDTO dto);
    int deleteItem(@Param("itemId") String itemId);
    int deleteItems(@Param("list") List<String> itemIds);
    // 페이징
    List<ItemDTO> selectItemListPage(@Param("limit") int limit, @Param("offset") int offset);

    // 총계
    long selectItemCount();
    
    
    List<Map<String, Object>> clientlist();
    List<Map<String, Object>> selectClientsByItemId(@Param("itemId") String itemId);

}