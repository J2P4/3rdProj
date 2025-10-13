package proj.spring.mes.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import proj.spring.mes.dto.ClientitemsDTO;
import proj.spring.mes.service.ClientitemsService;

@Controller
@RequestMapping("/item")
public class ClientItemsController {

    @Autowired
    private ClientitemsService service;

    @GetMapping("/{itemId}/clients")
    @ResponseBody
    public List<ClientitemsDTO> getClients(@PathVariable String itemId) {
        return service.getClientByItemId(itemId);
    }
}
