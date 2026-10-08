/* ============================================================
 * 迷你版校园信息中心 —— 交互与图表
 * 1. 自习室查询（按名称搜索 + 按楼层 / 开放状态筛选）
 * 2. 使用统计（fetch 加载 data.json，ECharts 柱状图）
 * 3. 一周使用趋势（fetch 加载 data.json，Chart.js 折线图）
 * ============================================================ */

/* ---------- 1. 自习室筛选 ---------- */

// 自习室数据（写死在 JS 数组）
const studyRooms = [
  { name: '1楼自习室A', floor: 1, status: '开放' },
  { name: '1楼自习室B', floor: 1, status: '满座' },
  { name: '2楼自习室A', floor: 2, status: '开放' },
  { name: '2楼自习室B', floor: 2, status: '维修' },
  { name: '3楼自习室A', floor: 3, status: '开放' },
  { name: '3楼自习室B', floor: 3, status: '满座' },
  { name: '4楼自习室A', floor: 4, status: '开放' },
  { name: '4楼自习室B', floor: 4, status: '维修' }
];

// 状态对应的 Bootstrap 徽章颜色
const statusBadge = {
  '开放': 'bg-success',
  '满座': 'bg-warning text-dark',
  '维修': 'bg-secondary'
};

// DOM 引用
const searchInput = document.querySelector('#searchInput');
const floorFilter = document.querySelector('#floorFilter');
const statusFilter = document.querySelector('#statusFilter');
const roomList = document.querySelector('#roomList');
const roomCount = document.querySelector('#roomCount');
const emptyTip = document.querySelector('#emptyTip');

// 渲染自习室列表（按当前搜索 + 筛选条件）
function renderRooms() {
  const keyword = searchInput.value.trim();
  const floorVal = floorFilter.value;
  const statusVal = statusFilter.value;

  // 搜索 + 筛选
  let showArr = studyRooms.filter(room => {
    const kwOk = (keyword === '') || room.name.includes(keyword);
    const floorOk = (floorVal === 'all') || (room.floor === Number(floorVal));
    const statusOk = (statusVal === 'all') || (room.status === statusVal);
    return kwOk && floorOk && statusOk;
  });

  // 渲染
  roomList.innerHTML = '';
  showArr.forEach(room => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body d-flex justify-content-between align-items-center">
          <h6 class="card-title mb-0">${room.name}</h6>
          <span class="badge ${statusBadge[room.status]}">${room.status}</span>
        </div>
      </div>
    `;
    roomList.appendChild(col);
  });

  // 显示数量
  roomCount.textContent = `共 ${showArr.length} 间`;

  // 无匹配时给出明确提示（非法输入/无结果场景）
  if (showArr.length === 0) {
    emptyTip.classList.remove('d-none');
  } else {
    emptyTip.classList.add('d-none');
  }
}

// 搜索输入（input 即时生效）与筛选条件变化时重新渲染
searchInput.addEventListener('input', renderRooms);
floorFilter.addEventListener('change', renderRooms);
statusFilter.addEventListener('change', renderRooms);

// 初始渲染
renderRooms();

/* ---------- 2. 使用统计图表 ---------- */

const chartStatus = document.querySelector('#chartStatus');
const chartBox = document.querySelector('#usageChart');
let usageChart = null;

async function loadUsageChart() {
  chartStatus.textContent = '数据加载中…';
  try {
    const res = await fetch('data.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    if (!usageChart) {
      usageChart = echarts.init(chartBox);
    }
    usageChart.setOption({
      title: { text: '各自习室使用量（单位：人次/日）', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: data.rooms,
        axisLabel: { rotate: 30 }
      },
      yAxis: {
        type: 'value',
        name: '使用量（人次/日）'
      },
      series: [{
        name: '使用量',
        type: 'bar',
        data: data.usage,
        itemStyle: { color: '#3d7ebd' },
        barMaxWidth: 40
      }]
    }, true);

    chartStatus.textContent = '';
    chartStatus.classList.remove('alert', 'alert-warning');
  } catch (err) {
    chartStatus.textContent = '数据加载失败：' + err.message + '（请通过本地服务器打开页面，如 python -m http.server）';
  }
}

// 窗口缩放时图表自适应
window.addEventListener('resize', () => {
  if (usageChart) usageChart.resize();
  if (trendChart) trendChart.resize();
});

/* ---------- 3. 一周使用趋势（Chart.js 折线图） ---------- */

const trendStatus = document.querySelector('#trendStatus');
const trendBox = document.querySelector('#trendChart');
let trendChart = null;

// 各楼层折线颜色
const lineColors = {
  '1楼': '#3d7ebd',
  '2楼': '#e67e22',
  '3楼': '#27ae60',
  '4楼': '#c0392b'
};

async function loadTrendChart() {
  trendStatus.textContent = '数据加载中…';
  try {
    const res = await fetch('data.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    if (!data.weekTrend) throw new Error('数据中没有 weekTrend 字段');

    // 在容器内创建 canvas 并获取 2d 上下文（兼容后台标签页等场景）
    const canvas = document.createElement('canvas');
    trendBox.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.weekTrend.days,
        datasets: data.weekTrend.series.map(s => ({
          label: s.name,
          data: s.data,
          borderColor: lineColors[s.name] || '#3d7ebd',
          backgroundColor: (lineColors[s.name] || '#3d7ebd') + '22',
          tension: 0.3,
          pointRadius: 4
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: '各楼层一周使用趋势（单位：人次）' },
          legend: { position: 'bottom' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    trendStatus.textContent = '';
  } catch (err) {
    trendStatus.textContent = '数据加载失败：' + err.message + '（请通过本地服务器打开页面，如 python -m http.server）';
  }
}

// 加载图表（放在所有声明之后调用，避免 const 暂时性死区）
loadUsageChart();
loadTrendChart();
