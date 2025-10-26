package proj.spring.mes.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class P07_BoardDTO {
	
	private String board_id;
	private String board_title;
	private String board_content;
	private String board_type;
	private String board_attatch;
	private String worker_id;
	private Date board_date;
	

}
