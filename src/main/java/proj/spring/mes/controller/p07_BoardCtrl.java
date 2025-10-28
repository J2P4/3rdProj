package proj.spring.mes.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
// 필요 시 동일 타입 빈 여러 개면 @Qualifier 사용
// import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import proj.spring.mes.dto.P07_BoardDTO;
import proj.spring.mes.dto.WorkerDTO;
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
    public Map<String, Object> create(@RequestBody P07_BoardDTO dto, HttpSession session) {
        Map<String, Object> res = new HashMap<String, Object>();

        // 로그인 사용자 확인
        WorkerDTO login = (WorkerDTO) session.getAttribute("loginUser");
        if (login == null) {
            res.put("success", false);
            res.put("message", "로그인이 필요합니다.");
            return res;
        }

        // 작성자 정보 설정
        dto.setWorker_id(login.getWorker_id());

        int inserted = boardService.add(dto);

        res.put("success", inserted > 0);
        res.put("message", inserted > 0 ? "등록 성공" : "등록 실패");
        return res;
    }

    // 수정: 본인만 허용 (서비스 권한 메서드 호출) 
    @RequestMapping(value="/{id}", method=RequestMethod.PUT, consumes="application/json", produces="application/json;charset=UTF-8")
    @ResponseBody
    public Map<String, Object> update(@PathVariable("id") String id,
                                      @RequestBody P07_BoardDTO dto,
                                      HttpSession session) {            
        String uid  = (String) session.getAttribute("worker_id");      
        String role = (String) session.getAttribute("role");            
        dto.setBoard_id(id);                                            
        boardService.modifyWithAuth(dto, uid, role);                    

        Map<String, Object> res = new HashMap<String, Object>();
        res.put("updated", 1);                                          
        return res;
    }

    // 삭제: 본인 또는 ADMIN 허용 (서비스 권한 메서드 호출)  ★ 핵심 변경
    @RequestMapping(value="/{id}", method=RequestMethod.DELETE, produces="application/json;charset=UTF-8")
    @ResponseBody
    public Map<String, Object> delete(@PathVariable("id") String id,
                                      HttpSession session) {            
        String uid  = (String) session.getAttribute("worker_id");       
        String role = (String) session.getAttribute("role");           
        boardService.removeWithAuth(id, uid, role);                    

        Map<String, Object> res = new HashMap<String, Object>();
        res.put("deleted", 1);                                         
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
