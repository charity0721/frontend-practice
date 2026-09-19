/* ============================================================
 * 个人学习数据看板 —— 第二步：任务管理 + 学习统计图表
 * 1. 学习任务（复用课堂五：增删改查 + localStorage + 搜索筛选）
 * 2. 学习统计（复用课堂六：fetch data.json + ECharts 柱状图）
 * ============================================================ */

/* ---------- 1. 学习任务管理 ---------- */

const addForm = document.querySelector('#addForm');
const taskName = document.querySelector('#taskName');
const subject = document.querySelector('#subject');
const priority = document.querySelector('#priority');
const tip = document.querySelector('#tip');
const listWrap = document.querySelector('#listWrap');
const searchInput = document.querySelector('#searchInput');

// 读取本地存储
let taskList = JSON.parse(localStorage.getItem('studyTasks') || '[]');

function saveData() {
  localStorage.setItem('studyTasks', JSON.stringify(taskList));
}

function renderTasks() {
  listWrap.innerHTML = '';
  const keyword = searchInput.value.trim().toLowerCase();
  let showArr = taskList;
  if (keyword) {
    showArr = taskList.filter(t => t.name.toLowerCase().includes(keyword));
  }
  showArr.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'list-group-item d-flex justify-content-between align-items-center';
    div.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <span class="badge bg-secondary ms-2">${item.subject}</span>
        <span class="badge bg-info ms-2">${item.priority}</span>
      </div>
    `;
    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-sm btn-outline-danger';
    delBtn.textContent = '删除';
    delBtn.onclick = () => {
      taskList.splice(idx, 1);
      saveData();
      renderTasks();
    };
    div.appendChild(delBtn);
    listWrap.appendChild(div);
  });
}

addForm.addEventListener('submit', e => {
  e.preventDefault();
  tip.textContent = '';
  const nameVal = taskName.value.trim();
  const subjVal = subject.value.trim();
  const prioVal = priority.value;
  if (!nameVal || !subjVal) {
    tip.textContent = '任务名称和科目不能为空！';
    return;
  }
  taskList.push({ name: nameVal, subject: subjVal, priority: prioVal });
  saveData();
  taskName.value = '';
  subject.value = '';
  renderTasks();
});

searchInput.oninput = renderTasks;

renderTasks();

/* ---------- 2. 学习统计图表 ---------- */

const chartBox = document.querySelector('#studyChart');
const chartStatus = document.querySelector('#chartStatus');
let studyChart = null;

async function loadStudyChart() {
  chartStatus.textContent = '数据加载中…';
  try {
    const res = await fetch('data/data.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    if (!studyChart) {
      studyChart = echarts.init(chartBox);
    }
    studyChart.setOption({
      title: { text: '每周学习时长（单位：小时）', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: data.weeks },
      yAxis: { type: 'value', name: '时长（小时）' },
      series: [{
        name: '学习时长',
        type: 'bar',
        data: data.hours,
        itemStyle: { color: '#4e79a7' },
        barMaxWidth: 40
      }]
    }, true);

    chartStatus.textContent = '';
  } catch (err) {
    chartStatus.textContent = '数据加载失败：' + err.message + '（请通过本地服务器打开页面）';
  }
}

window.addEventListener('resize', () => {
  if (studyChart) studyChart.resize();
});

loadStudyChart();
