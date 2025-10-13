// 수정본
package proj.spring.mes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.P0402_ClientMapperDAO;
import proj.spring.mes.dto.P0402_ClientDTO;


@Service
public class P0402_ClientServiceImpl implements P0402_ClientService {

    @Autowired
    P0402_ClientMapperDAO clientMapperDAO;

    @Override
    public List<P0402_ClientDTO> clientList() {
        return clientMapperDAO.selectClientList();
    }
}
