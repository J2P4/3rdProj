package proj.spring.mes.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.MainMapperDAO;

@Service
public class MainServiceImpl implements MainService {

	@Autowired
	MainMapperDAO mainMapperDao;
	

	@Override
	public Map<String, Object> getMainDashboard() {
		return mainMapperDao.selectMainDashboard();
	}


}
