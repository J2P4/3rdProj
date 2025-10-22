package proj.spring.mes.dto;

import lombok.Data;

@Data
public class P0405_ProcessDTO {
	private String process_id;	//공정 id
	private int process_seq;	//공정 순서
	private String process_name;	//공정명
	private String process_img;		//공정 이미지 경로
	private String process_info;	//공정 설명
	private String department_id;	//담당 부서 id

	
}
