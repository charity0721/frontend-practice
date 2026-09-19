/* ============================================================
 * 迷你版校园信息中心 —— 第二步：查询交互与图表
 * 1. 自习室筛选（按楼层 / 开放状态，数据写死在 JS 数组）
 * 2. 使用统计（fetch 加载 data.json，ECharts 柱状图）
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
const floorFilter = document.querySelector('#floorFilter');
const statusFilter = document.querySelector('#statusFilter');
const roomList = document.querySelector('#roomList');
const roomCount = document.querySelector('#roomCount');

// 渲染自习室列表（按当前筛选条件）
function renderRooms() {
  const floorVal = floorFilter.value;
  const statusVal = statusFilter.value;

  // 筛选
  let showArr = studyRooms.filter(room => {
    const floorOk = (floorVal === 'all') || (room.floor === Number(floorVal));
    const statusOk = (statusVal === 'all') || (room.status === statusVal);
    return floorOk && statusOk;
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
}

// 筛选条件变化时即时重新渲染（复用课堂五的 oninput/onchange 模式）
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
    const res = await fetch('data.json');
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
    chartStatus.textContent = '数据加载失败：' + err.message + '（请通过本地服务器打开页面，如 npx serve）';
  }
}

// 窗口缩放时图表自适应
window.addEventListener('resize', () => {
  if (usageChart) usageChart.resize();
});

// 加载图表
loadUsageChart();
