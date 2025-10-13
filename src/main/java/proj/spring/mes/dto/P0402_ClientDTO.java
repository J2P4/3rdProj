package proj.spring.mes.dto;

import lombok.Data;

@Data
public class P0402_ClientDTO {
	private String client_id; //거래처 id
	private String cilent_name;	//거래처 이름
	private String client_tel;	//거래처 전화번호
	private String worker_id;	//담당 직원 id
}
