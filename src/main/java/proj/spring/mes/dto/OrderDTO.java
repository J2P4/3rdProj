package proj.spring.mes.dto;

import java.sql.Date;

import lombok.Data;


@Data
public class OrderDTO {
	private String order_id;		// 발주 번호
	private Date order_payment_day;		// 결제일
	private Date order_date;		// 발주일
	private String order_amount;		// 발주량
	private Date order_receivement_date;	//수주일
	private String order_stat ;	// 발주상태(승인/반려)
	private String worker_id;	//발주 담당자 ID
	private String client_id;  // 거래처 ID
	private String item_id; //품목 id 
	private Date order_payment_duedate; //결제 예정일
	private Date order_receive_duedate;  //수주 예정일
	

}

