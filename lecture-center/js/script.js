/* ============================================================
 * 校园讲座信息中心 —— 首页逻辑
 * 1. fetch 加载 lectures.json（本地 JSON）
 * 2. 讲座查询：名称/主讲人搜索 + 院系筛选 + 状态筛选
 * ============================================================ */

// 状态对应的徽章颜色
const statusBadge = {
  '可预约': 'bg-success',
  '已满': 'bg-warning text-dark',
  '取消': 'bg-secondary'
};

// DOM 引用
const searchInput = document.querySelector('#searchInput');
const deptFilter = document.querySelector('#deptFilter');
const statusFilter = document.querySelector('#statusFilter');
const lectureList = document.querySelector('#lectureList');
const lectureCount = document.querySelector('#lectureCount');
const emptyTip = document.querySelector('#emptyTip');
const loadStatus = document.querySelector('#loadStatus');

let lectures = [];

// 渲染讲座列表（按当前搜索 + 筛选条件）
function renderLectures() {
  const keyword = searchInput.value.trim();
  const deptVal = deptFilter.value;
  const statusVal = statusFilter.value;

  let showArr = lectures.filter(item => {
    const kwOk = (keyword === '') || item.title.includes(keyword) || item.speaker.includes(keyword);
    const deptOk = (deptVal === 'all') || (item.dept === deptVal);
    const statusOk = (statusVal === 'all') || (item.status === statusVal);
    return kwOk && deptOk && statusOk;
  });

  lectureList.innerHTML = '';
  showArr.forEach(item => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h6 class="card-title">${item.title}</h6>
          <p class="small text-muted mb-1">主讲人：${item.speaker}（${item.dept}）</p>
          <p class="small text-muted mb-1">时间：${item.time} · 地点：${item.place}</p>
          <span class="badge ${statusBadge[item.status] || 'bg-secondary'}">${item.status}</span>
        </div>
      </div>
    `;
    lectureList.appendChild(col);
  });

  lectureCount.textContent = `共 ${showArr.length} 场`;

  if (showArr.length === 0) {
    emptyTip.classList.remove('d-none');
  } else {
    emptyTip.classList.add('d-none');
  }
}

// 加载数据
async function loadLectures() {
  loadStatus.textContent = '数据加载中…';
  try {
    const res = await fetch('lectures.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    if (!Array.isArray(data.lectures) || data.lectures.length === 0) {
      throw new Error('讲座数据为空');
    }

    lectures = data.lectures;

    // 动态填充院系下拉框（去重）
    const depts = [...new Set(lectures.map(item => item.dept))];
    deptFilter.innerHTML = '<option value="all">全部院系</option>' +
      depts.map(d => `<option value="${d}">${d}</option>`).join('');

    renderLectures();
    loadStatus.textContent = '';
  } catch (err) {
    loadStatus.textContent = '讲座数据加载失败：' + err.message + '（请通过本地服务器打开页面，如 python -m http.server）';
  }
}

// 搜索与筛选即时生效
searchInput.addEventListener('input', renderLectures);
deptFilter.addEventListener('change', renderLectures);
statusFilter.addEventListener('change', renderLectures);

loadLectures();
