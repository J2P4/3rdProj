package proj.spring.mes.service;

import java.util.List;

import proj.spring.mes.dto.P0502_WorkOrderDTO;

public interface P0502_WorkOrderService {
	public List<P0502_WorkOrderDTO> list(int page, int pagePerRows, P0502_WorkOrderDTO searchFilter);
	public long count(P0502_WorkOrderDTO searchFilter);
	public P0502_WorkOrderDTO getOneWO(String work_order_id);
	
	public int addWO(P0502_WorkOrderDTO dto);
	public int removeWos(List<String> wos);
}
