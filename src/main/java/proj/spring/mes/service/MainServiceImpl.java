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
	
//	@Override
//	public Map<String, Object> getStockByType() {
//        Map<String, Object> rows = mainMapperDao.selectStockByType();
//
//        List<String> labels = new ArrayList<String>();
//        List<Integer> data   = new ArrayList<Integer>();
//
//        for (Map<String,Object> r : rows) {
//            String div = (String) r.get("ITEM_DIV"); // RAW / PRODUCT / DEFECT ...
//            Number qty = (Number) r.get("QTY");
//
//            labels.add(toKorean(div));                             // 라벨 한글화
//            data.add(qty == null ? 0 : qty.intValue());
//        }
//
//        Map<String,Object> result = new HashMap<String, Object>();
//        List<Map<String,Object>> datasets = new ArrayList<Map<String, Object>>();
//
//        Map<String,Object> ds = new HashMap<String, Object>();
//        ds.put("label", "타입별 현재고");
//        ds.put("data", data);
//        datasets.add(ds);
//
//        result.put("labels", labels);
//        result.put("datasets", datasets);
//        return result;
//    }

//    private String toKorean(String code) {
//        if (code == null) return "기타";
//        String c = code.toUpperCase();
//
//        if (c.equals("RAW")) return "원자재";
//        else if (c.equals("PRODUCT")) return "상품";
//        else if (c.equals("DEFECT")) return "불량";
//        else return code;
//    }

	@Override
	public Map<String, Object> getMainDashboard() {
		return mainMapperDao.selectMainDashboard();
	}


}
