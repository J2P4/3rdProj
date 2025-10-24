package proj.spring.mes.controller;

import java.io.File;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    /** 브라우저가 요청하는 URL prefix (기존 유지) */
    private static final String WEB_PATH = "/resources/img/04_5_process";
    private static final String PLACEHOLDER_IMG = WEB_PATH + "/noimage.png";

    /** 실제 파일 저장 디렉터리 (로컬) */
    private static final File LOCAL_DIR = new File("D:/proj_v3/src/main/webapp/resources/img/04_5_process");

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
            resp.put("process_img", dto.getProcess_img()); // 예: /resources/img/04_5_.../{id}.png
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

    // 수정(JSON)
    @PostMapping(value="/processupdate", produces=MediaType.TEXT_PLAIN_VALUE)
    @ResponseBody
    public String update(P0405_ProcessDTO dto) {
        int result = service.editprocess(dto);
        return result > 0 ? "success" : "fail";
    }

    // 삭제(JSON)
    @PostMapping(value="/processdelete", consumes=MediaType.APPLICATION_JSON_VALUE, produces=MediaType.TEXT_PLAIN_VALUE)
    @ResponseBody
    public String deleteprocesss(@RequestBody List<String> processIds) {
        if (processIds == null || processIds.isEmpty()) return "fail";
        int deletedCount = service.removeprocesss(processIds);
        return (deletedCount == processIds.size()) ? "success" : "fail";
    }

    // 수정 슬라이드용 이미지 재업로드
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
            String url = service.saveImageForId(file, processId, WEB_PATH, servletContext);
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

    /**
     * /resources/img/04_5_process/{fileName} 요청을 톰캣 정적리소스가 아니라
     * 로컬 디스크(LOCAL_DIR)에서 직접 읽어 반환.
     * (JDK 1.6 호환 버전: java.nio.file.* 미사용)
     */
    @GetMapping(value = WEB_PATH + "/{fileName:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveProcessImage(@PathVariable("fileName") String fileName) {
        try {
            // 경로 이탈/확장자 화이트리스트
            if (fileName.indexOf("..") >= 0)
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body((Resource) null);
            if (!fileName.matches("^[A-Za-z0-9_-]+\\.(png|jpg|jpeg|gif|webp|bmp)$"))
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body((Resource) null);

            if (!LOCAL_DIR.exists() && !LOCAL_DIR.mkdirs()) {
                logger.error("LOCAL_DIR mkdirs fail: {}", LOCAL_DIR.getAbsolutePath());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body((Resource) null);
            }

            File f = new File(LOCAL_DIR, fileName);
            if (!f.exists() || !f.isFile())
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body((Resource) null);

            String ct = servletContext.getMimeType(f.getName());
            if (ct == null) ct = MediaType.APPLICATION_OCTET_STREAM_VALUE;

            Resource res = new FileSystemResource(f);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(ct))
                    .cacheControl(CacheControl.noCache())
                    .body(res);

        } catch (Exception e) {
            logger.error("serveProcessImage error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body((Resource) null);
        }
    }
}
