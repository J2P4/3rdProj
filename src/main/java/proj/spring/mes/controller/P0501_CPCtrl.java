package proj.spring.mes.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import proj.spring.mes.dto.ItemDTO;
import proj.spring.mes.dto.P0501_CPDTO;
import proj.spring.mes.service.P0501_CPService;

public class P0501_CPCtrl {

private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	@Autowired
	P0501_CPService CPService;
	
	
	/** 목록 */
	@RequestMapping("/CPlist")
    public String list(
    		Model model,
    		@RequestParam(value = "size", required = false, defaultValue = "10") int pagePerRows, // 페이지당 행 수 파라미터 (기본 10)
            @RequestParam(value = "page", required = false, defaultValue = "1")  int page         // 현재 페이지 번호 파라미터 (기본 1, 1-base)
            ) {
        
     // ===================== 1) 입력값 방어/보정 =====================
        int minSize = 1;                                 // 한 페이지 최소 1행
        int maxSize = 100;                               // 과도한 요청 방지: 최대 100행까지만 허용
        pagePerRows = Math.max(minSize, Math.min(pagePerRows, maxSize)); // 범위를 벗어나면 보정
        page = Math.max(page, 1);                        // 페이지는 1보다 작을 수 없음(1-base 유지)

        // ===================== 2) 전체 레코드 수 조회 =====================
        long totalCount = CPService.count();        // DB에서 아이템 총 개수 조회(서비스에 count() 구현 필요)

        // ===================== 3) 총 페이지 수 계산 및 현재 페이지 보정 =====================
        int totalPages = (int) Math.ceil((double) totalCount / pagePerRows); // 총 페이지 수 = 올림(총건수/페이지당수)
        if (totalPages == 0) totalPages = 1;             // 데이터 0건일 때도 1페이지로 표시
        if (page > totalPages) page = totalPages;        // 요청 페이지가 마지막 페이지 초과하면 마지막 페이지로 보정

        // ===================== 4) 목록 조회 =====================
        List<P0501_CPDTO> list = CPService.list(page, pagePerRows);
        //실제 OFFSET 계산((page-1)*pagePerRows)은 Service/Mapper에서 처리하도록 위임
        model.addAttribute("list", list); // 현재 페이지에 해당하는 데이터 목록

        // ===================== 5) 블록 페이지네이션 계산(10개 단위) =====================
        final int blockSize = 10;                        // 페이지 번호를 묶어서 보여주기
        int currentBlock = (int) Math.ceil((double) page / blockSize); // 현재 페이지가 속한 블록 번호
        int startPage = (currentBlock - 1) * blockSize + 1;            // 블록 시작 페이지: …
        int endPage   = Math.min(startPage + blockSize - 1, totalPages); // 블록 끝 페이지

        // 블록 이동 가능 여부/대상 계산
        boolean hasPrevBlock  = startPage > 1;           // 시작 페이지가 1보다 크면 이전 블록 존재 (예: 11~20 블록이면 이전 블록은 1~10)
        boolean hasNextBlock  = endPage < totalPages;    // 끝 페이지가 총 페이지보다 작으면 다음 블록 존재
        int prevBlockStart    = Math.max(startPage - blockSize, 1);     // 이전 블록의 시작 페이지 (예: 11→1)
        int nextBlockStart    = Math.min(startPage + blockSize, totalPages); // 다음 블록의 시작 페이지 (예: 1→11)

        // ===================== 6) JSP로 전달할 모델 속성들 =====================
        model.addAttribute("pagePerRows", pagePerRows);  // 페이지당 행 수 (JSP: Rows 셀렉터 selected 처리)
        model.addAttribute("page", page);                // 현재 페이지 번호 (JSP: 현재 페이지 강조)
        model.addAttribute("totalCount", totalCount);    // 총 레코드 수 (JSP: 총계 표기)
        model.addAttribute("totalPages", totalPages);    // 총 페이지 수   (JSP: 루프/표기)
        model.addAttribute("startPage", startPage);      // 현재 블록 시작 번호
        model.addAttribute("endPage", endPage);          // 현재 블록 끝 번호
        model.addAttribute("hasPrevBlock", hasPrevBlock);// 이전 블록 존재 여부 (JSP: "이전" 활성/비활성)
        model.addAttribute("hasNextBlock", hasNextBlock);// 다음 블록 존재 여부 (JSP: "다음" 활성/비활성)
        model.addAttribute("prevBlockStart", prevBlockStart); // 이전 블록이동 시 타깃 페이지(예: 11→1)
        model.addAttribute("nextBlockStart", nextBlockStart); // 다음 블록이동 시 타깃 페이지(예: 1→11)

        List<ItemDTO> itemList = CPService.itemList();
        model.addAttribute("itemList", itemList);
        
        System.out.println("목록페이지");
        
        
        return "02_user/02_user.tiles"; 
    }

    /** 상세 */
	@RequestMapping("/detail")
    public String detail(Model model, String cp_id) {
		
		P0501_CPDTO dto = CPService.get(cp_id);
        List<ItemDTO> itemList = CPService.itemList();
        
        model.addAttribute("dto", dto);
        model.addAttribute("itemList", itemList);
        
//        model.addAttribute("mode", "view"); // 읽기모드
        
        System.out.println("상세페이지");
        System.out.println("cp_id: "+cp_id);
        return "02_user/02_userDetail.tiles";
    }

    /** 등록 */
	@RequestMapping("/insert")
	public String insert(Model model, P0501_CPDTO dto) {
       
        
		CPService.add(dto);
        List<ItemDTO> itemList = CPService.itemList();
        
        // JSP에서 ${worker_id}로 접근 가능하도록 model에 담기
        model.addAttribute("cp_id", dto.getCp_id());
        model.addAttribute("CPdto", dto);
        model.addAttribute("itemList", itemList);
        
//        model.addAttribute("mode", "add"); // 등록 모드
        
        // 결과 페이지로 이동 
        return "02_user/02_userResult.tiles";
	}

	/** 수정 후 상세 */
	@RequestMapping("/modify")
	public String modify(Model model, P0501_CPDTO dto) {
		P0501_CPDTO CPdto = CPService.get(dto.getCp_id());
		List<ItemDTO> itemList = CPService.itemList();
		model.addAttribute("dto", CPdto);
		model.addAttribute("itemList", itemList);
		
		return "02_user/02_userModify.tiles";
	}
    /** 수정 후 상세 */
	@RequestMapping("/modifyDetail")
    public String modifyDetail(Model model, P0501_CPDTO dto) {
        
		CPService.edit(dto);
	    List<ItemDTO> itemList = CPService.itemList();

	    model.addAttribute("dto", dto);
        model.addAttribute("itemList", itemList);
        
        return "redirect:/detail?cp_id=" + dto.getCp_id();
    }

    /** 삭제 */
	@RequestMapping("/delete")
    public String delete(@RequestParam(value = "many_CPs", required = false) List<String> many_CPs,
    	    @RequestParam(defaultValue = "1") int page,
    	    @RequestParam(defaultValue = "10") int size,
    	    RedirectAttributes re
    	) {
    	    if (many_CPs == null || many_CPs.isEmpty()) {
    	    	re.addFlashAttribute("msg", "선택된 항목이 없습니다.");
    	    	re.addAttribute("page", page);
    	    	re.addAttribute("size", size);
    	        return "redirect:/list";
    	    }
    	    int deleted = CPService.deleteCPs(many_CPs);
    	    re.addFlashAttribute("msg", deleted + "건 삭제했습니다.");
    	    // ★ 삭제 후에도 보고 있던 페이지로 돌아가기
    	    re.addAttribute("page", page);
    	    re.addAttribute("size", size);
    	    return "redirect:/list";
    }
	
}
