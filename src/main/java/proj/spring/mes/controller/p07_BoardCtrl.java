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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import proj.spring.mes.dto.P07_BoardDTO;
import proj.spring.mes.service.P07_BoardService;

@Controller
@RequestMapping("/board")
public class p07_BoardCtrl {

    private static final Logger logger = LoggerFactory.getLogger(p07_BoardCtrl.class);

    @Autowired
    private P07_BoardService boardService;

    /** 게시판 화면 진입 **/
    @RequestMapping(value = {"", "/"}, method = RequestMethod.GET)
    public String boardView(Model model) {
        return "07_board/07_board.tiles";
    }

    /** 목록 조회 **/
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "keyword", required = false) String keyword) {

        Map<String, Object> result = boardService.findList(page, size, keyword);
        return new ResponseEntity<Map<String, Object>>(result, HttpStatus.OK);
    }

    /** 상세 조회 **/
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<?> detail(@PathVariable("id") String id) {
        P07_BoardDTO dto = boardService.findById(id);
        if (dto == null) {
            return new ResponseEntity<String>("NOT_FOUND", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<P07_BoardDTO>(dto, HttpStatus.OK);
    }

    /** 등록 **/
    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> create(@RequestBody P07_BoardDTO dto) {
        try {
            String newId = boardService.create(dto);
            Map<String, Object> body = new HashMap<String, Object>();
            body.put("id", newId);
            return new ResponseEntity<Map<String, Object>>(body, HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("create error", e);
            return new ResponseEntity<String>("CREATE_FAILED", HttpStatus.BAD_REQUEST);
        }
    }

    /** 수정 **/
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity<?> update(@PathVariable("id") Long id, @RequestBody P07_BoardDTO dto) {
        dto.setBoard_id(String.valueOf(id));
        boolean ok = boardService.update(dto);
        if (ok) return new ResponseEntity<String>("OK", HttpStatus.OK);
        return new ResponseEntity<String>("NOT_FOUND", HttpStatus.NOT_FOUND);
    }

    /** 삭제 **/
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public ResponseEntity<?> delete(@PathVariable("id") String id) {
        boolean ok = boardService.delete(id);
        if (ok) return new ResponseEntity<String>("OK", HttpStatus.OK);
        return new ResponseEntity<String>("NOT_FOUND", HttpStatus.NOT_FOUND);
    }
}
