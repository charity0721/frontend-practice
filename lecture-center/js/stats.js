/* ============================================================
 * 校园讲座信息中心 —— 统计图表页逻辑
 * 1. ECharts 柱状图：各院系讲座数量
 * 2. Chart.js 折线图：近八周讲座场次趋势
 * 数据统一来自 lectures.json
 * ============================================================ */

const chartStatus = document.querySelector('#chartStatus');
const deptBox = document.querySelector('#deptChart');
const trendBox = document.querySelector('#trendChart');

let deptChart = null;
let trendChart = null;

async function loadStats() {
  chartStatus.textContent = '数据加载中…';
  try {
    const res = await fetch('lectures.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    if (!data.deptStats || !data.weekTrend) {
      throw new Error('统计数据缺失');
    }

    // ECharts 柱状图
    deptChart = echarts.init(deptBox);
    deptChart.setOption({
      title: { text: '各院系讲座数量（单位：场）', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: data.deptStats.depts,
        axisLabel: { rotate: 20 }
      },
      yAxis: { type: 'value', name: '场次' },
      series: [{
        name: '讲座数',
        type: 'bar',
        data: data.deptStats.counts,
        itemStyle: { color: '#3d7ebd' },
        barMaxWidth: 40
      }]
    }, true);

    // Chart.js 折线图
    const canvas = document.createElement('canvas');
    trendBox.appendChild(canvas);
    trendChart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: data.weekTrend.weeks,
        datasets: [{
          label: '讲座场次',
          data: data.weekTrend.counts,
          borderColor: '#e67e22',
          backgroundColor: '#e67e2222',
          tension: 0.3,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: '近八周讲座场次趋势（单位：场）' },
          legend: { position: 'bottom' }
        },
        scales: { y: { beginAtZero: true } }
      }
    });

    chartStatus.textContent = '';
  } catch (err) {
    chartStatus.textContent = '统计数据加载失败：' + err.message + '（请通过本地服务器打开页面，如 python -m http.server）';
  }
}

window.addEventListener('resize', () => {
  if (deptChart) deptChart.resize();
  if (trendChart) trendChart.resize();
});

loadStats();
