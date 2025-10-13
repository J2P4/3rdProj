package proj.spring.mes.service;

import java.util.List;                                   
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import proj.spring.mes.dao.mapper.ClientItemsMapperDAO;
import proj.spring.mes.dto.ClientitemsDTO;

@Service
@RequiredArgsConstructor
public class ClientItemsServiceImpl implements ClientitemsService {
    private final ClientItemsMapperDAO mapper;

    @Override
    public List<ClientitemsDTO> getClientByItemId(String itemId) {   
        return mapper.selectClientitemsByItem(itemId);              
    }
}
