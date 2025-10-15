package proj.spring.mes.dto;

import lombok.Data;

@Data
public class PwDTO {
	private String current_pw;		// 현재 비밀번호
	private String new_pw;			// 새 비밀번호
	private String confirm_pw;		// 비밀번호 확인
	
}