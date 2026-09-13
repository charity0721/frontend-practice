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
    renderCards(data);
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

loadData();
