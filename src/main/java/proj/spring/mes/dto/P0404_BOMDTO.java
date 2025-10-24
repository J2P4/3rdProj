package proj.spring.mes.dto;

import lombok.Data;

@Data
public class P0404_BOMDTO {
	private String bom_id;
	private int bom_amount;
	private String item_id;
	
	private String item_div;
	private String item_name;
	
	private String material_item_id;
	private String material_item_name;
	private String material_item_div;
	private String product_item_name;
	private String product_item_id;
}
