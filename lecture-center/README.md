# 校园讲座信息中心

期末大作业作品：校园公共服务主题的信息与数据展示中心响应式前端应用，方便同学查询讲座、查看讲座统计、体验三维报告厅。

## 功能模块

- **首页**：Bootstrap 5 导航栏 + 三张模块卡片（响应式）
- **讲座查询**：关键词搜索（讲座名/主讲人）+ 院系筛选 + 状态筛选，即时渲染，无结果给出提示
- **统计图表**：`stats.html`，ECharts 柱状图（各院系讲座数量）+ Chart.js 折线图（近八周讲座场次趋势）
- **三维报告厅**：`three-d.html`，A-Frame 场景（讲台、投影幕、15 个观众座椅、灯光呼吸动画），可拖拽旋转缩放

## 运行方法

> ⚠️ 页面用 `fetch('lectures.json')` 加载数据，**不能直接双击 html 打开**（file:// 协议会报跨域错误）。

在 `lecture-center` 目录下启动本地服务器，二选一：

```bash
# Python
python -m http.server 8000
# Node
npx serve
```

然后浏览器访问 `http://localhost:8000/`（进入 lecture-center 子目录即 `http://localhost:8000/lecture-center/`）。
也可以用 VS Code 的 Live Server 插件打开 index.html。

## 目录说明

```
lecture-center/
├── index.html          # 首页（导航 + 卡片 + 讲座查询）
├── stats.html          # 统计图表页（ECharts + Chart.js）
├── three-d.html        # 三维报告厅页（A-Frame）
├── lectures.json       # 数据：讲座列表 + 图表统计
├── css/
│   └── custom.css
├── js/
│   ├── script.js       # 首页：加载数据 + 搜索筛选
│   └── stats.js        # 统计页：两类图表
└── libs/
    ├── echarts.min.js  # ECharts 本地库
    ├── chart.umd.js    # Chart.js 本地库
    └── aframe.min.js   # A-Frame 本地库
```

## 数据与资源来源

- 讲座数据：课程自建示例数据（`lectures.json`，2026-10-08 整理）
- **Bootstrap 5.3.3**：jsDelivr CDN
- **ECharts**（Apache-2.0）、**Chart.js**（MIT）、**A-Frame**（MIT）：本地库

## 错误处理

- 网络失败（服务器未启动 / 文件缺失）：页面提示“数据加载失败：HTTP 404（请通过本地服务器打开页面）”
- 数据为空或字段缺失：提示“讲座数据为空 / 统计数据缺失”
- 非法输入 / 无结果：搜索无匹配时提示“未找到匹配的讲座，请尝试清空搜索或放宽筛选条件”
