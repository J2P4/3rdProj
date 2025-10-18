package proj.spring.mes.dao.mapper;

import java.util.*;
import org.apache.ibatis.annotations.Param;
import proj.spring.mes.dto.ItemDTO;

public interface ItemMapperDAO {
    long count();
    List list(@Param("start") int start, @Param("end") int end);
    ItemDTO selectItemOne(@Param("itemId") String itemId);
    int insertItem(ItemDTO dto);
    int updateItem(ItemDTO dto);
    int deleteItems(@Param("ids") List ids);
    String nextItemIdByDiv(@Param("itemDiv") String itemDiv);
    int insertClientItem(@Param("itemId") String itemId, @Param("clientId") String clientId);
    List selectClientsByItemId(@Param("itemId") String itemId);
}
