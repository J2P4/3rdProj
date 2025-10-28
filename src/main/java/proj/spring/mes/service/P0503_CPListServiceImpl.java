package proj.spring.mes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.P0503_CPListMapperDAO;
import proj.spring.mes.dto.P0503_CPListDTO;

@Service
public class P0503_CPListServiceImpl implements P0503_CPListService {
	@Autowired
	P0503_CPListMapperDAO dao;
	
	public List<P0503_CPListDTO> list(int page, int pagePerRows, P0503_CPListDTO searchFilter) {
        int size = Math.max(1, Math.min(pagePerRows, 100));
        int p = Math.max(1, page);
        int offset = (p - 1) * size;
        
        System.out.println(size);
        System.out.println(p);
        System.out.println(offset);
        
        return dao.selectCL(size, offset, searchFilter);
	}
	public long count(P0503_CPListDTO searchFilter) {
		return dao.selectCPListCount(searchFilter);
	}
}
