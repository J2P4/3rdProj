package proj.spring.mes.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
// 필요하면 @Transactional 추가 가능
// import org.springframework.transaction.annotation.Transactional;

import proj.spring.mes.dto.ItemDTO;
import proj.spring.mes.dao.mapper.ItemMapperDAO; 

@Service
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemMapperDAO itemMapper;

    @Override
    public List<ItemDTO> list() {
        return itemMapper.selectItemList();
    }

    // 신규: 페이징 전용 목록
    @Override
    public List<ItemDTO> list(int page, int pagePerRows) {
        int size = Math.max(1, Math.min(pagePerRows, 100));
        int p = Math.max(1, page);
        int offset = (p - 1) * size;

        // Mapper는 LIMIT/OFFSET 받는 메서드가 필요함
        return itemMapper.selectItemListPage(size, offset);
    }

    //  총 레코드 수
    @Override
    public long count() {
        return itemMapper.selectItemCount();
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