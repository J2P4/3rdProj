package proj.spring.mes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.DataMapperDAO;
import proj.spring.mes.dto.DataDTO;

@Service
public class DataServiceImpl implements DataService {

	@Autowired
	DataMapperDAO datamapperdao;

	@Override
    public List<DataDTO> getDataById(int id) {
        return datamapperdao.selectDataById(id);
    }

    @Override
    public List<Integer> getDistinctIds() {  
        return datamapperdao.selectDistinctIds();
    }


	

}
