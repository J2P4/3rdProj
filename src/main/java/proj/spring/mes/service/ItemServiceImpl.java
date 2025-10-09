package proj.spring.mes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.ItemMapperDAO;
import proj.spring.mes.dto.ItemDTO;

@Service
public class ItemServiceImpl implements ItemService {
	@Autowired
	ItemMapperDAO ItemMapperDao;   // MapperDAO 인터페이스를 받아오기

	@Override
	public List<ItemDTO> list() {
	       return ItemMapperDao.selectItem();
	   }
	
    @Override
    public ItemDTO get(String ItemId) {
        return ItemMapperDao.selectOneItem(ItemId);
    }

    @Override
    public int add(ItemDTO dto) {
        return ItemMapperDao.insertItem(dto);
    }

    @Override
    public int edit(ItemDTO dto) {
        return ItemMapperDao.updateItem(dto);
    }

    @Override
    public int remove(String ItemId) {
        return ItemMapperDao.deleteItem(ItemId);
    }

}
