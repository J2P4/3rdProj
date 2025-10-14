package proj.spring.mes.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/session")
public class SessionController {

	
	/**
	 * - GET  /session/remain  : 현재 로그인 세션의 "남은 시간(초)"을 조회 (프론트 카운트다운 동기화용)
	 * - POST /session/extend  : 세션 유지시간을 연장(갱신) (프론트 "연장" 버튼이 호출)
	 *
	 * 사용 전제:
	 * 1) 로그인 성공 시 HttpSession에 "loginUser" 속성을 넣는다. (예: session.setAttribute("loginUser", user))
	 * 2) web.xml 또는 코드에서 setMaxInactiveInterval(...)로 세션 타임아웃(예: 30분)을 설정해둔다.
	 * 3) Spring XML 설정에서 이 컨트롤러 패키지가 component-scan에 포함되어야 한다.
	 *
	 */
    private int remainSec(HttpSession s){
    	// 세션 최대 비활성 시간(초). web.xml의 <session-timeout> 또는 setMaxInactiveInterval로 설정됨.
        int max = s.getMaxInactiveInterval(); // 초
        
        // 마지막 접근 시각으로부터 경과한 시간(초) = (현재 밀리초 - 마지막접근 밀리초) / 1000
        long idle = (System.currentTimeMillis() - s.getLastAccessedTime())/1000; // 초
        long remain = max - idle;
        return (int)Math.max(remain, 0);
    }

    /** 남은 시간 조회
     *  - 인증(로그인) 여부를 함께 내려서, 프론트가 이미 만료/로그아웃 상태면 즉시 처리할 수 있게 한다.
     *  - 세션이 없거나(loginUser 속성이 없으면) authenticated=false + remainSec=0 반환.
     */
    @ResponseBody
    @RequestMapping(value="/remain", method=RequestMethod.GET)
    public Map<String,Object> remain(HttpServletRequest req){
    	
        Map<String,Object> res = new HashMap<String, Object>();
        
        // 기존 세션만 조회 (false): 없다면 새로 만들지 않음. (불필요한 세션 생성 방지)
        HttpSession session = req.getSession(false);
        
        // 세션이 없거나, 로그인 마크(loginUser)가 없는 경우
        if(session == null || session.getAttribute("loginUser")==null){
            res.put("authenticated", false);
            res.put("remainSec", 0);
            return res;
        }
        
        // 정상 로그인 상태라면 남은 시간 계산 후 전달
        res.put("authenticated", true);
        res.put("remainSec", remainSec(session));
        
        return res;
    }

    /** 세션 연장 (마지막 접근 갱신 + 타이머 리셋) 
     *	- 이 엔드포인트를 호출하는 "POST 요청" 자체가 "마지막 접근 시각(lastAccessedTime)"을 갱신시킨다.
     *  - 추가로 정책상 명시적 연장(타임아웃 재설정)이 필요하면 setMaxInactiveInterval로 재지정. 
     */
    @ResponseBody
    @RequestMapping(value="/extend", method=RequestMethod.POST)
    public Map<String,Object> extend(HttpServletRequest req){
    	
        Map<String,Object> res = new HashMap<String, Object>();
        
        // 기존 세션만 조회 (false): 없다면 새로 만들지 않음.
        HttpSession session = req.getSession(false);
        
        // 인증 불가(세션 없음/로그인 마크 없음) → 연장 불가
        if(session == null || session.getAttribute("loginUser")==null){
            res.put("authenticated", false);
            res.put("remainSec", 0);
            return res;
        }
        // 마지막 접근 갱신 요청.
        session.setMaxInactiveInterval(30*60); // 30분
        
        // 이 POST 호출 자체가 마지막 접근 시각을 갱신하므로, 결과적으로 타이머가 리셋된다.
        res.put("authenticated", true);
        res.put("remainSec", session.getMaxInactiveInterval()); // 거의 1800에 근접
        
        return res;
    }
}