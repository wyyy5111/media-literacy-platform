# 一眼真相：编辑闯关（离线构建版）

目标：以游戏化方式训练标题规范、图表纠错、事实链与引用、伦理与AI标识、谣言识别。完全离线运行，双击 `dist/index.html` 即可游玩并导出 PDF。

## 目录结构

```
dist/
  index.html
  assets/
    icon.svg
    fonts/ (占位，建议放置 Noto Sans SC/Noto Serif SC)
  css/
    main.css
  js/
    app.js
    levels.engine.js
    scoring.js
    risk.rules.js (预留)
    chart.sandbox.js
    reverse.estimate.js (预留)
    sources.citation.js
    ethics.engine.js
    rumor.verify.js
    report.maker.js
    ledger.hash.js
    store.local.js
    a11y.js
    sw.js
data/
  lexicons.json
  levels.seed.json
  articles.seed.json
README.md
作品说明书.pdf
演示视频脚本.txt
```

## 使用说明

- 打开：双击 `dist/index.html`（或本地服务器访问 `http://localhost:5500/dist/index.html`）。
- 主题：右上角“深/浅”、“高对比”随时切换。
- 键盘：方向键切换页签、Enter/Space 触发按钮、Tab 导航控件。
- 评分：每关点击“提交本关”即可更新分数与雷达图。
- 导出：在“结果与导出”点击两个导出按钮，使用系统打印为 PDF。
- 存档：自动使用 localStorage 保存主题、姓名与分数。

### 作品说明书 PDF 导出

- 打开 `dist/docs/作品说明书.html`。
- 使用浏览器“打印为 PDF”（建议 A4、去除页眉页脚）生成 `作品说明书.pdf` 并随包体一并提交。
- 如在 `file://` 场景下打印受限，请临时用本地静态服务器打开该页面再打印。

## 构建与预览

- 本地预览：在终端启动静态服务器并访问 `http://localhost:5500/dist/index.html`。
  - Node 用户：`npx serve -l 5500 .` 或 `npx http-server -p 5500 .`
  - Python 用户：`python -m http.server 5500`
- 打包分发：直接分发 `dist/` 目录即可（包含 HTML/CSS/JS 与资产）。

## PWA 与离线

- `manifest.json` 与 `dist/js/sw.js` 已配置基础离线缓存；在 `http/https` 环境下访问会触发安装提示。
- 安装：点击右上角“安装到桌面”按钮或浏览器地址栏的安装图标。
- 更新：刷新页面后 Service Worker 会自动更新缓存；必要时清理浏览器缓存。

## 自测清单（摘要）

- 关卡生成：选择不同难度，确保关卡数量≥80 并覆盖 A/B/C/D/E/F/G。
- 图表纠错：柱/折/饼/堆叠四类均可在沙盒中修正并得到风险解释。
- 引用校验：GB/T 7714 占位格式化与槽位完整性评分可用。
- 伦理合规：必选项校验、禁止项惩罚与替代表述建议可用。
- 谣言识别：真假混排素材可生成可疑点与理由；UI 单选得分可更新。
- 导出：专题 PDF/证书 PDF 可打印；ZIP 导出包含 `report.json` 与指纹文本。
- 存档：分数、主题与导出索引可在 localStorage/IndexedDB 中恢复。

## 技术要点

- 无外部 CDN，全部本地资源；Service Worker 支持离线缓存（在 http/https 下生效）。
- Canvas 原生雷达图与图表纠错，无第三方图表库。
- SHA-256 指纹编号（WebCrypto，回退 djb2）。
- 打印 CSS 控制“一页专题/证书”版式。

## 字体与第三方库

- 字体：建议在 `dist/assets/fonts/` 放置 `NotoSansSC-Regular.woff2`、`NotoSerifSC-Regular.woff2` 等开源字体。
- PDF 库：当前使用浏览器打印生成 PDF；如需纯JS生成 PDF，可将 `pdf-lib` 本地文件放入 `dist/js/vendor/`，并在 `report.maker.js` 中接入。

## 二次开发

- 关卡与题库：参照 `data/levels.seed.json` 扩展并在 `levels.engine.js` 中渲染。
- 规则库：在 `risk.rules.js` 增加词表与校验逻辑（数据来源 `data/lexicons.json`）。
- 误差估算：在 `reverse.estimate.js` 实现像素→数值的估算模型，用于识别截断/双轴等风险。

## 安全与伦理底线

- 不采集个人信息；
- 不上传数据；
- 仅使用开源可用素材；若不确定，使用自制占位图；
- 对“AI生成”内容显著标注。