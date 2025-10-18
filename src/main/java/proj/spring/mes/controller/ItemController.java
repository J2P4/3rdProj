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
        @RequestParam(value = "size", required = false, defaultValue = "10") int pagePerRows,
        @RequestParam(value = "page", required = false, defaultValue = "1")  int page
    ) {
        // ===================== 1) 입력값 방어/보정 =====================
        int minSize = 1;                                 // 한 페이지 최소 1행
        int maxSize = 100;                               // 과도한 요청 방지: 최대 100행까지만 허용
        pagePerRows = Math.max(minSize, Math.min(pagePerRows, maxSize));
        page = Math.max(page, 1);

        // ===================== 2) 전체 레코드 수 조회 =====================
        long totalCount = itemService.count();

        // ===================== 3) 총 페이지 수 계산 및 현재 페이지 보정 =====================
        int totalPages = (int) Math.ceil((double) totalCount / pagePerRows);
        if (totalPages == 0) totalPages = 1;
        if (page > totalPages) page = totalPages;

        // ===================== 4) 목록 조회 =====================
        model.addAttribute("list", itemService.list(page, pagePerRows));

        // ===================== 5) 블록 페이지네이션 계산(10개 단위) =====================
        final int blockSize = 10;
        int currentBlock = (int) Math.ceil((double) page / blockSize);
        int startPage = (currentBlock - 1) * blockSize + 1;
        int endPage   = Math.min(startPage + blockSize - 1, totalPages);

        boolean hasPrevBlock  = startPage > 1;
        boolean hasNextBlock  = endPage < totalPages;
        int prevBlockStart    = Math.max(startPage - blockSize, 1);
        int nextBlockStart    = Math.min(startPage + blockSize, totalPages);

        // ===================== 6) JSP로 전달할 모델 속성들 =====================
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

        return "04_standard/04_3_standard_item.tiles";
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

        // 리다이렉트 URL 구성
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
        } else {
            itemService.edit(dto);
        }
        return dto;
    }

    // ================================================================
    // ★ 추가: /client/list (JSON) — 같은 경로 콘텐츠 협상용 핸들러
    //    - P0402_ClientCtrl 에서 /client/list (HTML) 핸들러가 있고,
    //      여기서는 동일 경로를 JSON으로만 책임집니다.
    //    - 프론트 fetch: headers.Accept=application/json 로 호출
    // ================================================================
    @RequestMapping(value="/client/list", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
    @ResponseBody
    public List<Map<String, Object>> clientListJson() {
        // ItemService에 존재하는 조회 메서드를 사용 (기존에 네가 보여준 시그니처 기준)
        return itemService.clientlist();
    }
}
