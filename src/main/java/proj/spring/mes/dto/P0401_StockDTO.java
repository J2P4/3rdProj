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
	private String stock_history_loc;
	
	// Mapper에서 계산하여 채울 필드
    private int stock_history_change;     // 증감 수량 (after - before)
    private String stock_history_time_str; // 포맷팅된 날짜 문자열 (YYYY-MM-DD HH24:MI)
}
