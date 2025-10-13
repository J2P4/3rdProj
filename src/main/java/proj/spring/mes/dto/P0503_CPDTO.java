package proj.spring.mes.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class P0503_CPDTO {
	private String cp_id;		// 생산계획 ID
	private int cp_amount;		// 목표수량
	private Date cp_start;		// 시작일
	private Date cp_end;		// 종료일
	private String item_code;	// 품목ID
	private String item_name;	// 품목명
}
