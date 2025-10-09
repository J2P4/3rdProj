package proj.spring.mes.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proj.spring.mes.dao.mapper.WorkerMapperDAO;
import proj.spring.mes.dto.DeptDTO;
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
	public List<DeptDTO> deptList() {
		return workerMapperDao.selectDept();
	}

    @Override
    public WorkerDTO get(String worker_id) {
        return workerMapperDao.selectOneWorker(worker_id);
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
    public int remove(String worker_id) {
        return workerMapperDao.deleteWorker(worker_id);
    }

	
}
