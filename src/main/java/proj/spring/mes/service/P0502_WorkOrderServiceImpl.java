package proj.spring.mes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.P0502_WorkOrderMapperDAO;
import proj.spring.mes.dto.P0502_WorkOrderDTO;

@Service
public class P0502_WorkOrderServiceImpl implements P0502_WorkOrderService{
	
	@Autowired
	P0502_WorkOrderMapperDAO woDAO;
	
	@Override
	public List<P0502_WorkOrderDTO> list(int page, int pagePerRows, P0502_WorkOrderDTO searchFilter) {
        int size = Math.max(1, Math.min(pagePerRows, 100));
        int p = Math.max(1, page);
        int offset = (p - 1) * size;
        
        System.out.println(size);
        System.out.println(p);
        System.out.println(offset);
        
        return woDAO.selectWO(size, offset, searchFilter);
	}
	
	@Override
	public long count(P0502_WorkOrderDTO searchFilter) {
		return woDAO.selectWOCount(searchFilter);
	}
}
