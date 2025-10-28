package proj.spring.mes.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class P0503_CPListDTO {
	private String cp_list_id;
	private double cp_rate;
	private double cp_successrate;
	private double cp_defectrate;
	private String cp_id;
	
	private Date fromDate;
	private Date toDate;
}
