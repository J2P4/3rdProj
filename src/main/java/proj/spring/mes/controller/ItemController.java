package proj.spring.mes.controller;                   

import org.springframework.stereotype.Controller;         
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.ui.Model;

import java.util.List; 
import java.util.Map;  

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.util.UriComponentsBuilder;

import proj.spring.mes.dto.ItemDTO;
import proj.spring.mes.service.ItemService;             
@Controller                                              
public class ItemController {

    @Autowired                                         
    private ItemService itemService;

    @RequestMapping("/itemlist")                       
    public String itemlist(
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
        long totalCount = itemService.count();           // DB에서 아이템 총 개수 조회(서비스에 count() 구현 필요)

        // ===================== 3) 총 페이지 수 계산 및 현재 페이지 보정 =====================
        int totalPages = (int) Math.ceil((double) totalCount / pagePerRows); // 총 페이지 수 = 올림(총건수/페이지당수)
        if (totalPages == 0) totalPages = 1;             // 데이터 0건일 때도 1페이지로 표시
        if (page > totalPages) page = totalPages;        // 요청 페이지가 마지막 페이지 초과하면 마지막 페이지로 보정

        // ===================== 4) 목록 조회 =====================
        //실제 OFFSET 계산((page-1)*pagePerRows)은 Service/Mapper에서 처리하도록 위임
        model.addAttribute("list", itemService.list(page, pagePerRows)); // 현재 페이지에 해당하는 데이터 목록

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

        return "04_standard/04_3_standard_item.tiles";
    }
    
    
    
    
    
    
    
    
    
    
    
    
    // 💡 추가: 거래처 목록 JSON API 엔드포인트
    @RequestMapping("/client/list") 
    @ResponseBody // 필수: 이 어노테이션이 JSON 응답을 담당합니다.
    public List<Map<String, Object>> clientlist() { 
        return itemService.clientlist(); 
    }
    
    
    

@RequestMapping(value = "/item/delete", method = org.springframework.web.bind.annotation.RequestMethod.POST)
public String deleteItems(
        @RequestParam("ids") String ids,
        @RequestParam(value = "page", required = false, defaultValue = "1") int page,
        @RequestParam(value = "size", required = false, defaultValue = "10") int size,
        @RequestParam(value = "itemNo",   required = false) String itemNo,
        @RequestParam(value = "itemName", required = false) String itemName,
        @RequestParam(value = "item_div", required = false) String itemDiv,
        @RequestParam(value = "item_min", required = false) String itemMin,
        @RequestParam(value = "item_max", required = false) String itemMax,
        org.springframework.web.servlet.mvc.support.RedirectAttributes ra
) {
    // ids 파싱 (공백/중복 제거, 순서 보존)
    java.util.LinkedHashSet<String> set = new java.util.LinkedHashSet<String>();
    if (ids != null) {
        String[] arr = ids.split(",");
        for (int i = 0; i < arr.length; i++) {
            String s = arr[i];
            if (s == null) continue;
            s = s.trim();
            if (s.length() > 0) set.add(s);
        }
    }
    java.util.List<String> idList = new java.util.ArrayList<String>(set);

    int deleted = itemService.removeAll(idList);
    ra.addFlashAttribute("msg", deleted + "건 삭제되었습니다.");

    // 리다이렉트 URL 구성 (자동 인코딩, Checked 예외 없음)
    UriComponentsBuilder b = UriComponentsBuilder.fromPath("/itemlist")
            .queryParam("page", page)
            .queryParam("size", size);

    if (itemNo   != null && itemNo.length()   > 0) b.queryParam("itemNo",   itemNo);
    if (itemName != null && itemName.length() > 0) b.queryParam("itemName", itemName);
    if (itemDiv  != null && itemDiv.length()  > 0) b.queryParam("item_div", itemDiv);
    if (itemMin  != null && itemMin.length()  > 0) b.queryParam("item_min", itemMin);
    if (itemMax  != null && itemMax.length()  > 0) b.queryParam("item_max", itemMax);

    return "redirect:" + b.build().encode().toUriString();
}
    


@RequestMapping("/item/detail")
@ResponseBody
public ItemDTO detail(@RequestParam("item_id") String item_id) {
    ItemDTO dto = itemService.get(item_id);
    System.out.println(dto);
    return dto;
}



@RequestMapping("/item/save")
@ResponseBody
public ItemDTO edit(@RequestParam("item_id") String item_id) {
    ItemDTO dto = itemService.get(item_id);
    System.out.println(dto);
    return dto;
}
    
    
    

@RequestMapping(value="/item/save", method=RequestMethod.POST)
@ResponseBody
public ItemDTO save(
    @RequestParam(value="item_id",   required=false) String item_id, 
    @RequestParam("item_name") String item_name,
    @RequestParam("item_div")  String item_div,
    @RequestParam("item_price") int item_price,
    @RequestParam("item_unit") String item_unit
) {
    ItemDTO dto = new ItemDTO();
    dto.setItem_id(item_id);
    dto.setItem_name(item_name);
    dto.setItem_div(item_div);
    dto.setItem_price(item_price);
    dto.setItem_unit(item_unit);

    if (item_id == null || item_id.isEmpty()) {
        itemService.add(dto);
        // dto = itemService.get(dto.getItem_id());
    } else {
        itemService.edit(dto);
    }
    return dto;
}















    
}