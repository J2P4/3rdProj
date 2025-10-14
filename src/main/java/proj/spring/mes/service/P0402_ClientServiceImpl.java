package proj.spring.mes.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import proj.spring.mes.dao.mapper.P0402_ClientMapperDAO;
import proj.spring.mes.dto.P0402_ClientDTO;

import java.util.List;

@Service
public class P0402_ClientServiceImpl implements P0402_ClientService {

 private static final Logger log = LoggerFactory.getLogger(P0402_ClientServiceImpl.class);
 private final P0402_ClientMapperDAO clientDAO;

 public P0402_ClientServiceImpl(P0402_ClientMapperDAO clientDAO) { this.clientDAO = clientDAO; }

 public List<P0402_ClientDTO> findClients(String clientNo, String clientName, String clientTel,
                                          String workerId, int offset, int size) {
     if (offset < 0) offset = 0;
     if (size < 1) size = 1;
     int startRow = offset;           // 0부터 시작
     int endRow   = offset + size;    // 포함 상한
     return clientDAO.findClients(
             blankToNull(clientNo), blankToNull(clientName),
             blankToNull(clientTel), blankToNull(workerId),
             startRow, endRow
     );
 }

 public int countClients(String clientNo, String clientName, String clientTel, String workerId) {
     return clientDAO.countClients(
             blankToNull(clientNo), blankToNull(clientName),
             blankToNull(clientTel), blankToNull(workerId)
     );
 }

 public void insertClient(P0402_ClientDTO dto) {
     if (dto == null) throw new IllegalArgumentException("dto must not be null");
     int affected = clientDAO.insertClient(dto);
     log.debug("insertClient affected={}", new Object[]{affected});
 }

 public void deleteByIds(java.util.List<Long> ids) {
     if (ids == null || ids.isEmpty()) return;
     int affected = clientDAO.deleteByIds(ids);
     log.debug("deleteByIds size={}, affected={}", new Object[]{ids.size(), affected});
 }

 private String blankToNull(String s) {
     if (s == null) return null;
     String t = s.trim();
     return t.length() == 0 ? null : t;
 }
}
