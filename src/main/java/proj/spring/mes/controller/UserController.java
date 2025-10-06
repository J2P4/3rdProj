package proj.spring.mes.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class UserController {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);
	
	@Autowired
	
	@RequestMapping("/user")
	public String login() {
		System.out.println("계정관리");
		return "02_user/02_user.tiles";
	}
}
