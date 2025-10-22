package proj.spring.mes.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import proj.spring.mes.dto.P0405_ProcessDTO;
import proj.spring.mes.service.P0405_ProcessService;

@Controller("p0405ProcessCtrl") // 빈 이름 명시(충돌 예방)
public class P0405_ProcessCtrl {

    private static final Logger logger = LoggerFactory.getLogger(P0405_ProcessCtrl.class);

    @Autowired
    P0405_ProcessService service;

    /** 모든 String 파라미터 trim + 빈문자 → null */
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
    }

    // ===== 목록 =====  GET /processlist  (요구사항)
    @GetMapping("/processlist")
    public String processList(Model model,
            @RequestParam(value = "size", required = false, defaultValue = "10") int pagePerRows,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            P0405_ProcessDTO searchFilter) {

        logger.info("[PROCESS/LIST] in page={}, size={}", page, pagePerRows);
        logger.info("[PROCESS/LIST] filter={}", searchFilter);

        // 1) 입력값 보정
        int minSize = 1, maxSize = 100;
        pagePerRows = Math.max(minSize, Math.min(pagePerRows, maxSize));
        page = Math.max(page, 1);

        // 2) 전체 카운트
        long totalCount = service.count(searchFilter);
        logger.info("[PROCESS/LIST] count={}", totalCount);

        // 3) 총 페이지 / 현재 페이지 보정
        int totalPages = (int) Math.ceil((double) totalCount / pagePerRows);
        if (totalPages == 0) totalPages = 1;
        if (page > totalPages) page = totalPages;

        // 4) 목록 조회 (페이징)
        List<P0405_ProcessDTO> list = service.list(page, pagePerRows, searchFilter);
        logger.info("[PROCESS/LIST] listSize={}", (list == null ? null : list.size()));

        // 5) 블록 페이지네이션
        final int blockSize = 10;
        int currentBlock = (int) Math.ceil((double) page / blockSize);
        int startPage = (currentBlock - 1) * blockSize + 1;
        int endPage = Math.min(startPage + blockSize - 1, totalPages);

        boolean hasPrevBlock = startPage > 1;
        boolean hasNextBlock = endPage < totalPages;
        int prevBlockStart = Math.max(startPage - blockSize, 1);
        int nextBlockStart = Math.min(startPage + blockSize, totalPages);

        //  품목 목록 유지
        List<P0405_ProcessDTO> itemList = service.processItem();

       
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, false);

        String itemListJson;
        try {
            String rawJson = objectMapper.writeValueAsString(itemList);
            itemListJson = rawJson.replaceAll("[\n\r]", "")
                                  .replaceAll("'", "\\\\'")
                                  .replaceAll("\"", "\\\\\"")
                                  .replaceAll("`", "\\\\`");
        } catch (JsonProcessingException e) {
            logger.error("itemList JSON 직렬화 실패", e);
            itemListJson = "[]";
        }

        // 모델 바인딩
        model.addAttribute("pagePerRows", pagePerRows);
        model.addAttribute("page", page);
        model.addAttribute("totalCount", totalCount);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("startPage", startPage);
        model.addAttribute("endPage", endPage);
        model.addAttribute("hasPrevBlock", hasPrevBlock);
        model.addAttribute("hasNextBlock", hasNextBlock);
        model.addAttribute("prevBlockStart", prevBlockStart);
        model.addAttribute("nextBlockStart", nextBlockStart);
        model.addAttribute("filter", searchFilter);

        model.addAttribute("list", list);
        model.addAttribute("itemList", itemList);
        model.addAttribute("itemListJson", itemListJson);

        logger.info("[PROCESS/LIST] out page={}, size={}", page, pagePerRows);
        logger.info("[PROCESS/LIST] out totalPages={}, listSize={}", totalPages, (list == null ? null : list.size()));

        return "04_standard/04_5_standard_process.tiles";
    }

    // ===== 상세 =====  GET /processdetail?process_id=...
    @GetMapping("/processdetail")
    @ResponseBody
    public P0405_ProcessDTO detail(@RequestParam("process_id") String process_id) {
        logger.info("[PROCESS/DETAIL] id={}", process_id);
        P0405_ProcessDTO dto = service.getOneprocess(process_id);
        logger.debug("[PROCESS/DETAIL] dto={}", dto);
        return dto;
     }

    // ===== 등록 =====  POST /processinsert
    @PostMapping("/processinsert")
    @ResponseBody
    public String insert(P0405_ProcessDTO dto) {
        logger.info("[PROCESS/INSERT] dto={}", dto);
        int result = service.addprocess(dto);
        logger.info("[PROCESS/INSERT] result={}", result);
        return result > 0 ? "success" : "fail";
    }

    // ===== 수정 =====  POST /processupdate
    @PostMapping("/processupdate")
    @ResponseBody
    public String update(P0405_ProcessDTO dto) {
        logger.info("[PROCESS/UPDATE] dto={}", dto);
        int result = service.editprocess(dto);
        logger.info("[PROCESS/UPDATE] result={}", result);
        return result > 0 ? "success" : "fail";
    }

    // ===== 삭제 =====  POST /processdelete
    @PostMapping("/processdelete")
    @ResponseBody
    public String deleteprocesss(@RequestBody List<String> processIds) { // 메서드명 유지
        logger.info("[PROCESS/DELETE] ids={}", processIds);
        if (processIds == null || processIds.isEmpty()) return "fail";
        int deletedCount = service.removeprocesss(processIds); // 서비스 메서드명 유지
        logger.info("[PROCESS/DELETE] deletedCount={}, requested={}", deletedCount, (processIds == null ? null : processIds.size()));
        return (deletedCount == (processIds == null ? 0 : processIds.size())) ? "success" : "fail";
    }
}
