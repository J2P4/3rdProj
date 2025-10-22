package proj.spring.mes.controller;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import proj.spring.mes.dto.ItemDTO;
import proj.spring.mes.dto.P0501_CPDTO;
import proj.spring.mes.service.P0501_CPService;

@Controller
public class P0501_CPCtrl {

private static final Logger logger = LoggerFactory.getLogger(P0501_CPCtrl.class);
	
	@Autowired
	P0501_CPService CPService;
	
	
	// ===============================================================
    // [1] 목록 페이지 (JSP 렌더)
    // ===============================================================
    @RequestMapping(value = "/cp", method = RequestMethod.GET)
    public String cp(
            Model model,
            @RequestParam(value = "size", required = false, defaultValue = "10") int pagePerRows,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            P0501_CPDTO searchFilter) {

        // ① 파라미터 보정
        int minSize = 1;
        int maxSize = 100;
        pagePerRows = Math.max(minSize, Math.min(pagePerRows, maxSize));
        page = Math.max(page, 1);

        // ② 전체 건수
        long totalCount = CPService.count(searchFilter);

        // ③ 총 페이지 및 현재 페이지 보정
        int totalPages = (int) Math.ceil((double) totalCount / pagePerRows);
        if (totalPages == 0) totalPages = 1;
        if (page > totalPages) page = totalPages;

        // ④ 목록 데이터
        List<P0501_CPDTO> list = CPService.list(page, pagePerRows, searchFilter);
        model.addAttribute("list", list);

        // ⑤ 페이지 블록 계산
        final int blockSize = 10;
        int currentBlock = (int) Math.ceil((double) page / blockSize);
        int startPage = (currentBlock - 1) * blockSize + 1;
        int endPage = Math.min(startPage + blockSize - 1, totalPages);

        boolean hasPrevBlock = startPage > 1;
        boolean hasNextBlock = endPage < totalPages;
        int prevBlockStart = Math.max(startPage - blockSize, 1);
        int nextBlockStart = Math.min(startPage + blockSize, totalPages);

        // ⑥ JSP 전달값
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

        // 품목 목록
        List<ItemDTO> itemList = CPService.itemList();
        model.addAttribute("itemList", itemList);

        logger.info("사원 목록 페이지");
        return "05_production/05_1_cp.tiles";
    }

    // ===============================================================
    // [2] 신규 등록 (AJAX, JSON 응답)
    // ===============================================================
    @RequestMapping(value = "/cpinsert", method = RequestMethod.POST, produces = "application/json; charset=UTF-8")
    @ResponseBody
    public Map<String, Object> insertAjax(
            @ModelAttribute P0501_CPDTO dto,
            HttpServletRequest request) {

        Map<String, Object> res = new HashMap<String, Object>();
        try {
            boolean isAjax = "XMLHttpRequest".equals(request.getHeader("X-Requested-With"));
            logger.debug("insertAjax() ajax?={} dto={}", isAjax, dto);

            // --- 1) 유효성 검사 ---
            if (dto.getCp_start() == null) return fail(res, "시작일은 필수입니다.");
            if (dto.getCp_end() == null) return fail(res, "종료일은 필수입니다.");
            if (isBlank(dto.getItem_id())) return fail(res, "품목을 선택하세요.");
            if (isBlank(dto.getCp_amount())) return fail(res, "수량을 입력하세요.");

            // --- 2) 등록 처리 ---
            CPService.add(dto);
            if (isBlank(dto.getCp_id())) return fail(res, "등록 실패(계획ID 생성 실패).");

            // --- 5) 품목명 조회 ---
            String itemName = null;
            try {
                ItemDTO d = CPService.getItemName(dto.getItem_id()); 
                if (d != null) itemName = d.getItem_name();
            } catch (Exception ignore) {}

            // --- 6) JSON 결과 ---
            res.put("ok", true);
            res.put("message", "등록되었습니다.");
            res.put("cp_id", dto.getCp_id());
            res.put("cp_start", new SimpleDateFormat("yyyy-MM-dd").format(dto.getCp_start()));
            res.put("cp_end", new SimpleDateFormat("yyyy-MM-dd").format(dto.getCp_end()));
            res.put("item_name", itemName);
            res.put("cp_amount", dto.getCp_amount());

            return res;
        } catch (Exception e) {
            logger.error("insertAjax error", e);
            return fail(res, "서버 오류: " + e.getMessage());
        }
    }

    // ===============================================================
    // [3] 상세 보기 (JSON)
    // ===============================================================
    @RequestMapping(value = "/cpdetail", method = RequestMethod.GET, produces = "application/json; charset=UTF-8")
    @ResponseBody
    public P0501_CPDTO detail(@RequestParam("cp_id") String cp_id) {
        if (isBlank(cp_id)) return null;
        return CPService.get(cp_id);
    }

    // ===============================================================
    // [4] 수정
    // ===============================================================
    @RequestMapping(value="/cpupdate", method=RequestMethod.POST, produces="application/json; charset=UTF-8")
    @ResponseBody
    public Map<String,Object> cpupdate(@ModelAttribute P0501_CPDTO dto) {
        Map<String,Object> res = new HashMap<String, Object>();
        try {
            System.out.println("cpupdate dto=" + dto);
            CPService.edit(dto);
            res.put("ok", true);
            res.put("message", "수정되었습니다.");
        } catch(Exception e) {
            e.printStackTrace();
            res.put("ok", false);
            res.put("message", "오류: " + e.getMessage());
        }
        return res;
    }

    
    // ===============================================================
    // [5] 삭제
    // ===============================================================
    @RequestMapping(value = "/cpdelete", method = RequestMethod.POST)
    public String delete(
            @RequestParam(value = "many_cps", required = false) List<String> many_cps,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            RedirectAttributes re) {

        if (many_cps == null || many_cps.isEmpty()) {
            re.addFlashAttribute("msg", "선택된 항목이 없습니다.");
            re.addAttribute("page", page);
            re.addAttribute("size", size);
            return "redirect:/cp";
        }

        int deleted = CPService.deleteCPs(many_cps);
        re.addFlashAttribute("msg", deleted + "건 삭제했습니다.");
        re.addAttribute("page", page);
        re.addAttribute("size", size);

        return "redirect:/cp";
    }

    // ===============================================================
    // [공통 유틸 메서드]
    // ===============================================================
    private boolean isBlank(int i) {
    	return i == 0;
    }
    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private Map<String, Object> fail(Map<String, Object> res, String msg) {
        res.put("ok", false);
        res.put("message", msg);
        return res;
    }
}
