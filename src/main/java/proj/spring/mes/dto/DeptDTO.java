package proj.spring.mes.dto;

import lombok.Data;

@Data
public class DeptDTO {

	private String department_id;	// 부서ID
	private int department_repid;	// 부장 ID
	private int department_num;	// 부서 인원
	private String department_name;	// 부서명
}
