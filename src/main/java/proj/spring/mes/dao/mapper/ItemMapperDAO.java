package proj.spring.mes.dao.mapper;

import java.util.List;

import proj.spring.mes.dto.ItemDTO;

public interface ItemMapperDAO {
	//전체 조회
    List<ItemDTO> selectItem();
    
    //하나만 추출할떄
    ItemDTO selectOneItem(String item_id);
    
    //삽입
    int insertItem(ItemDTO dto);
    
    //수정
    int updateItem(ItemDTO dto);
    
    //삭제
    int deleteItem(String item_id);
}
