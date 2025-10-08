package proj.spring.mes.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class P0602_OutInsDTO {
	private String inspection_result_id;
	private Date inspection_result_date;
	private int inspection_result_good;
	private int inspection_result_bad;
	private String worker_id;
	private String stock_id;
	private int inspection_type;
}
