package proj.spring.mes.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class P0502_WorkOrderDTO {
	private String work_order_id;
	private Date work_order_date;
	private int work_order_num;
	private int work_order_fin;
	private String cp_id;
	private String worker_id;
	private String worker_name;
	private String item_id;
	
	private Date fromDate;
	private Date toDate;
}
