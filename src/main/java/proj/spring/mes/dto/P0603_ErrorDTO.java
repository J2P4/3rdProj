package proj.spring.mes.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class P0603_ErrorDTO {
	private String defect_reason_id;
	private String defect_reason;
	private String defect_exhaust;
	private String inspection_result_id;
	
	private Date inspection_result_date;
	private String stock_id;
}
