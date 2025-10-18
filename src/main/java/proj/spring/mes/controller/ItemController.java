package proj.spring.mes.controller;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
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
        @RequestParam(value = "page", required = false, defaultValue = "1") int page
    ) {
        long totalCount = itemService.count();
        int totalPages = (int) Math.ceil((double) totalCount / pagePerRows);
        if (totalPages == 0) totalPages = 1;
        if (page > totalPages) page = totalPages;

        model.addAttribute("list", itemService.list(page, pagePerRows));
        model.addAttribute("page", page);
        model.addAttribute("totalPages", totalPages);
        return "04_standard/04_3_standard_item.tiles";
    }

    @RequestMapping("/item/detail")
    @ResponseBody
    public ItemDTO detail(@RequestParam("item_id") String item_id) {
        return itemService.get(item_id);
    }

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

    @RequestMapping(value = "/item/delete", method = RequestMethod.POST)
    public String deleteItems(
        @RequestParam("ids") String ids,
        org.springframework.web.servlet.mvc.support.RedirectAttributes ra
    ) {
        LinkedHashSet set = new LinkedHashSet();
        if (ids != null) {
            String[] arr = ids.split(",");
            for (int i = 0; i < arr.length; i++) {
                String s = arr[i];
                if (s != null && s.trim().length() > 0) set.add(s.trim());
            }
        }
        List idList = new ArrayList(set);
        itemService.removeAll(idList);
        return "redirect:/itemlist";
    }

    @RequestMapping(value="/item/{itemId}/clients", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
    @ResponseBody
    public List clientsByItemId(@PathVariable("itemId") String itemId) {
        return itemService.selectClientsByItemId(itemId);
    }
}
