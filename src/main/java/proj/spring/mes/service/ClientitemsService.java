package proj.spring.mes.service;

import java.util.List;
import proj.spring.mes.dto.ClientitemsDTO;

public interface ClientitemsService {
    List<ClientitemsDTO> getClientByItemId(String itemId); 
}
