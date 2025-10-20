package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.ItemDTO;
import proj.spring.mes.dto.P0501_CPDTO;

public interface P0501_CPService {

	// CRUD
    List<P0501_CPDTO> list();
    List<ItemDTO> itemList();
    P0501_CPDTO get(String cp_id);
    int add(P0501_CPDTO dto);
    int edit(P0501_CPDTO dto);
    int deleteCPs(List<String> ids);
	
    ItemDTO getItemName(String item_id);
    
    //페이징 목록
    List<P0501_CPDTO> list(int page, int pagePerRows, P0501_CPDTO searchFilter);

    //총 레코드 수
    long count(P0501_CPDTO searchFilter);
}
