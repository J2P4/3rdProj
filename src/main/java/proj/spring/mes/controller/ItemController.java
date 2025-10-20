package proj.spring.mes.controller;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import proj.spring.mes.dto.ItemDTO;
import proj.spring.mes.service.ItemService;

@Controller
public class ItemController {

    @Autowired
    private ItemService itemService;

    /** 품목 리스트 (필터 검색 + 페이지네이션) */
    @RequestMapping("/itemlist")
    public String itemlist(
        Model model,
        @RequestParam(value = "size", required = false, defaultValue = "10") int pagePerRows,
        @RequestParam(value = "page", required = false, defaultValue = "1") int page,

        @RequestParam(value = "itemNo",   required = false) String itemNo,
        @RequestParam(value = "itemName", required = false) String itemName,
        @RequestParam(value = "item_div", required = false) String itemDiv,
        @RequestParam(value = "item_min", required = false) String itemMinStr,
        @RequestParam(value = "item_max", required = false) String itemMaxStr
    ) {
        boolean hasFilter = notEmpty(itemNo) || notEmpty(itemName) || notEmpty(itemDiv)
                         || notEmpty(itemMinStr) || notEmpty(itemMaxStr);

        if (pagePerRows <= 0) pagePerRows = 10;
        if (page <= 0) page = 1;

        long totalCount;
        List list;

        if (hasFilter) {
            String itemNoEsc   = escapeLike(itemNo);
            String itemNameEsc = escapeLike(itemName);
            String itemDivEsc  = escapeLike(itemDiv);
            Integer itemMin = parseInt(itemMinStr);
            Integer itemMax = parseInt(itemMaxStr);

            int start = (page - 1) * pagePerRows + 1;
            int end   = page * pagePerRows;

            Map<String,Object> p = new HashMap<String,Object>();
            p.put("itemNoEsc", itemNoEsc);
            p.put("itemNameEsc", itemNameEsc);
            p.put("itemDivEsc", itemDivEsc);
            p.put("itemMin", itemMin);
            p.put("itemMax", itemMax);
            p.put("start", start);
            p.put("end", end);

            totalCount = itemService.countBySearch(p);
            list = itemService.searchList(p);

            Map<String,Object> keep = new HashMap<String,Object>();
            keep.put("itemNo", itemNo);
            keep.put("itemName", itemName);
            keep.put("item_div", itemDiv);
            keep.put("item_min", itemMinStr);
            keep.put("item_max", itemMaxStr);
            model.addAttribute("param", keep);

        } else {
            totalCount = itemService.count();
            list = itemService.list(page, pagePerRows);
        }

        int totalPages = (int) Math.ceil((double) totalCount / pagePerRows);
        if (totalPages == 0) totalPages = 1;
        if (page > totalPages) page = totalPages;

        int blockSize = 10;
        int currentBlock = (page - 1) / blockSize;
        int startPage = currentBlock * blockSize + 1;
        int endPage = Math.min(startPage + blockSize - 1, totalPages);
        boolean hasPrevBlock = startPage > 1;
        boolean hasNextBlock = endPage < totalPages;
        int prevBlockStart = Math.max(1, startPage - blockSize);
        int nextBlockStart = endPage + 1;

        model.addAttribute("list", list);
        model.addAttribute("page", page);
        model.addAttribute("pagePerRows", pagePerRows);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("startPage", startPage);
        model.addAttribute("endPage", endPage);
        model.addAttribute("hasPrevBlock", hasPrevBlock);
        model.addAttribute("hasNextBlock", hasNextBlock);
        model.addAttribute("prevBlockStart", prevBlockStart);
        model.addAttribute("nextBlockStart", nextBlockStart);
        
        
        System.out.println("[DEBUG] params itemNo="+itemNo+", itemName="+itemName
        	    +", itemDiv="+itemDiv+", min="+itemMinStr+", max="+itemMaxStr);
        	System.out.println("[DEBUG] totalCountBySearch="+totalCount);
        	System.out.println("[DEBUG] list size="+(list==null?0:list.size()));


        return "04_standard/04_3_standard_item.tiles";
    }

    /** 단건 상세 */
    @RequestMapping("/item/detail")
    @ResponseBody
    public ItemDTO detail(@RequestParam("item_id") String item_id) {
        return itemService.get(item_id);
    }

    /** 저장(등록/수정) */
    @RequestMapping(value="/item/save", method=RequestMethod.GET)
    public String itemSaveGetRedirect() {
        return "redirect:/itemlist";
    }

    @RequestMapping(value="/item/save", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
    @ResponseBody
    public ItemDTO save(
        @RequestParam(value="item_id",   required=false)                   String item_id,
        @RequestParam(value="item_name", required=false, defaultValue="")  String item_name,
        @RequestParam(value="item_div",  required=false, defaultValue="")  String item_div,
        @RequestParam(value="item_price",required=false)                   Integer item_price,
        @RequestParam(value="item_unit", required=false, defaultValue="")  String item_unit,
        @RequestParam(value="client_id", required=false, defaultValue="")  String client_id
    ) {
        if (item_name == null || item_name.trim().length() == 0)
            throw new IllegalArgumentException("item_name required");
        if (item_div == null || item_div.trim().length() == 0)
            throw new IllegalArgumentException("item_div required");

        ItemDTO in = new ItemDTO();
        in.setItem_id(item_id);
        in.setItem_name(item_name.trim());
        in.setItem_div(item_div.trim());
        in.setItem_price(item_price != null ? item_price.intValue() : 0);
        in.setItem_unit(item_unit.trim());
        in.setClient_id(client_id.trim());

        if (item_id == null || item_id.trim().length() == 0) {
            return itemService.create(in, client_id != null ? client_id.trim() : "");
        } else {
            itemService.editWithClient(in, client_id != null ? client_id.trim() : "");
            return itemService.get(in.getItem_id());
        }
    }

    /** 일괄 삭제 */
    @RequestMapping(value = "/item/delete", method = RequestMethod.POST)
    public String deleteItems(@RequestParam("ids") String ids) {
        LinkedHashSet<String> set = new LinkedHashSet<String>();
        if (ids != null) {
            String[] arr = ids.split(",");
            for (int i = 0; i < arr.length; i++) {
                String s = arr[i];
                if (s != null && s.trim().length() > 0) set.add(s.trim());
            }
        }
        List<String> idList = new ArrayList<String>(set);
        itemService.removeAll(idList);
        return "redirect:/itemlist";
    }

    /** 품목별 거래처 목록 */
    @RequestMapping(value="/item/{itemId}/clients", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
    @ResponseBody
    public List<Map<String,Object>> clientsByItemId(@PathVariable("itemId") String itemId) {
        return itemService.selectClientsByItemId(itemId);
    }

    // ===== 내부 유틸 =====
    private static boolean notEmpty(String s){
        return s != null && s.trim().length() != 0;
    }
    private static Integer parseInt(String s){
        try { return notEmpty(s) ? Integer.valueOf(s) : null; }
        catch (Exception e){ return null; }
    }
    /** 오라클 LIKE 이스케이프: %, _, \ 를 각각 \%, \_, \\ 로 변환 */
    private static String escapeLike(String s){
        if (!notEmpty(s)) return null;
        return s.replace("\\", "\\\\").replace("%","\\%").replace("_","\\_");
    }
}
