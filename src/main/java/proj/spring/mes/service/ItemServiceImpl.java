package proj.spring.mes.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import proj.spring.mes.dto.ItemDTO;
import proj.spring.mes.dao.mapper.ItemMapperDAO; // 프로젝트에 있는 Mapper 타입 사용

@Service
public class ItemServiceImpl implements ItemService {


    @Autowired
    private ItemMapperDAO itemMapper;


    @Override
    public List<ItemDTO> list() {
        return itemMapper.selectItemList();
    }


    @Override
    public ItemDTO get(String ItemId) {
        return itemMapper.selectItemOne(ItemId);
    }


    @Override
    public int add(ItemDTO dto) {
        return itemMapper.insertItem(dto);
    }

  
    @Override
    public int edit(ItemDTO dto) {
        return itemMapper.updateItem(dto);
    }


    @Override
    public int remove(String ItemId) {
        return itemMapper.deleteItem(ItemId);
    }
}
