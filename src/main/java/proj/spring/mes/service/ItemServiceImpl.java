package proj.spring.mes.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import proj.spring.mes.dao.mapper.ItemMapperDAO;
import proj.spring.mes.dto.ItemDTO;

@Service
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemMapperDAO itemMapper;

    public long count() {
        return itemMapper.count();
    }

    public List list(int page, int pagePerRows) {
        int start = (page - 1) * pagePerRows + 1;
        int end   = page * pagePerRows;
        return itemMapper.list(start, end);
    }

    public ItemDTO get(String itemId) {
        return itemMapper.selectItemOne(itemId);
    }

    @Transactional
    public ItemDTO create(ItemDTO in, String clientId) {
        String newId = itemMapper.nextItemIdByDiv(in.getItem_div());
        in.setItem_id(newId);
        itemMapper.insertItem(in);

        if (clientId != null && clientId.trim().length() > 0) {
            itemMapper.insertClientItem(newId, clientId);
        }
        return itemMapper.selectItemOne(newId);
    }

    @Transactional
    public int editWithClient(ItemDTO in, String clientId) {
        int r = itemMapper.updateItem(in);
        if (clientId != null && clientId.trim().length() > 0) {
            itemMapper.insertClientItem(in.getItem_id(), clientId);
        }
        return r;
    }

    public int removeAll(List ids) {
        return itemMapper.deleteItems(ids);
    }

    public List selectClientsByItemId(String itemId) {
        return itemMapper.selectClientsByItemId(itemId);
    }
}
