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

import proj.spring.mes.dto.DeptDTO;
import proj.spring.mes.dto.WorkerDTO;
import proj.spring.mes.service.WorkerService;

@Controller
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    WorkerService workerService;

    // ===============================================================
    // [1] 목록 페이지 (JSP 렌더)
    // ===============================================================
    @RequestMapping(value = "/workerlist", method = RequestMethod.GET)
    public String workerlist(
            Model model,
            @RequestParam(value = "size", required = false, defaultValue = "10") int pagePerRows,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            WorkerDTO searchFilter) {

        // ① 파라미터 보정
        int minSize = 1;
        int maxSize = 100;
        pagePerRows = Math.max(minSize, Math.min(pagePerRows, maxSize));
        page = Math.max(page, 1);

        // ② 전체 건수
        long totalCount = workerService.count(searchFilter);

        // ③ 총 페이지 및 현재 페이지 보정
        int totalPages = (int) Math.ceil((double) totalCount / pagePerRows);
        if (totalPages == 0) totalPages = 1;
        if (page > totalPages) page = totalPages;

        // ④ 목록 데이터
        List<WorkerDTO> list = workerService.list(page, pagePerRows, searchFilter);
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

        // 부서 목록
        List<DeptDTO> deptList = workerService.deptList();
        model.addAttribute("deptList", deptList);

        logger.info("사원 목록 페이지");
        return "02_user/02_user.tiles";
    }

    // ===============================================================
    // [2] 신규 등록 (AJAX, JSON 응답)
    // ===============================================================
    @RequestMapping(value = "/workerinsert", method = RequestMethod.POST, produces = "application/json; charset=UTF-8")
    @ResponseBody
    public Map<String, Object> insertAjax(
            @ModelAttribute WorkerDTO dto,
            @RequestParam(required = false) String person_email,
            @RequestParam(required = false) String domain_email,
            HttpServletRequest request) {

        Map<String, Object> res = new HashMap<String, Object>();
        try {
            boolean isAjax = "XMLHttpRequest".equals(request.getHeader("X-Requested-With"));
            logger.debug("insertAjax() ajax?={} dto={}", isAjax, dto);

            // --- 1) 유효성 검사 ---
            if (isBlank(dto.getWorker_name())) return fail(res, "이름은 필수입니다.");
            if (dto.getWorker_birth() == null) return fail(res, "생년월일은 필수입니다.");
            if (dto.getWorker_join() == null) return fail(res, "입사일은 필수입니다.");
            if (isBlank(dto.getDepartment_id())) return fail(res, "부서를 선택하세요.");
            if (isBlank(dto.getWorker_code()) || "1".equals(dto.getWorker_code()))
                return fail(res, "권한을 선택하세요.");

            // --- 2) 이메일 합치기 ---
            if ((dto.getWorker_email() == null || dto.getWorker_email().isEmpty())
                    && person_email != null && !person_email.isEmpty()
                    && domain_email != null && !domain_email.isEmpty()) {
                dto.setWorker_email(person_email + "@" + domain_email);
            }

            // --- 3) 초기 비밀번호 = j2p4mes ---
            dto.setWorker_pw("j2p4mes");

            // --- 4) 등록 처리 ---
            workerService.add(dto);
            if (isBlank(dto.getWorker_id())) return fail(res, "등록 실패(사번 생성 실패).");

            // --- 5) 부서명 조회 ---
            String deptName = null;
            try {
                DeptDTO d = workerService.getDeptName(dto.getDepartment_id()); // 또는 getDeptName(...)
                if (d != null) deptName = d.getDepartment_name();
            } catch (Exception ignore) {}

            // --- 6) JSON 결과 ---
            res.put("ok", true);
            res.put("message", "등록되었습니다.");
            res.put("worker_id", dto.getWorker_id());
            res.put("worker_name", dto.getWorker_name());
            res.put("worker_email", dto.getWorker_email());
            res.put("worker_code", dto.getWorker_code());
            res.put("worker_join", new SimpleDateFormat("yyyy-MM-dd").format(dto.getWorker_join()));
            res.put("worker_birth", new SimpleDateFormat("yyyy-MM-dd").format(dto.getWorker_birth()));
            res.put("department_name", deptName);
            res.put("temp_pw", "j2p4mes");

            return res;
        } catch (Exception e) {
            logger.error("insertAjax error", e);
            return fail(res, "서버 오류: " + e.getMessage());
        }
    }

    // ===============================================================
    // [3] 상세 보기 (JSON)
    // ===============================================================
    @RequestMapping(value = "/workerDetail", method = RequestMethod.GET, produces = "application/json; charset=UTF-8")
    @ResponseBody
    public WorkerDTO detail(@RequestParam("worker_id") String workerId) {
        if (isBlank(workerId)) return null;
        return workerService.get(workerId);
    }

    // ===============================================================
    // [4] 수정
    // ===============================================================
    @RequestMapping(value="/workerUpdate", method=RequestMethod.POST, produces="application/json; charset=UTF-8")
    @ResponseBody
    public Map<String,Object> workerUpdate(@ModelAttribute WorkerDTO dto) {
        Map<String,Object> res = new HashMap<String, Object>();
        try {
            System.out.println("workerUpdate dto=" + dto);
            workerService.edit(dto);
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
    @RequestMapping(value = "/workerDelete", method = RequestMethod.POST)
    public String delete(
            @RequestParam(value = "many_workers", required = false) List<String> many_workers,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            RedirectAttributes re) {

        if (many_workers == null || many_workers.isEmpty()) {
            re.addFlashAttribute("msg", "선택된 항목이 없습니다.");
            re.addAttribute("page", page);
            re.addAttribute("size", size);
            return "redirect:/workerlist";
        }

        int deleted = workerService.deleteWorkers(many_workers);
        re.addFlashAttribute("msg", deleted + "건 삭제했습니다.");
        re.addAttribute("page", page);
        re.addAttribute("size", size);

        return "redirect:/workerlist";
    }

    // ===============================================================
    // [공통 유틸 메서드]
    // ===============================================================
    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private Map<String, Object> fail(Map<String, Object> res, String msg) {
        res.put("ok", false);
        res.put("message", msg);
        return res;
    }
}
