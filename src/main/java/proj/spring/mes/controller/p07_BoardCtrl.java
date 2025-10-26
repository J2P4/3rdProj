package proj.spring.mes.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
// 필요 시 동일 타입 빈 여러 개면 @Qualifier 사용
// import org.springframework.beans.factory.annotation.Qualifier;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import proj.spring.mes.dto.P07_BoardDTO;
import proj.spring.mes.service.P07_BoardService;

@Controller
@RequestMapping("/board")
public class p07_BoardCtrl {

    @Autowired
    // @Qualifier("p07_BoardServiceImpl") // 동일 타입 빈이 여러 개라면 주석 해제
    private P07_BoardService boardService;

   
    @RequestMapping(value = "", method = RequestMethod.GET)
    public String page() {
        return "07_board/07_board.tiles";   // ← tiles 정의 id
    }    
    

    // 목록
    @RequestMapping(value="/list", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
    @ResponseBody
    public Map<String, Object> list(
            @RequestParam(value="page", required=false, defaultValue="1") int page,
            @RequestParam(value="size", required=false, defaultValue="10") int size,
            @RequestParam(value="keyword", required=false, defaultValue="") String keyword
    ) {
        int offset = (page - 1) * size;
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("offset", offset);
        param.put("size",   size);
        param.put("keyword", (keyword == null) ? "" : keyword);

        List<P07_BoardDTO> list = boardService.findList(param);
        int total = boardService.count(param);

        Map<String, Object> res = new HashMap<String, Object>();
        res.put("list", list);
        res.put("totalCount", total);
        return res;
    }

    // 상세
    @RequestMapping(value="/{id}", method=RequestMethod.GET, produces="application/json;charset=UTF-8")
    @ResponseBody
    public P07_BoardDTO detail(@PathVariable("id") String id) {
        return boardService.findById(id);
    }

    // 등록
    @RequestMapping(value="", method=RequestMethod.POST, consumes="application/json", produces="application/json;charset=UTF-8")
    @ResponseBody
    public Map<String, Object> create(@RequestBody P07_BoardDTO dto) {
        int inserted = boardService.add(dto);
        Map<String, Object> res = new HashMap<String, Object>();
        res.put("inserted", inserted);
        res.put("id", dto.getBoard_id()); // selectKey로 생성된 ID
        return res;
    }

    // 수정  ★핵심: PathVariable -> DTO 주입
    @RequestMapping(value="/{id}", method=RequestMethod.PUT, consumes="application/json", produces="application/json;charset=UTF-8")
    @ResponseBody
    public Map<String, Object> update(@PathVariable("id") String id,
                                      @RequestBody P07_BoardDTO dto) {
        dto.setBoard_id(id); // 반드시 주입
        int updated = boardService.modify(dto);
        Map<String, Object> res = new HashMap<String, Object>();
        res.put("updated", updated); // 1 기대
        return res;
    }

    // 삭제
    @RequestMapping(value="/{id}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
    @ResponseBody
    public Map<String, Object> delete(@PathVariable("id") String id) {
        int deleted = boardService.remove(id);
        Map<String, Object> res = new HashMap<String, Object>();
        res.put("deleted", deleted);
        return res;
    }

    // (레거시 폴백) form POST로 들어오는 업데이트도 허용
    @RequestMapping(value="/update", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
    @ResponseBody
    public Map<String, Object> legacyUpdate(P07_BoardDTO dto) {
        int updated = boardService.modify(dto);
        Map<String, Object> res = new HashMap<String, Object>();
        res.put("updated", updated);
        return res;
    }
}
