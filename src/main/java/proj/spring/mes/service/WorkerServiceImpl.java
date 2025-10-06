package proj.spring.mes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.WorkerMapperDAO;
import proj.spring.mes.dto.WorkerDTO;

@Service
public class WorkerServiceImpl implements WorkerService{
	
	@Autowired
	WorkerMapperDAO workerMapperDao;   // MapperDAO 인터페이스를 받아오기


	@Override
	   public List<WorkerDTO> list() {
	       return workerMapperDao.selectWorker();
	   }

    @Override
    public WorkerDTO get(String workerId) {
        return workerMapperDao.selectOneWorker(workerId);
    }

    @Override
    public int add(WorkerDTO dto) {
        return workerMapperDao.insertWorker(dto);
    }

    @Override
    public int edit(WorkerDTO dto) {
        return workerMapperDao.updateWorker(dto);
    }

    @Override
    public int remove(String workerId) {
        return workerMapperDao.deleteWorker(workerId);
    }

}
