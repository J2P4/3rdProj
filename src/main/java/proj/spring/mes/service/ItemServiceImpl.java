package proj.spring.mes.service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import proj.spring.mes.dao.mapper.ItemMapperDAO;
import proj.spring.mes.dto.ItemDTO;

@Service
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemMapperDAO itemMapper;

    /** 총 건수 */
    @Override
    public long count() {
        return itemMapper.count();
    }

    /** 기본 목록(페이지네이션) */
    @Override
    public List<Map<String,Object>> list(int page, int pagePerRows) {
        int start = (page - 1) * pagePerRows + 1;
        int end   = page * pagePerRows;
        // Mapper: list(start, end) -> resultType="map"
        return itemMapper.list(start, end);
    }

    /** LIKE 검색 총건수 */
    @Override
    public long countBySearch(Map<String,Object> params) {
        return itemMapper.countBySearch(params);
    }

    /** LIKE 검색 목록(페이지네이션 포함) */
    @Override
    public List<Map<String,Object>> searchList(Map<String,Object> params) {
        return itemMapper.searchList(params);
    }

    /** 단건 조회 */
    @Override
    public ItemDTO get(String itemId) {
        return itemMapper.selectItemOne(itemId);
    }

    /** 등록 (거래처 매핑 포함) */
    @Transactional
    @Override
    public ItemDTO create(ItemDTO in, String clientId) {
        String newId = itemMapper.nextItemIdByDiv(in.getItem_div());
        in.setItem_id(newId);
        itemMapper.insertItem(in);

        if (clientId != null && clientId.trim().length() > 0) {
            itemMapper.insertClientItem(newId, clientId.trim());
        }
        return itemMapper.selectItemOne(newId);
    }

    /** 수정 (거래처 매핑 upsert) */
    @Transactional
    @Override
    public int editWithClient(ItemDTO in, String clientId) {
        int r = itemMapper.updateItem(in);
        if (clientId != null && clientId.trim().length() > 0) {
            itemMapper.insertClientItem(in.getItem_id(), clientId.trim());
        }
        return r;
    }

    /** 다건 삭제 */
    @Override
    public int removeAll(List<String> ids) {
        // Mapper는 parameterType="map"으로 ids 컬렉션 받도록 정의되어 있어야 함
        return itemMapper.deleteItems(ids);
    }

    /** 품목별 거래처 목록 */
    @Override
    public List<Map<String,Object>> selectClientsByItemId(String itemId) {
        return itemMapper.selectClientsByItemId(itemId);
    }
}
