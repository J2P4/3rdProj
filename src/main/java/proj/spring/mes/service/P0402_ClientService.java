package proj.spring.mes.service;

import proj.spring.mes.dto.P0402_ClientDTO;
import java.util.List;

public interface P0402_ClientService {

    List<P0402_ClientDTO> findClients(String client_id,
                                      String clientName,
                                      String clientTel,
                                      String workerId,
                                      int offset,
                                      int size);

    int countClients(String client_id,
                     String clientName,
                     String clientTel,
                     String workerId);

    void insertClient(P0402_ClientDTO dto);

    void deleteByIds(List<Long> ids);
    P0402_ClientDTO  get(String client_id);
    
    //수정
    P0402_ClientDTO update(P0402_ClientDTO dto);
}
