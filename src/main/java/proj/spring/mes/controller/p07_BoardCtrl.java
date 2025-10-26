package proj.spring.mes.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.*; // Get/Post/Put/DeleteMapping, PathVariable, RequestParam, RequestBody

import proj.spring.mes.service.P07_BoardService;
// import proj.spring.mes.dto.P07_BoardDTO; // ← 프로젝트 DTO 패키지에 맞게 주석 해제

@Controller
@RequestMapping("/board")
public class p07_BoardCtrl {

    private static final Logger logger = LoggerFactory.getLogger(p07_BoardCtrl.class);

    @Autowired
    public P07_BoardService boardService; // ← 변수명 유지

    @GetMapping({"", "/"})
    public String boardView(Model model) {
        // 초기 렌더에 필요한 값이 있으면 model.addAttribute(...)로 전달
        return "07_board/07_board.tiles";
        // 기존 뜬금없는 return은 삭제. (컴파일 에러 원인)
    }


    @GetMapping("/list")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {

     

    	Map<String, Object> result = new HashMap<String, Object>();


        // 임시 형태(서비스 연결 전 테스트용)
        result.put("page", page);
        result.put("size", size);
        result.put("keyword", keyword);
        result.put("totalCount", 0);
        result.put("list", java.util.Collections.emptyList());

        return ResponseEntity.ok(result);
    }

    /**
     * 상세 조회 (JSON)
     * 예시 URL: GET /proj_mes/board/123
     */
    @GetMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> detail(@PathVariable("id") Long id) {
        logger.info("GET /proj_mes/board/{}", id);
        // P07_BoardDTO dto = boardService.findById(id);
        // if (dto == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("NOT_FOUND");
        // return ResponseEntity.ok(dto);

        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("TODO: connect boardService.findById");
    }

    /**
     * 등록 (JSON)
     * 예시 URL: POST /proj_mes/board
     * 요청 Body는 JSON으로 가정 (TinyMCE 본문 HTML 포함)
     */
    @PostMapping
    @ResponseBody
    public ResponseEntity<?> create(
            // @RequestBody P07_BoardDTO dto
            @RequestBody Map<String, Object> payload // 서비스 연결 전 임시
    ) {
        logger.info("POST /proj_mes/board payload={}", payload);
        // Long newId = boardService.create(dto);
        // return ResponseEntity.status(HttpStatus.CREATED).body(newId);

        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("TODO: connect boardService.create");
    }

    /**
     * 수정 (JSON)
     * 예시 URL: PUT /proj_mes/board/123
     */
    @PutMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> update(
            @PathVariable("id") Long id,
            // @RequestBody P07_BoardDTO dto
            @RequestBody Map<String, Object> payload // 서비스 연결 전 임시
    ) {
        logger.info("PUT /proj_mes/board/{} payload={}", id, payload);
  
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("TODO: connect boardService.update");
    }

    /**
     * 삭제 (JSON)
     * 예시 URL: DELETE /proj_mes/board/123
     */
    @DeleteMapping("/{id}")
    @ResponseBody
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        logger.info("DELETE /proj_mes/board/{}", id);
     
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body("TODO: connect boardService.delete");
    }
}
