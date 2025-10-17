package proj.spring.mes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.P0501_CPMapperDAO;
import proj.spring.mes.dto.ItemDTO;
import proj.spring.mes.dto.P0501_CPDTO;

@Service
public class P0501_CPServiceImpl implements P0501_CPService{

	@Autowired
	P0501_CPMapperDAO cpMapperDao;   // MapperDAO 인터페이스를 받아오기


	@Override
    public List<P0501_CPDTO> list() {
       return cpMapperDao.selectCP();
    }

	@Override
	public List<ItemDTO> itemList() {
		return cpMapperDao.selectItem();
	}

    @Override
    public P0501_CPDTO get(String cp_id) {
        return cpMapperDao.selectOneCP(cp_id);
    }

    @Override
    public int add(P0501_CPDTO dto) {
        return cpMapperDao.insertCP(dto);
    }

    @Override
    public int edit(P0501_CPDTO dto) {
        return cpMapperDao.updateCP(dto);
    }

    @Override
    public int deleteCPs(List<String> cp_ids) {
        if (cp_ids == null || cp_ids.isEmpty()) return 0;
        return cpMapperDao.deleteCPs(cp_ids);
    }

    
    // 신규: 페이징 전용 목록
    @Override
    public List<P0501_CPDTO> list(int page, int pagePerRows) {
        int size = Math.max(1, Math.min(pagePerRows, 100));
        int p = Math.max(1, page);
        int offset = (p - 1) * size;

        // Mapper는 LIMIT/OFFSET 받는 메서드가 필요함
        return cpMapperDao.selectCPListPage(size, offset);
    }

    //  총 레코드 수
    @Override
    public long count() {
        return cpMapperDao.selectCPCount();
    }
}
