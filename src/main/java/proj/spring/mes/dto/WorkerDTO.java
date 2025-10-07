package proj.spring.mes.dto;

import java.sql.Date;

import lombok.Data;

@Data
public class WorkerDTO {
	private String worker_id;		// 사번
	private String worker_name;		// 사원이름
	private Date worker_birth;		// 생년월일
	private String worker_pw;		// 비밀번호
	private String worker_email;	// 이메일
	private String worker_code;		// 권한
	private Date worker_join;		// 입사일
	private String department_id;	// 부서ID
	private String department_name;	// 부서명
}
