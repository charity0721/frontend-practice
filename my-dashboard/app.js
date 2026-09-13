const state = { data: null, range: 'all' };
const loadData = async () => {
  $('#status').text('加载中...').show();
  try {
    const response = await fetch('data/weather.json');
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    const data = await response.json();
    if (data.months.length === 0) {
      $('#status').text('暂无数据').show();
      return;
    }
    state.data = data;
    $('#sub-title').text(data.title + ' · ' + data.source);
    $('#status').hide();
    renderAll();
  } catch (error) {
    $('#status').text('加载失败：' + error.message).show();
  }
};
const average = (numbers) => {
  const total = numbers.reduce((sum, n) => sum + n, 0);
  return Math.round(total / numbers.length * 10) / 10;
};
const rainiest = (data) => {
  const max = Math.max(...data.rainfall);
  const index = data.rainfall.indexOf(max);
  return { month: data.months[index], value: max };
};
const renderCards = (data) => {
  const wetMonth = rainiest(data);
  const cards = [
    { label: '平均最高气温', value: average(data.temperature.high) + ' ℃' },
    { label: '平均最低气温', value: average(data.temperature.low) + ' ℃' },
    { label: '累计降水量', value: data.rainfall.reduce((sum, n) => sum + n, 0) + ' mm' },
    { label: '降水最多月份', value: wetMonth.month + '（' + wetMonth.value + ' mm）' }
  ];
  $('#cards').empty();
  cards.forEach(card => {
    $('#cards').append(`
      <div class="col-md-3">
        <div class="card h-100">
          <div class="card-body">
            <h3 class="card-title h6">${card.label}</h3>
            <p class="card-text fs-5">${card.value}</p>
          </div>
        </div>
      </div>
    `);
  });
};

let barChart = null;
const renderBarChart = (data) => {
  if (barChart === null) {
    barChart = echarts.init(document.querySelector('#bar-chart'));
  }
  barChart.setOption({
    title: { text: '各月降水量（单位：mm）', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { data: data.months, name: '月份' },
    yAxis: { name: '降水量 (mm)' },
    series: [{
      name: '降水量',
      type: 'bar',
      data: data.rainfall,
      itemStyle: { color: '#3d7ebd' }
    }]
  }, true);
};

let lineChart = null;
const renderLineChart = (data) => {
  if (lineChart !== null) {
    lineChart.destroy();
  }
  const ctx = document.querySelector('#line-chart');
  lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.months,
      datasets: [
        { label: '最高气温', data: data.temperature.high, borderWidth: 2, tension: 0.3 },
        { label: '最低气温', data: data.temperature.low, borderWidth: 2, tension: 0.3 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: '各月气温趋势（单位：℃）' }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: '气温 (℃)' } }
      }
    }
  });
};

const filterData = (data, range) => {
  const from = range === 'h2' ? 4 : 0;
  const to = range === 'h1' ? 4 : data.months.length;
  return {
    months: data.months.slice(from, to),
    temperature: {
      high: data.temperature.high.slice(from, to),
      low: data.temperature.low.slice(from, to)
    },
    rainfall: data.rainfall.slice(from, to)
  };
};

const renderAll = () => {
  const view = filterData(state.data, state.range);
  renderCards(view);
  renderBarChart(view);
  renderLineChart(view);
};

window.addEventListener('resize', () => {
  if (barChart) barChart.resize();
});

$('#range-buttons').on('click', 'button', function () {
  state.range = $(this).data('range');
  $(this).addClass('active').siblings().removeClass('active');
  $('#range-tip').text('已显示：' + $(this).text());
  renderAll();
});

loadData();
