package proj.spring.mes.dto;

import java.sql.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class P0501_CPDTO {
	private String cp_id;		// 생산계획 ID
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "#,###")
	private int cp_amount;		// 목표수량
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date cp_start;		// 시작일
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date cp_end;		// 종료일
	private String item_id;		// 품목ID
	private String item_name;	// 품목명
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date fromDate;		// 필터시작일
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date toDate;		// 필터종료일
}
