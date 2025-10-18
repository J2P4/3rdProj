package proj.spring.mes.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import proj.spring.mes.dto.P0402_ClientDTO;
import proj.spring.mes.service.P0402_ClientService;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class P0402_ClientCtrl {

    private static final Logger logger = LoggerFactory.getLogger(P0402_ClientCtrl.class);

    @Autowired
    private P0402_ClientService clientService;

    /** 리스트 화면 (JSP) */
    @RequestMapping(value = {"/clientlist", "/client/list"}, method = RequestMethod.GET)
    public String clientlist(
            @RequestParam(value = "client_id", required = false) String client_id,
            @RequestParam(value = "clientName", required = false) String clientName,
            @RequestParam(value = "clientTel", required = false) String clientTel,
            @RequestParam(value = "workerId", required = false) String workerId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            Model model
    ) {
        if (page < 1) page = 1;
        if (size < 1) size = 1;
        int offset = (page - 1) * size;

        List<P0402_ClientDTO> list = clientService.findClients(
                client_id, clientName, clientTel, workerId, offset, size
        );

        int totalRows = clientService.countClients(client_id, clientName, clientTel, workerId);
        if (totalRows < 0) totalRows = 0;

        int totalPages = (int) Math.ceil((double) totalRows / (double) size);
        if (totalPages <= 0) totalPages = 1;

        int blockSize = 10;
        int currentBlock = (int) Math.ceil((double) page / (double) blockSize);
        int startPage = (currentBlock - 1) * blockSize + 1;
        int endPage = startPage + blockSize - 1;
        if (endPage > totalPages) endPage = totalPages;

        boolean hasPrevBlock = startPage > 1;
        boolean hasNextBlock = endPage < totalPages;
        int prevBlockStart = startPage - blockSize;
        if (prevBlockStart < 1) prevBlockStart = 1;
        int nextBlockStart = endPage + 1;
        if (nextBlockStart > totalPages) nextBlockStart = totalPages;

        model.addAttribute("list", list);
        model.addAttribute("page", page);
        model.addAttribute("pagePerRows", size);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("startPage", startPage);
        model.addAttribute("endPage", endPage);
        model.addAttribute("hasPrevBlock", hasPrevBlock);
        model.addAttribute("hasNextBlock", hasNextBlock);
        model.addAttribute("prevBlockStart", prevBlockStart);
        model.addAttribute("nextBlockStart", nextBlockStart);

        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("client_id", client_id == null ? "" : client_id);
        paramMap.put("clientName", clientName == null ? "" : clientName);
        paramMap.put("clientTel", clientTel == null ? "" : clientTel);
        paramMap.put("workerId", workerId == null ? "" : workerId);
        model.addAttribute("param", paramMap);

        logger.info("Loaded client list: page={}, size={}, totalRows={}", new Object[]{page, size, totalRows});
        return "04_standard/04_2_standard_client.tiles";
    }

    /** JSON 엔드포인트 (프런트에서 거래처 드롭다운 채우기용) */
    @RequestMapping(value = "/api/clients", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    @ResponseBody
    public List<P0402_ClientDTO> apiClientList(
            @RequestParam(value = "client_id", required = false) String client_id,
            @RequestParam(value = "clientName", required = false) String clientName,
            @RequestParam(value = "clientTel", required = false) String clientTel,
            @RequestParam(value = "workerId", required = false) String workerId,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "1000") int size
    ) {
        if (page < 1) page = 1;
        if (size < 1) size = 1;
        int offset = (page - 1) * size;

        List<P0402_ClientDTO> list = clientService.findClients(
                client_id, clientName, clientTel, workerId, offset, size
        );
        int count = (list == null) ? 0 : list.size();
        logger.info("Loaded client list (api): {}", new Object[]{count});

        return (list == null) ? Collections.<P0402_ClientDTO>emptyList() : list;
    }

    /** 등록 */
    @RequestMapping(value = "/client/insert", method = RequestMethod.POST)
    public String insertClient(
            @ModelAttribute P0402_ClientDTO dto,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "client_id", required = false) String client_id,
            @RequestParam(value = "clientName", required = false) String clientName,
            @RequestParam(value = "clientTel", required = false) String clientTel,
            @RequestParam(value = "workerId", required = false) String workerId,
            RedirectAttributes ra
    ) {
        if (dto == null) throw new IllegalArgumentException("dto must not be null");
        clientService.insertClient(dto);
        logger.info("Inserted client: {}", new Object[]{dto});

        ra.addAttribute("page", page);
        ra.addAttribute("size", size);
        ra.addAttribute("client_id", client_id);
        ra.addAttribute("clientName", clientName);
        ra.addAttribute("clientTel", clientTel);
        ra.addAttribute("workerId", workerId);
        return "redirect:/clientlist";
    }

    /** 삭제 */
    @RequestMapping(value = "/client/delete", method = RequestMethod.POST)
    public String deleteClients(
            @RequestParam("ids") String idsCsv,
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestParam(value = "client_id", required = false) String client_id,
            @RequestParam(value = "clientName", required = false) String clientName,
            @RequestParam(value = "clientTel", required = false) String clientTel,
            @RequestParam(value = "workerId", required = false) String workerId,
            RedirectAttributes ra
    ) {
        List<Long> ids = new ArrayList<Long>();
        if (idsCsv != null) {
            String[] parts = idsCsv.split(",");
            for (int i = 0; i < parts.length; i++) {
                String s = parts[i];
                if (s != null) {
                    String t = s.trim();
                    if (t.length() > 0) {
                        try {
                            ids.add(Long.valueOf(t));
                        } catch (NumberFormatException ignore) {}
                    }
                }
            }
        }

        if (!ids.isEmpty()) {
            clientService.deleteByIds(ids);
            logger.info("Deleted clients: {}", new Object[]{ids});
        }

        ra.addAttribute("page", page);
        ra.addAttribute("size", size);
        ra.addAttribute("client_id", client_id);
        ra.addAttribute("clientName", clientName);
        ra.addAttribute("clientTel", clientTel);
        ra.addAttribute("workerId", workerId);
        return "redirect:/clientlist";
    }

    /** 상세 조회 */
    @RequestMapping("/client/detail")
    @ResponseBody
    public P0402_ClientDTO detail(@RequestParam("client_id") String client_id) {
        P0402_ClientDTO dto = clientService.get(client_id);
        System.out.println(dto);
        return dto;
    }

    /** 테스트용 (미사용 가능) */
    @RequestMapping("/client/save")
    @ResponseBody
    public P0402_ClientDTO edit(@RequestParam("client_id") String client_id) {
        P0402_ClientDTO dto = clientService.get(client_id);
        System.out.println(dto);
        return dto;
    }

    /** 업데이트(JSON 응답) */
    @RequestMapping(value = "/client/update", method = RequestMethod.POST, produces = "application/json")
    @ResponseBody
    public P0402_ClientDTO update(@ModelAttribute P0402_ClientDTO dto) {
        try {
            P0402_ClientDTO updatedDto = clientService.update(dto);
            if (updatedDto != null) {
                logger.info("Updated client: {}", updatedDto.getClient_id());
                return updatedDto;
            } else {
                logger.warn("Update failed: Client ID not found: {}", dto.getClient_id());
                return null;
            }
        } catch (IllegalArgumentException e) {
            logger.error("Update request error (Bad Request): {}", e.getMessage());
            return null;
        } catch (Exception e) {
            logger.error("Internal server error during update", e);
            return null;
        }
    }
}
