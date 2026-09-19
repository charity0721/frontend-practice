# 个人学习数据看板

自主实践作品：整合课堂五（交互）、课堂六（数据可视化）、课堂七（三维展示）的个人学习数据看板。

## 功能模块

- **首页**：Bootstrap 导航 + 四张模块卡片（响应式）
- **学习任务**：添加任务（名称/科目/优先级）、搜索筛选、删除，数据保存在 localStorage
- **学习统计**：加载 `data/data.json`，用 ECharts 渲染每周学习时长柱状图
- **校园三维导览**：A-Frame 校园场景，独立页面，可返回看板

## 运行方法

> ⚠️ 因为页面用 `fetch('data/data.json')` 加载数据，**不能直接双击 index.html 打开**（file:// 协议会报跨域错误）。

在 `study-dashboard` 目录下启动本地服务器：

```bash
# 方式一：Node
npx serve
# 或
npx http-server -p 8000

# 方式二：Python
python -m http.server 8000
```

然后浏览器访问 `http://localhost:8000`。
也可以用 VS Code 的 **Live Server** 插件右键 index.html → Open with Live Server。

## 目录说明

```
study-dashboard/
├── index.html          # 统一入口（导航 + 任务管理 + 统计图表）
├── css/
│   └── style.css       # 自定义样式（在 Bootstrap 之后引入）
├── js/
│   └── app.js          # 交互逻辑：任务管理 + ECharts 图表加载
├── data/
│   └── data.json       # 统计数据：每周学习时长
├── libs/
│   └── echarts.min.js  # ECharts 本地库
└── three-d/
    ├── scene.html      # 校园三维导览页（含返回按钮）
    └── libs/
        └── aframe.min.js   # A-Frame 本地库
```

## 数据与资源来源

- 任务数据：保存在浏览器 localStorage（课程自建示例）
- 学习时长数据：课程自建示例数据（`data/data.json`，2026-09-19 整理）
- **Bootstrap 5.3.3**：jsDelivr CDN
- **ECharts**：Apache 开源协议（Apache-2.0），本地库
- **A-Frame**：MIT 协议，本地库
- 三维场景：基于课堂七作业改造（A-Frame 校园场景）

## 技术整合说明

- **学习任务**：复用课堂五 manage-app 的增删改查 + localStorage + 搜索筛选模式
- **学习统计**：复用课堂六 my-dashboard 的 fetch JSON + ECharts 柱状图模式
- **校园三维**：复用课堂七 three-d 的 A-Frame 校园场景
