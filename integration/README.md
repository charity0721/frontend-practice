# 迷你版校园信息中心

课堂作业八案例复现：跟随实践指南八搭建的"迷你版校园公共信息与数据展示中心"，整合课堂一至七的前端成果。

## 功能模块

- **首页**：Bootstrap 导航栏 + 四张模块卡片（响应式）
- **自习室查询**：按楼层 / 开放状态即时筛选（数据写死在 `script.js` 数组中）
- **使用统计**：加载 `data.json`，用 ECharts 渲染各自习室每日使用量柱状图
- **校园三维导览**：Three.js 场景（搬自课堂七），独立页面，可返回首页

## 运行方法

> ⚠️ 因为页面用 `fetch('data.json')` 加载数据，**不能直接双击 index.html 打开**（file:// 协议会报跨域错误）。

在 `integration` 目录下启动本地服务器，二选一：

```bash
# 方式一：Node（任选其一）
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
integration/
├── index.html          # 统一入口（首页：导航 + 卡片 + 自习室筛选 + 统计图表）
├── css/
│   └── custom.css      # 自定义样式（在 Bootstrap 之后引入）
├── script.js           # 交互逻辑：自习室筛选 + ECharts 图表加载
├── data.json          # 统计数据：各自习室每日使用量
├── libs/
│   └── echarts.min.js  # ECharts 本地库（断网可用）
└── three-d/
    ├── scene.html      # 校园三维导览页（含返回首页按钮）
    └── libs/
        ├── three.min.js        # Three.js 本地库
        └── OrbitControls.js     # 轨道控制器
```

## 数据与资源来源

- 自习室数据：课程自建示例数据（写死在 `script.js` 数组）
- 使用量数据：课程自建示例数据（`data.json`，2026-09-19 整理）
- **Bootstrap 5.3.3**：jsDelivr CDN
- **ECharts**：Apache 开源协议（Apache-2.0），本地库
- **Three.js r128**：MIT 协议，本地库
- 三维场景：基于课堂七作业改造（星球宇宙场景 → 校园三维导览页）

## 质量自查

已按实践指南八第四部分清单完成五项自查：三档宽度（375/768/1200px）、错误处理三状态（断网/空数据/格式错）、Console 无红色报错、可访问性（label/alt）、提交历史分步。
