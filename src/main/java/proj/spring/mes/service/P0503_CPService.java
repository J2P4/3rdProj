package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.ItemDTO;
import proj.spring.mes.dto.P0503_CPDTO;

public interface P0503_CPService {

	// CRUD
    List<P0503_CPDTO> list();
    List<ItemDTO> itemList();
    P0503_CPDTO get(String cp_id);
    int add(P0503_CPDTO dto);
    int edit(P0503_CPDTO dto);
    int deleteCPs(List<String> ids);
	
	//페이징 목록
    List<P0503_CPDTO> list(int page, int pagePerRows);

    //총 레코드 수
    long count();
}
