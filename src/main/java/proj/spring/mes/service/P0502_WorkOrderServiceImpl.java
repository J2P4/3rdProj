package proj.spring.mes.service;

import java.util.List;
import java.util.Map;

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
	
	@Override
	public int addWO(P0502_WorkOrderDTO dto) {
		return woDAO.insertWO(dto);
	}
	
	@Override
	public int removeWos(List<String> wos) {
		return woDAO.deleteWOs(wos);
	}
	
	@Override
	public P0502_WorkOrderDTO getOneWO(String work_order_id) {
		// 작업 지시서 기본 정보 조회 (item_id 포함)
		P0502_WorkOrderDTO woDetail = woDAO.selectOneWO(work_order_id);
				
		if (woDetail != null && woDetail.getItem_id() != null) {
			String item_id = woDetail.getItem_id();
			
			// BOM 정보 조회
			List<Map<String, Object>> bomList = woDAO.selectBOM(item_id);
			woDetail.setBomList(bomList); // DTO에 설정
			
			// 공정 정보 조회
			List<Map<String, Object>> processList = woDAO.selectProcess(item_id);
			woDetail.setProcessList(processList); // DTO에 설정
		}
		
		return woDetail;
	}
	
	@Override
	public int modifyWO(P0502_WorkOrderDTO dto) {
	    return woDAO.updateWO(dto);
	}
	
	@Override
	public List<P0502_WorkOrderDTO> getAllWorkers() {
		return woDAO.selectAllWorker();
	}
}
