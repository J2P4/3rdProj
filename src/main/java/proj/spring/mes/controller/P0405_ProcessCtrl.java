package proj.spring.mes.controller;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;

import proj.spring.mes.dto.P0405_ProcessDTO;
import proj.spring.mes.service.P0405_ProcessService;

@Controller("p0405ProcessCtrl")
public class P0405_ProcessCtrl {

    private static final Logger logger = LoggerFactory.getLogger(P0405_ProcessCtrl.class);

    private static final String WEB_PATH = "/resources/img/04_5_process";
    private static final String PLACEHOLDER_IMG = WEB_PATH + "/noimage.png";

    @Autowired private P0405_ProcessService service;
    @Autowired private ServletContext servletContext;

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
    }

    // 목록
    @GetMapping("/processlist")
    public String processList(Model model,
            @RequestParam(value="size", defaultValue="10") int pagePerRows,
            @RequestParam(value="page", defaultValue="1") int page,
            P0405_ProcessDTO searchFilter) {

        long totalCount = service.count(searchFilter);
        int totalPages = (int)Math.ceil((double)totalCount / Math.max(1,pagePerRows));
        if (totalPages == 0) totalPages = 1;
        if (page > totalPages) page = totalPages;

        List<P0405_ProcessDTO> list = service.list(page, pagePerRows, searchFilter);
        List<P0405_ProcessDTO> itemList = service.processItem();

        ObjectMapper om = new ObjectMapper();
        om.configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, false);
        String itemListJson;
        try { itemListJson = om.writeValueAsString(itemList); }
        catch(Exception e){ itemListJson="[]"; }

        model.addAttribute("pagePerRows", pagePerRows);
        model.addAttribute("page", page);
        model.addAttribute("totalCount", totalCount);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("filter", searchFilter);
        model.addAttribute("list", list);
        model.addAttribute("itemList", itemList);
        model.addAttribute("itemListJson", itemListJson);
        return "04_standard/04_5_standard_process.tiles";
    }

    // 상세(JSON)
    @GetMapping("/process/detail")
    @ResponseBody
    public P0405_ProcessDTO detail(@RequestParam("process_id") String process_id) {
        return service.getOneprocess(process_id);
    }

    // 등록(멀티파트 1요청, 서버에서 ID 선발급, 파일명=ID, JSON 응답)
    @PostMapping(
        value="/processinsert",
        consumes=MediaType.MULTIPART_FORM_DATA_VALUE,
        produces=MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseBody
    public ResponseEntity<String> insert(
        @RequestParam(value="file", required=false) MultipartFile file,
        @ModelAttribute P0405_ProcessDTO dto
    ) {
        Map<String,Object> resp = new HashMap<String,Object>();
        try {
            String id = service.createWithFile(file, dto, WEB_PATH, PLACEHOLDER_IMG, servletContext);
            resp.put("status","success");
            resp.put("process_id", id);
            resp.put("process_img", dto.getProcess_img());
            String json = new ObjectMapper().writeValueAsString(resp);
            return ResponseEntity.ok(json);
        } catch (Exception e) {
            e.printStackTrace();
            resp.put("status","fail");
            resp.put("message", e.getMessage());
            try {
                String json = new ObjectMapper().writeValueAsString(resp);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(json);
            } catch (Exception ignore) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"status\":\"fail\"}");
            }
        }
    }

    // 수정(JSON: text/plain 유지해도 되지만 통일)
    @PostMapping(value="/processupdate", produces=MediaType.TEXT_PLAIN_VALUE)
    @ResponseBody
    public String update(P0405_ProcessDTO dto) {
        int result = service.editprocess(dto);
        return result > 0 ? "success" : "fail";
    }

    // 삭제(JSON text/plain)
    @PostMapping(value="/processdelete", consumes=MediaType.APPLICATION_JSON_VALUE, produces=MediaType.TEXT_PLAIN_VALUE)
    @ResponseBody
    public String deleteprocesss(@RequestBody List<String> processIds) {
        if (processIds == null || processIds.isEmpty()) return "fail";
        int deletedCount = service.removeprocesss(processIds);
        return (deletedCount == processIds.size()) ? "success" : "fail";
    }

    // (선택) 수정 슬라이드용 이미지 재업로드 엔드포인트
    @PostMapping(
        value="/processimageupload",
        consumes=MediaType.MULTIPART_FORM_DATA_VALUE,
        produces=MediaType.APPLICATION_JSON_VALUE
    )
    @ResponseBody
    public ResponseEntity<String> uploadImage(
        @RequestParam("file") MultipartFile file,
        @RequestParam("process_id") String processId
    ) {
        Map<String,Object> resp = new HashMap<String,Object>();
        try {
            String url = service.saveImageForId(file, processId, WEB_PATH, servletContext); // 파일명=공정ID
            resp.put("status","success");
            resp.put("image_url", url);
            String json = new ObjectMapper().writeValueAsString(resp);
            return ResponseEntity.ok(json);
        } catch (Exception e) {
            e.printStackTrace();
            resp.put("status","fail");
            resp.put("message", e.getMessage());
            try {
                String json = new ObjectMapper().writeValueAsString(resp);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(json);
            } catch (Exception ignore) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"status\":\"fail\"}");
            }
        }
    }
}
