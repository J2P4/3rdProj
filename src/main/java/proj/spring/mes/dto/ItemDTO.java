package proj.spring.mes.dto;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;

@Getter
@Setter
public class ItemDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String item_id;
    private int item_price;  
    private String item_name;
    private String item_unit;
    private String item_div;
    private String client_id;

}
