package proj.spring.mes.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class P0401_StockDTO {
	private String stock_id;
	private int stock_amount;
	private String stock_wrap;
	
	private String item_id;
	private String item_div;
	private String item_name;
	
	private String stock_history_id;
	private int stock_history_before;
	private int stock_history_after;
	private Date stock_history_time;
	private String stock_history_reason;
	private String stock_history_loc;
}
