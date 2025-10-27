package proj.spring.mes.dao.mapper;

import java.util.List;
import java.util.Map;

public interface MainMapperDAO {

	Map<String, Object> selectStockByType();
	Map<String, Object> selectMainDashboard();

}
