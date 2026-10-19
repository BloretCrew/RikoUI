# Riko UI ✦ `@bloret-crew/riko-ui`

温馨、可爱、童话感的手绘风 UI 框架，源自小说《络的世界》。米色纸张、浅棕描边、冰蓝点缀与暖橙五角星——把治愈感带进任何项目。

- **零依赖**：纯 CSS + 原生 JS（约 7KB gzip），任何框架都能用
- **80+ 组件**：布局、表单、导航、数据展示、反馈、装饰
- **深浅色**：按系统 / 按时间 / 浅色 / 深色，所有组件自动适配；局部区域也能单独切换
- **无障碍**：WCAG AA 对比度、完整键盘操作、遵循 WAI-ARIA APG
- **对 AI 友好**：随包附带 `llms.txt`、完整指南与组件清单，`npx riko-ui check` 一键检查用法

## 安装

```sh
npm i @bloret-crew/riko-ui lucide
npm i @bloret-crew/riko-ui-fonts   # 可选：自托管字体（推荐）
```

```js
import '@bloret-crew/riko-ui-fonts/riko-fonts.css';
import '@bloret-crew/riko-ui/css';
import Riko, { toast } from '@bloret-crew/riko-ui';   // 自动初始化，并挂到 window.Riko
import * as lucide from 'lucide';
window.lucide = lucide;                                // 让 Riko 自动渲染 <i data-lucide>
```

### CDN

```html
<head>
  <script src="https://cdn.jsdelivr.net/npm/@bloret-crew/riko-ui@0/dist/riko-theme-init.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@bloret-crew/riko-ui-fonts@0/riko-fonts.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@bloret-crew/riko-ui@0/dist/riko-ui.min.css">
</head>
<body class="riko-plaid">
  …
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://cdn.jsdelivr.net/npm/@bloret-crew/riko-ui@0/dist/riko-ui.min.js"></script>
</body>
```

中国大陆访问：可使用 npmmirror 镜像（`https://registry.npmmirror.com/@bloret-crew/riko-ui/latest/files/dist/riko-ui.min.css`），或把 `dist/` 与字体包整个目录自托管到任意服务器（全部使用相对路径）。

## 写法一瞥

```html
<button class="riko-btn riko-btn--primary"><i data-lucide="book-open"></i>开始阅读</button>

<article class="riko-card riko-card--stitched">
  <h3 class="riko-card__title">星星酥</h3>
  <p class="riko-card__body">HV 甜品店的招牌点心，今天还是特价哦。</p>
</article>

<div class="riko-tabs" data-riko="tabs">…</div>
<script>Riko.toast.success('保存成功啦');</script>
```

| 规则 | 写法 |
|---|---|
| 组件 / 部件 / 修饰 | `riko-btn` / `riko-card__title` / `riko-btn--primary`（修饰与根类同元素） |
| 状态 | `disabled`、`aria-pressed`、`aria-expanded`、`aria-current`、`aria-invalid`（不用 `.active`） |
| JS 组件 | `data-riko="tabs"`，弹层用 `data-riko-open="id"` / `data-riko-close` |
| 设计变量 | `var(--riko-color-accent)`、`var(--riko-space-4)`… |
| 深色 | `<html data-theme="dark">`，或 `Riko.theme.set('system' \| 'time' \| 'light' \| 'dark')` |

## 给 AI

把下面这段放进项目的 `CLAUDE.md` / `AGENTS.md`（完整版见 `ai/AGENTS.snippet.md`）：

```md
本项目使用 Riko UI。写界面前先读 node_modules/@bloret-crew/riko-ui/llms.txt，
需要具体组件时读 ai/AI_GUIDE.md 对应小节；交付前运行 npx riko-ui check <改动的文件>，0 错误才算完成。
```

- `llms.txt`：核心规则 + 组件索引（约 2k tokens）
- `ai/AI_GUIDE.md`：每个组件的结构、修饰、状态、JS、无障碍与示例
- `ai/components.json`：机器可读组件清单
- `npx riko-ui check <路径> [--json]`：检查未知类名（附纠错建议）、修饰缺根类、结构/属性缺失、无障碍问题、写死颜色等

## 自定义主题

```css
:root, [data-theme] { --riko-palette-star: #E98A9B; --riko-palette-star-soft: #FBE1E6; }
[data-theme="dark"] { --riko-palette-star: #F2A3B1; }
```

所有样式都位于 `@layer riko.*` 中，你自己的（未分层）样式总能覆盖它们。

## 许可

MIT。内置图标来自 [Lucide](https://lucide.dev)（ISC）。字体见 `@bloret-crew/riko-ui-fonts`（SIL OFL 1.1）。
