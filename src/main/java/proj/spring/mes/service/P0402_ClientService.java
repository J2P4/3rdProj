package proj.spring.mes.service;

import proj.spring.mes.dto.P0402_ClientDTO;
import java.util.List;

public interface P0402_ClientService {

    List<P0402_ClientDTO> findClients(String clientNo,
                                      String clientName,
                                      String clientTel,
                                      String workerId,
                                      int offset,
                                      int size);

    int countClients(String clientNo,
                     String clientName,
                     String clientTel,
                     String workerId);

    void insertClient(P0402_ClientDTO dto);

    void deleteByIds(List<Long> ids);
}
