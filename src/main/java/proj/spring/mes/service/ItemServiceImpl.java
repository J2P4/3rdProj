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
    
    
    @Override
    public int removeAll(List<String> itemIds) {
        if (itemIds == null || itemIds.isEmpty()) return 0;

        // 순서 보존 + 중복 제거
        java.util.LinkedHashSet<String> set = new java.util.LinkedHashSet<String>();
        for (int i = 0; i < itemIds.size(); i++) {
            String s = itemIds.get(i);
            if (s == null) continue;
            s = s.trim();
            if (s.length() > 0) {
                set.add(s);
            }
        }
        if (set.isEmpty()) return 0;

        java.util.List<String> cleaned = new java.util.ArrayList<String>(set);

        int total = 0;
        final int LIMIT = 1000; 
        for (int i = 0; i < cleaned.size(); i += LIMIT) {
            int toIndex = i + LIMIT;
            if (toIndex > cleaned.size()) toIndex = cleaned.size();
            java.util.List<String> part = cleaned.subList(i, toIndex);
            total += itemMapper.deleteItems(part);
        }
        return total;
    }
    
    
    
    
    
    
    
    
    
    
    
    
}