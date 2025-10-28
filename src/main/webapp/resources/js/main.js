let chart;

function toNum(v){ return Number(v ?? 0); }
function rowsToSeries(rows){
  // 1월 1일 ~ 1월 14일까지만 필터
  const filtered = rows.filter(r => {
    const d = new Date(r.obsDate);
    return d.getMonth() === 0 && d.getDate() <= 14; // JS의 month는 0=1월
  });
  return {
    labels: filtered.map(r => new Date(r.obsDate).getDate()), // x축: 1~14 일(day)
    low:    filtered.map(r => toNum(r.predLo1)),
    actual: filtered.map(r => toNum(r.actual)),
    high:   filtered.map(r => toNum(r.predHi1)),
  };
}

async function fetchJson(url){
  const res = await fetch(url, { headers: { 'Accept':'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function buildChart(el, s){
  if (chart) chart.destroy();
  chart = new Chart(el, {
    type:'line',
    data:{
      labels: s.labels,
      datasets:[
        { label:'최저 예측',  data:s.low,   borderColor:'#2563eb', borderWidth:2, pointRadius:2, fill:false },
        { label:'실제 수요량', data:s.actual,borderColor:'#16a34a', borderWidth:2, pointRadius:2, fill:false },
        { label:'최고 예측',  data:s.high,  borderColor:'#ef4444', borderWidth:2, pointRadius:2, fill:false }
      ]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      plugins:{
        legend:{ position:'left' },
        title:{ display:true, text:'1월 1일 ~ 1월 14일 수요 예측' }
      },
      scales:{
        x:{ title:{ display:true, text:'일자' }, ticks:{ stepSize:1, maxRotation:0 } },
        y:{ beginAtZero:true, title:{ display:true, text:'수요량' } }
      }
    }
  });
}

async function loadAndRender(id){
  const url = `${window.contextPath || ''}/chart/byId?id=${encodeURIComponent(id)}`;
  const rows = await fetchJson(url);
  buildChart(document.getElementById('dataChart'), rowsToSeries(rows));
}

document.addEventListener('DOMContentLoaded', async () => {
  const select = document.getElementById('idSelect');
  const ids = await fetchJson(`${window.contextPath || ''}/chart/ids`);
  select.innerHTML = ids.map(v=>`<option value="${v}">${v}</option>`).join('');
  select.value = ids[0];
  await loadAndRender(select.value);
  select.addEventListener('change', () => loadAndRender(select.value));
});
