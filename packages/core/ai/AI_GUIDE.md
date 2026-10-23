# Riko UI · AI 使用指南（v0.1.0）

> 本文件由构建自动生成（tools/gen-guide.mjs），是写 Riko UI 页面时的完整参考。
> 温馨、可爱、童话感的手绘风格：米色纸张、浅棕描边、冰蓝点缀、暖橙五角星；不规则圆角、虚线缝线、胶带、波浪线。

## 核心规则（必须遵守）

1. 类名前缀一律 `riko-`。根类 `riko-<组件>`，部件 `riko-<组件>__<部件>`，修饰 `riko-<组件>--<修饰>`。**修饰类必须与根类写在同一元素上**（`class="riko-btn riko-btn--primary"`）。
2. 状态用原生属性/ARIA，不用状态类：`disabled`、`aria-pressed`、`aria-selected`、`aria-expanded`、`aria-current="page"`、`aria-invalid="true"`、`aria-busy="true"`、`hidden`。**不要写 `.active` `.is-open` `.dark`**。
3. 需要 JS 的组件在根元素加 `data-riko="<组件>"`，Riko 会自动初始化（包括之后动态插入的元素）；打开弹层用 `data-riko-open="<id>"`，关闭用 `data-riko-close`。
4. 只用设计变量，不写死颜色/阴影/圆角：`var(--riko-color-*)`、`var(--riko-space-*)`、`var(--riko-radius-*)`、`var(--riko-shadow-*)`。定制品牌色就覆盖变量。
5. 深色模式由 `<html data-theme="dark">` 控制，交给 `Riko.theme`；不要自己写 `prefers-color-scheme` 或深色类。在 `<head>`、样式表之前用 `<script src>` 引入 `riko-theme-init.js` 防闪烁（SSR 可内联 `Riko.themeInitSnippet()`）。
6. 布局用原语：`riko-container`、`riko-section`、`riko-stack`（纵向）、`riko-cluster`（横向）、`riko-grid`、`riko-split`（侧栏+主区），不要为常规排版手写 flex/grid CSS。
7. 图标用 Lucide：`<i data-lucide="名称"></i>`（先引入 lucide 再引入 riko-ui）。仅图标的按钮必须有 `aria-label`；装饰图标/星星加 `aria-hidden="true"`。
8. 同一组（group）的修饰互斥，只选一个；尺寸默认 md 不写修饰。
9. 照抄本指南 examples 中的结构，不要增删部件层级；不确定时查 `ai/components/<组件>.json`。
10. 写完运行 `npx riko-ui check <文件或目录>`，把错误全部修掉再交付。check 只检查结构、类名与无障碍，交互行为请自己在浏览器里点一遍。
11. 页面最上方的标题区用 `riko-hero`（h1，每页唯一）；页面内的版块标题用 `riko-section-head`（h2）。

## 快速开始

**npm**

```sh
npm i @bloret-crew/riko-ui lucide
```

```js
import '@bloret-crew/riko-ui/css';          // 样式
import Riko from '@bloret-crew/riko-ui';       // 自动初始化，并挂到 window.Riko
import { createIcons, icons } from 'lucide';
createIcons({ icons });               // 或让 Riko 自动渲染（需 window.lucide）
```

**CDN / 纯 HTML**（中国大陆可把 cdn.jsdelivr.net 换成 registry.npmmirror.com 镜像或自托管 dist/）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.jsdelivr.net/npm/@bloret-crew/riko-ui@0/dist/riko-theme-init.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@bloret-crew/riko-ui@0/dist/riko-ui.min.css">
</head>
<body class="riko-plaid">
  <div class="riko-glow" aria-hidden="true"></div>
  <div class="riko-page">
    <main class="riko-page__main riko-container riko-section">
      <h1 class="riko-h1">你好，Riko UI <span class="riko-star" aria-hidden="true"></span></h1>
    </main>
  </div>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://cdn.jsdelivr.net/npm/@bloret-crew/riko-ui@0/dist/riko-ui.min.js"></script>
</body>
</html>
```

**React / Vue 等框架**：照常写 `className` / `class`；组件挂载或更新后若有新的 `data-riko` 元素，Riko 的 MutationObserver 会自动初始化；也可手动 `Riko.init(rootEl)`。服务端渲染时在 `<head>` 内联 `Riko.themeInitSnippet()` 的返回值。

## 组件速查

### 设计基础

| 组件 | 根类 | JS | 说明 |
|---|---|---|---|
| 图标与星星 `icon` | `riko-icon` | — | 页面图标推荐 Lucide；框架内置 47 个 Lucide 图标可用 riko-icon--<名> 直接显示；品牌五角星 riko-star。 |
| 滚动进场 `reveal` | — | `data-riko="reveal"` | 元素滚动进入视口时淡入上移。 |
| 主题与深色模式 `theme` | — | — | 四种外观模式（按系统 / 按时间 / 浅色 / 深色）、防闪烁脚本与设计变量覆盖。 |
| 排版 `typography` | — | — | 标题、手写副标、正文色调、引用、键位、行内代码、高亮与长文排版。 |
| 工具类 `utilities` | — | — | 少量高频工具类：读屏专用、显示隐藏、文字对齐/截断、宽度、外边距。 |

### 布局

| 组件 | 根类 | JS | 说明 |
|---|---|---|---|
| 横向排列 `cluster` | `riko-cluster` | — | 子元素横向排列、自动换行、垂直居中。 |
| 容器 `container` | `riko-container` | — | 水平居中、限制最大宽度并留出左右边距。 |
| 分割线 `divider` | `riko-divider` | — | 虚线、波浪线、带文字或星星的分割线，以及竖向分隔。 |
| 栅格 `grid` | `riko-grid` | — | 自适应栅格：按最小列宽自动排列，或固定 2/3/4/6 列（小屏自动减少）。 |
| 主视觉 / 页头 `hero` | `riko-hero` | — | 页面最上方的主视觉：手写引导语、大标题、手写副标、波浪线、导语、操作按钮，可在右侧放插画或拍立得。 |
| 居中与占位 `layout-helpers` | `riko-center` | — | riko-center 让内容水平垂直居中；riko-spacer 在 flex 容器中推开两侧。 |
| 页面外壳 `page` | `riko-page` | — | 整页纵向布局，页脚始终贴底。 |
| 版块 `section` | `riko-section` | — | 版块上下留白。 |
| 版块标题 `section-head` | `riko-section-head` | — | 版块大标题 + 手写副标 + 说明 + 右侧操作区。 |
| 侧栏布局 `split` | `riko-split` | — | 左侧（或右侧）固定宽度侧栏 + 主区；侧栏吸顶；窄屏变为上下。 |
| 纵向堆叠 `stack` | `riko-stack` | — | 子元素纵向排列并保持统一间距。 |

### 通用

| 组件 | 根类 | JS | 说明 |
|---|---|---|---|
| 按钮 `button` | `riko-btn` | — | 触发操作的按钮：纸白描边 + 底部实体阴影，悬停上浮、按下下沉。 |
| 按钮组 `button-group` | `riko-btn-group` | — | 把相关按钮放在一起：默认带间距，--attached 拼接成一体。 |
| 链接 `link` | `riko-link` | — | 带波浪下划线的文字链接，适合正文中跳转。 |
| 主题选择器 `theme-picker` | `riko-theme-picker` | `data-riko="theme-picker"` | 让用户在「按系统 / 按时间 / 浅色 / 深色」四种外观模式间切换，选择自动保存。 |

### 表单

| 组件 | 根类 | JS | 说明 |
|---|---|---|---|
| 复选框 `checkbox` | `riko-checkbox` | — | 原生 checkbox 美化：勾选时橙色小方块弹出对勾，支持半选与卡片样式。 |
| 可搜索选择 `combobox` | `riko-combobox` | `data-riko="combobox"` | 可输入关键字过滤的单选下拉（WAI-ARIA combobox + listbox），支持内联选项或增强原生 <select>；附带可复用的 riko-listbox 选项列表样式。 |
| 拖拽上传 `dropzone` | `riko-dropzone` | `data-riko="dropzone"` | 拖拽或点击选择文件的上传区域，显示文件列表、大小与图片缩略图，支持类型 / 大小 / 数量限制。 |
| 表单项 `field` | `riko-field` | `data-riko="field"` | 标签 + 控件 + 提示 / 错误 / 字数计数的标准组合，JS 自动处理无障碍关联。 |
| 字段组 `fieldset` | `riko-fieldset` | — | 用 legend 给一组相关控件起标题，可做成缝线卡片。 |
| 表单布局 `form` | `riko-form` | — | 表单整体排版：纵向或两列栅格，底部操作区。 |
| 表单校验 `form-validate` | — | `data-riko="form-validate"` | 基于浏览器原生约束的表单校验：失焦 / 提交时校验，把中文错误写入 riko-field__error、设置 aria-invalid，并聚焦第一个错误。 |
| 输入框 `input` | `riko-input` | — | 单行文本输入，统一美化 text / email / password / number / date / time / color / file 等原生类型。 |
| 输入组 `input-group` | `riko-input-group` | `data-riko="password-toggle"` | 给输入框加前后缀文字、图标或内嵌按钮，整体一个边框。 |
| 数字输入 `number` | `riko-number` | `data-riko="number"` | 带减 / 加按钮的数字输入，支持范围、步长、长按连续增减与键盘微调。 |
| 验证码输入 `otp` | `riko-otp` | `data-riko="otp"` | 分格输入验证码：自动跳格、粘贴拆分、退格回退、短信自动填充，完整值同步到隐藏 input。 |
| 单选框 `radio` | `riko-radio` | — | 原生 radio 美化：选中时中心弹出一颗橙色小星星，支持卡片样式。 |
| 滑块 `range` | `riko-range` | `data-riko="range"` | 美化的原生滑块：已选段为暖橙色，可同步显示数值。 |
| 星星评分 `rating` | `riko-rating` | — | 品牌五角星评分：可选模式基于单选框（纯 CSS、可键盘操作），只读模式支持小数。 |
| 搜索框 `search` | `riko-search` | `data-riko="search"` | 胶囊形搜索框：清除按钮、快捷键聚焦、防抖输入事件、可选结果计数与上一处 / 下一处；配合 Riko.highlight() 实现搜索并高亮。 |
| 分段选择 `segmented` | `riko-segmented` | — | 胶囊形的单选按钮组，选中项橙色并带回弹动画。 |
| 下拉选择 `select` | `riko-select` | — | 美化后的原生 <select>，支持分组、多选列表。 |
| 色块选择 `swatches` | `riko-swatches` | — | 基于单选框的圆形色块选择，选中时显示勾与描边。 |
| 开关 `switch` | `riko-switch` | — | 立即生效的开/关设置，打开时圆钮里出现一颗小星星。 |
| 标签输入 `tags-input` | `riko-tags-input` | `data-riko="tags-input"` | 输入后按回车 / 逗号生成标签，可删除、可粘贴批量添加，结果以逗号分隔同步到隐藏 input。 |
| 多行文本 `textarea` | `riko-textarea` | `data-riko="autosize"` | 多行输入，可自动增高，也有横线信纸外观。 |

### 导航

| 组件 | 根类 | JS | 说明 |
|---|---|---|---|
| 返回顶部 `backtop` | `riko-backtop` | `data-riko="backtop"` | 页面右下角的橙色星形按钮，滚动一段后出现，点击平滑回到顶部。 |
| 面包屑 `breadcrumb` | `riko-breadcrumb` | — | 显示当前页面在层级中的位置，分隔符为小箭头或小星星。 |
| 命令面板 `command` | `riko-command` | `data-riko="command"` | 快捷键唤起的全局搜索/命令弹窗：输入即过滤、分组结果、↑↓ 选择、Enter 执行，线性动画开合。 |
| 下拉菜单 `dropdown` | `riko-dropdown` | `data-riko="dropdown"` | 点击按钮弹出的操作菜单（riko-menu），支持图标、快捷键、分组标题、分隔线、勾选项与危险操作。 |
| 页脚 `footer` | `riko-footer` | — | 米色扇贝花边页脚：三颗星星、一行文字链接、两行版权信息。 |
| 导航栏 `navbar` | `riko-navbar` | `data-riko="navbar"` | 吸顶毛玻璃导航栏：左侧 logo 与标题，中间主导航，右侧操作按钮；窄屏自动收起为菜单。 |
| 翻页 `pager` | `riko-pager` | — | 「上一节 / 下一节」两张大卡片，显示前后内容的标题。 |
| 分页 `pagination` | `riko-pagination` | `data-riko="pagination"` | 页码分页，当前页是一颗微微倾斜的橙色小方块；可由 JS 根据总页数自动渲染。 |
| 阅读进度条 `reading-progress` | `riko-reading-progress` | `data-riko="reading-progress"` | 固定在页面顶部的细进度条（冰蓝到橙色渐变），显示整页或某篇文章的阅读进度。 |
| 侧边目录 `sidenav` | `riko-sidenav` | `data-riko="sidenav"` | 可折叠分组的侧边目录（小说章节、文档目录、设置分类），支持编号、已读星星、计数徽章。 |
| 步骤条 `steps` | `riko-steps` | — | 展示流程进度：已完成显示勾，当前步骤是倾斜的橙色小方块，出错显示红叉。 |
| 标签页 `tabs` | `riko-tabs` | `data-riko="tabs"` | 在同一区域内切换几组平级内容；支持波浪下划线、胶囊滑块、笔记本分隔页、纵向四种外观。 |
| 页内目录 `toc` | `riko-toc` | `data-riko="toc"` | 页内锚点目录，滚动时自动高亮当前小节（左侧橙色竖线 + 小星星）。 |

### 数据展示

| 组件 | 根类 | JS | 说明 |
|---|---|---|---|
| 折叠面板 `accordion` | `riko-accordion` | `data-riko="accordion"` | 基于原生 <details> 的折叠面板，带编号徽章与旋转箭头；加 JS 后展开收起有平滑动画。 |
| 头像 `avatar` | `riko-avatar` | — | 圆形头像，支持图片、文字缩写、图标、在线状态与重叠头像组。 |
| 徽标 `badge` | `riko-badge` | — | 小小的数字或圆点，用于未读数、计数和状态提示，可挂在按钮或头像右上角。 |
| 卡片 `card` | `riko-card` | — | 纸白底、手绘圆角的内容容器，可加缝线、胶带，或做成整卡可点击的入口。 |
| 轮播 `carousel` | `riko-carousel` | `data-riko="carousel"` | 基于滚动吸附的横向轮播，自动生成箭头与圆点，支持触摸滑动、键盘与自动播放。 |
| 代码块 `codeblock` | `riko-codeblock` | — | 带标题栏与复制按钮的代码块，标题栏左侧是三颗彩色小圆点。 |
| 复制 `copy` | — | `data-riko="copy"` | 给任意按钮加上「一键复制」：复制成功时图标变成勾，并告诉读屏「已复制」。 |
| 描述列表 `desc-list` | `riko-desc-list` | — | 「名称—内容」成对展示的信息列表，可竖排、横排、多列或带边框。 |
| 空状态 `empty` | `riko-empty` | — | 没有内容时的温馨占位：默认插画是一颗漂浮的星星和小云朵。 |
| 列表 `list` | `riko-list` | — | 一行一条信息的列表，支持图标、手写编号、说明、元信息与操作，可做成可点击列表或小卡片网格。 |
| 拍立得 `polaroid` | `riko-polaroid` | — | 带白边与手写说明的照片框，轻微倾斜，悬停回正。 |
| 气泡卡片 `popover` | `riko-popover` | `data-riko="popover"` | 点击触发的浮层卡片，可放任意内容（文字、链接、按钮、表单），点外部或按 Esc 关闭。 |
| 统计数值 `stat` | `riko-stat` | — | 大号手写数字的指标卡，带标签、图标与涨跌趋势。 |
| 表格 `table` | `riko-table` | `data-riko="table-sort"` | 手绘风数据表格，外层负责横向滚动与圆角，支持斑马纹、悬停、紧凑、竖线与点击表头排序。 |
| 标签 `tag` | `riko-tag` | `data-riko-dismiss` | 胶囊形的小标签，表示分类、状态或关键词，可带图标、星星，或做成可移除。 |
| 时间轴 `timeline` | `riko-timeline` | — | 按时间顺序排列的事件，虚线串联，节点可以是小圆点或星星。 |
| 文字提示 `tooltip` | — | `data-riko="tooltip"` | 悬停或聚焦时出现的小提示气泡，可可色底、带小箭头。 |
| 树形列表 `tree` | `riko-tree` | — | 用嵌套 <details> 构建的文件夹树，虚线连接层级，原生键盘可用。 |

### 反馈

| 组件 | 根类 | JS | 说明 |
|---|---|---|---|
| 提示条 `alert` | `riko-alert` | — | 在内容中显示一条带色调图标的提示/标注，可带标题、操作按钮与关闭按钮。 |
| 公告横幅 `banner` | `riko-banner` | — | 横跨页面或内容区顶部的一条公告，可带图标、链接与关闭按钮，可吸顶。 |
| 对话框 `dialog` | `riko-dialog` | `data-riko="dialog"` | 基于原生 <dialog> 的模态对话框：线性动画、遮罩模糊、焦点锁定、Esc/遮罩关闭；另提供 Riko.confirm / Riko.alert。 |
| 抽屉 `drawer` | `riko-drawer` | `data-riko="drawer"` | 从屏幕左/右/底部滑出的模态面板（原生 <dialog>），用法与对话框一致。 |
| 进度 `progress` | `riko-progress` | — | 基于原生 <progress> 的渐变进度条（支持不确定进度），以及带小星星的环形进度。 |
| 结果页 `result` | `riko-result` | — | 操作完成、出错、空结果或 404 时的整块居中反馈：插画/图标、标题、说明与操作。 |
| 骨架屏 `skeleton` | `riko-skeleton` | — | 内容加载前的柔和闪光占位块：文字行、圆形头像、矩形图片。 |
| 加载中 `spinner` | `riko-spinner` | — | 旋转的品牌星星（或三颗跳动的小星星）加可读文字。 |
| 轻提示 `toast` | `riko-toast` | — | 由 JS 弹出、几秒后自动消失的通知卡片；悬停/聚焦时暂停计时，可带操作按钮。 |

### 装饰

| 组件 | 根类 | JS | 说明 |
|---|---|---|---|
| 柔光背景 `glow` | `riko-glow` | — | 页面角落的冰蓝与暖橙柔光（fixed，不影响布局）。 |
| 便利贴 `note` | `riko-note` | — | 略微倾斜、右下角折页的便利贴。 |
| 笔记本纸 `notebook` | `riko-notebook` | — | 左侧装订孔 + 橙色页边线，可选横线格。 |
| 格纹背景 `plaid` | `riko-plaid` | — | 络可裙摆般的淡格纹背景。 |
| 扇贝花边 `scallop` | `riko-scallop` | — | 色块顶部（或底部）的圆弧花边。 |
| 漂浮星星 `sky` | `riko-sky` | — | 背景中缓慢闪烁的小星星（最多 7 颗位置预设）。 |
| 波浪下划线 `squiggle` | `riko-squiggle` | — | 手绘感的橙色波浪线。 |
| 贴纸 `sticker` | `riko-sticker` | — | 倾斜的手写体小贴纸标签。 |
| 缝线内框 `stitched` | `riko-stitched` | — | 在有背景的块内画一圈虚线缝线（像布艺/裙摆的走线）。 |
| 胶带 `tape` | `riko-tape` | — | 贴在卡片/照片顶部的半透明条纹胶带。 |
| 轻微倾斜 `tilt` | `riko-tilt` | — | 让元素微微倾斜，悬停时回正。 |

## 设计变量

组件与自定义样式只使用这些变量（深浅色自动切换）：

- **color**：`--riko-color-bg` `--riko-color-surface` `--riko-color-surface-sunken` `--riko-color-surface-muted` `--riko-color-surface-glass` `--riko-color-fg` `--riko-color-fg-strong` `--riko-color-fg-muted` `--riko-color-fg-subtle` `--riko-color-border` `--riko-color-border-strong` `--riko-color-stitch` `--riko-color-primary` `--riko-color-primary-fg` `--riko-color-primary-shade` `--riko-color-brown` `--riko-color-tan` `--riko-color-accent` `--riko-color-accent-soft` `--riko-color-accent-fg` `--riko-color-accent-ink` `--riko-color-accent-shade` `--riko-color-ice` `--riko-color-ice-soft` `--riko-color-ice-strong` `--riko-color-ice-ink` `--riko-color-success` `--riko-color-success-soft` `--riko-color-success-ink` `--riko-color-warning` `--riko-color-warning-soft` `--riko-color-warning-ink` `--riko-color-danger` `--riko-color-danger-soft` `--riko-color-danger-ink` `--riko-color-info` `--riko-color-info-soft` `--riko-color-info-ink` `--riko-color-overlay` `--riko-color-focus` `--riko-color-mark` `--riko-color-selection`
- **plaid**：`--riko-plaid-a` `--riko-plaid-b`
- **glow**：`--riko-glow-a` `--riko-glow-b`
- **shadow**：`--riko-shadow-sm` `--riko-shadow-md` `--riko-shadow-lg` `--riko-shadow-inset` `--riko-shadow-press` `--riko-shadow-press-hover` `--riko-shadow-press-primary` `--riko-shadow-press-accent`
- **space**：`--riko-space-0` `--riko-space-1` `--riko-space-2` `--riko-space-3` `--riko-space-4` `--riko-space-5` `--riko-space-6` `--riko-space-7` `--riko-space-8` `--riko-space-9` `--riko-space-10`
- **radius**：`--riko-radius-xs` `--riko-radius-sm` `--riko-radius-md` `--riko-radius-lg` `--riko-radius-xl` `--riko-radius-pill` `--riko-radius-wobble-sm` `--riko-radius-wobble` `--riko-radius-wobble-lg`
- **font**：`--riko-font-title` `--riko-font-body` `--riko-font-read` `--riko-font-hand` `--riko-font-mono`
- **text**：`--riko-text-xs` `--riko-text-sm` `--riko-text-md` `--riko-text-lg` `--riko-text-xl` `--riko-text-2xl` `--riko-text-3xl` `--riko-text-4xl` `--riko-text-5xl`
- **weight**：`--riko-weight-normal` `--riko-weight-medium` `--riko-weight-bold`
- **leading**：`--riko-leading-tight` `--riko-leading-normal` `--riko-leading-relaxed` `--riko-leading-read`
- **ease**：`--riko-ease-out` `--riko-ease-bounce` `--riko-ease-linear`
- **duration**：`--riko-duration-fast` `--riko-duration-base` `--riko-duration-slow`
- **z**：`--riko-z-base` `--riko-z-sticky` `--riko-z-dropdown` `--riko-z-overlay` `--riko-z-modal` `--riko-z-toast` `--riko-z-tooltip`
- **control**：`--riko-control-h-sm` `--riko-control-h-md` `--riko-control-h-lg`
- **border**：`--riko-border-width`
- **focus**：`--riko-focus-ring` `--riko-focus-offset`
- **container**：`--riko-container` `--riko-container-wide` `--riko-container-narrow`
- **header**：`--riko-header-h`

## 组件详情

## 设计基础

### 图标与星星 Icon & Star `icon`

页面图标推荐 Lucide；框架内置 47 个 Lucide 图标可用 riko-icon--<名> 直接显示；品牌五角星 riko-star。

**何时用**：任何图标位置。普通页面图标用 Lucide（<i data-lucide="名称">），不想加载 Lucide 时用内置 riko-icon--*；装饰与强调用 riko-star。

**根**：`riko-icon`（推荐 `<span>`）

**部件**：
- `riko-star` 品牌五角星（实心圆润），颜色默认橙色

**修饰**（同组互斥）：
- variant：`riko-icon--check` 内置图标 check；`riko-icon--x` 内置图标 x；`riko-icon--minus` 内置图标 minus；`riko-icon--plus` 内置图标 plus；`riko-icon--chevron-down` 内置图标 chevron-down；`riko-icon--chevron-up` 内置图标 chevron-up；`riko-icon--chevron-left` 内置图标 chevron-left；`riko-icon--chevron-right` 内置图标 chevron-right；`riko-icon--chevrons-up-down` 内置图标 chevrons-up-down；`riko-icon--arrow-up` 内置图标 arrow-up；`riko-icon--arrow-right` 内置图标 arrow-right；`riko-icon--arrow-left` 内置图标 arrow-left；`riko-icon--search` 内置图标 search；`riko-icon--info` 内置图标 info；`riko-icon--success` 内置图标 success；`riko-icon--warning` 内置图标 warning；`riko-icon--danger` 内置图标 danger；`riko-icon--help` 内置图标 help；`riko-icon--loader` 内置图标 loader；`riko-icon--upload` 内置图标 upload；`riko-icon--file` 内置图标 file；`riko-icon--calendar` 内置图标 calendar；`riko-icon--clock` 内置图标 clock；`riko-icon--eye` 内置图标 eye；`riko-icon--eye-off` 内置图标 eye-off；`riko-icon--copy` 内置图标 copy；`riko-icon--menu` 内置图标 menu；`riko-icon--more-horizontal` 内置图标 more-horizontal；`riko-icon--external-link` 内置图标 external-link；`riko-icon--sun` 内置图标 sun；`riko-icon--moon` 内置图标 moon；`riko-icon--monitor` 内置图标 monitor；`riko-icon--settings` 内置图标 settings；`riko-icon--inbox` 内置图标 inbox；`riko-icon--image` 内置图标 image；`riko-icon--user` 内置图标 user；`riko-icon--bell` 内置图标 bell；`riko-icon--grip-vertical` 内置图标 grip-vertical；`riko-icon--folder` 内置图标 folder；`riko-icon--folder-open` 内置图标 folder-open；`riko-icon--circle` 内置图标 circle；`riko-icon--dot` 内置图标 dot；`riko-icon--pencil` 内置图标 pencil；`riko-icon--feather` 内置图标 feather；`riko-icon--lock` 内置图标 lock；`riko-icon--send` 内置图标 send
- behavior：`riko-icon--spin` 旋转（加载中）；`riko-star--twinkle` 闪烁动画；`riko-star--bob` 上下漂浮动画
- size：`riko-icon--sm` 0.9em；`riko-icon--lg` 1.5em；`riko-icon--xl` 2em；`riko-star--xs` 星星 0.6em；`riko-star--sm` 星星 0.8em；`riko-star--lg` 星星 1.5em；`riko-star--xl` 星星 2.4em
- tone：`riko-star--ice` 冰蓝星星；`riko-star--muted` 浅棕星星

**JS**：
- 方法 `Riko.init(root)`：页面已加载 lucide 时，会自动把 root 内的 <i data-lucide> 渲染为 svg

**无障碍**：
- 纯装饰图标加 aria-hidden="true"；有含义的独立图标加 role="img" 与 aria-label。
- 仅含图标的按钮要在按钮上写 aria-label。

**要点**：
- ✓ Lucide：<i data-lucide="heart"></i>，先引入 lucide 再引入 riko-ui.js，Riko 会自动渲染。
- ✓ 内置图标：<span class="riko-icon riko-icon--search" aria-hidden="true"></span>。
- ✓ 图标颜色继承 currentColor，尺寸默认 1.15em，可用 --riko-icon-size 覆盖。
- ✓ 星星颜色可用 --riko-star-color 覆盖，尺寸用 --riko-star-size。

**避免**：
- ✗ 不要混用多个图标库，统一 Lucide。
- ✗ 不要写 <span class="riko-icon--check">（缺少根类 riko-icon）。

**示例 · Lucide 图标**

```html
<i data-lucide="book-open"></i>
```

**示例 · 内置图标**

```html
<span class="riko-icon riko-icon--search" aria-hidden="true"></span>
```

**示例 · 品牌星星**

```html
<span class="riko-star riko-star--lg riko-star--twinkle" aria-hidden="true"></span>
```

### 滚动进场 Reveal `reveal`

元素滚动进入视口时淡入上移。

**何时用**：首页版块、卡片网格的进场点缀；不要用于首屏关键内容。

**部件**：
- `riko-u-reveal` 由 JS 自动添加的进场过渡类（无需手写）

**JS**：
- 启用：`data-riko="reveal"`
- 选项 `data-riko-delay`（毫秒） 默认 0：进场延迟（可做错落效果）

**无障碍**：
- 用户开启「减少动态效果」时直接显示，无动画。

**要点**：
- ✓ 无 JS 时内容正常显示（渐进增强）。

**示例 · 基础**

```html
<section class="riko-section" data-riko="reveal">…</section>
```

### 主题与深色模式 Theme `theme`

四种外观模式（按系统 / 按时间 / 浅色 / 深色）、防闪烁脚本与设计变量覆盖。

**何时用**：所有页面。只需在 <head> 放防闪烁脚本，Riko 会自动应用保存的模式。

**JS**：
- 方法 `Riko.theme.set("system" | "time" | "light" | "dark")`：设置并保存模式
- 方法 `Riko.theme.toggle()`：浅/深切换
- 方法 `Riko.theme.mode`：当前模式
- 方法 `Riko.theme.current`：实际主题 'light' | 'dark'
- 方法 `Riko.theme.onChange(fn)`：订阅变化
- 方法 `Riko.theme.configure({ storageKey, dayStart, dayEnd })`：配置
- 方法 `Riko.themeInitSnippet(storageKey?)`：返回防闪烁脚本源码（服务端渲染时内联）
- 事件 `riko:theme:change` detail { mode, theme }：在 document 上派发

**要点**：
- ✓ <html data-theme="dark"> 即深色；局部区域也可写 data-theme="dark" / "light" 强制主题。
- ✓ 自定义品牌色：在你的 CSS 中覆盖 --riko-palette-* 或 --riko-color-*（写在 :root, [data-theme] 与 [data-theme="dark"] 两处）。
- ✓ 防闪烁：在 <head>、样式表之前放 <script src=".../dist/riko-theme-init.js"></script>（推荐）；服务端渲染时也可把 Riko.themeInitSnippet() 的返回值内联。

**避免**：
- ✗ 不要写 @media (prefers-color-scheme) 自己切颜色，统一用 data-theme。

**示例 · 局部深色区域**

```html
<section data-theme="dark" style="background: var(--riko-color-bg); color: var(--riko-color-fg);">…</section>
```

**示例 · 覆盖品牌色**

```html
<style>
  :root, [data-theme] { --riko-palette-star: #E98A9B; --riko-palette-star-soft: #FBE1E6; }
</style>
```

### 排版 Typography `typography`

标题、手写副标、正文色调、引用、键位、行内代码、高亮与长文排版。

**何时用**：所有文字都优先用这些类而不是自己写字体/颜色。长文章、小说正文用 riko-prose（小说加 --read）。

**部件**：
- `riko-display` 超大展示标题（首页主视觉）
- `riko-h1` 一级标题（ZCOOL XiaoWei）
- `riko-h2` 二级标题
- `riko-h3` 三级标题
- `riko-h4` 四级标题
- `riko-h5` 五级标题
- `riko-h6` 六级标题
- `riko-hand` 手写体英文点缀（Caveat），可加 --ice / --accent
- `riko-lead` 导语段落（大一号、次要色）
- `riko-text` 正文文字，配合 --sm/--xs/--lg、--muted/--strong/--accent/--ice/--success/--warning/--danger、--read
- `riko-caption` 图注/小字说明
- `riko-eyebrow` 标题上方的小号字距标签
- `riko-quote` 引用块（blockquote），可含 __cite
- `riko-quote__cite` 引用出处
- `riko-kbd` 键盘按键
- `riko-code` 行内代码
- `riko-mark` 高亮（--current 为当前匹配）
- `riko-prose` 长文容器：自动排版内部 h1–h6、p、ul、blockquote、code、pre、table、img；--read 小说阅读、--lg、--wide

**修饰**（同组互斥）：
- tone：`riko-hand--ice` 冰蓝手写；`riko-hand--accent` 橙色手写；`riko-text--muted` 次要色；`riko-text--strong` 加粗强调色；`riko-text--accent` 橙色文字；`riko-text--ice` 冰蓝文字；`riko-text--success` 成功色；`riko-text--warning` 警告色；`riko-text--danger` 危险色
- size：`riko-text--xs` 12px；`riko-text--sm` 14px；`riko-text--lg` 18px；`riko-prose--lg` 大一号
- variant：`riko-text--read` 衬线阅读字体；`riko-mark--current` 当前搜索结果；`riko-prose--read` 小说/散文：衬线、首行缩进、宽松行距；字号读取 --riko-reading-size
- layout：`riko-prose--wide` 取消最大宽度

**无障碍**：
- 标题层级按语义使用 h1–h6 元素，riko-h* 只负责外观，可与元素层级不同。
- 手写体只用于短英文点缀，不要承载重要信息。

**要点**：
- ✓ 标题元素加 riko-h1…riko-h6；需要手写英文副标时在旁边放 <span class="riko-hand">…</span>。
- ✓ Markdown/CMS 输出的 HTML 包在 <article class="riko-prose"> 里即可获得完整排版。
- ✓ 修饰类必须与根类同时写：<p class="riko-text riko-text--muted">。
- ✓ 标题字体 ZCOOL XiaoWei 风格化较强（如木字旁、「于」），少数字可能不易辨认；若标题中这类字很多或要求严肃易读，可改用 style="font-family: var(--riko-font-read)" 或 riko-text--read。

**避免**：
- ✗ 不要写 style="font-family:…" 或写死颜色。
- ✗ 不要单独写 riko-text--muted 而漏掉 riko-text。

**示例 · 标题 + 手写副标**

```html
<h2 class="riko-h2">小说目录 <span class="riko-hand">table of contents</span></h2>
```

**示例 · 导语与次要文字**

```html
<p class="riko-lead">从沙滩上的第一幅画开始，踏入这个世界的边缘与深处。</p>
<p class="riko-text riko-text--sm riko-text--muted">建议先阅读已更新章节，避免剧透。</p>
```

**示例 · 小说正文**

```html
<article class="riko-prose riko-prose--read">
  <p>轻柔的海浪涌来，在微风的吹拂下散入金黄的沙滩。</p>
  <p>沙滩上，一个女孩哼着欢快的歌，挥动她的画笔。</p>
</article>
```

**示例 · 引用、键位、代码、高亮**

```html
<blockquote class="riko-quote">愿你在字里行间找到属于自己的那片海。<cite class="riko-quote__cite">《络的世界》</cite></blockquote>
<p>按 <kbd class="riko-kbd">/</kbd> 搜索，配置项 <code class="riko-code">themeMode</code>，<mark class="riko-mark">星星酥</mark> 今日特价。</p>
```

### 工具类 Utilities `utilities`

少量高频工具类：读屏专用、显示隐藏、文字对齐/截断、宽度、外边距。

**何时用**：仅在组件/布局原语无法满足的小调整时使用。

**部件**：
- `riko-u-sr-only` 只对读屏可见
- `riko-u-hidden` 隐藏
- `riko-u-hide-sm` ≤520px 隐藏
- `riko-u-hide-md` ≤768px 隐藏
- `riko-u-only-mobile` 仅 ≤768px 显示
- `riko-u-text-left` text-left
- `riko-u-text-center` text-center
- `riko-u-text-right` text-right
- `riko-u-nowrap` nowrap
- `riko-u-truncate` 单行省略
- `riko-u-clamp-2` 两行省略
- `riko-u-clamp-3` 三行省略
- `riko-u-tabular` 等宽数字
- `riko-u-w-full` w-full
- `riko-u-flex-1` flex-1
- `riko-u-relative` relative
- `riko-u-mx-auto` mx-auto
- `riko-u-mt-0` mt-0
- `riko-u-mt-2` mt-2
- `riko-u-mt-4` mt-4
- `riko-u-mt-6` mt-6
- `riko-u-mt-8` mt-8
- `riko-u-mt-10` mt-10
- `riko-u-mb-0` mb-0
- `riko-u-mb-2` mb-2
- `riko-u-mb-4` mb-4
- `riko-u-mb-6` mb-6
- `riko-u-mb-8` mb-8
- `riko-u-mb-10` mb-10

**要点**：
- ✓ 间距工具只有 mt/mb 的 0/2/4/6/8/10 档（对应 --riko-space-*）；更复杂的间距请用 riko-stack / riko-cluster。

**避免**：
- ✗ 不要用工具类堆砌组件外观（颜色、阴影、圆角），那是组件的职责。

**示例 · 读屏专用文字**

```html
<a class="riko-link" href="#chapters">继续阅读<span class="riko-u-sr-only">：第 76 节 风过围垣，落星回响</span></a>
```

## 布局

### 横向排列 Cluster `cluster`

子元素横向排列、自动换行、垂直居中。

**何时用**：按钮组、标签组、工具栏、页头左右分布。

**根**：`riko-cluster`（推荐 `<div>`）

**修饰**（同组互斥）：
- size：`riko-cluster--xs` 4px；`riko-cluster--sm` 8px；`riko-cluster--lg` 24px
- layout：`riko-cluster--between` 两端对齐；`riko-cluster--center` 居中；`riko-cluster--end` 靠右
- behavior：`riko-cluster--start` 顶部对齐；`riko-cluster--nowrap` 不换行

**示例 · 按钮组**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn riko-btn--primary">保存</button>
  <button type="button" class="riko-btn">取消</button>
</div>
```

### 容器 Container `container`

水平居中、限制最大宽度并留出左右边距。

**何时用**：包住每个版块的内容。阅读正文用 --narrow，后台/阅读器用 --wide。

**根**：`riko-container`（推荐 `<div>`）

**修饰**（同组互斥）：
- size：`riko-container--wide` 1320px；`riko-container--narrow` 760px（阅读宽度）；`riko-container--fluid` 占满宽度（保留边距）

**要点**：
- ✓ 宽度变量：--riko-container / --riko-container-wide / --riko-container-narrow，可在 :root 覆盖。

**示例 · 基础**

```html
<div class="riko-container">…</div>
```

### 分割线 Divider `divider`

虚线、波浪线、带文字或星星的分割线，以及竖向分隔。

**何时用**：分隔内容块；行内分隔用 --vertical。

**根**：`riko-divider`（推荐 `<div>`）

**修饰**（同组互斥）：
- variant：`riko-divider--squiggle` 橙色波浪线；`riko-divider--stars` 中间放星星；`riko-divider--solid` 实线
- layout：`riko-divider--vertical` 竖向（行内）

**无障碍**：
- 纯装饰分割用 <div role="separator">；带文字时文字会被读出。

**示例 · 带文字**

```html
<div class="riko-divider" role="separator">或者</div>
```

**示例 · 波浪线**

```html
<div class="riko-divider riko-divider--squiggle" role="separator"></div>
```

**示例 · 星星**

```html
<div class="riko-divider riko-divider--stars" role="separator"><span class="riko-star" aria-hidden="true"></span></div>
```

### 栅格 Grid `grid`

自适应栅格：按最小列宽自动排列，或固定 2/3/4/6 列（小屏自动减少）。

**何时用**：卡片网格、统计面板、相册。

**根**：`riko-grid`（推荐 `<div>`）

**部件**：
- `riko-grid__span-2` 占 2 列（窄屏自动整行）
- `riko-grid__span-3` 占 3 列（窄屏自动整行）
- `riko-grid__span-full` 占满整行

**修饰**（同组互斥）：
- layout：`riko-grid--cols-2` 两列；`riko-grid--cols-3` 三列；`riko-grid--cols-4` 四列（≤1024px 两列，≤420px 一列）；`riko-grid--cols-6` 六列
- size：`riko-grid--sm` 小间距；`riko-grid--lg` 大间距

**要点**：
- ✓ 默认自适应列：最小列宽 240px，可用 style="--riko-grid-min: 180px" 调整。

**避免**：
- ✗ 不要写 style="grid-column: span 2"，窄屏会撑出隐式列导致溢出，请用 riko-grid__span-2。

**示例 · 自适应**

```html
<div class="riko-grid">
  <article class="riko-card">…</article>
  <article class="riko-card">…</article>
  <article class="riko-card">…</article>
</div>
```

### 主视觉 / 页头 Hero `hero`

页面最上方的主视觉：手写引导语、大标题、手写副标、波浪线、导语、操作按钮，可在右侧放插画或拍立得。

**何时用**：每个页面的标题区都用它：首页用 --split（左文右图）或 --center；内页标题用 --center --sm 或 --sm。页面内部的版块标题改用 section-head。

**根**：`riko-hero`（推荐 `<section>`）

**部件**：
- `riko-hero__text` 文字列（必需）
- `riko-hero__eyebrow` 标题上方的手写引导语（可带星星）
- `riko-hero__title` 主标题，用 <h1>（每页唯一）（必需）
- `riko-hero__sub` 手写英文副标（冰蓝）
- `riko-hero__desc` 导语段落
- `riko-hero__actions` 按钮/标签区
- `riko-hero__art` 右侧插画区（--split 时），宽度用 --riko-hero-art 调整

**修饰**（同组互斥）：
- layout：`riko-hero--split` 左文右图，窄屏自动变为上下居中；`riko-hero--center` 居中
- size：`riko-hero--sm` 内页小号页头

**无障碍**：
- __title 用 <h1>，整页只有一个 h1。
- 装饰星星与波浪线加 aria-hidden="true"。

**要点**：
- ✓ 在 __text 中可放 <span class="riko-squiggle" aria-hidden="true"></span> 作为标题下的波浪线。
- ✓ 包在 riko-container 内使用。

**避免**：
- ✗ 不要把页面主标题写成 riko-section-head（那是版块内的 h2 标题）。

**示例 · 首页主视觉（左文右图）**

```html
<section class="riko-hero riko-hero--split">
  <div class="riko-hero__text">
    <p class="riko-hero__eyebrow"><span class="riko-star" aria-hidden="true"></span>a small star in ordinary days</p>
    <h1 class="riko-hero__title">《络的世界》</h1>
    <p class="riko-hero__sub">Welcome to RikoLand</p>
    <span class="riko-squiggle" aria-hidden="true"></span>
    <p class="riko-hero__desc">欢迎来到络可的童话小镇呀！这里藏着好多五彩斑斓的画稿和奇思妙想。</p>
    <div class="riko-hero__actions">
      <a class="riko-btn riko-btn--primary riko-btn--lg" href="#read"><i data-lucide="book-open"></i>开始阅读</a>
      <span class="riko-tag riko-tag--accent">预计 2027 年继续更新！</span>
    </div>
  </div>
  <div class="riko-hero__art">
    <figure class="riko-polaroid">
      <span class="riko-tape" aria-hidden="true"></span>
      <img src="https://riko.land/assets/logo.jpg" alt="《络的世界》封面插画">
      <figcaption class="riko-polaroid__caption">Riko's World ✦</figcaption>
    </figure>
  </div>
</section>
```

**示例 · 内页页头**

```html
<header class="riko-hero riko-hero--center riko-hero--sm">
  <div class="riko-hero__text">
    <h1 class="riko-hero__title"><span class="riko-star" aria-hidden="true"></span> 角色设定集</h1>
    <p class="riko-hero__sub">who's who in riko's world</p>
    <p class="riko-hero__desc">《络的世界》中已登场的人物与地点整理。建议先读完已更新章节再翻阅哦。</p>
  </div>
</header>
```

### 居中与占位 Center & Spacer `layout-helpers`

riko-center 让内容水平垂直居中；riko-spacer 在 flex 容器中推开两侧。

**何时用**：空状态居中、导航栏左右分布。

**根**：`riko-center`（推荐 `<div>`）

**部件**：
- `riko-spacer` 在 flex 行中占满剩余空间

**示例 · 推开两侧**

```html
<div class="riko-cluster riko-cluster--nowrap">
  <strong>《络的世界》</strong>
  <span class="riko-spacer"></span>
  <button type="button" class="riko-btn riko-btn--sm">设置</button>
</div>
```

### 页面外壳 Page `page`

整页纵向布局，页脚始终贴底。

**何时用**：每个页面的 <body> 内最外层。

**根**：`riko-page`（推荐 `<div>`）

**部件**：
- `riko-page__main` 主体区域（占满剩余高度）

**要点**：
- ✓ <body class="riko-plaid"> 可获得淡格纹背景；再放 <div class="riko-glow" aria-hidden="true"></div> 获得柔光。

**示例 · 页面骨架**

```html
<div class="riko-page">
  <header>…页头（如 riko-navbar）…</header>
  <main class="riko-page__main">…</main>
  <footer>…页脚（如 riko-footer）…</footer>
</div>
```

### 版块 Section `section`

版块上下留白。

**何时用**：页面中的每个主要区块。

**根**：`riko-section`（推荐 `<div>`）

**修饰**（同组互斥）：
- size：`riko-section--sm` 小留白；`riko-section--lg` 大留白

**示例 · 基础**

```html
<section class="riko-section">
  <div class="riko-container">…</div>
</section>
```

### 版块标题 Section Head `section-head`

版块大标题 + 手写副标 + 说明 + 右侧操作区。

**何时用**：每个版块开头（如「小说目录」「其他内容」）。

**根**：`riko-section-head`（推荐 `<div>`）

**部件**：
- `riko-section-head__text` 左侧文字容器（必需）
- `riko-section-head__title` 标题（h2），可在前面放 riko-star（必需）
- `riko-section-head__sub` 手写英文副标
- `riko-section-head__desc` 说明文字
- `riko-section-head__actions` 右侧操作（按钮、搜索）

**修饰**（同组互斥）：
- layout：`riko-section-head--center` 居中
- size：`riko-section-head--sm` 小号标题

**示例 · 完整**

```html
<div class="riko-section-head">
  <div class="riko-section-head__text">
    <h2 class="riko-section-head__title"><span class="riko-star" aria-hidden="true"></span>小说目录</h2>
    <span class="riko-section-head__sub">table of contents</span>
    <p class="riko-section-head__desc">点击章节即可跳转到对应的剧情内容。</p>
  </div>
  <div class="riko-section-head__actions">
    <button type="button" class="riko-btn riko-btn--sm">全部展开</button>
  </div>
</div>
```

### 侧栏布局 Split `split`

左侧（或右侧）固定宽度侧栏 + 主区；侧栏吸顶；窄屏变为上下。

**何时用**：阅读器、文档、后台、设置页。

**根**：`riko-split`（推荐 `<div>`）

**部件**：
- `riko-split__aside` 侧栏（sticky）（必需）
- `riko-split__main` 主区（必需）

**修饰**（同组互斥）：
- layout：`riko-split--reverse` 侧栏在右
- size：`riko-split--wide-aside` 侧栏 360px
- behavior：`riko-split--static` 侧栏不吸顶（内容区的右侧栏、后台卡片栏）

**要点**：
- ✓ 侧栏宽度可用 --riko-split-aside 覆盖。

**示例 · 阅读器布局**

```html
<div class="riko-split riko-container riko-container--wide">
  <aside class="riko-split__aside">…目录…</aside>
  <main class="riko-split__main">…正文…</main>
</div>
```

### 纵向堆叠 Stack `stack`

子元素纵向排列并保持统一间距。

**何时用**：表单项、卡片内容、任何纵向列表。

**根**：`riko-stack`（推荐 `<div>`）

**修饰**（同组互斥）：
- size：`riko-stack--xs` 4px；`riko-stack--sm` 8px；`riko-stack--lg` 24px；`riko-stack--xl` 48px
- layout：`riko-stack--center` 水平居中

**要点**：
- ✓ 默认间距 16px；也可用 style="--riko-stack-gap: var(--riko-space-5)" 精调。

**示例 · 基础**

```html
<div class="riko-stack">
  <h3 class="riko-h3">标题</h3>
  <p>正文</p>
</div>
```

## 通用

### 按钮 Button `button`

触发操作的按钮：纸白描边 + 底部实体阴影，悬停上浮、按下下沉。

**何时用**：用于提交、打开弹窗、执行操作等。跳转页面时用 <a class="riko-btn" href>；只是行内文字链接改用 riko-link。

**根**：`riko-btn`（推荐 `<button>`）

**部件**：
- `riko-btn__badge` 按钮内的计数徽章

**修饰**（同组互斥）：
- variant：`riko-btn--primary` 主要操作：可可色实心（每个区域最多一个）；`riko-btn--accent` 强调：暖橙色实心；`riko-btn--ice` 冰蓝色；`riko-btn--soft` 浅橙底，无描边；`riko-btn--outline` 虚线描边，透明底；`riko-btn--ghost` 无边框，悬停出现浅底（工具栏、次要操作）；`riko-btn--link` 像链接一样的按钮；`riko-btn--danger` 危险操作（删除等）
- size：`riko-btn--xs` 超小 28px；`riko-btn--sm` 小号 34px；`riko-btn--lg` 大号 52px；`riko-btn--xl` 超大 60px
- shape：`riko-btn--icon` 仅图标的正圆角方形按钮（必须有 aria-label）；`riko-btn--round` 正圆按钮（仅图标，必须有 aria-label）；`riko-btn--square` 手绘不规则圆角
- layout：`riko-btn--block` 占满父容器宽度

**状态**：
- `disabled` <button> 禁用
- `aria-disabled="true"` <a> 链接按钮禁用（同时去掉 href）
- `aria-busy="true"` 加载中：显示旋转图标并阻止点击
- `aria-pressed="true"` 切换按钮的按下状态

**无障碍**：
- <button> 必须写 type（button / submit / reset）。
- 仅图标按钮（--icon / --round）必须有 aria-label。
- 切换型按钮用 aria-pressed 表示状态，不要用类名。

**要点**：
- ✓ 图标直接放在按钮里：<i data-lucide="名称"></i>，间距自动处理；图标放在文字后面时悬停会轻轻右移。
- ✓ 一个区域只放一个 --primary 按钮，其余用默认或 --ghost。
- ✓ 外观、尺寸、形状三组修饰各选一个即可自由组合。

**避免**：
- ✗ 不要用 <div onclick> 代替按钮。
- ✗ 不要给按钮写内联颜色，用外观修饰或覆盖 --riko-btn-bg 等私有变量。
- ✗ 不要同时写两个外观修饰（如 --primary 和 --ghost）。

**示例 · 外观**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn">默认按钮</button>
  <button type="button" class="riko-btn riko-btn--primary">开始阅读</button>
  <button type="button" class="riko-btn riko-btn--accent">点亮星星</button>
  <button type="button" class="riko-btn riko-btn--ice">冰蓝色</button>
  <button type="button" class="riko-btn riko-btn--soft">柔和</button>
  <button type="button" class="riko-btn riko-btn--outline">虚线描边</button>
  <button type="button" class="riko-btn riko-btn--ghost">幽灵</button>
  <button type="button" class="riko-btn riko-btn--link">文字链接</button>
  <button type="button" class="riko-btn riko-btn--danger">删除画稿</button>
</div>
```

**示例 · 带图标**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn riko-btn--primary"><i data-lucide="book-open"></i>开始阅读</button>
  <a class="riko-btn" href="#button">下一节<i data-lucide="arrow-right"></i></a>
  <button type="button" class="riko-btn riko-btn--soft"><span class="riko-star" aria-hidden="true"></span>收藏</button>
  <button type="button" class="riko-btn">消息<span class="riko-btn__badge">3</span></button>
</div>
```

**示例 · 尺寸**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn riko-btn--xs">超小</button>
  <button type="button" class="riko-btn riko-btn--sm">小号</button>
  <button type="button" class="riko-btn">默认</button>
  <button type="button" class="riko-btn riko-btn--lg">大号</button>
  <button type="button" class="riko-btn riko-btn--xl">超大</button>
</div>
```

**示例 · 仅图标与形状**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn riko-btn--icon" aria-label="设置"><i data-lucide="settings"></i></button>
  <button type="button" class="riko-btn riko-btn--icon riko-btn--ice" aria-label="搜索"><i data-lucide="search"></i></button>
  <button type="button" class="riko-btn riko-btn--round riko-btn--accent" aria-label="点赞"><i data-lucide="heart"></i></button>
  <button type="button" class="riko-btn riko-btn--square riko-btn--soft">方角按钮</button>
  <button type="button" class="riko-btn riko-btn--ghost riko-btn--icon riko-btn--sm" aria-label="更多"><i data-lucide="ellipsis"></i></button>
</div>
```

**示例 · 状态**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn" disabled>不可用</button>
  <button type="button" class="riko-btn riko-btn--primary" aria-busy="true">保存中</button>
  <button type="button" class="riko-btn" aria-pressed="true"><i data-lucide="bookmark"></i>已加书签</button>
  <a class="riko-btn riko-btn--outline" aria-disabled="true">链接不可用</a>
</div>
```

**示例 · 占满宽度**

```html
<button type="button" class="riko-btn riko-btn--primary riko-btn--lg riko-btn--block"><i data-lucide="sparkles"></i>踏入络的世界</button>
```

### 按钮组 Button Group `button-group`

把相关按钮放在一起：默认带间距，--attached 拼接成一体。

**何时用**：一组并列操作或切换视图、对齐方式等互斥选项（互斥且需要表单值时用 segmented）。

**根**：`riko-btn-group`（推荐 `<div>`）

**修饰**（同组互斥）：
- layout：`riko-btn-group--attached` 按钮拼接成一体
- behavior：`riko-btn-group--vertical` 纵向排列

**状态**：
- `aria-pressed="true"`（在 `riko-btn`） 组内当前选中的按钮

**无障碍**：
- 容器加 role="group" 与 aria-label 说明这组按钮的用途。

**要点**：
- ✓ 子元素直接放 .riko-btn，尺寸修饰写在每个按钮上。

**避免**：
- ✗ 不要在 --attached 组里混用不同尺寸的按钮。

**示例 · 间隔排列**

```html
<div class="riko-btn-group" role="group" aria-label="章节操作">
  <button type="button" class="riko-btn riko-btn--sm"><i data-lucide="arrow-left"></i>上一节</button>
  <button type="button" class="riko-btn riko-btn--sm">目录</button>
  <button type="button" class="riko-btn riko-btn--sm">下一节<i data-lucide="arrow-right"></i></button>
</div>
```

**示例 · 拼接**

```html
<div class="riko-btn-group riko-btn-group--attached" role="group" aria-label="对齐方式">
  <button type="button" class="riko-btn" aria-pressed="true" aria-label="左对齐"><i data-lucide="align-left"></i></button>
  <button type="button" class="riko-btn" aria-pressed="false" aria-label="居中"><i data-lucide="align-center"></i></button>
  <button type="button" class="riko-btn" aria-pressed="false" aria-label="右对齐"><i data-lucide="align-right"></i></button>
</div>
```

**示例 · 纵向拼接**

```html
<div class="riko-btn-group riko-btn-group--attached riko-btn-group--vertical" role="group" aria-label="排序">
  <button type="button" class="riko-btn" aria-pressed="true">最新更新</button>
  <button type="button" class="riko-btn" aria-pressed="false">最多收藏</button>
  <button type="button" class="riko-btn" aria-pressed="false">章节顺序</button>
</div>
```

### 链接 Link `link`

带波浪下划线的文字链接，适合正文中跳转。

**何时用**：正文或说明文字中的跳转。需要按钮外观时用 <a class="riko-btn">。未加类的 <a> 也会得到同样的基础样式。

**根**：`riko-link`（推荐 `<a>`）

**修饰**（同组互斥）：
- variant：`riko-link--muted` 低调灰棕色；`riko-link--plain` 无下划线，悬停才出现
- decor：`riko-link--external` 外链：末尾自动加外链图标

**状态**：
- `aria-current="page"` 当前页面
- `aria-disabled="true"` 不可用（同时去掉 href）

**无障碍**：
- 链接文字要能独立说明去向，不要只写「点这里」。
- 外链加 target="_blank" 时同时写 rel="noopener"。

**要点**：
- ✓ 外链写法：<a class="riko-link riko-link--external" href="…" target="_blank" rel="noopener">。

**避免**：
- ✗ 不要用链接触发 JS 操作（那是按钮的工作）。

**示例 · 基础**

```html
<p>跟随络可，<a class="riko-link" href="#link">从沙滩上的第一幅画</a>开始读起吧。</p>
```

**示例 · 变体**

```html
<div class="riko-cluster riko-cluster--lg">
  <a class="riko-link riko-link--muted" href="#link">低调链接</a>
  <a class="riko-link riko-link--plain" href="#link">悬停才有下划线</a>
  <a class="riko-link riko-link--external" href="https://riko.land" target="_blank" rel="noopener">络的世界官网</a>
  <a class="riko-link" aria-current="page" href="#link">当前页面</a>
  <a class="riko-link" aria-disabled="true">暂不可用</a>
</div>
```

### 主题选择器 Theme Picker `theme-picker`

让用户在「按系统 / 按时间 / 浅色 / 深色」四种外观模式间切换，选择自动保存。

**何时用**：放在设置弹窗、设置页或页脚。只需要一个浅/深切换按钮时改用 data-riko="theme-toggle"。

**根**：`riko-theme-picker`（推荐 `<div>`）

**部件**：
- `riko-theme-picker__option` 选项按钮，必须带 data-theme-mode（自动生成时无需手写）
- `riko-theme-picker__icon` 选项图标圆圈
- `riko-theme-picker__text` 文字容器
- `riko-theme-picker__label` 选项名
- `riko-theme-picker__desc` 选项说明
- `riko-theme-toggle` （theme-toggle 组件自动添加）深浅切换按钮
- `riko-theme-toggle__sun` 切换按钮中的太阳图标
- `riko-theme-toggle__moon` 切换按钮中的月亮图标

**修饰**（同组互斥）：
- layout：`riko-theme-picker--compact` 一行四个图标胶囊，适合放在导航栏/页脚

**状态**：
- `aria-pressed="true"`（在 `riko-theme-picker__option`） 当前选中的模式（JS 自动维护）

**JS**：
- 启用：`data-riko="theme-picker"`
- 方法 `Riko.theme.set(mode)`：设置模式：'system' | 'time' | 'light' | 'dark'，并保存
- 方法 `Riko.theme.toggle()`：在浅色与深色间切换
- 方法 `Riko.theme.mode / Riko.theme.current`：当前模式 / 实际生效的 'light' | 'dark'
- 方法 `Riko.theme.onChange(fn)`：订阅变化，返回取消函数
- 方法 `Riko.theme.configure({ storageKey, dayStart, dayEnd })`：自定义存储键与「按时间」的白天范围（默认 8–18 点）
- 事件 `riko:theme:change` detail { mode, theme }：在 document 上派发

**无障碍**：
- 自动生成时已带 role="group" 与 aria-label，手写选项时也要保留 aria-pressed。
- 单独的 theme-toggle 若内容为图标，必须有 aria-label（自动生成时默认「切换深浅色」）。

**要点**：
- ✓ 留空容器即可，JS 会生成四个选项：<div class="riko-theme-picker" data-riko="theme-picker"></div>。
- ✓ 防闪烁：在 <head>、样式表之前放 <script src=".../dist/riko-theme-init.js"></script>（推荐）；服务端渲染时也可把 Riko.themeInitSnippet() 的返回值内联。
- ✓ 深色模式由 <html data-theme="dark"> 控制，不要自己给元素加深色类。

**避免**：
- ✗ 不要自己写 localStorage 主题逻辑或 prefers-color-scheme 媒体查询，统一用 Riko.theme。
- ✗ 不要用 class="dark" / .is-dark 表示深色。

**示例 · 完整列表（设置弹窗中）**

```html
<div class="riko-theme-picker" data-riko="theme-picker"></div>
```

**示例 · 紧凑胶囊**

```html
<div class="riko-theme-picker riko-theme-picker--compact" data-riko="theme-picker"></div>
```

**示例 · 深浅切换按钮**

```html
<button type="button" class="riko-btn riko-btn--icon" data-riko="theme-toggle" aria-label="切换深浅色"></button>
```

## 表单

### 复选框 Checkbox `checkbox`

原生 checkbox 美化：勾选时橙色小方块弹出对勾，支持半选与卡片样式。

**何时用**：多选、同意条款、可独立开关的选项（立即生效的设置更适合 switch）。

**根**：`riko-checkbox`（推荐 `<label>`）

**部件**：
- `riko-checkbox__text` 标题 + 说明的文字容器
- `riko-checkbox__desc` 说明小字（放在 __text 内）

**修饰**（同组互斥）：
- size：`riko-checkbox--sm` 小号；`riko-checkbox--lg` 大号
- variant：`riko-checkbox--card` 可选卡片

**状态**：
- `checked`（在 `input`） 选中
- `disabled`（在 `input`） 禁用
- `indeterminate（JS 属性）`（在 `input`） 半选：input.indeterminate = true
- `aria-invalid="true"`（在 `input`） 校验失败

**无障碍**：
- 结构必须是 <label class="riko-checkbox"><input type="checkbox"> 文字</label>，点击文字即可勾选。
- 一组复选框放进 <fieldset class="riko-fieldset"> 并写 legend。

**要点**：
- ✓ input 必须是 label 的直接子元素。

**避免**：
- ✗ 不要隐藏原生 input 后用 div 模拟。

**示例 · 基础**

```html
<div class="riko-stack riko-stack--sm">
  <label class="riko-checkbox"><input type="checkbox" name="snack" checked> 星星酥</label>
  <label class="riko-checkbox"><input type="checkbox" name="snack"> 橘子汽水</label>
  <label class="riko-checkbox"><input type="checkbox" name="snack" disabled> 神秘点心（售罄）</label>
</div>
```

**示例 · 带说明与半选**

```html
<div class="riko-stack riko-stack--sm">
  <label class="riko-checkbox"><input type="checkbox" id="all-chapters"><span class="riko-checkbox__text">全部章节<span class="riko-checkbox__desc">已选择部分章节（半选状态由 JS 设置 indeterminate）</span></span></label>
  <label class="riko-checkbox riko-checkbox--sm"><input type="checkbox" checked> 小号复选框</label>
  <label class="riko-checkbox riko-checkbox--lg"><input type="checkbox"> 大号复选框</label>
</div>
```

**示例 · 卡片**

```html
<div class="riko-grid riko-grid--sm">
  <label class="riko-checkbox riko-checkbox--card"><input type="checkbox" checked><span class="riko-checkbox__text">更新提醒<span class="riko-checkbox__desc">新章节发布时通知我</span></span></label>
  <label class="riko-checkbox riko-checkbox--card"><input type="checkbox"><span class="riko-checkbox__text">设定集剧透<span class="riko-checkbox__desc">显示尚未出现的设定</span></span></label>
</div>
```

### 可搜索选择 Combobox `combobox`

可输入关键字过滤的单选下拉（WAI-ARIA combobox + listbox），支持内联选项或增强原生 <select>；附带可复用的 riko-listbox 选项列表样式。

**何时用**：选项较多（> 7 个）需要搜索时。选项很少用 riko-select（原生下拉）或 radio / segmented；可自由输入多个值用 tags-input。

**根**：`riko-combobox`（推荐 `<div>`）

**部件**：
- `riko-combobox__input` 文本输入框（role=combobox 等 ARIA 由 JS 补全）（必需）
- `riko-combobox__list` 弹出的选项列表 <ul>，同时加 riko-listbox（必需）
- `riko-combobox__value` 隐藏 input，保存选中值（写 data-riko-name 时自动生成）
- `riko-listbox` 选项列表容器（可脱离 combobox 单独用于菜单式列表）
- `riko-listbox__option` 选项 <li>，data-value 为提交值，文本为显示名
- `riko-listbox__desc` 选项内的次要说明
- `riko-listbox__group` 分组标题（role=presentation）
- `riko-listbox__empty` 无结果提示（JS 自动生成）

**修饰**（同组互斥）：
- size：`riko-combobox--sm` 小号；`riko-combobox--lg` 大号
- shape：`riko-combobox--block` 占满容器宽度

**状态**：
- `aria-expanded="true"`（在 `riko-combobox__input`） 列表展开（JS 维护）
- `aria-selected="true"`（在 `riko-listbox__option`） 已选中（可在 HTML 中预设初始值）
- `aria-disabled="true"`（在 `riko-listbox__option`） 不可选的选项
- `data-state="active"`（在 `riko-listbox__option`） 键盘高亮项（JS 维护）
- `disabled`（在 `riko-combobox__input`） 禁用

**JS**：
- 启用：`data-riko="combobox"`
- 选项 `data-riko-name`（字符串）：内联模式下生成隐藏 input 的 name
- 选项 `data-riko-empty`（字符串） 默认 没有找到呢……换个关键词试试吧 ✦：无结果提示文案
- 方法 `el.riko.value`：当前选中值
- 方法 `el.riko.setValue(value)`：按 data-value 选中
- 方法 `el.riko.open()`：打开列表
- 方法 `el.riko.close()`：关闭列表
- 方法 `el.riko.refresh()`：动态增删选项后重新扫描
- 事件 `riko:combobox:change` detail { value, label, option }：选中值改变
- 事件 `riko:combobox:open`：列表打开
- 事件 `riko:combobox:close`：列表关闭

**无障碍**：
- 输入框需要 aria-label 或 <label for>；增强 select 时会自动把 <label for> 转接到生成的输入框。
- 键盘：↓ 打开 / 下移，↑ 上移，Home / End 首尾，Enter 选中，Esc 关闭（再按清空）。

**要点**：
- ✓ 只写结构，role / aria-* / id 全部交给 JS。
- ✓ 内联选项用 data-value 指定提交值；显示文本取选项的第一段文字（可用 data-label 覆盖）。
- ✓ 列表以 popover 顶层显示，放在弹窗、卡片里也不会被遮挡。

**避免**：
- ✗ 不要把 riko-listbox__option 写成 <button> 或 <a>。
- ✗ 不要给 combobox 输入框加 riko-input 类。

**示例 · 内联选项**

```html
<div class="riko-combobox" data-riko="combobox" data-riko-name="character">
  <input class="riko-combobox__input" type="text" placeholder="选择一位角色…" aria-label="角色">
  <ul class="riko-combobox__list riko-listbox">
    <li class="riko-listbox__option" data-value="riko">络可<span class="riko-listbox__desc">沙滩上的小画家</span></li>
    <li class="riko-listbox__option" data-value="star">Star<span class="riko-listbox__desc">戴眼罩的少年</span></li>
    <li class="riko-listbox__option" data-value="111">111<span class="riko-listbox__desc">HV 的村长</span></li>
    <li class="riko-listbox__option" data-value="wuni">无昵</li>
    <li class="riko-listbox__option" data-value="rhedar">Rhedar</li>
    <li class="riko-listbox__option" data-value="mizu" aria-disabled="true">Mizu（暂未登场）</li>
  </ul>
</div>
```

**示例 · 增强原生下拉**

```html
<div class="riko-field" style="max-width: 320px">
  <label class="riko-field__label" for="act">想从哪一幕开始读？</label>
  <div class="riko-combobox riko-combobox--block" data-riko="combobox">
    <select id="act" name="act">
      <option value="">搜索幕名…</option>
      <optgroup label="序章">
        <option value="p1">第一幕：沙滩上的画家</option>
        <option value="p2">第二幕：归途的微光</option>
        <option value="p3">第三幕：暗林深处</option>
      </optgroup>
      <optgroup label="第一章">
        <option value="c1">第一幕：自晨曦中归来</option>
        <option value="c2">第二幕：于木石间相嬉</option>
        <option value="c5">第五幕：落星摇曳，清风回荡</option>
      </optgroup>
    </select>
  </div>
</div>
```

### 拖拽上传 Dropzone `dropzone`

拖拽或点击选择文件的上传区域，显示文件列表、大小与图片缩略图，支持类型 / 大小 / 数量限制。

**何时用**：上传图片、附件、手稿。只需一个简单文件按钮时可用 <input class="riko-input" type="file">。

**根**：`riko-dropzone`（推荐 `<div>`）

**部件**：
- `riko-dropzone__area` 可点击 / 拖入的区域，用 <label> 包住 input（必需）
- `riko-dropzone__input` 原生 <input type="file">（视觉隐藏，accept / multiple 写在这里）（必需）
- `riko-dropzone__icon` 图标框；留空显示默认上传图标，也可放 Lucide 图标
- `riko-dropzone__title` 主提示
- `riko-dropzone__hint` 次要提示（格式、大小）
- `riko-dropzone__list` 文件列表（JS 生成）
- `riko-dropzone__file` 文件项
- `riko-dropzone__thumb` 缩略图 / 文件图标
- `riko-dropzone__meta` 文件名与大小容器
- `riko-dropzone__name` 文件名
- `riko-dropzone__size` 大小或拒绝原因
- `riko-dropzone__remove` 移除按钮

**修饰**（同组互斥）：
- size：`riko-dropzone--sm` 紧凑尺寸

**状态**：
- `data-state="dragover"` 文件拖入时（JS 维护）
- `aria-invalid="true"`（在 `riko-dropzone__file`） 被拒绝的文件
- `disabled`（在 `riko-dropzone__input`） 禁用

**JS**：
- 启用：`data-riko="dropzone"`
- 选项 `data-riko-max-size`（如 500KB / 5MB） 默认 不限：单个文件大小上限
- 选项 `data-riko-max-files`（数字） 默认 multiple 时不限，否则 1：最多文件数
- 方法 `el.riko.files`：当前文件数组（同时已同步到 input.files，可随表单提交）
- 方法 `el.riko.add(files)`：添加文件（数组或 FileList）
- 方法 `el.riko.remove(index)`：移除第 index 个
- 方法 `el.riko.clear()`：清空
- 事件 `riko:dropzone:change` detail { files }：文件列表变化
- 事件 `riko:dropzone:reject` detail { file, reason }：文件因类型 / 大小 / 数量被拒绝

**无障碍**：
- input 保持可聚焦（只是视觉隐藏），键盘 Tab 到区域后按空格 / 回车即可选择文件。
- 移除按钮自动带 aria-label，文件列表为 aria-live。

**要点**：
- ✓ 必须用 <label class="riko-dropzone__area"> 包住 input，这样点击整个区域都能选文件。
- ✓ 类型限制写在 input 的 accept 上，JS 会同时用于拖入校验。

**避免**：
- ✗ 不要把文件列表放进 label 内（点击移除按钮会再次打开文件选择）。

**示例 · 基础用法**

```html
<div class="riko-dropzone" data-riko="dropzone" data-riko-max-size="5MB">
  <label class="riko-dropzone__area">
    <input class="riko-dropzone__input" type="file" name="drawings" accept="image/*" multiple>
    <span class="riko-dropzone__icon" aria-hidden="true"></span>
    <span class="riko-dropzone__title">把画稿拖到这里，或点击选择</span>
    <span class="riko-dropzone__hint">支持 PNG / JPG / WebP，单张不超过 5MB</span>
  </label>
</div>
```

**示例 · 小尺寸 · 单个文件**

```html
<div class="riko-dropzone riko-dropzone--sm" data-riko="dropzone" style="max-width: 360px">
  <label class="riko-dropzone__area">
    <input class="riko-dropzone__input" type="file" name="manuscript" accept=".txt,.docx">
    <span class="riko-dropzone__icon" aria-hidden="true"><i data-lucide="feather"></i></span>
    <span class="riko-dropzone__title">上传小说手稿</span>
    <span class="riko-dropzone__hint">.txt 或 .docx</span>
  </label>
</div>
```

### 表单项 Field `field`

标签 + 控件 + 提示 / 错误 / 字数计数的标准组合，JS 自动处理无障碍关联。

**何时用**：表单中每个输入控件都建议包一层 riko-field。

**根**：`riko-field`（推荐 `<div>`）

**部件**：
- `riko-field__label` 标签（<label for>）（必需）
- `riko-field__required` 必填星号（aria-hidden，控件本身写 required）
- `riko-field__optional` 「选填」小字
- `riko-field__hint` 提示文字
- `riko-field__error` 错误信息；hidden 时隐藏，显示时控件自动 aria-invalid
- `riko-field__counter` 字数计数（内容由 JS 生成，读取控件 maxlength）
- `riko-field__footer` 把提示和计数放在同一行

**修饰**（同组互斥）：
- layout：`riko-field--inline` 标签在左、控件在右（窄屏自动上下排列）

**状态**：
- `hidden`（在 `riko-field__error`） 隐藏错误信息

**JS**：
- 启用：`data-riko="field"`
- 方法 `el.riko.setError(message)`：显示错误并标记控件 aria-invalid
- 方法 `el.riko.clearError()`：清除错误
- 方法 `el.riko.update()`：重新计算关联与计数

**无障碍**：
- 用 data-riko="field" 时，hint / error / counter 会自动通过 aria-describedby 关联到控件，错误信息带 aria-live。
- 必填项控件本身要写 required；星号只是视觉提示。

**要点**：
- ✓ 结构顺序：label → 控件 → hint / error / counter。
- ✓ 需要字数统计：控件写 maxlength，并放一个空的 <p class="riko-field__counter"></p>。

**避免**：
- ✗ 不要手写 aria-describedby 的 id 拼接，交给 data-riko="field"。
- ✗ 不要用红色文字类代替 riko-field__error。

**示例 · 标签 + 提示**

```html
<div class="riko-field" data-riko="field">
  <label class="riko-field__label" for="nickname">昵称<span class="riko-field__required" aria-hidden="true">*</span></label>
  <input class="riko-input" id="nickname" type="text" required placeholder="例如：小星星">
  <p class="riko-field__hint">小伙伴们会这样称呼你</p>
</div>
```

**示例 · 错误信息**

```html
<div class="riko-field" data-riko="field">
  <label class="riko-field__label" for="email">邮箱</label>
  <input class="riko-input" id="email" type="email" value="riko@">
  <p class="riko-field__error">邮箱好像少了点什么，再检查一下吧</p>
</div>
```

**示例 · 字数计数**

```html
<div class="riko-field" data-riko="field">
  <label class="riko-field__label" for="motto">个性签名<span class="riko-field__optional">（选填）</span></label>
  <textarea class="riko-textarea" id="motto" rows="2" maxlength="40">平凡日子里的一颗小星星</textarea>
  <div class="riko-field__footer">
    <p class="riko-field__hint">最多 40 个字</p>
    <p class="riko-field__counter"></p>
  </div>
</div>
```

**示例 · 横向标签**

```html
<div class="riko-field riko-field--inline" data-riko="field">
  <label class="riko-field__label" for="village">所在村庄</label>
  <input class="riko-input" id="village" type="text" value="HV 村">
  <p class="riko-field__hint">将显示在你的个人卡片上</p>
</div>
```

### 字段组 Fieldset `fieldset`

用 legend 给一组相关控件起标题，可做成缝线卡片。

**何时用**：一组单选/复选框，或把长表单分成几个小节。

**根**：`riko-fieldset`（推荐 `<fieldset>`）

**部件**：
- `riko-fieldset__legend` 标题（<legend>）（必需）
- `riko-fieldset__desc` 说明文字

**修饰**（同组互斥）：
- layout：`riko-fieldset--inline` 选项横向排列
- variant：`riko-fieldset--card` 缝线卡片外框

**状态**：
- `disabled` 整组禁用（原生行为）

**无障碍**：
- 用原生 <fieldset> + <legend>，读屏会在每个选项前读出组名。

**要点**：
- ✓ 单选组、复选组一律放进 fieldset。

**避免**：
- ✗ 不要用 div + 标题代替 fieldset/legend。

**示例 · 基础**

```html
<fieldset class="riko-fieldset">
  <legend class="riko-fieldset__legend">喜欢的点心</legend>
  <p class="riko-fieldset__desc">可以多选哦</p>
  <label class="riko-checkbox"><input type="checkbox" checked> 星星酥</label>
  <label class="riko-checkbox"><input type="checkbox"> 海盐饼干</label>
</fieldset>
```

**示例 · 卡片**

```html
<fieldset class="riko-fieldset riko-fieldset--card">
  <legend class="riko-fieldset__legend"><span class="riko-star" aria-hidden="true"></span>通知设置</legend>
  <label class="riko-switch riko-switch--end"><input type="checkbox" role="switch" checked> 新章节更新</label>
  <label class="riko-switch riko-switch--end"><input type="checkbox" role="switch"> 设定集更新</label>
</fieldset>
```

### 表单布局 Form `form`

表单整体排版：纵向或两列栅格，底部操作区。

**何时用**：任何 <form>。

**根**：`riko-form`（推荐 `<form>`）

**部件**：
- `riko-form__full` 在 --grid 中跨两列
- `riko-form__actions` 底部按钮区（虚线分隔，右对齐）

**修饰**（同组互斥）：
- layout：`riko-form--grid` 两列栅格（窄屏单列）
- behavior：`riko-form--compact` 紧凑间距

**无障碍**：
- 提交按钮用 type="submit"；错误信息用 riko-field__error 显示在对应控件下方。

**要点**：
- ✓ 表单项用 riko-field，分组用 riko-fieldset，按钮放 riko-form__actions。
- ✓ 主要按钮放在操作区最右侧。

**避免**：
- ✗ 不要用 <br> 或空 div 撑间距。

**示例 · 完整表单**

```html
<form class="riko-form riko-form--grid">
  <div class="riko-field" data-riko="field">
    <label class="riko-field__label" for="f-name">昵称<span class="riko-field__required" aria-hidden="true">*</span></label>
    <input class="riko-input" id="f-name" type="text" required placeholder="小星星">
  </div>
  <div class="riko-field" data-riko="field">
    <label class="riko-field__label" for="f-role">最喜欢的角色</label>
    <select class="riko-select" id="f-role">
      <option>络可</option>
      <option>Star</option>
    </select>
  </div>
  <div class="riko-field riko-form__full" data-riko="field">
    <label class="riko-field__label" for="f-msg">想对作者说的话</label>
    <textarea class="riko-textarea" id="f-msg" rows="3" maxlength="200" data-riko="autosize"></textarea>
    <p class="riko-field__counter"></p>
  </div>
  <fieldset class="riko-fieldset riko-fieldset--inline">
    <legend class="riko-fieldset__legend">订阅</legend>
    <label class="riko-checkbox"><input type="checkbox" checked> 章节更新</label>
    <label class="riko-checkbox"><input type="checkbox"> 设定集</label>
  </fieldset>
  <div class="riko-form__actions">
    <button type="reset" class="riko-btn riko-btn--ghost">重置</button>
    <button type="submit" class="riko-btn riko-btn--primary"><i data-lucide="send"></i>寄出信件</button>
  </div>
</form>
```

### 表单校验 Form Validate `form-validate`

基于浏览器原生约束的表单校验：失焦 / 提交时校验，把中文错误写入 riko-field__error、设置 aria-invalid，并聚焦第一个错误。

**何时用**：任何需要前端校验的 <form>。纯展示表单或由框架（如 React Hook Form）接管校验时不需要。

**状态**：
- `aria-invalid="true"`（在 `riko-input`） 校验失败的控件（JS 维护）
- `hidden`（在 `riko-field__error`） 无错误时隐藏（JS 维护）

**JS**：
- 启用：`data-riko="form-validate"`
- 选项 `data-riko-message-*`（required / type / pattern / minlength / maxlength / min / max / step / match） 默认 内置中文文案：写在控件上，自定义对应错误的提示，如 data-riko-message-required="请填写昵称"
- 选项 `data-riko-match`（选择器）：写在控件上：值必须与另一个控件相同（如确认密码），文案用 data-riko-message-match
- 选项 `data-riko-required`（布尔属性）：写在 riko-otp / riko-tags-input 上：必填
- 方法 `form.riko.validate()`：立即校验全部，返回错误数组 [{ control, message }]
- 方法 `form.riko.valid`：是否全部通过
- 方法 `form.riko.setError(control, message)`：手动设置错误（如服务端返回），message 为空则清除
- 方法 `form.riko.clear()`：清除所有错误
- 事件 `riko:form:invalid` detail { errors }：提交时有错误
- 事件 `riko:form:submit` detail { data: FormData }：校验通过、即将提交；调用 preventDefault() 可阻止原生提交（适合 AJAX）

**无障碍**：
- 错误信息自动 aria-live 并通过 aria-describedby 关联到控件。
- 每个控件都应放在 riko-field 内，并有 riko-field__label。

**要点**：
- ✓ 规则全部用原生属性：required、type="email"、minlength、pattern（配 title 作为提示）等。
- ✓ 错误显示在同一 riko-field 内；没有 riko-field__error 时会自动创建。
- ✓ AJAX 提交：监听 riko:form:submit，preventDefault() 后自行发送 e.detail.data。
- ✓ 事件 riko:form:submit / riko:form:invalid 在 <form> 元素上派发（会冒泡）：form.addEventListener("riko:form:submit", e => { e.preventDefault(); …AJAX…; Riko.toast.success("已提交"); form.reset(); })。
- ✓ form.reset() 会自动清除错误状态，字数计数（field）与自动增高（autosize）也会同步，无需手动调用。
- ✓ 必填下拉：<select required> 并以 <option value="">请选择…</option> 作为第一项（空值即视为未选）。
- ✓ 复选框/单选组的错误：把它们放进同一个 riko-field，错误写入该 field 的 riko-field__error（不存在时自动创建在 field 末尾，并通过 aria-describedby 关联）。

**避免**：
- ✗ 不要自己写 alert() 提示错误。
- ✗ 不要在 submit 事件里重复写一遍校验逻辑。

**示例 · 注册表单**

```html
<form class="riko-form" data-riko="form-validate" style="max-width: 460px">
  <div class="riko-field" data-riko="field">
    <label class="riko-field__label" for="reg-name">昵称<span class="riko-field__required" aria-hidden="true">*</span></label>
    <input class="riko-input" id="reg-name" name="name" required minlength="2" maxlength="12" placeholder="小伙伴们会这样称呼你">
  </div>
  <div class="riko-field" data-riko="field">
    <label class="riko-field__label" for="reg-mail">邮箱<span class="riko-field__required" aria-hidden="true">*</span></label>
    <input class="riko-input" id="reg-mail" name="email" type="email" required placeholder="riko@riko.land">
  </div>
  <div class="riko-field" data-riko="field">
    <label class="riko-field__label" for="reg-pwd">密码<span class="riko-field__required" aria-hidden="true">*</span></label>
    <input class="riko-input" id="reg-pwd" name="password" type="password" required minlength="8" autocomplete="new-password">
    <p class="riko-field__hint">至少 8 个字符</p>
  </div>
  <div class="riko-field" data-riko="field">
    <label class="riko-field__label" for="reg-pwd2">确认密码<span class="riko-field__required" aria-hidden="true">*</span></label>
    <input class="riko-input" id="reg-pwd2" name="password2" type="password" required data-riko-match="#reg-pwd" data-riko-message-match="两次输入的密码不一样哦" autocomplete="new-password">
  </div>
  <div class="riko-field">
    <span class="riko-field__label" id="reg-code-label">邀请码<span class="riko-field__required" aria-hidden="true">*</span></span>
    <div class="riko-otp riko-otp--sm" data-riko="otp" data-riko-length="4" data-riko-required aria-labelledby="reg-code-label">
      <input class="riko-otp__value" type="hidden" name="invite">
    </div>
  </div>
  <div class="riko-field">
    <label class="riko-checkbox"><input type="checkbox" name="agree" required data-riko-message-required="请先同意 HV 村规哦"> 我已阅读并同意 HV 村规</label>
  </div>
  <div class="riko-form__actions">
    <button type="reset" class="riko-btn riko-btn--ghost">重置</button>
    <button type="submit" class="riko-btn riko-btn--primary">加入 HV</button>
  </div>
</form>
```

**示例 · 必填下拉**

```html
<div class="riko-field">
  <label class="riko-field__label" for="role">角色类型</label>
  <select class="riko-select" id="role" name="role" required>
    <option value="">请选择…</option>
    <option>主要角色</option>
    <option>次要角色</option>
  </select>
</div>
```

### 输入框 Input `input`

单行文本输入，统一美化 text / email / password / number / date / time / color / file 等原生类型。

**何时用**：任何单行输入。需要标签和提示时包进 riko-field；需要前后缀或按钮时包进 riko-input-group。

**根**：`riko-input`（推荐 `<input>`）

**修饰**（同组互斥）：
- size：`riko-input--sm` 小号；`riko-input--lg` 大号
- shape：`riko-input--round` 胶囊形（搜索框常用）

**状态**：
- `disabled` 禁用
- `readonly` 只读：虚线边框
- `aria-invalid="true"` 校验失败：红色边框（配合 riko-field__error）

**无障碍**：
- 每个输入框都要有可见的 <label for> 或 aria-label。
- 错误时设置 aria-invalid="true"，并用 aria-describedby 关联错误文字（riko-field 会自动处理）。

**要点**：
- ✓ 选对 type（email、tel、number…）以获得合适的移动端键盘。
- ✓ 外观已统一，不需要再给原生日期/文件控件写样式。
- ✓ 日期类（date / datetime-local / month / week）的 riko-input 若未写 max，Riko 会自动设为 9999 年上限，防止浏览器允许输入 5–6 位年份；需要更严格的范围请自己写 min / max。

**避免**：
- ✗ 不要用 placeholder 代替 label。
- ✗ 不要直接改 border-color 表示错误，用 aria-invalid。

**示例 · 基础**

```html
<input class="riko-input" type="text" placeholder="给你的画起个名字吧…" aria-label="画作名称">
```

**示例 · 尺寸与形状**

```html
<div class="riko-stack riko-stack--sm">
  <input class="riko-input riko-input--sm" type="text" placeholder="小号输入框" aria-label="小号">
  <input class="riko-input" type="text" placeholder="默认输入框" aria-label="默认">
  <input class="riko-input riko-input--lg" type="text" placeholder="大号输入框" aria-label="大号">
  <input class="riko-input riko-input--round" type="search" placeholder="胶囊搜索框" aria-label="搜索">
</div>
```

**示例 · 状态**

```html
<div class="riko-stack riko-stack--sm">
  <input class="riko-input" type="email" value="riko@bloret" aria-invalid="true" aria-label="邮箱">
  <input class="riko-input" type="text" value="只读：百络谷" readonly aria-label="只读">
  <input class="riko-input" type="text" placeholder="不可用" disabled aria-label="不可用">
</div>
```

**示例 · 原生类型**

```html
<div class="riko-grid riko-grid--sm">
  <input class="riko-input" type="date" aria-label="日期">
  <input class="riko-input" type="time" value="08:00" aria-label="时间">
  <input class="riko-input" type="number" value="76" min="1" aria-label="章节号">
  <input class="riko-input" type="password" value="starcake" aria-label="密码">
  <input class="riko-input" type="color" value="#F2994A" aria-label="颜色">
  <input class="riko-input" type="file" aria-label="上传画稿">
</div>
```

### 输入组 Input Group `input-group`

给输入框加前后缀文字、图标或内嵌按钮，整体一个边框。

**何时用**：网址前缀、单位后缀、搜索框带按钮、密码显示切换等。

**根**：`riko-input-group`（推荐 `<div>`）

**部件**：
- `riko-input-group__addon` 前缀/后缀文字块（放在开头或末尾）
- `riko-input-group__icon` 输入框内的装饰图标
- `riko-password-toggle__show` （JS 生成）密码切换按钮中的「显示」图标
- `riko-password-toggle__hide` （JS 生成）密码切换按钮中的「隐藏」图标

**修饰**（同组互斥）：
- size：`riko-input-group--sm` 小号；`riko-input-group--lg` 大号
- shape：`riko-input-group--round` 胶囊形

**状态**：
- `aria-invalid="true"`（在 `riko-input`） 写在内部 input 上，整个组变红

**JS**：
- 启用：`data-riko="password-toggle"`
- 选项 `data-riko-target`（CSS 选择器） 默认 同组内的 input：要切换的密码框
- 方法 `el.riko.toggle()`：切换显示/隐藏

**无障碍**：
- 图标只是装饰；输入框仍需 label 或 aria-label。
- 密码切换按钮需要 aria-label，JS 会在显示后改为「隐藏密码」并维护 aria-pressed。

**要点**：
- ✓ 内部直接放 riko-input / riko-select / riko-btn，不需要给它们去边框。
- ✓ 密码切换按钮留空即可，图标由 JS 生成。

**避免**：
- ✗ 不要在输入组外层再包 riko-input 的边框样式。

**示例 · 前后缀**

```html
<div class="riko-input-group">
  <span class="riko-input-group__addon">https://</span>
  <input class="riko-input" type="text" value="riko.land" aria-label="网址">
  <span class="riko-input-group__addon">.com</span>
</div>
```

**示例 · 图标与按钮**

```html
<div class="riko-input-group riko-input-group--round">
  <span class="riko-input-group__icon"><i data-lucide="search"></i></span>
  <input class="riko-input" type="search" placeholder="搜索小说内容…" aria-label="搜索小说内容">
  <button type="button" class="riko-btn riko-btn--primary riko-btn--sm">搜索</button>
</div>
```

**示例 · 密码显示/隐藏**

```html
<div class="riko-input-group">
  <span class="riko-input-group__icon"><i data-lucide="lock"></i></span>
  <input class="riko-input" id="password" type="password" value="star-cake-2026" aria-label="密码">
  <button type="button" class="riko-btn riko-btn--ghost riko-btn--icon" data-riko="password-toggle" aria-label="显示密码"></button>
</div>
```

### 数字输入 Number `number`

带减 / 加按钮的数字输入，支持范围、步长、长按连续增减与键盘微调。

**何时用**：数量、页码、份数等小范围整数或固定步长的数值。大范围连续数值用 range（滑块）；只读数字展示用 stat。

**根**：`riko-number`（推荐 `<div>`）

**部件**：
- `riko-number__input` 原生 <input type="number">，min / max / step 写在它上面（必需）
- `riko-number__btn` 减 / 加按钮（data-step="down|up"），JS 自动生成，无需手写

**修饰**（同组互斥）：
- size：`riko-number--sm` 小号；`riko-number--lg` 大号
- shape：`riko-number--block` 占满容器宽度

**状态**：
- `disabled`（在 `riko-number__input`） 禁用整个控件
- `aria-invalid="true"`（在 `riko-number__input`） 错误状态（外框变红）

**JS**：
- 启用：`data-riko="number"`
- 方法 `el.riko.stepUp()`：按 step 增加一次
- 方法 `el.riko.stepDown()`：按 step 减少一次
- 方法 `el.riko.set(value)`：设置数值（自动夹在 min / max 之间）
- 方法 `el.riko.value`：当前数值
- 事件 `riko:number:change` detail { value }：数值通过按钮或键盘改变时派发；同时会触发原生 input / change 事件

**无障碍**：
- 输入框需要可访问名称：用 riko-field__label 的 <label for>，或 aria-label。
- 加减按钮不进入 Tab 顺序，键盘用户在输入框内用 ↑↓ / PageUp / PageDown / Home / End 调整。

**要点**：
- ✓ 只写一个 input.riko-number__input，按钮交给 JS 生成。
- ✓ min / max / step / value 写在 input 上，小数步进（如 0.5）会自动保留小数位。

**避免**：
- ✗ 不要再给 input 加 riko-input 类（外框由 riko-number 提供）。
- ✗ 不要用 type="text" 自己做数字校验。

**示例 · 基础用法**

```html
<div class="riko-number" data-riko="number">
  <input class="riko-number__input" type="number" min="1" max="12" step="1" value="3" aria-label="星星酥数量">
</div>
```

**示例 · 尺寸与小数步进**

```html
<div class="riko-cluster">
  <div class="riko-number riko-number--sm" data-riko="number">
    <input class="riko-number__input" type="number" min="0" max="5" step="0.5" value="2.5" aria-label="评分">
  </div>
  <div class="riko-number" data-riko="number">
    <input class="riko-number__input" type="number" min="0" max="99" value="7" aria-label="章节">
  </div>
  <div class="riko-number riko-number--lg" data-riko="number">
    <input class="riko-number__input" type="number" min="0" step="10" value="100" aria-label="绿宝石">
  </div>
</div>
```

**示例 · 放在表单项中**

```html
<div class="riko-field" data-riko="field" style="max-width: 280px">
  <label class="riko-field__label" for="ticket">船票张数</label>
  <div class="riko-number riko-number--block" data-riko="number">
    <input class="riko-number__input" id="ticket" type="number" min="1" max="6" value="2">
  </div>
  <p class="riko-field__hint">白桦木船最多能坐 6 个人哦</p>
</div>
```

### 验证码输入 OTP Input `otp`

分格输入验证码：自动跳格、粘贴拆分、退格回退、短信自动填充，完整值同步到隐藏 input。

**何时用**：短信 / 邮箱验证码、邀请码、PIN。

**根**：`riko-otp`（推荐 `<div>`）

**部件**：
- `riko-otp__value` 隐藏 input（name 写在这里，随表单提交）（必需）
- `riko-otp__cell` 单个输入格（JS 生成）
- `riko-otp__sep` 分隔短线（data-riko-split 时生成）

**修饰**（同组互斥）：
- size：`riko-otp--sm` 小号；`riko-otp--lg` 大号

**状态**：
- `data-state="complete"` 已填满（JS 维护）
- `aria-invalid="true"` 错误状态

**JS**：
- 启用：`data-riko="otp"`
- 选项 `data-riko-length`（数字） 默认 6：位数
- 选项 `data-riko-type`（numeric | alphanumeric） 默认 numeric：字符类型（字母自动转大写）
- 选项 `data-riko-split`（数字） 默认 0：在第 N 位后加分隔线
- 选项 `data-riko-required`（布尔属性）：配合 form-validate：必须填满
- 方法 `el.riko.value`：当前值
- 方法 `el.riko.set(value)`：设置值
- 方法 `el.riko.clear()`：清空并聚焦第一格
- 方法 `el.riko.focus()`：聚焦第一个空格
- 事件 `riko:otp:change` detail { value }：任一格变化
- 事件 `riko:otp:complete` detail { value }：全部填满时（适合自动提交）

**无障碍**：
- 根元素需要 aria-label 或 aria-labelledby（自动设为 role=group）；每格自动带「第 N 位，共 M 位」。

**要点**：
- ✓ 只写一个隐藏的 input.riko-otp__value，输入格交给 JS 生成。
- ✓ 第一格自动带 autocomplete="one-time-code"，手机可直接填入短信验证码。

**避免**：
- ✗ 不要手写 6 个 input。

**示例 · 6 位数字**

```html
<div class="riko-otp" data-riko="otp" data-riko-length="6" aria-label="短信验证码">
  <input class="riko-otp__value" type="hidden" name="code">
</div>
```

**示例 · 字母数字 · 中间分隔**

```html
<div class="riko-otp riko-otp--sm" data-riko="otp" data-riko-length="6" data-riko-split="3" data-riko-type="alphanumeric" aria-label="邀请码">
  <input class="riko-otp__value" type="hidden" name="invite">
</div>
```

### 单选框 Radio `radio`

原生 radio 美化：选中时中心弹出一颗橙色小星星，支持卡片样式。

**何时用**：从 2–6 个互斥选项中选一个。选项很短且想要紧凑外观时用 segmented；选项多时用 select。

**根**：`riko-radio`（推荐 `<label>`）

**部件**：
- `riko-radio__text` 标题 + 说明的文字容器
- `riko-radio__desc` 说明小字（放在 __text 内）

**修饰**（同组互斥）：
- size：`riko-radio--sm` 小号；`riko-radio--lg` 大号
- variant：`riko-radio--card` 可选卡片

**状态**：
- `checked`（在 `input`） 选中
- `disabled`（在 `input`） 禁用

**无障碍**：
- 同组单选框写相同 name，并放进 <fieldset> + <legend>。

**要点**：
- ✓ 结构：<label class="riko-radio"><input type="radio" name="组名" value="值"> 文字</label>。

**避免**：
- ✗ 不要省略 name，否则无法互斥。

**示例 · 基础**

```html
<fieldset class="riko-fieldset riko-fieldset--inline">
  <legend class="riko-fieldset__legend">下午茶</legend>
  <label class="riko-radio"><input type="radio" name="tea" value="black" checked> 热红茶</label>
  <label class="riko-radio"><input type="radio" name="tea" value="milk"> 牛奶</label>
  <label class="riko-radio"><input type="radio" name="tea" value="soda" disabled> 汽水（喝完啦）</label>
</fieldset>
```

**示例 · 卡片**

```html
<fieldset class="riko-fieldset">
  <legend class="riko-fieldset__legend">阅读方式</legend>
  <div class="riko-grid riko-grid--sm">
    <label class="riko-radio riko-radio--card"><input type="radio" name="read-mode" value="scroll" checked><span class="riko-radio__text">连续滚动<span class="riko-radio__desc">像展开一卷长长的画</span></span></label>
    <label class="riko-radio riko-radio--card"><input type="radio" name="read-mode" value="page"><span class="riko-radio__text">分页翻阅<span class="riko-radio__desc">一页一页慢慢看</span></span></label>
  </div>
</fieldset>
```

### 滑块 Range `range`

美化的原生滑块：已选段为暖橙色，可同步显示数值。

**何时用**：在连续区间内调节数值（音量、字号、亮度）。需要精确数字时配合 number 输入。

**根**：`riko-range`（推荐 `<input>`）

**部件**：
- `riko-output` 数值显示徽章：独立的 <output class="riko-output" for="滑块 id">（不放在 input 内）

**修饰**（同组互斥）：
- size：`riko-range--sm` 细轨道小圆钮
- variant：`riko-range--ice` 冰蓝色

**状态**：
- `disabled` 禁用

**JS**：
- 启用：`data-riko="range"`
- 选项 `data-riko-output`（CSS 选择器） 默认 output[for=该 id]：额外要同步显示值的元素
- 选项 `data-riko-suffix`（文本） 默认 无：显示值的后缀，如 px、%
- 方法 `el.riko.update()`：用 JS 改 value 后刷新填充与显示

**无障碍**：
- 必须有 label 或 aria-label。

**要点**：
- ✓ 建议总是加 data-riko="range"，否则 Chrome/Safari 中已选段不会着色（Firefox 原生支持）。

**避免**：
- ✗ 不要用 div 模拟滑块。

**示例 · 基础**

```html
<input class="riko-range" type="range" min="0" max="100" value="40" data-riko="range" aria-label="背景音乐音量">
```

**示例 · 显示数值**

```html
<div class="riko-field">
  <div class="riko-cluster riko-cluster--between">
    <label class="riko-field__label" for="font-size">正文字号</label>
    <output class="riko-output" for="font-size">18px</output>
  </div>
  <input class="riko-range" id="font-size" type="range" min="14" max="26" value="18" data-riko="range" data-riko-suffix="px">
</div>
```

**示例 · 小号与冰蓝**

```html
<div class="riko-stack">
  <input class="riko-range riko-range--sm" type="range" value="70" data-riko="range" aria-label="亮度">
  <input class="riko-range riko-range--ice" type="range" value="25" data-riko="range" aria-label="海浪声">
  <input class="riko-range" type="range" value="50" disabled data-riko="range" aria-label="不可调节">
</div>
```

### 星星评分 Rating `rating`

品牌五角星评分：可选模式基于单选框（纯 CSS、可键盘操作），只读模式支持小数。

**何时用**：打分、满意度、喜爱程度。只展示数值时用 --readonly。

**根**：`riko-rating`（推荐 `<fieldset>`）

**部件**：
- `riko-rating__legend` <legend> 标题（可选，但需要可访问名称）
- `riko-rating__input` <input type="radio">，同一组 name 相同，按 1→5 顺序（必需）
- `riko-rating__star` <label for> 星星，内含 riko-u-sr-only 文字如「3 星」（必需）

**修饰**（同组互斥）：
- variant：`riko-rating--readonly` 只读展示（无子元素，用 style="--riko-rating-value: 3.5"）
- size：`riko-rating--sm` 小号；`riko-rating--lg` 大号

**状态**：
- `checked`（在 `riko-rating__input`） 当前分数
- `disabled` 禁用（加在 fieldset 上）

**无障碍**：
- 可选模式用 <fieldset> + <legend>（或 role="radiogroup" + aria-label），每颗星的 label 内放 riko-u-sr-only 的「N 星」。
- 只读模式写 role="img" 与 aria-label="评分 3.5 / 5"。

**要点**：
- ✓ input 与 label 交替书写：input → label → input → label …，顺序为 1 到 5。
- ✓ 星星颜色可通过 --riko-rating-on 覆盖。

**避免**：
- ✗ 不要倒序书写或用 flex-direction: row-reverse。
- ✗ 不要用 5 个 <button> 加 JS 模拟。

**示例 · 可选评分**

```html
<fieldset class="riko-rating">
  <legend class="riko-rating__legend">给这一章打个分吧</legend>
  <input class="riko-rating__input" type="radio" name="score" id="score-1" value="1">
  <label class="riko-rating__star" for="score-1"><span class="riko-u-sr-only">1 星</span></label>
  <input class="riko-rating__input" type="radio" name="score" id="score-2" value="2">
  <label class="riko-rating__star" for="score-2"><span class="riko-u-sr-only">2 星</span></label>
  <input class="riko-rating__input" type="radio" name="score" id="score-3" value="3">
  <label class="riko-rating__star" for="score-3"><span class="riko-u-sr-only">3 星</span></label>
  <input class="riko-rating__input" type="radio" name="score" id="score-4" value="4" checked>
  <label class="riko-rating__star" for="score-4"><span class="riko-u-sr-only">4 星</span></label>
  <input class="riko-rating__input" type="radio" name="score" id="score-5" value="5">
  <label class="riko-rating__star" for="score-5"><span class="riko-u-sr-only">5 星</span></label>
</fieldset>
```

**示例 · 只读展示与尺寸**

```html
<div class="riko-stack riko-stack--sm">
  <span class="riko-rating riko-rating--readonly riko-rating--sm" style="--riko-rating-value: 4.5" role="img" aria-label="评分 4.5 / 5"></span>
  <span class="riko-rating riko-rating--readonly" style="--riko-rating-value: 3.5" role="img" aria-label="评分 3.5 / 5"></span>
  <span class="riko-rating riko-rating--readonly riko-rating--lg" style="--riko-rating-value: 2" role="img" aria-label="评分 2 / 5"></span>
</div>
```

### 搜索框 Search `search`

胶囊形搜索框：清除按钮、快捷键聚焦、防抖输入事件、可选结果计数与上一处 / 下一处；配合 Riko.highlight() 实现搜索并高亮。

**何时用**：站内搜索、列表过滤、文章 / 小说内查找。需要从候选项中选择一个值时改用 combobox。

**根**：`riko-search`（推荐 `<div>`）

**部件**：
- `riko-search__input` <input type="search">（必需）
- `riko-search__hint` 快捷键提示（<kbd>），输入后自动隐藏
- `riko-search__count` 结果计数，内容由 el.riko.setResult() 写入
- `riko-search__nav` 上一处 / 下一处按钮容器（有结果时显示）
- `riko-search__btn` 导航按钮，data-step="prev|next"，需要 aria-label
- `riko-search__clear` 清除按钮（JS 自动生成）

**修饰**（同组互斥）：
- size：`riko-search--sm` 小号；`riko-search--lg` 大号
- layout：`riko-search--block` 占满容器宽度
- shape：`riko-search--square` 圆角矩形（默认胶囊）

**状态**：
- `data-state="filled|empty"` 是否有内容（JS 维护）

**JS**：
- 启用：`data-riko="search"`
- 选项 `data-riko-hotkey`（单个按键 | none） 默认 /：聚焦快捷键；Ctrl/Cmd+K 始终可用（页面上只有第一个启用快捷键的搜索框生效）
- 选项 `data-riko-debounce`（毫秒） 默认 160：riko:search:input 防抖时间
- 方法 `el.riko.setResult(result)`：显示结果计数与导航：{ current, total, label? }；传 null 清除
- 方法 `el.riko.clear()`：清空
- 方法 `el.riko.focus()`：聚焦输入框
- 方法 `el.riko.value`：原始值
- 方法 `el.riko.query`：去空格并转小写的查询词
- 方法 `Riko.highlight(root, query, opts)`：在容器内用 <mark class="riko-mark"> 高亮全部匹配，返回 { count, marks, index, next(), prev(), go(i), clear() }；options：caseSensitive、className、currentClass、exclude、scroll
- 事件 `riko:search:input` detail { value, query }：输入防抖后派发（清空时也会派发）
- 事件 `riko:search:step` detail { dir: 1 | -1, query }：Enter / Shift+Enter 或点击导航按钮
- 事件 `riko:search:clear`：被清空时

**无障碍**：
- 输入框必须有 aria-label 或关联的 <label>。
- 导航按钮必须有 aria-label（如「上一处」「下一处」）；计数区自动设为 aria-live。

**要点**：
- ✓ 放大镜图标由 CSS 绘制，不要再手写图标。
- ✓ 每次输入都重新调用 Riko.highlight(root, query)，它会先清除上一次的高亮。
- ✓ 页面上有多个搜索框时，只给主搜索框保留快捷键，其余写 data-riko-hotkey="none"。

**避免**：
- ✗ 不要给 input 再加 riko-input 类。
- ✗ 不要自己用 innerHTML 替换文本来高亮（会破坏事件与结构），用 Riko.highlight()。

**示例 · 基础用法**

```html
<div class="riko-search" data-riko="search">
  <input class="riko-search__input" type="search" placeholder="搜索小说内容，例如：星星酥" aria-label="搜索小说内容">
  <kbd class="riko-search__hint">/</kbd>
</div>
```

**示例 · 尺寸**

```html
<div class="riko-stack">
  <div class="riko-search riko-search--sm" data-riko="search" data-riko-hotkey="none">
    <input class="riko-search__input" type="search" placeholder="小号搜索" aria-label="小号搜索">
  </div>
  <div class="riko-search riko-search--lg riko-search--block" data-riko="search" data-riko-hotkey="none">
    <input class="riko-search__input" type="search" placeholder="占满一行的大号搜索" aria-label="大号搜索">
  </div>
</div>
```

**示例 · 搜索并高亮**

```html
<div class="riko-search" data-riko="search" data-riko-hotkey="none" id="story-search">
  <input class="riko-search__input" type="search" placeholder="在下面的段落里搜索…" aria-label="搜索段落">
  <span class="riko-search__count"></span>
  <span class="riko-search__nav">
    <button type="button" class="riko-search__btn" data-step="prev" aria-label="上一处"></button>
    <button type="button" class="riko-search__btn" data-step="next" aria-label="下一处"></button>
  </span>
</div>
<div class="riko-prose riko-prose--read" id="story">…正文…</div>

<script>
  const box = document.getElementById('story-search');
  let hl = null;
  box.addEventListener('riko:search:input', e => {
    hl = Riko.highlight('#story', e.detail.query);
    hl.next();
    box.riko.setResult(e.detail.query ? { current: hl.index + 1, total: hl.count } : null);
  });
  box.addEventListener('riko:search:step', e => {
    if (!hl || !hl.count) return;
    e.detail.dir > 0 ? hl.next() : hl.prev();
    box.riko.setResult({ current: hl.index + 1, total: hl.count });
  });
</script>
```

### 分段选择 Segmented Control `segmented`

胶囊形的单选按钮组，选中项橙色并带回弹动画。

**何时用**：2–5 个短选项的互斥切换（视图、排序、字号等）。

**根**：`riko-segmented`（推荐 `<div>`）

**部件**：
- `riko-segmented__item` 选项（<label>，内含隐藏的 radio）（必需）

**修饰**（同组互斥）：
- size：`riko-segmented--sm` 小号；`riko-segmented--lg` 大号
- layout：`riko-segmented--block` 撑满宽度、平分
- variant：`riko-segmented--ice` 冰蓝选中色

**状态**：
- `checked`（在 `input`） 选中项
- `disabled`（在 `input`） 禁用某项

**无障碍**：
- 容器写 role="radiogroup" 与 aria-label；方向键切换由原生 radio 提供。

**要点**：
- ✓ 每项：<label class="riko-segmented__item"><input type="radio" name="组名" value="值">文字</label>。
- ✓ 可在文字前放 Lucide 图标。

**避免**：
- ✗ 不要用按钮组模拟需要提交值的单选。

**示例 · 基础**

```html
<div class="riko-segmented" role="radiogroup" aria-label="外观">
  <label class="riko-segmented__item"><input type="radio" name="look" value="day" checked><i data-lucide="sun"></i>白天</label>
  <label class="riko-segmented__item"><input type="radio" name="look" value="dusk"><i data-lucide="sunset"></i>黄昏</label>
  <label class="riko-segmented__item"><input type="radio" name="look" value="night"><i data-lucide="moon"></i>夜晚</label>
</div>
```

**示例 · 尺寸与色调**

```html
<div class="riko-stack riko-stack--sm">
  <div class="riko-segmented riko-segmented--sm riko-segmented--ice" role="radiogroup" aria-label="字号">
    <label class="riko-segmented__item"><input type="radio" name="size" value="s">小</label>
    <label class="riko-segmented__item"><input type="radio" name="size" value="m" checked>中</label>
    <label class="riko-segmented__item"><input type="radio" name="size" value="l">大</label>
  </div>
  <div class="riko-segmented riko-segmented--block" role="radiogroup" aria-label="排序">
    <label class="riko-segmented__item"><input type="radio" name="order" value="new" checked>最新</label>
    <label class="riko-segmented__item"><input type="radio" name="order" value="hot">最热</label>
    <label class="riko-segmented__item"><input type="radio" name="order" value="old" disabled>最早</label>
  </div>
</div>
```

### 下拉选择 Select `select`

美化后的原生 <select>，支持分组、多选列表。

**何时用**：选项较少（< 15）且不需要搜索时。需要搜索/自定义选项时用 combobox。

**根**：`riko-select`（推荐 `<select>`）

**修饰**（同组互斥）：
- size：`riko-select--sm` 小号；`riko-select--lg` 大号

**状态**：
- `disabled` 禁用
- `aria-invalid="true"` 校验失败：红色边框（配合 riko-field__error）

**无障碍**：
- 必须有 label 或 aria-label。

**要点**：
- ✓ 选项直接写 <option>，分组用 <optgroup label>。
- ✓ 写 multiple 或 size 时自动变为列表外观。

**避免**：
- ✗ 不要用 div 模拟下拉框（需要时用 combobox 组件）。

**示例 · 基础**

```html
<select class="riko-select" aria-label="喜欢的角色">
  <option>络可</option>
  <option>Star</option>
  <option>111</option>
  <option disabled>神秘人（未解锁）</option>
</select>
```

**示例 · 分组与尺寸**

```html
<div class="riko-stack riko-stack--sm">
  <select class="riko-select riko-select--sm" aria-label="章节">
    <optgroup label="序章">
      <option>沙滩上的画家</option>
      <option>世界的边缘</option>
    </optgroup>
    <optgroup label="第一章">
      <option>晨会上的沉重决议</option>
    </optgroup>
  </select>
  <select class="riko-select riko-select--lg" aria-label="字号">
    <option>大字号阅读</option>
  </select>
</div>
```

**示例 · 多选列表**

```html
<select class="riko-select" multiple aria-label="标签">
  <option selected>温馨</option>
  <option>冒险</option>
  <option selected>治愈</option>
  <option>悬疑</option>
</select>
```

### 色块选择 Swatches `swatches`

基于单选框的圆形色块选择，选中时显示勾与描边。

**何时用**：选择主题色、标签颜色、画笔颜色等少量预设颜色。任意颜色用 <input class="riko-input" type="color">。

**根**：`riko-swatches`（推荐 `<div>`）

**部件**：
- `riko-swatches__item` <label>，用 style="--riko-swatch: …" 指定颜色（必需）
- `riko-swatches__input` <input type="radio">（视觉隐藏）（必需）
- `riko-swatches__color` 色块（必需）
- `riko-swatches__label` 颜色名（可加 riko-u-sr-only 只给读屏）

**修饰**（同组互斥）：
- size：`riko-swatches--sm` 小号；`riko-swatches--lg` 大号
- shape：`riko-swatches--square` 手绘圆角方块

**状态**：
- `checked`（在 `riko-swatches__input`） 选中
- `disabled`（在 `riko-swatches__input`） 不可选

**无障碍**：
- 根元素写 role="radiogroup" 与 aria-label；每个色块都要有颜色名（可视或 riko-u-sr-only）。

**要点**：
- ✓ 颜色优先用设计变量，例如 style="--riko-swatch: var(--riko-color-ice-strong)"。
- ✓ 结构顺序：input → color → label（勾选样式依赖相邻关系）。

**避免**：
- ✗ 不要只靠颜色区分而不提供名称。

**示例 · 基础用法**

```html
<div class="riko-swatches" role="radiogroup" aria-label="主题色">
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-accent)">
    <input class="riko-swatches__input" type="radio" name="color" value="star" checked>
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label">星星橙</span>
  </label>
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-ice-strong)">
    <input class="riko-swatches__input" type="radio" name="color" value="ice">
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label">冰蓝</span>
  </label>
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-primary)">
    <input class="riko-swatches__input" type="radio" name="color" value="cocoa">
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label">可可</span>
  </label>
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-success)">
    <input class="riko-swatches__input" type="radio" name="color" value="leaf">
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label">嫩叶</span>
  </label>
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-danger)">
    <input class="riko-swatches__input" type="radio" name="color" value="berry">
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label">莓果</span>
  </label>
</div>
```

**示例 · 小号方形（仅色块）**

```html
<div class="riko-swatches riko-swatches--sm riko-swatches--square" role="radiogroup" aria-label="画笔颜色">
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-tan)">
    <input class="riko-swatches__input" type="radio" name="brush" value="sand" checked>
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label riko-u-sr-only">沙滩</span>
  </label>
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-ice)">
    <input class="riko-swatches__input" type="radio" name="brush" value="sea">
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label riko-u-sr-only">海水</span>
  </label>
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-warning)">
    <input class="riko-swatches__input" type="radio" name="brush" value="sun">
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label riko-u-sr-only">阳光</span>
  </label>
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-brown)">
    <input class="riko-swatches__input" type="radio" name="brush" value="wood">
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label riko-u-sr-only">木头</span>
  </label>
</div>
```

### 开关 Switch `switch`

立即生效的开/关设置，打开时圆钮里出现一颗小星星。

**何时用**：设置项「打开/关闭」且立即生效。需要提交表单才生效的勾选用 checkbox。

**根**：`riko-switch`（推荐 `<label>`）

**部件**：
- `riko-switch__text` 标题 + 说明的文字容器
- `riko-switch__desc` 说明小字

**修饰**（同组互斥）：
- size：`riko-switch--sm` 小号；`riko-switch--lg` 大号
- layout：`riko-switch--end` 文字在左、开关在右，占满一行（设置列表）

**状态**：
- `checked`（在 `input`） 打开
- `disabled`（在 `input`） 禁用

**无障碍**：
- input 写 role="switch"，读屏会读作「开关，开/关」。

**要点**：
- ✓ 结构：<label class="riko-switch"><input type="checkbox" role="switch"> 文字</label>。

**避免**：
- ✗ 不要用按钮 + 类名模拟开关。

**示例 · 基础**

```html
<div class="riko-stack riko-stack--sm">
  <label class="riko-switch"><input type="checkbox" role="switch" checked> 新章节提醒</label>
  <label class="riko-switch"><input type="checkbox" role="switch"> 夜间护眼</label>
  <label class="riko-switch"><input type="checkbox" role="switch" disabled> 自动翻页（即将推出）</label>
</div>
```

**示例 · 尺寸**

```html
<div class="riko-cluster riko-cluster--lg">
  <label class="riko-switch riko-switch--sm"><input type="checkbox" role="switch" checked> 小号</label>
  <label class="riko-switch"><input type="checkbox" role="switch" checked> 默认</label>
  <label class="riko-switch riko-switch--lg"><input type="checkbox" role="switch" checked> 大号</label>
</div>
```

**示例 · 设置列表**

```html
<div class="riko-stack">
  <label class="riko-switch riko-switch--end"><input type="checkbox" role="switch" checked><span class="riko-switch__text">漂浮星星<span class="riko-switch__desc">在页面背景中显示闪烁的小星星</span></span></label>
  <label class="riko-switch riko-switch--end"><input type="checkbox" role="switch"><span class="riko-switch__text">减少动画<span class="riko-switch__desc">关闭回弹与淡入效果</span></span></label>
</div>
```

### 标签输入 Tags Input `tags-input`

输入后按回车 / 逗号生成标签，可删除、可粘贴批量添加，结果以逗号分隔同步到隐藏 input。

**何时用**：关键词、标签、收件人等可自由输入的多个短值。只能从固定选项多选时用 checkbox（--card / chip 样式）。

**根**：`riko-tags-input`（推荐 `<div>`）

**部件**：
- `riko-tags-input__input` 文字输入框（必需）
- `riko-tags-input__tag` 标签（JS 生成；也可预先写好作为初始值）
- `riko-tags-input__label` 标签文字
- `riko-tags-input__remove` 标签的删除按钮

**修饰**（同组互斥）：
- shape：`riko-tags-input--block` 占满容器宽度

**状态**：
- `aria-invalid="true"` 错误状态
- `data-state="armed"`（在 `riko-tags-input__tag`） 按一次退格后待删除（JS 维护）

**JS**：
- 启用：`data-riko="tags-input"`
- 选项 `data-riko-name`（字符串）：隐藏 input 的 name（随表单提交，逗号分隔）
- 选项 `data-riko-value`（逗号分隔）：初始标签
- 选项 `data-riko-max`（数字） 默认 不限：最多几个标签
- 选项 `data-riko-unique`（true | false） 默认 true：是否去重（不区分大小写）
- 选项 `data-riko-add-on-blur`（true | false） 默认 true：失焦时把未确认的文字加为标签
- 选项 `data-riko-required`（布尔属性）：配合 form-validate：至少一个标签
- 方法 `el.riko.tags`：标签数组
- 方法 `el.riko.add(text)`：添加（可逗号分隔多个）
- 方法 `el.riko.remove(index)`：删除第 index 个
- 方法 `el.riko.set(list)`：整体替换
- 方法 `el.riko.clear()`：清空
- 事件 `riko:tags-input:change` detail { tags, value }：标签变化

**无障碍**：
- 输入框需要 aria-label 或 <label for>；根元素自动设为 role=group。
- 每个删除按钮自动带「移除标签 X」的 aria-label，增删结果通过隐藏的 aria-live 区域播报。

**要点**：
- ✓ 只写一个输入框，标签和隐藏 input 交给 JS。
- ✓ 分隔符：回车、英文逗号、中文逗号、顿号、换行。

**避免**：
- ✗ 不要把多个值写在一个普通 input 里让用户自己用逗号分隔。

**示例 · 基础用法**

```html
<div class="riko-tags-input" data-riko="tags-input" data-riko-name="tags" data-riko-value="络可,星星酥,百络谷">
  <input class="riko-tags-input__input" type="text" placeholder="输入后按回车添加" aria-label="作品标签">
</div>
```

**示例 · 限制数量**

```html
<div class="riko-field" style="max-width: 420px">
  <label class="riko-field__label" for="fav">最喜欢的三个角色</label>
  <div class="riko-tags-input riko-tags-input--block" data-riko="tags-input" data-riko-name="favorites" data-riko-max="3">
    <input class="riko-tags-input__input" id="fav" type="text" placeholder="最多 3 个">
  </div>
  <p class="riko-field__hint">支持一次粘贴多个，用逗号分隔</p>
</div>
```

### 多行文本 Textarea `textarea`

多行输入，可自动增高，也有横线信纸外观。

**何时用**：留言、日记、描述等多行内容。

**根**：`riko-textarea`（推荐 `<textarea>`）

**修饰**（同组互斥）：
- size：`riko-textarea--sm` 小号；`riko-textarea--lg` 大号
- variant：`riko-textarea--notebook` 横线信纸外观（衬线字体）

**状态**：
- `disabled` 禁用
- `readonly` 只读：虚线边框
- `aria-invalid="true"` 校验失败：红色边框（配合 riko-field__error）

**JS**：
- 启用：`data-riko="autosize"`
- 选项 `data-riko-max-rows`（数字） 默认 不限：最多增高到几行，超出后滚动
- 方法 `el.riko.update()`：用 JS 修改 value 后手动重算高度

**无障碍**：
- 与输入框相同：必须有 label 或 aria-label。

**要点**：
- ✓ 自动增高：加 data-riko="autosize"，用 rows 设置初始行数。
- ✓ 需要字数统计时放进 riko-field 并加 riko-field__counter，配合 maxlength。

**避免**：
- ✗ 自动增高时不要再设置固定 height。

**示例 · 基础**

```html
<textarea class="riko-textarea" rows="3" placeholder="写下今天的冒险日记…" aria-label="日记"></textarea>
```

**示例 · 自动增高**

```html
<textarea class="riko-textarea" data-riko="autosize" data-riko-max-rows="8" rows="2" placeholder="越写越长也没关系，会自己长高哦" aria-label="留言"></textarea>
```

**示例 · 信纸外观**

```html
<textarea class="riko-textarea riko-textarea--notebook" rows="4" aria-label="信纸">亲爱的 Star：
今天的晚霞像橘子汽水一样。</textarea>
```

## 导航

### 返回顶部 Back to Top `backtop`

页面右下角的橙色星形按钮，滚动一段后出现，点击平滑回到顶部。

**何时用**：较长的页面（文章、目录、列表）。

**根**：`riko-backtop`（推荐 `<button>`）

**修饰**（同组互斥）：
- layout：`riko-backtop--static` 不固定定位（用于演示或嵌入工具栏）

**状态**：
- `data-state="hidden|shown"` 是否显示（JS 维护）

**JS**：
- 启用：`data-riko="backtop"`
- 选项 `data-riko-offset`（像素） 默认 400：滚动超过多少后出现
- 方法 `el.riko.update()`：重新判断是否显示

**无障碍**：
- 必须有 aria-label="返回顶部"（JS 会补默认值）。
- 键盘触发时焦点会移到页面第一个可聚焦元素。

**要点**：
- ✓ 按钮内容留空，星星和箭头由 CSS 绘制。
- ✓ 位置可用 --riko-backtop-right / --riko-backtop-bottom 调整。

**避免**：
- ✗ 不要在按钮里再放图标。

**示例 · 星形按钮**

```html
<button type="button" class="riko-backtop riko-backtop--static" aria-label="返回顶部"></button>
```

### 面包屑 Breadcrumb `breadcrumb`

显示当前页面在层级中的位置，分隔符为小箭头或小星星。

**何时用**：层级 ≥ 3 的内容页（文档、设定集、商品分类）。两级以内用返回按钮即可。

**根**：`riko-breadcrumb`（推荐 `<nav>`）

**部件**：
- `riko-breadcrumb__list` 有序列表 <ol>（必需）
- `riko-breadcrumb__item` 列表项 <li>（必需）
- `riko-breadcrumb__link` 链接；最后一项用 <span aria-current="page">（必需）

**修饰**（同组互斥）：
- variant：`riko-breadcrumb--stars` 分隔符改为橙色小星星

**状态**：
- `aria-current="page"`（在 `riko-breadcrumb__link`） 当前页面（最后一项）

**无障碍**：
- <nav aria-label="面包屑"> 包裹 <ol>。
- 最后一项不是链接，并带 aria-current="page"。

**要点**：
- ✓ 分隔符由 CSS 生成，不要手写「/」或「>」。
- ✓ 可在 __link 内放 Lucide 图标（如首页 house）。

**避免**：
- ✗ 不要用 <div> 代替 <ol>/<li>。

**示例 · 基础**

```html
<nav class="riko-breadcrumb" aria-label="面包屑">
  <ol class="riko-breadcrumb__list">
    <li class="riko-breadcrumb__item"><a class="riko-breadcrumb__link" href="#"><i data-lucide="house"></i>首页</a></li>
    <li class="riko-breadcrumb__item"><a class="riko-breadcrumb__link" href="#">小说</a></li>
    <li class="riko-breadcrumb__item"><span class="riko-breadcrumb__link" aria-current="page">沙滩上的画家</span></li>
  </ol>
</nav>
```

**示例 · 星星分隔**

```html
<nav class="riko-breadcrumb riko-breadcrumb--stars" aria-label="面包屑">
  <ol class="riko-breadcrumb__list">
    <li class="riko-breadcrumb__item"><a class="riko-breadcrumb__link" href="#">络可的笔记本</a></li>
    <li class="riko-breadcrumb__item"><a class="riko-breadcrumb__link" href="#">地点</a></li>
    <li class="riko-breadcrumb__item"><span class="riko-breadcrumb__link" aria-current="page">百络谷</span></li>
  </ol>
</nav>
```

### 命令面板 Command Palette `command`

快捷键唤起的全局搜索/命令弹窗：输入即过滤、分组结果、↑↓ 选择、Enter 执行，线性动画开合。

**何时用**：站点内容较多、需要快速跳转或执行操作时；也可作为全局搜索。只是表单里的可搜索选择请用 combobox。

**根**：`riko-command`（推荐 `<dialog>`）

**部件**：
- `riko-command__search` 顶部搜索栏（放大镜由 CSS 绘制）（必需）
- `riko-command__input` 搜索输入框（需 aria-label）（必需）
- `riko-command__esc` 右侧 Esc 提示
- `riko-command__list` 结果列表（role="listbox"）（必需）
- `riko-command__group` 结果分组
- `riko-command__group-label` 分组标题
- `riko-command__item` 结果项（a 或 button，role="option"）（必需）
- `riko-command__icon` 项前图标方块
- `riko-command__text` 项标题（匹配文字会被 <mark> 高亮）
- `riko-command__desc` 项说明（放在 __text 内）
- `riko-command__shortcut` 项右侧快捷键
- `riko-command__empty` 无结果提示（初始 hidden）
- `riko-command__footer` 底部按键说明

**状态**：
- `aria-selected="true"`（在 `riko-command__item`） 键盘当前项（JS 维护）
- `hidden`（在 `riko-command__item`） 被过滤掉的项
- `data-state="closing"` 关闭动画进行中

**JS**：
- 启用：`data-riko="command"`
- 选项 `data-riko-hotkey`（单个字母）：Ctrl/⌘ + 该字母开关面板，如 k
- 选项 `data-riko-open`（面板 id（写在任意按钮上））：点击该元素打开面板
- 选项 `data-riko-keywords`（空格分隔（写在条目上））：额外的搜索别名
- 方法 `el.riko.open() / close() / toggle()`：开关面板
- 方法 `el.riko.filter(query)`：以指定关键词过滤
- 事件 `riko:command:open`：打开
- 事件 `riko:command:close`：关闭
- 事件 `riko:command:filter` detail { query, count }：过滤后
- 事件 `riko:command:select` detail { item, value, query }：选择条目（可 preventDefault 阻止链接跳转）

**无障碍**：
- 必须使用原生 <dialog>，并有 aria-label。
- 输入框是 combobox，结果是 listbox；用 aria-activedescendant 指示当前项（JS 维护）。
- 关闭后焦点回到打开前的元素；Esc 关闭。

**要点**：
- ✓ 链接型条目选择后会跳转；按钮型条目通过 riko:command:select 处理（读取 data-value）。
- ✓ 空格分隔的多个关键词需同时匹配。
- ✓ 打开时页面滚动被锁定。

**避免**：
- ✗ 不要用 <div> 代替 <dialog>。
- ✗ 不要自己写 Ctrl+K 监听，用 data-riko-hotkey。

**示例 · 命令面板**

```html
<button type="button" class="riko-btn riko-btn--soft" data-riko-open="demo-command"><i data-lucide="search"></i>快速搜索 <kbd class="riko-kbd">Ctrl K</kbd></button>
<dialog class="riko-command" id="demo-command" data-riko="command" data-riko-hotkey="k" aria-label="快速搜索">
  <div class="riko-command__search">
    <input class="riko-command__input" type="text" placeholder="搜索章节、设定或操作…" aria-label="搜索">
    <kbd class="riko-command__esc">Esc</kbd>
  </div>
  <div class="riko-command__list">
    <div class="riko-command__group">
      <p class="riko-command__group-label">章节</p>
      <a class="riko-command__item" href="#001"><span class="riko-command__icon"><i data-lucide="book-open"></i></span><span class="riko-command__text">沙滩上的画家<span class="riko-command__desc">序章 · 第一幕 · 001</span></span></a>
      <a class="riko-command__item" href="#076"><span class="riko-command__icon"><i data-lucide="sparkles"></i></span><span class="riko-command__text">风过围垣，落星回响<span class="riko-command__desc">第一章 · 第五幕 · 最新</span></span></a>
    </div>
    <div class="riko-command__group">
      <p class="riko-command__group-label">设定</p>
      <a class="riko-command__item" href="#riko" data-riko-keywords="主角 贝雷帽 画家"><span class="riko-command__icon"><i data-lucide="palette"></i></span><span class="riko-command__text">络可<span class="riko-command__desc">喜欢画画的小女孩</span></span></a>
      <a class="riko-command__item" href="#hv" data-riko-keywords="村庄 百络谷"><span class="riko-command__icon"><i data-lucide="house"></i></span><span class="riko-command__text">HV 村<span class="riko-command__desc">大家的家</span></span></a>
    </div>
    <div class="riko-command__group">
      <p class="riko-command__group-label">操作</p>
      <button type="button" class="riko-command__item" data-value="theme"><span class="riko-command__icon"><i data-lucide="moon"></i></span><span class="riko-command__text">切换深浅色</span><kbd class="riko-command__shortcut">T</kbd></button>
    </div>
  </div>
  <p class="riko-command__empty" hidden>没有找到呢……换个关键词试试吧 ✦</p>
  <div class="riko-command__footer"><span><kbd>↑</kbd><kbd>↓</kbd>选择</span><span><kbd>↵</kbd>打开</span><span><kbd>Esc</kbd>关闭</span></div>
</dialog>
```

### 下拉菜单 Dropdown Menu `dropdown`

点击按钮弹出的操作菜单（riko-menu），支持图标、快捷键、分组标题、分隔线、勾选项与危险操作。

**何时用**：收纳次要操作或选项。需要从列表里选一个值并提交表单时用 select / combobox；悬停提示用 tooltip。

**根**：`riko-dropdown`（推荐 `<div>`）

**部件**：
- `riko-menu` 菜单面板（role="menu"，初始 hidden）（必需）
- `riko-menu__item` 菜单项（button 或 a，role="menuitem" / menuitemcheckbox / menuitemradio）（必需）
- `riko-menu__icon` 项前图标容器
- `riko-menu__shortcut` 右侧快捷键提示（<kbd>）
- `riko-menu__desc` 项内第二行说明
- `riko-menu__label` 分组标题
- `riko-menu__separator` 分隔线（<hr>）
- `riko-menu__danger` 危险操作项：与 riko-menu__item 同时写在同一元素上

**修饰**（同组互斥）：
- decor：`riko-dropdown--no-caret` 触发按钮不显示下拉箭头

**状态**：
- `aria-expanded="true"`（在 `[aria-haspopup]`） 菜单打开（JS 维护）
- `aria-checked="true"`（在 `riko-menu__item`） 勾选项被选中
- `disabled`（在 `riko-menu__item`） 不可用项
- `hidden`（在 `riko-menu`） 菜单关闭

**JS**：
- 启用：`data-riko="dropdown"`
- 选项 `data-riko-placement`（bottom-start | bottom-end | bottom | top-start | top-end | right-start | left-start …） 默认 bottom-start：菜单相对按钮的位置（空间不足自动翻转）
- 选项 `data-riko-keep-open`（（写在菜单项上））：选择该项后不关闭菜单
- 方法 `el.riko.open() / close() / toggle()`：开关菜单
- 方法 `el.riko.isOpen`：是否打开
- 事件 `riko:dropdown:open`：菜单打开
- 事件 `riko:dropdown:close`：菜单关闭
- 事件 `riko:dropdown:select` detail { item, value, checked }：选择菜单项（value 取 data-value 或文字）

**无障碍**：
- 触发按钮需要 aria-haspopup="menu"（JS 会补 aria-expanded / aria-controls）。
- 键盘：↓/Enter/Space 打开并聚焦首项，↑ 打开并聚焦末项；菜单内 ↑↓ Home End、首字母跳转、Esc 关闭、Tab 离开。
- 勾选项用 role="menuitemcheckbox|menuitemradio" + aria-checked；单选项放进 role="group"。

**要点**：
- ✓ 结构：.riko-dropdown 的直接子元素是触发按钮和 .riko-menu。
- ✓ 菜单项是链接时用 <a class="riko-menu__item" role="menuitem" href>。
- ✓ 危险项写 class="riko-menu__item riko-menu__danger"。

**避免**：
- ✗ 不要在菜单里放输入框等复杂控件（那是 popover）。
- ✗ 不要用 riko-menu__item--danger（部件不能带修饰），改用 riko-menu__danger。

**示例 · 操作菜单**

```html
<div class="riko-dropdown" data-riko="dropdown">
  <button type="button" class="riko-btn" aria-haspopup="menu">更多操作</button>
  <div class="riko-menu" role="menu" hidden>
    <p class="riko-menu__label">本节</p>
    <button type="button" class="riko-menu__item" role="menuitem"><span class="riko-menu__icon"><i data-lucide="bookmark"></i></span>加入书签<kbd class="riko-menu__shortcut">B</kbd></button>
    <button type="button" class="riko-menu__item" role="menuitem"><span class="riko-menu__icon"><i data-lucide="share-2"></i></span>分享给朋友</button>
    <a class="riko-menu__item" role="menuitem" href="#"><span class="riko-menu__icon"><i data-lucide="message-circle"></i></span>去论坛讨论</a>
    <hr class="riko-menu__separator">
    <button type="button" class="riko-menu__item riko-menu__danger" role="menuitem"><span class="riko-menu__icon"><i data-lucide="trash-2"></i></span>清除阅读记录</button>
  </div>
</div>
```

**示例 · 勾选菜单（右对齐）**

```html
<div class="riko-dropdown" data-riko="dropdown" data-riko-placement="bottom-end">
  <button type="button" class="riko-btn riko-btn--soft" aria-haspopup="menu"><i data-lucide="sliders-horizontal"></i>阅读设置</button>
  <div class="riko-menu" role="menu" hidden>
    <button type="button" class="riko-menu__item" role="menuitemcheckbox" aria-checked="true" data-riko-keep-open>显示已读星星</button>
    <button type="button" class="riko-menu__item" role="menuitemcheckbox" aria-checked="false" data-riko-keep-open>首行缩进</button>
    <hr class="riko-menu__separator">
    <div role="group" aria-label="字体">
      <p class="riko-menu__label">字体</p>
      <button type="button" class="riko-menu__item" role="menuitemradio" aria-checked="true" data-riko-keep-open>宋体（衬线）</button>
      <button type="button" class="riko-menu__item" role="menuitemradio" aria-checked="false" data-riko-keep-open>黑体（无衬线）</button>
    </div>
  </div>
</div>
```

### 页脚 Footer `footer`

米色扇贝花边页脚：三颗星星、一行文字链接、两行版权信息。

**何时用**：每个页面底部。

**根**：`riko-footer`（推荐 `<footer>`）

**部件**：
- `riko-footer__inner` 可选限宽容器
- `riko-footer__stars` 三颗星星装饰（放 3 个带 aria-hidden 的 riko-star）
- `riko-footer__brand` 可选品牌名
- `riko-footer__nav` 链接导航 <nav>
- `riko-footer__link` 链接（之间自动出现「·」）
- `riko-footer__copy` 版权文字段落

**修饰**（同组互斥）：
- decor：`riko-footer--flat` 去掉扇贝花边，改为顶部虚线

**无障碍**：
- __nav 用 <nav aria-label="页脚导航">。
- 每颗装饰星星加 aria-hidden="true"。

**要点**：
- ✓ 放在 <body> 末尾、页面主体之后；与 riko-page 一起使用可让页脚贴底。
- ✓ 扇贝花边颜色跟随 --riko-color-surface-muted。

**避免**：
- ✗ 不要手写分隔符「·」。

**示例 · 页脚**

```html
<footer class="riko-footer">
  <div class="riko-footer__stars"><span class="riko-star" aria-hidden="true"></span><span class="riko-star" aria-hidden="true"></span><span class="riko-star" aria-hidden="true"></span></div>
  <nav class="riko-footer__nav" aria-label="页脚导航">
    <a class="riko-footer__link" href="https://read.riko.land">小说阅读器</a>
    <a class="riko-footer__link" href="https://wiki.riko.land">Wiki</a>
    <a class="riko-footer__link" href="https://contact.riko.land">联系我们</a>
  </nav>
  <p class="riko-footer__copy">© 2021–2026 Bloret.All rights reserved.</p>
  <p class="riko-footer__copy">《络的世界》项目组</p>
</footer>
```

### 导航栏 Navbar `navbar`

吸顶毛玻璃导航栏：左侧 logo 与标题，中间主导航，右侧操作按钮；窄屏自动收起为菜单。

**何时用**：每个页面顶部放一个。页面内的分区切换用 tabs，文档/阅读类的侧边目录用 sidenav。

**根**：`riko-navbar`（推荐 `<header>`）

**部件**：
- `riko-navbar__inner` 内容容器（居中、限宽）（必需）
- `riko-navbar__brand` 品牌区（通常是回首页的链接）
- `riko-navbar__logo` 圆形 logo：<img> 或包一颗 riko-star 的 <span>
- `riko-navbar__text` 标题文字容器
- `riko-navbar__title` 主标题
- `riko-navbar__sub` 手写体副标题（窄屏隐藏）
- `riko-navbar__nav` 主导航 <nav>（需 aria-label）
- `riko-navbar__link` 导航链接；当前页加 aria-current="page"
- `riko-navbar__actions` 右侧按钮区（设置、通行证、返回等）
- `riko-navbar__toggle` 窄屏菜单按钮（空按钮，图标由 CSS 绘制，需 aria-label）
- `riko-navbar__center` 中间区（搜索框等），自动占满剩余宽度并居中

**修饰**（同组互斥）：
- variant：`riko-navbar--transparent` 不吸顶、无背景，适合首屏大图上方
- layout：`riko-navbar--wide` 内容宽度改为 --riko-container-wide

**状态**：
- `aria-current="page"`（在 `riko-navbar__link`） 当前页面
- `aria-expanded="true"`（在 `riko-navbar__toggle`） 窄屏菜单展开（JS 维护）
- `data-state="open|closed"`（在 `riko-navbar__nav`） 窄屏下菜单面板状态（JS 维护）

**JS**：
- 启用：`data-riko="navbar"`
- 方法 `el.riko.open() / close() / toggle()`：控制窄屏菜单
- 方法 `el.riko.isOpen`：窄屏菜单是否展开
- 事件 `riko:navbar:open`：窄屏菜单展开
- 事件 `riko:navbar:close`：窄屏菜单收起

**无障碍**：
- __nav 用 <nav aria-label="主导航">。
- __toggle 是空按钮，必须写 aria-label（JS 默认补「打开菜单」）。
- logo 图片在品牌链接里已有文字时用 alt=""。

**要点**：
- ✓ 只有带 __nav 和 __toggle 时才需要 data-riko="navbar"。
- ✓ 右侧操作按钮直接用 riko-btn（如 riko-btn--icon + aria-label）。
- ✓ 页面只放一个吸顶导航栏；滚动锚点的偏移量由 --riko-header-h（72px）统一控制。
- ✓ 导航栏中间放搜索框：<div class="riko-navbar__center"><div class="riko-search" data-riko="search">…</div></div>，放在 __brand 与 __actions 之间。

**避免**：
- ✗ 不要把 riko-navbar__link 写成 riko-btn。
- ✗ 不要给当前链接加 .active，改用 aria-current="page"。

**示例 · 基础导航栏**

```html
<header class="riko-navbar" data-riko="navbar">
  <div class="riko-navbar__inner">
    <a class="riko-navbar__brand" href="#">
      <img class="riko-navbar__logo" src="https://riko.land/assets/logo.jpg" alt="">
      <span class="riko-navbar__text">
        <span class="riko-navbar__title">《络的世界》</span>
        <span class="riko-navbar__sub">RikoLand · little star</span>
      </span>
    </a>
    <nav class="riko-navbar__nav" aria-label="主导航">
      <a class="riko-navbar__link" href="#" aria-current="page">首页</a>
      <a class="riko-navbar__link" href="#">小说</a>
      <a class="riko-navbar__link" href="#">设定集</a>
      <a class="riko-navbar__link" href="#">关于</a>
    </nav>
    <div class="riko-navbar__actions">
      <button type="button" class="riko-btn riko-btn--icon" data-riko="theme-toggle" aria-label="切换深浅色"></button>
      <a class="riko-btn riko-btn--primary riko-btn--sm" href="#">开始阅读</a>
    </div>
    <button type="button" class="riko-navbar__toggle" aria-label="打开菜单"></button>
  </div>
</header>
```

**示例 · 透明导航栏（不吸顶）**

```html
<header class="riko-navbar riko-navbar--transparent">
  <div class="riko-navbar__inner">
    <a class="riko-navbar__brand" href="#">
      <span class="riko-navbar__logo"><span class="riko-star riko-star--lg" aria-hidden="true"></span></span>
      <span class="riko-navbar__text">
        <span class="riko-navbar__title">络可的笔记本</span>
        <span class="riko-navbar__sub">little notes</span>
      </span>
    </a>
    <div class="riko-navbar__actions">
      <a class="riko-btn riko-btn--ghost riko-btn--sm" href="#"><i data-lucide="arrow-left"></i>返回主页</a>
    </div>
  </div>
</header>
```

### 翻页 Pager `pager`

「上一节 / 下一节」两张大卡片，显示前后内容的标题。

**何时用**：小说章节、文档、教程等线性阅读内容的底部。多页列表用 pagination。

**根**：`riko-pager`（推荐 `<nav>`）

**部件**：
- `riko-pager__prev` 上一项卡片（a / button）
- `riko-pager__next` 下一项卡片（a / button），总在右侧
- `riko-pager__label` 小字标签（上一节/下一节），箭头由 CSS 生成（必需）
- `riko-pager__title` 前后内容的标题（必需）

**状态**：
- `aria-disabled="true"`（在 `riko-pager__prev`） 不可用（用于 span/a）
- `disabled`（在 `riko-pager__next`） 不可用（用于 button）

**无障碍**：
- <nav aria-label="…翻页">。

**要点**：
- ✓ 只有下一项时可以只写 __next，它会保持在右栏。
- ✓ 窄屏（≤520px）自动改为上下排列。

**避免**：
- ✗ 不要在 __label 里再手写箭头。

**示例 · 上一节 / 下一节**

```html
<nav class="riko-pager" aria-label="小节翻页">
  <a class="riko-pager__prev" href="#001"><span class="riko-pager__label">上一节</span><span class="riko-pager__title">001 沙滩上的画家</span></a>
  <a class="riko-pager__next" href="#003"><span class="riko-pager__label">下一节</span><span class="riko-pager__title">003 熟悉的身影</span></a>
</nav>
```

### 分页 Pagination `pagination`

页码分页，当前页是一颗微微倾斜的橙色小方块；可由 JS 根据总页数自动渲染。

**何时用**：列表数据分多页时用。上一篇/下一篇式的线性阅读用 pager；无限滚动则不需要分页。

**根**：`riko-pagination`（推荐 `<nav>`）

**部件**：
- `riko-pagination__item` 页码（a / button / 当前页用 span aria-current="page"）（必需）
- `riko-pagination__prev` 上一页（与 __item 同用；留空只显示箭头，需 aria-label）
- `riko-pagination__next` 下一页（与 __item 同用）
- `riko-pagination__ellipsis` 省略号
- `riko-pagination__info` 右侧说明文字，如「共 76 节」

**修饰**（同组互斥）：
- size：`riko-pagination--sm` 小号
- layout：`riko-pagination--center` 居中对齐

**状态**：
- `aria-current="page"`（在 `riko-pagination__item`） 当前页
- `aria-disabled="true"`（在 `riko-pagination__item`） 不可用（如第一页的「上一页」）

**JS**：
- 启用：`data-riko="pagination"`
- 选项 `data-riko-total`（数字） 默认 1：总页数
- 选项 `data-riko-current`（数字） 默认 1：当前页
- 选项 `data-riko-siblings`（数字） 默认 1：当前页两侧显示几个页码
- 选项 `data-riko-href`（含 {page} 的地址）：设置后渲染为链接，否则渲染为按钮
- 方法 `el.riko.set(page)`：跳到某页（按钮模式）
- 方法 `el.riko.setTotal(n)`：修改总页数
- 方法 `el.riko.page / el.riko.total`：当前页 / 总页数
- 事件 `riko:pagination:change` detail { page, total }：按钮模式下页码改变

**无障碍**：
- <nav aria-label="分页">。
- 只有箭头的上一页/下一页必须写 aria-label。
- 当前页用 aria-current="page"。

**要点**：
- ✓ 服务端渲染时直接手写结构，无需 data-riko。
- ✓ 前端分页用 data-riko="pagination"，内容留空，监听 riko:pagination:change 加载数据。

**避免**：
- ✗ 不要用 .active 标记当前页。

**示例 · 自动渲染**

```html
<nav class="riko-pagination" data-riko="pagination" data-riko-total="20" data-riko-current="6" aria-label="分页"></nav>
```

**示例 · 手写结构（服务端渲染）**

```html
<nav class="riko-pagination riko-pagination--sm" aria-label="分页">
  <a class="riko-pagination__item riko-pagination__prev" href="?page=1">上一页</a>
  <a class="riko-pagination__item" href="?page=1">1</a>
  <span class="riko-pagination__item" aria-current="page">2</span>
  <a class="riko-pagination__item" href="?page=3">3</a>
  <span class="riko-pagination__ellipsis" aria-hidden="true">…</span>
  <a class="riko-pagination__item" href="?page=9">9</a>
  <a class="riko-pagination__item riko-pagination__next" href="?page=3">下一页</a>
  <span class="riko-pagination__info">共 76 节</span>
</nav>
```

### 阅读进度条 Reading Progress `reading-progress`

固定在页面顶部的细进度条（冰蓝到橙色渐变），显示整页或某篇文章的阅读进度。

**何时用**：小说、长文章阅读页。表示任务/上传进度请用 progress。

**根**：`riko-reading-progress`（推荐 `<div>`）

**修饰**（同组互斥）：
- layout：`riko-reading-progress--static` 不固定定位、带底色的进度条

**JS**：
- 启用：`data-riko="reading-progress"`
- 选项 `data-riko-target`（CSS 选择器）：只计算该元素（如文章正文）的阅读进度
- 方法 `el.riko.update()`：重新计算
- 方法 `el.riko.progress`：当前进度 0–1
- 事件 `riko:reading-progress:change` detail { progress }：进度变化

**无障碍**：
- 默认是装饰（aria-hidden）；加 aria-label 后会变成 role="progressbar" 并维护 aria-valuenow。

**要点**：
- ✓ 进度写在 CSS 变量 --riko-progress（0–1）上，也可以手动设置。
- ✓ 高度可用 --riko-reading-progress-h 调整。

**示例 · 阅读进度条**

```html
<div class="riko-reading-progress riko-reading-progress--static" style="--riko-progress: .62"></div>
```

### 侧边目录 Side Nav `sidenav`

可折叠分组的侧边目录（小说章节、文档目录、设置分类），支持编号、已读星星、计数徽章。

**何时用**：内容有两级结构、需要长期显示目录时用。单层少量链接用 riko-toc；页面主导航用 navbar。

**根**：`riko-sidenav`（推荐 `<nav>`）

**部件**：
- `riko-sidenav__heading` 目录标题（小字，可选）
- `riko-sidenav__group` 一个可折叠分组
- `riko-sidenav__group-toggle` 分组按钮（aria-expanded 控制展开）
- `riko-sidenav__badge` 分组编号徽章（文字或图标）
- `riko-sidenav__label` 分组标题；可内含 <small> 作为上方小字
- `riko-sidenav__count` 分组右侧计数
- `riko-sidenav__panel` 分组面板（紧跟在 toggle 之后）
- `riko-sidenav__list` 链接列表 <ul>
- `riko-sidenav__item` 目录项（a 或 button）；当前项 aria-current="page"
- `riko-sidenav__num` 手写编号，如 001
- `riko-sidenav__text` 项目文字（占满剩余宽度）
- `riko-sidenav__meta` 右侧小徽章（如搜索命中数）
- `riko-sidenav__dot` 已读星星（需 aria-label="已读"）

**修饰**（同组互斥）：
- size：`riko-sidenav--compact` 更紧凑的行高与徽章

**状态**：
- `aria-expanded="true|false"`（在 `riko-sidenav__group-toggle`） 分组展开/收起
- `aria-current="page"`（在 `riko-sidenav__item`） 当前项
- `aria-disabled="true"`（在 `riko-sidenav__item`） 不可用的项

**JS**：
- 启用：`data-riko="sidenav"`
- 方法 `el.riko.expand(i) / collapse(i)`：展开/收起第 i 个分组（或传分组元素）
- 方法 `el.riko.expandAll() / collapseAll()`：全部展开/收起
- 方法 `el.riko.setCurrent(hrefOrEl)`：切换当前项，自动展开所在分组并滚动到可见
- 方法 `el.riko.reveal()`：把当前项滚动到可见
- 事件 `riko:sidenav:toggle` detail { group, expanded }：分组展开状态变化

**无障碍**：
- 根元素用 <nav aria-label="…">。
- 分组按钮必须是 <button>，展开状态写在 aria-expanded 上。
- 只用图标的 __badge 外层文字在 __label 中，不需额外 aria-label。

**要点**：
- ✓ __panel 必须紧跟在 __group-toggle 之后（CSS 依赖相邻关系）。
- ✓ 未写 aria-expanded 的分组：包含当前项则展开，否则收起。
- ✓ 放在固定高度、overflow:auto 的容器里时，当前项会自动滚动到可见。

**避免**：
- ✗ 不要用 .open / .active 类，改用 aria-expanded / aria-current。
- ✗ 不要把 __item 放在 __panel 之外的分组里。

**示例 · 分组目录（小说阅读器）**

```html
<nav class="riko-sidenav" data-riko="sidenav" aria-label="小说目录">
  <p class="riko-sidenav__heading">小说目录</p>
  <div class="riko-sidenav__group">
    <button type="button" class="riko-sidenav__group-toggle" aria-expanded="true">
      <span class="riko-sidenav__badge">一</span>
      <span class="riko-sidenav__label"><small>序章</small>第一幕：沙滩上的画家</span>
      <span class="riko-sidenav__count">3 节</span>
    </button>
    <div class="riko-sidenav__panel">
      <ul class="riko-sidenav__list">
        <li><a class="riko-sidenav__item" href="#001"><span class="riko-sidenav__num">001</span><span class="riko-sidenav__text">沙滩上的画家</span><span class="riko-sidenav__dot" aria-label="已读"></span></a></li>
        <li><a class="riko-sidenav__item" href="#002" aria-current="page"><span class="riko-sidenav__num">002</span><span class="riko-sidenav__text">世界的边缘</span><span class="riko-sidenav__meta">3</span></a></li>
        <li><a class="riko-sidenav__item" href="#003"><span class="riko-sidenav__num">003</span><span class="riko-sidenav__text">熟悉的身影</span></a></li>
      </ul>
    </div>
  </div>
  <div class="riko-sidenav__group">
    <button type="button" class="riko-sidenav__group-toggle" aria-expanded="false">
      <span class="riko-sidenav__badge">二</span>
      <span class="riko-sidenav__label"><small>序章</small>第二幕：归途的微光</span>
      <span class="riko-sidenav__count">5 节</span>
    </button>
    <div class="riko-sidenav__panel">
      <ul class="riko-sidenav__list">
        <li><a class="riko-sidenav__item" href="#004"><span class="riko-sidenav__num">004</span><span class="riko-sidenav__text">变故</span></a></li>
        <li><a class="riko-sidenav__item" href="#005"><span class="riko-sidenav__num">005</span><span class="riko-sidenav__text">Star 的决心</span></a></li>
      </ul>
    </div>
  </div>
</nav>
```

**示例 · 紧凑型**

```html
<nav class="riko-sidenav riko-sidenav--compact" data-riko="sidenav" aria-label="设定集">
  <div class="riko-sidenav__group">
    <button type="button" class="riko-sidenav__group-toggle" aria-expanded="true">
      <span class="riko-sidenav__badge"><i data-lucide="users"></i></span>
      <span class="riko-sidenav__label">人物</span>
    </button>
    <div class="riko-sidenav__panel">
      <ul class="riko-sidenav__list">
        <li><a class="riko-sidenav__item" href="#riko" aria-current="page">络可</a></li>
        <li><a class="riko-sidenav__item" href="#star">Star</a></li>
        <li><a class="riko-sidenav__item" href="#111">111</a></li>
      </ul>
    </div>
  </div>
</nav>
```

### 步骤条 Steps `steps`

展示流程进度：已完成显示勾，当前步骤是倾斜的橙色小方块，出错显示红叉。

**何时用**：注册、下单、引导等多步流程；也可以表示故事进度。纯时间顺序的记录用 timeline。

**根**：`riko-steps`（推荐 `<ol>`）

**部件**：
- `riko-steps__item` 一个步骤 <li>（必需）
- `riko-steps__marker` 序号方块（完成/出错时序号被图标替换）（必需）
- `riko-steps__body` 文字容器
- `riko-steps__title` 步骤名
- `riko-steps__desc` 说明（横向窄屏时隐藏）

**修饰**（同组互斥）：
- layout：`riko-steps--vertical` 纵向排列
- size：`riko-steps--sm` 小号

**状态**：
- `aria-current="step"`（在 `riko-steps__item`） 当前步骤
- `data-status="done"`（在 `riko-steps__item`） 已完成
- `data-status="error"`（在 `riko-steps__item`） 出错

**无障碍**：
- 用 <ol>，屏幕阅读器会读出「第几项，共几项」。
- 当前步骤写 aria-current="step"。

**要点**：
- ✓ 当前步骤之前的步骤写 data-status="done"。
- ✓ 连接线颜色自动跟随完成状态。

**避免**：
- ✗ 不要用 class 表示状态（.done/.active），用 data-status 与 aria-current。

**示例 · 横向**

```html
<ol class="riko-steps">
  <li class="riko-steps__item" data-status="done"><span class="riko-steps__marker">1</span><span class="riko-steps__body"><span class="riko-steps__title">踏上沙滩</span><span class="riko-steps__desc">第一幅画</span></span></li>
  <li class="riko-steps__item" data-status="done"><span class="riko-steps__marker">2</span><span class="riko-steps__body"><span class="riko-steps__title">世界边缘</span><span class="riko-steps__desc">遇见屏障</span></span></li>
  <li class="riko-steps__item" aria-current="step"><span class="riko-steps__marker">3</span><span class="riko-steps__body"><span class="riko-steps__title">踏上归途</span><span class="riko-steps__desc">进行中</span></span></li>
  <li class="riko-steps__item"><span class="riko-steps__marker">4</span><span class="riko-steps__body"><span class="riko-steps__title">回到 HV</span><span class="riko-steps__desc">敬请期待</span></span></li>
</ol>
```

**示例 · 纵向 + 出错状态**

```html
<ol class="riko-steps riko-steps--vertical riko-steps--sm">
  <li class="riko-steps__item" data-status="done"><span class="riko-steps__marker">1</span><span class="riko-steps__body"><span class="riko-steps__title">填写昵称</span><span class="riko-steps__desc">好啦，你叫「小星星」</span></span></li>
  <li class="riko-steps__item" data-status="error"><span class="riko-steps__marker">2</span><span class="riko-steps__body"><span class="riko-steps__title">验证邮箱</span><span class="riko-steps__desc">验证码过期了，再发一次吧</span></span></li>
  <li class="riko-steps__item" aria-current="step"><span class="riko-steps__marker">3</span><span class="riko-steps__body"><span class="riko-steps__title">选择头像</span></span></li>
  <li class="riko-steps__item"><span class="riko-steps__marker">4</span><span class="riko-steps__body"><span class="riko-steps__title">完成</span></span></li>
</ol>
```

### 标签页 Tabs `tabs`

在同一区域内切换几组平级内容；支持波浪下划线、胶囊滑块、笔记本分隔页、纵向四种外观。

**何时用**：2–7 组平级内容、一次只看一组时用。需要同时展开多组用 accordion；切换页面用链接/navbar。

**根**：`riko-tabs`（推荐 `<div>`）

**部件**：
- `riko-tabs__list` 页签容器（role="tablist"，需 aria-label）（必需）
- `riko-tabs__tab` 页签按钮（role="tab"）（必需）
- `riko-tabs__badge` 页签内的小计数
- `riko-tabs__panel` 内容面板（role="tabpanel"），与页签按顺序对应；非选中面板加 hidden（必需）

**修饰**（同组互斥）：
- variant：`riko-tabs--pills` 胶囊外观，选中滑块带回弹；`riko-tabs--cards` 卡片外观，像笔记本分隔页
- layout：`riko-tabs--vertical` 纵向排列（窄屏自动变横向）
- shape：`riko-tabs--fill` 页签平分整行宽度

**状态**：
- `aria-selected="true"`（在 `riko-tabs__tab`） 当前页签（JS 维护）
- `disabled`（在 `riko-tabs__tab`） 禁用的页签
- `hidden`（在 `riko-tabs__panel`） 未选中的面板

**JS**：
- 启用：`data-riko="tabs"`
- 选项 `data-riko-activation`（auto | manual） 默认 auto：manual：方向键只移动焦点，Enter/Space 才切换
- 方法 `el.riko.select(index)`：切换到第 index 个页签
- 方法 `el.riko.index`：当前索引
- 事件 `riko:tabs:change` detail { index, tab, panel }：切换后派发

**无障碍**：
- role、aria-controls、aria-labelledby、tabindex 由 JS 补齐；没有 JS 时请自行写全。
- __list 需要 aria-label 说明这组页签的用途。
- 键盘：←/→（纵向为 ↑/↓）、Home、End。

**要点**：
- ✓ 页签与面板按出现顺序一一对应；也可以用 aria-controls 显式指定。
- ✓ 初始选中项写 aria-selected="true"，其余面板写 hidden，避免无 JS 时全部显示。
- ✓ 页签用 <button type="button">。

**避免**：
- ✗ 不要用 <a href> 做页签（那是导航，不是 tabs）。
- ✗ 不要用 .active 标记选中项。

**示例 · 默认（波浪下划线）**

```html
<div class="riko-tabs" data-riko="tabs">
  <div class="riko-tabs__list" aria-label="设定集">
    <button type="button" class="riko-tabs__tab" aria-selected="true">人物</button>
    <button type="button" class="riko-tabs__tab">地点</button>
    <button type="button" class="riko-tabs__tab">道具 <span class="riko-tabs__badge">12</span></button>
    <button type="button" class="riko-tabs__tab" disabled>未解锁</button>
  </div>
  <div class="riko-tabs__panel">络可：喜欢画画的小女孩，戴着带星星的贝雷帽。</div>
  <div class="riko-tabs__panel" hidden>百络谷：海边的温柔小村，HV 的大家都住在这里。</div>
  <div class="riko-tabs__panel" hidden>画笔、颜料盒，还有一串会发光的流星项链。</div>
  <div class="riko-tabs__panel" hidden>这一页还没有写好哦。</div>
</div>
```

**示例 · 胶囊**

```html
<div class="riko-tabs riko-tabs--pills" data-riko="tabs">
  <div class="riko-tabs__list" aria-label="设定集">
    <button type="button" class="riko-tabs__tab" aria-selected="true">人物</button>
    <button type="button" class="riko-tabs__tab">地点</button>
    <button type="button" class="riko-tabs__tab">道具 <span class="riko-tabs__badge">12</span></button>
    <button type="button" class="riko-tabs__tab" disabled>未解锁</button>
  </div>
  <div class="riko-tabs__panel">络可：喜欢画画的小女孩，戴着带星星的贝雷帽。</div>
  <div class="riko-tabs__panel" hidden>百络谷：海边的温柔小村，HV 的大家都住在这里。</div>
  <div class="riko-tabs__panel" hidden>画笔、颜料盒，还有一串会发光的流星项链。</div>
  <div class="riko-tabs__panel" hidden>这一页还没有写好哦。</div>
</div>
```

**示例 · 卡片（笔记本分隔页）**

```html
<div class="riko-tabs riko-tabs--cards" data-riko="tabs">
  <div class="riko-tabs__list" aria-label="设定集">
    <button type="button" class="riko-tabs__tab" aria-selected="true">人物</button>
    <button type="button" class="riko-tabs__tab">地点</button>
    <button type="button" class="riko-tabs__tab">道具 <span class="riko-tabs__badge">12</span></button>
    <button type="button" class="riko-tabs__tab" disabled>未解锁</button>
  </div>
  <div class="riko-tabs__panel">络可：喜欢画画的小女孩，戴着带星星的贝雷帽。</div>
  <div class="riko-tabs__panel" hidden>百络谷：海边的温柔小村，HV 的大家都住在这里。</div>
  <div class="riko-tabs__panel" hidden>画笔、颜料盒，还有一串会发光的流星项链。</div>
  <div class="riko-tabs__panel" hidden>这一页还没有写好哦。</div>
</div>
```

**示例 · 纵向 + 手动激活**

```html
<div class="riko-tabs riko-tabs--vertical" data-riko="tabs" data-riko-activation="manual">
  <div class="riko-tabs__list" aria-label="设定集">
    <button type="button" class="riko-tabs__tab" aria-selected="true">人物</button>
    <button type="button" class="riko-tabs__tab">地点</button>
    <button type="button" class="riko-tabs__tab">道具 <span class="riko-tabs__badge">12</span></button>
    <button type="button" class="riko-tabs__tab" disabled>未解锁</button>
  </div>
  <div class="riko-tabs__panel">络可：喜欢画画的小女孩，戴着带星星的贝雷帽。</div>
  <div class="riko-tabs__panel" hidden>百络谷：海边的温柔小村，HV 的大家都住在这里。</div>
  <div class="riko-tabs__panel" hidden>画笔、颜料盒，还有一串会发光的流星项链。</div>
  <div class="riko-tabs__panel" hidden>这一页还没有写好哦。</div>
</div>
```

### 页内目录 Table of Contents `toc`

页内锚点目录，滚动时自动高亮当前小节（左侧橙色竖线 + 小星星）。

**何时用**：长文章、文档页的右侧或顶部。多级可折叠目录用 sidenav。

**根**：`riko-toc`（推荐 `<nav>`）

**部件**：
- `riko-toc__title` 标题（自带小星星）
- `riko-toc__list` 一级列表 <ul>（必需）
- `riko-toc__sublist` 二级列表 <ul>（放在一级 li 内）
- `riko-toc__link` 锚点链接 href="#id"（必需）

**状态**：
- `aria-current="true"`（在 `riko-toc__link`） 当前所在小节（JS 维护）

**JS**：
- 启用：`data-riko="toc"`
- 选项 `data-riko-source`（CSS 选择器）：列表为空时，从该容器内带 id 的标题自动生成
- 选项 `data-riko-levels`（如 h2,h3） 默认 h2,h3：自动生成时使用的标题级别（第一个为一级）
- 选项 `data-riko-offset`（像素） 默认 导航栏高度 + 24：判定「当前」时顶部预留的距离
- 方法 `el.riko.update()`：重新计算当前小节
- 事件 `riko:toc:change` detail { index, link, target }：当前小节变化

**无障碍**：
- <nav aria-label="本页目录">。
- 当前项用 aria-current="true"（不是 page）。

**要点**：
- ✓ 链接的 href 必须指向页面中存在的 id。
- ✓ 自动生成时标题可用 data-toc-title 指定更短的目录名。
- ✓ 常与 riko-split 搭配放在侧栏，并设 position: sticky。

**避免**：
- ✗ 不要给链接加 .active。

**示例 · 页内目录（试着滚动本页）**

```html
<nav class="riko-toc" data-riko="toc" aria-label="本页目录">
  <p class="riko-toc__title">本页目录</p>
  <ul class="riko-toc__list">
    <li><a class="riko-toc__link" href="#navbar">导航栏</a></li>
    <li><a class="riko-toc__link" href="#sidenav">侧边目录</a></li>
    <li><a class="riko-toc__link" href="#tabs">标签页</a>
      <ul class="riko-toc__sublist">
        <li><a class="riko-toc__link" href="#pagination">分页</a></li>
        <li><a class="riko-toc__link" href="#pager">翻页</a></li>
      </ul>
    </li>
    <li><a class="riko-toc__link" href="#dropdown">下拉菜单</a></li>
    <li><a class="riko-toc__link" href="#command">命令面板</a></li>
  </ul>
</nav>
```

## 数据展示

### 折叠面板 Accordion `accordion`

基于原生 <details> 的折叠面板，带编号徽章与旋转箭头；加 JS 后展开收起有平滑动画。

**何时用**：把长内容分组收起，如章节分幕、常见问题。只需单个「展开更多」也可以用一个 __item。

**根**：`riko-accordion`（推荐 `<div>`）

**部件**：
- `riko-accordion__item` 一项（必须是 <details>）
- `riko-accordion__summary` 标题行（必须是 <summary>）
- `riko-accordion__badge` 左侧编号徽章（展开时变橙并微旋）
- `riko-accordion__title` 标题文字
- `riko-accordion__meta` 右侧小计数（如「3 节」）
- `riko-accordion__content` 展开的内容

**修饰**（同组互斥）：
- behavior：`riko-accordion--exclusive` 同一时间只展开一项
- layout：`riko-accordion--cards` 每项是独立卡片；`riko-accordion--flush` 无外框，嵌入其他容器

**状态**：
- `open`（在 `riko-accordion__item`） 原生属性：默认展开

**JS**：
- 启用：`data-riko="accordion"`
- 方法 `el.riko.open(i) / close(i) / toggle(i)`：i 为序号或 details 元素
- 事件 `riko:accordion:toggle` detail { item, open }：展开或收起时

**无障碍**：
- 使用原生 <details>/<summary>，键盘（Enter/空格）与读屏开箱即用。
- __badge 中只放简短编号；需要的话给它 aria-hidden="true"。

**要点**：
- ✓ 不加 data-riko 也能用（无动画或使用浏览器原生动画）。
- ✓ --exclusive 需要 JS；不用 JS 时可以给每个 details 写相同的 name 属性实现互斥。

**避免**：
- ✗ 不要用 <div> 代替 <details>/<summary>。
- ✗ 不要在 summary 里放链接或按钮。

**示例 · 分幕目录**

```html
<div class="riko-accordion" data-riko="accordion" style="max-width: 560px">
  <details class="riko-accordion__item" open>
    <summary class="riko-accordion__summary">
      <span class="riko-accordion__badge" aria-hidden="true">一</span>
      <span class="riko-accordion__title">序章 · 第一幕：沙滩上的画家</span>
      <span class="riko-accordion__meta">3 节</span>
    </summary>
    <div class="riko-accordion__content">001 沙滩上的画家 · 002 世界的边缘 · 003 熟悉的身影</div>
  </details>
  <details class="riko-accordion__item">
    <summary class="riko-accordion__summary">
      <span class="riko-accordion__badge" aria-hidden="true">二</span>
      <span class="riko-accordion__title">序章 · 第二幕：归途的微光</span>
      <span class="riko-accordion__meta">5 节</span>
    </summary>
    <div class="riko-accordion__content">004 变故 · 005 Star 的决心 · 006 重逢 · 007 村庄 · 008 归途的微光</div>
  </details>
  <details class="riko-accordion__item">
    <summary class="riko-accordion__summary">
      <span class="riko-accordion__badge" aria-hidden="true">三</span>
      <span class="riko-accordion__title">序章 · 第三幕：暗林深处</span>
      <span class="riko-accordion__meta">6 节</span>
    </summary>
    <div class="riko-accordion__content">009 暗林 · 010 不幸 · 011 禁忌的力量 · 012 逃离袭击 · 013 谈判 · 014 命令方块</div>
  </details>
</div>
```

**示例 · 卡片式 · 互斥展开**

```html
<div class="riko-accordion riko-accordion--cards riko-accordion--exclusive" data-riko="accordion" style="max-width: 560px">
  <details class="riko-accordion__item" open>
    <summary class="riko-accordion__summary"><span class="riko-accordion__title">小说多久更新一次？</span></summary>
    <div class="riko-accordion__content">作者星星酥会尽量保持每周更新，预计 2027 年继续更新新的章节！</div>
  </details>
  <details class="riko-accordion__item">
    <summary class="riko-accordion__summary"><span class="riko-accordion__title">笔记本会剧透吗？</span></summary>
    <div class="riko-accordion__content">笔记本只整理已出现的设定，但还是建议先读完已更新的章节哦。</div>
  </details>
  <details class="riko-accordion__item">
    <summary class="riko-accordion__summary"><span class="riko-accordion__title">在哪里反馈错别字？</span></summary>
    <div class="riko-accordion__content">页面底部的「反馈」表单就可以，谢谢你帮络可捉虫！</div>
  </details>
</div>
```

### 头像 Avatar `avatar`

圆形头像，支持图片、文字缩写、图标、在线状态与重叠头像组。

**何时用**：代表一个人或角色。站点 Logo 也可用 --ring 风格。

**根**：`riko-avatar`（推荐 `<span>`）

**部件**：
- `riko-avatar__status` 右下角状态点，配合 data-status="online|busy|away|offline"
- `riko-avatar-group` 头像组容器（重叠排列）

**修饰**（同组互斥）：
- size：`riko-avatar--xs` 24px；`riko-avatar--sm` 32px；`riko-avatar--lg` 64px；`riko-avatar--xl` 96px
- decor：`riko-avatar--ring` 纸白边 + 浅棕环（同站点 Logo）
- shape：`riko-avatar--square` 手绘圆角方形
- tone：`riko-avatar--accent` 浅橙底（文字/图标头像）；`riko-avatar--soft` 米色底（文字/图标头像）

**状态**：
- `data-status="online|busy|away|offline"`（在 `riko-avatar__status`） 状态颜色：绿 / 红 / 黄 / 灰

**无障碍**：
- 图片头像：<img> 写 alt（人名）。
- 文字或图标头像：在 riko-avatar 上加 role="img" 与 aria-label。
- __status 要有 aria-label（如「在线」）或 aria-hidden="true"。
- 旁边已有可见名字（如卡片标题）时，头像是装饰：图片 alt=""，文字/图标头像加 aria-hidden="true"，避免重复朗读。

**要点**：
- ✓ 头像组用 <div class="riko-avatar-group">，内部头像会自动加白边并重叠。

**避免**：
- ✗ 不要直接给 <img> 加 riko-avatar，应外包一层 <span class="riko-avatar">。

**示例 · 尺寸与类型**

```html
<div class="riko-cluster riko-cluster--lg">
  <span class="riko-avatar riko-avatar--xs"><img src="https://riko.land/assets/logo.jpg" alt="络可"></span>
  <span class="riko-avatar riko-avatar--sm"><img src="https://riko.land/assets/logo.jpg" alt="络可"></span>
  <span class="riko-avatar"><img src="https://riko.land/assets/logo.jpg" alt="络可"></span>
  <span class="riko-avatar riko-avatar--lg riko-avatar--ring"><img src="https://riko.land/assets/logo.jpg" alt="络可"></span>
  <span class="riko-avatar riko-avatar--xl riko-avatar--ring"><img src="https://riko.land/assets/logo.jpg" alt="络可"></span>
  <span class="riko-avatar riko-avatar--lg" role="img" aria-label="星星酥">星</span>
  <span class="riko-avatar riko-avatar--lg riko-avatar--accent" role="img" aria-label="Star"><span class="riko-star" aria-hidden="true"></span></span>
  <span class="riko-avatar riko-avatar--lg riko-avatar--soft riko-avatar--square" role="img" aria-label="访客"><i data-lucide="user"></i></span>
</div>
```

**示例 · 状态与头像组**

```html
<div class="riko-cluster riko-cluster--lg">
  <span class="riko-avatar riko-avatar--lg"><img src="https://riko.land/assets/logo.jpg" alt="络可"><span class="riko-avatar__status" data-status="online" aria-label="在线"></span></span>
  <span class="riko-avatar riko-avatar--lg riko-avatar--soft" role="img" aria-label="111"><span aria-hidden="true">111</span><span class="riko-avatar__status" data-status="busy" aria-label="忙碌"></span></span>
  <span class="riko-avatar riko-avatar--lg riko-avatar--accent" role="img" aria-label="无昵">昵<span class="riko-avatar__status" data-status="away" aria-label="离开"></span></span>
  <div class="riko-avatar-group">
    <span class="riko-avatar"><img src="https://riko.land/assets/logo.jpg" alt="络可"></span>
    <span class="riko-avatar riko-avatar--accent" role="img" aria-label="Star">S</span>
    <span class="riko-avatar riko-avatar--soft" role="img" aria-label="111">1</span>
    <span class="riko-avatar" role="img" aria-label="还有 5 人">+5</span>
  </div>
</div>
```

### 徽标 Badge `badge`

小小的数字或圆点，用于未读数、计数和状态提示，可挂在按钮或头像右上角。

**何时用**：提示数量或「有新内容」。表示分类或属性用 tag。

**根**：`riko-badge`（推荐 `<span>`）

**部件**：
- `riko-badge-anchor` 定位容器：把徽标挂到内部元素（按钮/头像）的右上角

**修饰**（同组互斥）：
- tone：`riko-badge--ice` 冰蓝；`riko-badge--success` 成功；`riko-badge--warning` 警告；`riko-badge--danger` 危险/未读；`riko-badge--neutral` 中性灰棕
- size：`riko-badge--sm` 小号；`riko-badge--lg` 大号
- shape：`riko-badge--dot` 只显示小圆点
- decor：`riko-badge--pulse` 脉冲光环（吸引注意）

**无障碍**：
- 挂在图标按钮上的徽标要有 aria-label（如「3 条未读」），或把数量写进按钮的 aria-label 并给徽标 aria-hidden="true"。
- --dot 没有文字，必须提供 aria-label 或 aria-hidden="true"。

**要点**：
- ✓ 挂角：<span class="riko-badge-anchor">按钮或头像 + <span class="riko-badge">3</span></span>。
- ✓ 数字超过 99 时显示 99+。

**避免**：
- ✗ 不要用徽标承载长文字，改用 tag。

**示例 · 基础用法**

```html
<div class="riko-cluster">
  <span class="riko-badge">12</span>
  <span class="riko-badge riko-badge--ice">新</span>
  <span class="riko-badge riko-badge--success">3</span>
  <span class="riko-badge riko-badge--warning">!</span>
  <span class="riko-badge riko-badge--danger">99+</span>
  <span class="riko-badge riko-badge--neutral">0</span>
  <span class="riko-badge riko-badge--sm">sm</span>
  <span class="riko-badge riko-badge--lg">76</span>
</div>
```

**示例 · 挂在按钮与头像上**

```html
<div class="riko-cluster riko-cluster--lg">
  <span class="riko-badge-anchor">
    <button type="button" class="riko-btn riko-btn--icon" aria-label="消息，3 条未读"><i data-lucide="bell"></i></button>
    <span class="riko-badge riko-badge--danger" aria-hidden="true">3</span>
  </span>
  <span class="riko-badge-anchor">
    <span class="riko-avatar riko-avatar--ring"><img src="https://riko.land/assets/logo.jpg" alt="络可"></span>
    <span class="riko-badge riko-badge--dot riko-badge--pulse" aria-label="有新动态"></span>
  </span>
  <span class="riko-badge-anchor">
    <button type="button" class="riko-btn riko-btn--soft">收件箱</button>
    <span class="riko-badge riko-badge--ice" aria-label="12 封新邮件">12</span>
  </span>
</div>
```

### 卡片 Card `card`

纸白底、手绘圆角的内容容器，可加缝线、胶带，或做成整卡可点击的入口。

**何时用**：承载一组相关内容（文章摘要、功能入口、个人资料）。只需要一行信息时用 list；需要大号统计数字时用 stat。

**根**：`riko-card`（推荐 `<article / a（可点击时）>`）

**部件**：
- `riko-card__media` 顶部（或横排时左侧）图片区，会贴边
- `riko-card__header` 顶部一行：图标 + 标签
- `riko-card__icon` 倾斜的方块图标
- `riko-card__tag` 让标签靠右的包裹类（可直接加在 riko-tag 上）
- `riko-card__title` 标题（标题字体）
- `riko-card__sub` 标题下的手写副标
- `riko-card__body` 正文，自动撑开剩余高度
- `riko-card__content` 横排卡片中的文字列
- `riko-card__footer` 底部操作区（虚线分隔）
- `riko-card__cta` 视觉上的「按钮」，仅用于可点击整卡内部
- `riko-card__actions` __header 右侧的操作区（下拉菜单、图标按钮）

**修饰**（同组互斥）：
- decor：`riko-card--stitched` 缝线内框；`riko-card--flat` 去阴影
- behavior：`riko-card--taped` 顶部胶带（会自动留出上边距）；`riko-card--interactive` 整卡可点击：悬停上浮微旋、右下角色团放大
- size：`riko-card--feature` 首页大入口卡：更大内边距、图标与标题；`riko-card--compact` 紧凑；`riko-card--lg` 大内边距（阅读纸张、文章正文）
- tone：`riko-card--soft` 米色底；`riko-card--ice` 冰蓝底；`riko-card--accent` 浅橙底
- layout：`riko-card--horizontal` 图文横排（窄屏自动变竖排）

**无障碍**：
- 整卡可点击时整张卡就是一个链接：用 <a class="riko-card riko-card--interactive" href>，卡片内部不要再放其他链接或按钮。
- __icon 中的图标是装饰，Lucide 图标会自动 aria-hidden。

**要点**：
- ✓ 普通卡片里的操作放在 __footer，用 riko-btn。
- ✓ 可点击卡片里的「开始阅读」用 <span class="riko-card__cta">，它只是视觉提示。
- ✓ 多张卡片用 riko-grid 排列，高度会自动对齐。
- ✓ 标签放在 __header 里，加 riko-card__tag 即可靠右。
- ✓ 头像/人物卡：把 riko-avatar 放在 __header 里（与 __tag 同行），名字写在 __title。
- ✓ 底部一组标签：<div class="riko-card__footer"><div class="riko-cluster riko-cluster--sm">…riko-tag…</div></div>。
- ✓ --stitched 与 --taped 可以同时使用（像贴着胶带的手作纸张）。

**避免**：
- ✗ 不要在 riko-card--interactive（<a>）里嵌套 <a> 或 <button>。
- ✗ 不要自己写阴影/圆角覆盖，改用 --flat / tone 修饰。

**示例 · 基础卡片**

```html
<div class="riko-grid">
  <article class="riko-card">
    <div class="riko-card__header">
      <span class="riko-card__icon"><i data-lucide="palette"></i></span>
      <span class="riko-tag riko-tag--ice riko-card__tag">设定</span>
    </div>
    <h3 class="riko-card__title">络可的画板</h3>
    <p class="riko-card__body">沙滩上的第一幅画，画的是碧空、大海和一只跃出水面的海豚。</p>
    <div class="riko-card__footer">
      <button type="button" class="riko-btn riko-btn--sm riko-btn--soft">查看设定</button>
    </div>
  </article>
  <article class="riko-card riko-card--stitched">
    <h3 class="riko-card__title">星星酥</h3>
    <p class="riko-card__sub">today's special</p>
    <p class="riko-card__body">HV 甜品店的招牌点心，酥脆香甜，今天还是特价哦。</p>
  </article>
  <article class="riko-card riko-card--taped">
    <h3 class="riko-card__title">今日便签</h3>
    <p class="riko-card__body">记得给 Star 哥哥带一份星星酥，再去钓鱼场看看。</p>
  </article>
</div>
```

**示例 · 可点击的大入口卡**

```html
<div class="riko-grid riko-grid--cols-2">
  <a class="riko-card riko-card--feature riko-card--interactive riko-card--stitched" href="#card">
    <div class="riko-card__header">
      <span class="riko-card__icon"><i data-lucide="book-open"></i></span>
      <span class="riko-tag riko-tag--accent riko-card__tag"><span class="riko-star" aria-hidden="true"></span>敬请期待后续更新！</span>
    </div>
    <h3 class="riko-card__title">《络的世界》</h3>
    <p class="riko-card__body">从沙滩上的第一幅画开始，跟随主角一同踏入这个世界的边缘与深处。</p>
    <span class="riko-card__cta">开始阅读</span>
  </a>
  <a class="riko-card riko-card--feature riko-card--interactive riko-card--stitched" href="#card">
    <div class="riko-card__header">
      <span class="riko-card__icon"><i data-lucide="notebook-pen"></i></span>
      <span class="riko-tag riko-tag--ice riko-tag--dashed riko-card__tag">设定集 · 未完成</span>
    </div>
    <h3 class="riko-card__title">络可的笔记本</h3>
    <p class="riko-card__body">小说中已出现设定的整理与解释。建议先阅读已更新章节后再翻阅，避免剧透。</p>
    <span class="riko-card__cta">翻阅笔记本</span>
  </a>
</div>
```

**示例 · 带图片与横排**

```html
<div class="riko-stack riko-stack--lg">
  <article class="riko-card" style="max-width: 320px">
    <div class="riko-card__media"><img src="https://riko.land/assets/logo.jpg" alt="《络的世界》封面"></div>
    <h3 class="riko-card__title">络的世界</h3>
    <p class="riko-card__body">一个关于画笔、星星与归途的故事。</p>
  </article>
  <article class="riko-card riko-card--horizontal">
    <div class="riko-card__media"><img src="https://riko.land/assets/logo.jpg" alt="《络的世界》封面"></div>
    <div class="riko-card__content">
      <h3 class="riko-card__title">第一章 · 第五幕</h3>
      <p class="riko-card__sub">落星摇曳，清风回荡</p>
      <p class="riko-card__body">风过围垣，落星回响。少年脖颈上的流星项链轻轻摇曳，像一颗真正的落星。</p>
      <div class="riko-card__footer">
        <span class="riko-tag riko-tag--sm">17 节</span>
        <span class="riko-tag riko-tag--sm riko-tag--accent">最新</span>
      </div>
    </div>
  </article>
</div>
```

**示例 · 色调与紧凑**

```html
<div class="riko-grid" style="--riko-grid-min: 200px">
  <article class="riko-card riko-card--soft riko-card--compact">
    <h3 class="riko-card__title">米色</h3>
    <p class="riko-card__body">像旧纸张一样温柔。</p>
  </article>
  <article class="riko-card riko-card--ice riko-card--compact">
    <h3 class="riko-card__title">冰蓝</h3>
    <p class="riko-card__body">边界之地的蓝色屏障。</p>
  </article>
  <article class="riko-card riko-card--accent riko-card--compact">
    <h3 class="riko-card__title">暖橙</h3>
    <p class="riko-card__body">贝雷帽上的小星星。</p>
  </article>
  <article class="riko-card riko-card--flat riko-card--compact">
    <h3 class="riko-card__title">无阴影</h3>
    <p class="riko-card__body">适合嵌在其他容器里。</p>
  </article>
</div>
```

**示例 · 人物卡（头像 + 标签组）**

```html
<article class="riko-card riko-card--stitched">
  <div class="riko-card__header">
    <span class="riko-avatar riko-avatar--ring"><img src="https://riko.land/assets/logo.jpg" alt=""></span>
    <span class="riko-tag riko-tag--accent riko-card__tag">主角</span>
  </div>
  <h3 class="riko-card__title">络可</h3>
  <p class="riko-card__sub">little painter</p>
  <p class="riko-card__body">喜欢画画的小女孩，戴着带星星的贝雷帽。</p>
  <div class="riko-card__footer">
    <div class="riko-cluster riko-cluster--sm">
      <span class="riko-tag riko-tag--sm">画家</span>
      <span class="riko-tag riko-tag--sm riko-tag--ice">HV 村</span>
    </div>
  </div>
</article>
```

### 轮播 Carousel `carousel`

基于滚动吸附的横向轮播，自动生成箭头与圆点，支持触摸滑动、键盘与自动播放。

**何时用**：一组同类的图片或卡片需要在有限空间内轮换展示。重要信息不要只放在轮播里。

**根**：`riko-carousel`（推荐 `<div>`）

**部件**：
- `riko-carousel__track` 滚动轨道（必需）
- `riko-carousel__slide` 每一张（必需）
- `riko-carousel__prev` 上一张按钮（自动生成）
- `riko-carousel__next` 下一张按钮（自动生成）
- `riko-carousel__dots` 圆点容器（自动生成）
- `riko-carousel__dot` 圆点按钮（自动生成）
- `riko-carousel__play` 播放/暂停按钮（自动播放时生成）

**修饰**（同组互斥）：
- layout：`riko-carousel--peek` 露出两侧相邻卡片；`riko-carousel--multi` 一屏多张（宽屏 3 张，窄屏 1.3 张）

**状态**：
- `aria-current="true"`（在 `riko-carousel__dot`） 当前圆点（JS 维护）

**JS**：
- 启用：`data-riko="carousel"`
- 选项 `data-riko-autoplay`（毫秒（空值=5000））：自动播放；悬停或聚焦时暂停，「减少动态效果」时默认不播放，并生成暂停按钮
- 方法 `el.riko.next() / prev() / goTo(i)`：切换
- 方法 `el.riko.play() / pause()`：自动播放控制
- 方法 `el.riko.index`：当前序号
- 事件 `riko:carousel:change` detail { index }：当前张变化时

**无障碍**：
- 根元素需要 aria-label（如「络可的画册」）。
- JS 会设置 role="region"、aria-roledescription 与每张的「n / 总数」标签。
- 轨道可聚焦，方向键 ← → 切换，Home / End 跳到首尾。

**要点**：
- ✓ 只需写 track 与 slide，箭头和圆点自动生成。
- ✓ 每张可以放图片、卡片或任意内容。

**避免**：
- ✗ 不要在一页放多个自动播放的轮播。

**示例 · 基础用法**

```html
<div class="riko-carousel" data-riko="carousel" aria-label="络可的画册">
  <div class="riko-carousel__track">
    <div class="riko-carousel__slide"><div class="riko-card riko-card--ice riko-card--flat riko-u-w-full" style="min-height: 200px"><h3 class="riko-card__title">碧空</h3><p class="riko-card__body">无垠的大海倒映着碧空。</p></div></div>
    <div class="riko-carousel__slide"><div class="riko-card riko-card--accent riko-card--flat riko-u-w-full" style="min-height: 200px"><h3 class="riko-card__title">落日</h3><p class="riko-card__body">晚霞把沙滩染成了橘子色。</p></div></div>
    <div class="riko-carousel__slide"><div class="riko-card riko-card--soft riko-card--flat riko-u-w-full" style="min-height: 200px"><h3 class="riko-card__title">沙滩</h3><p class="riko-card__body">金黄的沙滩上留下一串小脚印。</p></div></div>
  </div>
</div>
```

**示例 · 露出相邻 · 自动播放**

```html
<div class="riko-carousel riko-carousel--peek" data-riko="carousel" data-riko-autoplay="4000" aria-label="章节推荐">
  <div class="riko-carousel__track">
    <div class="riko-carousel__slide"><a class="riko-card riko-card--interactive riko-u-w-full" href="#carousel"><h3 class="riko-card__title">001 沙滩上的画家</h3><p class="riko-card__body">轻柔的海浪涌来，散入金黄的沙滩。</p></a></div>
    <div class="riko-carousel__slide"><a class="riko-card riko-card--interactive riko-u-w-full" href="#carousel"><h3 class="riko-card__title">035 钓鱼场的闹剧</h3><p class="riko-card__body">第一竿：皮革靴子，第二竿：俩荷叶……</p></a></div>
    <div class="riko-carousel__slide"><a class="riko-card riko-card--interactive riko-u-w-full" href="#carousel"><h3 class="riko-card__title">076 风过围垣，落星回响</h3><p class="riko-card__body">回来就好。</p></a></div>
  </div>
</div>
```

### 代码块 Code Block `codeblock`

带标题栏与复制按钮的代码块，标题栏左侧是三颗彩色小圆点。

**何时用**：展示多行代码或配置。行内代码用 riko-code。

**根**：`riko-codeblock`（推荐 `<div>`）

**部件**：
- `riko-codeblock__header` 标题栏
- `riko-codeblock__lang` 语言或文件名
- `riko-codeblock__copy` 复制按钮（配合 data-riko="copy"）
- `riko-codeblock__pre` <pre> 容器（内部放 <code>）

**无障碍**：
- 复制按钮是仅图标按钮，要写 aria-label="复制代码"。

**要点**：
- ✓ 复制按钮：data-riko="copy" data-riko-target="#代码元素id"。
- ✓ 代码中的 < 和 & 要转义。

**避免**：
- ✗ 不要把长代码放进 riko-code（行内代码）。

**示例 · 基础用法**

```html
<div class="riko-codeblock">
  <div class="riko-codeblock__header">
    <span class="riko-codeblock__lang">index.html</span>
    <button type="button" class="riko-codeblock__copy" data-riko="copy" data-riko-target="#code-hello" aria-label="复制代码"></button>
  </div>
  <pre class="riko-codeblock__pre"><code id="code-hello">&lt;link rel="stylesheet" href="riko-ui.css"&gt;
&lt;script src="riko-ui.js"&gt;&lt;/script&gt;
&lt;button class="riko-btn riko-btn--primary"&gt;你好，络可&lt;/button&gt;</code></pre>
</div>
```

### 复制 Copy `copy`

给任意按钮加上「一键复制」：复制成功时图标变成勾，并告诉读屏「已复制」。

**何时用**：邀请码、链接、代码等需要用户复制的内容。

**部件**：
- `riko-copy__icon` 复制图标（按钮为空时自动生成；成功时变为勾）

**状态**：
- `data-state="copied"`（在 `按钮`） 复制成功后约 1.8 秒内（JS 维护）

**JS**：
- 启用：`data-riko="copy"`
- 选项 `data-riko-copy`（文本）：要复制的文字
- 选项 `data-riko-target`（CSS 选择器）：复制该元素的 value（输入框）或文字内容
- 选项 `data-riko-copied-text`（文本） 默认 已复制：读屏播报的成功提示
- 方法 `Riko.copy(text)`：复制任意文本，返回 Promise<boolean>
- 方法 `el.riko.copy()`：触发该按钮的复制
- 事件 `riko:copy:success` detail { text }：复制成功
- 事件 `riko:copy:error` detail { text }：复制失败

**无障碍**：
- 仅图标的复制按钮必须有 aria-label（如「复制链接」）。
- 成功提示通过隐藏的 aria-live 区域播报。

**要点**：
- ✓ data-riko-copy 与 data-riko-target 二选一。
- ✓ 需要额外视觉反馈时可监听 riko:copy:success 弹出 toast。

**避免**：
- ✗ 不要自己调用 navigator.clipboard 再手动改图标，直接用 data-riko="copy"。

**示例 · 基础用法**

```html
<div class="riko-cluster">
  <code class="riko-code" id="invite-code">RIKO-2026</code>
  <button type="button" class="riko-btn riko-btn--soft riko-btn--sm" data-riko="copy" data-riko-target="#invite-code"><span class="riko-copy__icon" aria-hidden="true"></span>复制邀请码</button>
  <button type="button" class="riko-btn riko-btn--icon riko-btn--ghost" data-riko="copy" data-riko-copy="https://riko.land" aria-label="复制网站链接"></button>
</div>
```

### 描述列表 Description List `desc-list`

「名称—内容」成对展示的信息列表，可竖排、横排、多列或带边框。

**何时用**：角色资料、订单详情、设置摘要等键值信息。

**根**：`riko-desc-list`（推荐 `<dl>`）

**部件**：
- `riko-desc-list__row` 一组（<div> 包住 dt + dd）
- `riko-desc-list__term` 名称（<dt>）
- `riko-desc-list__detail` 内容（<dd>）

**修饰**（同组互斥）：
- layout：`riko-desc-list--horizontal` 名称与内容左右排列；`riko-desc-list--columns` 多列自适应
- decor：`riko-desc-list--bordered` 带边框与虚线分隔

**无障碍**：
- 使用语义化的 <dl>/<dt>/<dd>。

**要点**：
- ✓ 名称列宽可用 style="--riko-desc-term-w: 6em" 调整。

**避免**：
- ✗ 不要用表格或 div 模拟键值对。

**示例 · 角色资料**

```html
<dl class="riko-desc-list riko-desc-list--horizontal riko-desc-list--bordered" style="max-width: 480px">
  <div class="riko-desc-list__row"><dt class="riko-desc-list__term">姓名</dt><dd class="riko-desc-list__detail">络可（Riko）</dd></div>
  <div class="riko-desc-list__row"><dt class="riko-desc-list__term">年龄</dt><dd class="riko-desc-list__detail">十二岁</dd></div>
  <div class="riko-desc-list__row"><dt class="riko-desc-list__term">爱好</dt><dd class="riko-desc-list__detail">画画、星星酥、在沙滩上发呆</dd></div>
  <div class="riko-desc-list__row"><dt class="riko-desc-list__term">标志</dt><dd class="riko-desc-list__detail"><span class="riko-tag riko-tag--accent riko-tag--sm"><span class="riko-star" aria-hidden="true"></span>星星贝雷帽</span></dd></div>
</dl>
```

**示例 · 多列**

```html
<dl class="riko-desc-list riko-desc-list--columns">
  <div class="riko-desc-list__row"><dt class="riko-desc-list__term">作者</dt><dd class="riko-desc-list__detail">星星酥</dd></div>
  <div class="riko-desc-list__row"><dt class="riko-desc-list__term">状态</dt><dd class="riko-desc-list__detail">连载中</dd></div>
  <div class="riko-desc-list__row"><dt class="riko-desc-list__term">最新</dt><dd class="riko-desc-list__detail">076 风过围垣，落星回响</dd></div>
  <div class="riko-desc-list__row"><dt class="riko-desc-list__term">字数</dt><dd class="riko-desc-list__detail">约 9 万字</dd></div>
</dl>
```

### 空状态 Empty `empty`

没有内容时的温馨占位：默认插画是一颗漂浮的星星和小云朵。

**何时用**：列表、搜索结果、收藏夹等为空时。整页错误（404 等）用 result。

**根**：`riko-empty`（推荐 `<div>`）

**部件**：
- `riko-empty__art` 插画区；为空时显示默认星星云朵，也可放自己的图片/图标
- `riko-empty__title` 标题
- `riko-empty__desc` 说明
- `riko-empty__actions` 操作按钮区

**修饰**（同组互斥）：
- size：`riko-empty--sm` 小号（嵌在卡片、下拉框中）

**无障碍**：
- 默认插画是装饰，__art 加 aria-hidden="true"。

**要点**：
- ✓ 给出下一步操作（如「去看看」「清除筛选」）。

**避免**：
- ✗ 不要只写「暂无数据」，用温暖的语气说明原因。

**示例 · 基础用法**

```html
<div class="riko-empty">
  <div class="riko-empty__art" aria-hidden="true"></div>
  <h3 class="riko-empty__title">书签夹还空空的</h3>
  <p class="riko-empty__desc">读到喜欢的小节时，点一下星星就能收藏到这里啦。</p>
  <div class="riko-empty__actions">
    <a class="riko-btn riko-btn--primary" href="#empty">去读小说</a>
  </div>
</div>
```

**示例 · 小号**

```html
<div class="riko-card" style="max-width: 320px">
  <div class="riko-empty riko-empty--sm">
    <div class="riko-empty__art" aria-hidden="true"></div>
    <h3 class="riko-empty__title">没有找到「河豚」</h3>
    <p class="riko-empty__desc">换个关键词试试吧 ✦</p>
  </div>
</div>
```

### 列表 List `list`

一行一条信息的列表，支持图标、手写编号、说明、元信息与操作，可做成可点击列表或小卡片网格。

**何时用**：消息、设置项、章节目录、文件列表等纵向条目。需要多列对比时用 table。

**根**：`riko-list`（推荐 `<ul / ol>`）

**部件**：
- `riko-list__item` 一行（li，或可点击时 li 内的 a / button）
- `riko-list__icon` 左侧圆角图标
- `riko-list__num` 左侧手写编号（如章节号 001）
- `riko-list__content` 中间文字列
- `riko-list__title` 标题
- `riko-list__desc` 说明
- `riko-list__meta` 右侧元信息（时间、数量）
- `riko-list__action` 右侧操作按钮区

**修饰**（同组互斥）：
- layout：`riko-list--divided` 行间虚线分隔；`riko-list--cards` 小卡片网格（如章节目录）
- behavior：`riko-list--interactive` 每行可点击：悬停高亮右移、右侧箭头

**状态**：
- `aria-current="page"`（在 `riko-list__item`） 可点击列表中的当前项（橙色高亮）

**无障碍**：
- 可点击列表中，可点击的是 li 内部的 <a class="riko-list__item"> 或 <button class="riko-list__item">，不要给 li 绑点击。
- 当前项用 aria-current="page"（导航）或 aria-current="true"。

**要点**：
- ✓ 非交互列表：<li class="riko-list__item">；交互列表：<li><a class="riko-list__item" href>…</a></li>。
- ✓ 章节目录：riko-list--cards riko-list--interactive + __num。

**避免**：
- ✗ --interactive 的行里不要再放其他按钮（会形成嵌套交互）；需要行内操作时不要加 --interactive，改用 __action。

**示例 · 基础列表**

```html
<ul class="riko-list riko-list--divided" style="max-width: 520px">
  <li class="riko-list__item">
    <span class="riko-list__icon"><i data-lucide="mail"></i></span>
    <div class="riko-list__content">
      <span class="riko-list__title">来自 111 的信</span>
      <span class="riko-list__desc">今晚的会议改到红石灯下开。</span>
    </div>
    <span class="riko-list__meta">3 分钟前</span>
  </li>
  <li class="riko-list__item">
    <span class="riko-list__icon"><i data-lucide="fish"></i></span>
    <div class="riko-list__content">
      <span class="riko-list__title">钓鱼场</span>
      <span class="riko-list__desc">第一竿：皮革靴子，第二竿：俩荷叶……</span>
    </div>
    <div class="riko-list__action">
      <button type="button" class="riko-btn riko-btn--sm riko-btn--ghost">再试一竿</button>
    </div>
  </li>
  <li class="riko-list__item">
    <span class="riko-list__icon"><i data-lucide="cookie"></i></span>
    <div class="riko-list__content">
      <span class="riko-list__title">甜品店</span>
      <span class="riko-list__desc">星星酥今日特价。</span>
    </div>
    <span class="riko-list__meta">昨天</span>
  </li>
</ul>
```

**示例 · 可点击列表**

```html
<ul class="riko-list riko-list--interactive" style="max-width: 420px">
  <li><a class="riko-list__item" href="#list"><span class="riko-list__num">001</span><span class="riko-list__content"><span class="riko-list__title">沙滩上的画家</span></span></a></li>
  <li><a class="riko-list__item" href="#list" aria-current="page"><span class="riko-list__num">002</span><span class="riko-list__content"><span class="riko-list__title">世界的边缘</span></span></a></li>
  <li><a class="riko-list__item" href="#list"><span class="riko-list__num">003</span><span class="riko-list__content"><span class="riko-list__title">熟悉的身影</span></span></a></li>
</ul>
```

**示例 · 小卡片网格**

```html
<ul class="riko-list riko-list--cards riko-list--interactive">
  <li><a class="riko-list__item" href="#list"><span class="riko-list__num">074</span><span class="riko-list__content"><span class="riko-list__title">夜出医庐，独巡残村</span></span></a></li>
  <li><a class="riko-list__item" href="#list"><span class="riko-list__num">075</span><span class="riko-list__content"><span class="riko-list__title">月下清辉，暗见净化</span></span></a></li>
  <li><a class="riko-list__item" href="#list"><span class="riko-list__num">076</span><span class="riko-list__content"><span class="riko-list__title">风过围垣，落星回响 <span class="riko-badge riko-badge--sm">最新</span></span></span></a></li>
</ul>
```

### 拍立得 Polaroid `polaroid`

带白边与手写说明的照片框，轻微倾斜，悬停回正。

**何时用**：展示插画、角色图、头图等需要「贴在手账上」感觉的图片。普通内容图用 card 的 __media。

**根**：`riko-polaroid`（推荐 `<figure>`）

**部件**：
- `riko-polaroid__caption` 手写体说明（figcaption）

**修饰**（同组互斥）：
- layout：`riko-polaroid--left` 向左倾斜；`riko-polaroid--straight` 不倾斜
- size：`riko-polaroid--sm` 小号（180px）；`riko-polaroid--lg` 大号（360px）

**无障碍**：
- <img> 必须有描述性的 alt；__caption 是可见说明，不能替代 alt。

**要点**：
- ✓ 内部可放 <span class="riko-tape" aria-hidden="true"></span> 加胶带。
- ✓ 宽度可用 style="--riko-polaroid-w: 240px" 自定义；图片比例用 --riko-polaroid-ratio。

**避免**：
- ✗ 不要把拍立得放进 overflow:hidden 的小容器，倾斜与胶带会被裁掉。

**示例 · 基础用法**

```html
<div class="riko-cluster riko-cluster--lg riko-cluster--center">
  <figure class="riko-polaroid">
    <span class="riko-tape" aria-hidden="true"></span>
    <img src="https://riko.land/assets/logo.jpg" alt="《络的世界》封面插画">
    <figcaption class="riko-polaroid__caption">Riko's World ✦</figcaption>
  </figure>
  <figure class="riko-polaroid riko-polaroid--left riko-polaroid--sm">
    <img src="https://riko.land/assets/logo.jpg" alt="《络的世界》封面插画">
    <figcaption class="riko-polaroid__caption">little star</figcaption>
  </figure>
  <figure class="riko-polaroid riko-polaroid--straight riko-polaroid--sm">
    <img src="https://riko.land/assets/logo.jpg" alt="《络的世界》封面插画">
    <figcaption class="riko-polaroid__caption">summer, 2026</figcaption>
  </figure>
</div>
```

### 气泡卡片 Popover `popover`

点击触发的浮层卡片，可放任意内容（文字、链接、按钮、表单），点外部或按 Esc 关闭。

**何时用**：需要在原地展示补充信息或少量操作。只有一句提示用 tooltip；操作菜单用 dropdown；需要用户专注完成任务用 dialog。

**根**：`riko-popover`（推荐 `<div>`）

**部件**：
- `riko-popover__header` 标题行
- `riko-popover__title` 标题
- `riko-popover__close` 关闭按钮（加 data-riko-close 与 aria-label）
- `riko-popover__body` 内容
- `riko-popover__footer` 底部操作区

**修饰**（同组互斥）：
- size：`riko-popover--sm` 窄（220px）；`riko-popover--lg` 宽（400px）
- tone：`riko-popover--ice` 冰蓝底

**状态**：
- `aria-expanded="true"`（在 `触发器`） 打开时由 JS 维护

**JS**：
- 启用：`data-riko="popover"`
- 选项 `data-riko-toggle="<popover id>"`（popover 的 id）：写在触发按钮上：点击切换
- 选项 `popover`（auto）：原生属性，写在 popover 上（推荐手写，避免首屏闪现）
- 选项 `data-riko-placement`（bottom | top | left | right（可加 -start / -end）） 默认 bottom：写在 popover 上：相对触发器的位置
- 选项 `data-riko-close`：写在 popover 内的按钮上：点击关闭
- 方法 `pop.riko.open(anchor?) / pop.riko.close() / pop.riko.toggle(anchor?)`：手动控制；anchor 为定位参照元素
- 事件 `riko:popover:open` detail { anchor }：打开后
- 事件 `riko:popover:close` detail { anchor }：关闭后

**无障碍**：
- 触发器用 <button>；JS 会设置 aria-expanded / aria-controls / aria-haspopup。
- 打开后焦点移入卡片（第一个可聚焦元素，没有则卡片本身），Esc 关闭并把焦点还给触发器。
- 有标题时给 popover 加 aria-labelledby 指向标题 id。

**要点**：
- ✓ popover 元素可以放在页面任何位置（通常放在触发器旁边或 body 末尾），它会在顶层渲染。
- ✓ 关闭按钮：<button class="riko-popover__close" data-riko-close aria-label="关闭"></button>。

**避免**：
- ✗ 不要用 popover 做必须完成的流程（改用 dialog）。
- ✗ 不要给触发器同时加 popovertarget 和 data-riko-toggle。

**示例 · 基础用法**

```html
<div class="riko-cluster riko-cluster--center">
  <button type="button" class="riko-btn riko-btn--soft" data-riko-toggle="pop-riko">关于络可</button>
  <div class="riko-popover" id="pop-riko" data-riko="popover" popover aria-labelledby="pop-riko-title">
    <div class="riko-popover__header">
      <h3 class="riko-popover__title" id="pop-riko-title"><span class="riko-star" aria-hidden="true"></span>络可</h3>
      <button type="button" class="riko-popover__close" data-riko-close aria-label="关闭"></button>
    </div>
    <div class="riko-popover__body">自小在 HV 长大的小画家，戴着有星星的贝雷帽，最喜欢在沙滩上画海。</div>
    <div class="riko-popover__footer">
      <a class="riko-btn riko-btn--sm riko-btn--primary" href="#popover">查看设定</a>
    </div>
  </div>
  <button type="button" class="riko-btn" data-riko-toggle="pop-tip">小提示</button>
  <div class="riko-popover riko-popover--sm riko-popover--ice" id="pop-tip" data-riko="popover" popover data-riko-placement="top">
    <div class="riko-popover__body">按 ← → 可以切换小节哦 ✦</div>
  </div>
</div>
```

### 统计数值 Stat `stat`

大号手写数字的指标卡，带标签、图标与涨跌趋势。

**何时用**：仪表盘、个人主页的关键数字。

**根**：`riko-stat`（推荐 `<div>`）

**部件**：
- `riko-stat__icon` 右上角倾斜图标
- `riko-stat__label` 指标名称
- `riko-stat__value` 数值（大号手写体）
- `riko-stat__unit` 单位（放在 __value 内）
- `riko-stat__trend` 趋势说明，配合 data-trend="up|down"

**修饰**（同组互斥）：
- tone：`riko-stat--accent` 橙色描边与图标
- layout：`riko-stat--plain` 去掉卡片外观（嵌在其他卡片里时）

**状态**：
- `data-trend="up|down"`（在 `riko-stat__trend`） 上升（绿）/ 下降（红），带箭头

**无障碍**：
- 趋势不要只靠颜色和箭头表达：文字里写明「增加 / 减少」或「+12 / -3」。

**要点**：
- ✓ 多个 stat 用 riko-grid 排列。

**避免**：
- ✗ __value 中不要放长文字。

**示例 · 指标卡**

```html
<div class="riko-grid" style="--riko-grid-min: 200px">
  <div class="riko-stat">
    <span class="riko-stat__icon"><i data-lucide="book-open"></i></span>
    <span class="riko-stat__label">已更新小节</span>
    <span class="riko-stat__value">76<span class="riko-stat__unit">节</span></span>
    <span class="riko-stat__trend" data-trend="up">本月 +12</span>
  </div>
  <div class="riko-stat riko-stat--accent">
    <span class="riko-stat__icon"><i data-lucide="star"></i></span>
    <span class="riko-stat__label">收到的星星</span>
    <span class="riko-stat__value">2,048</span>
    <span class="riko-stat__trend" data-trend="up">较上周 +8%</span>
  </div>
  <div class="riko-stat">
    <span class="riko-stat__icon"><i data-lucide="type"></i></span>
    <span class="riko-stat__label">总字数</span>
    <span class="riko-stat__value">9.0<span class="riko-stat__unit">万字</span></span>
    <span class="riko-stat__trend">连载中</span>
  </div>
  <div class="riko-stat">
    <span class="riko-stat__icon"><i data-lucide="bug"></i></span>
    <span class="riko-stat__label">待修复错别字</span>
    <span class="riko-stat__value">3</span>
    <span class="riko-stat__trend" data-trend="down">较上周减少 5 个</span>
  </div>
</div>
```

### 表格 Table `table`

手绘风数据表格，外层负责横向滚动与圆角，支持斑马纹、悬停、紧凑、竖线与点击表头排序。

**何时用**：需要按列对比的结构化数据。只有一列信息时用 list。

**根**：`riko-table`（推荐 `<table>`）

**部件**：
- `riko-table-wrap` 外层容器（必需）：圆角边框、窄屏横向滚动
- `riko-table__sort` 排序按钮（由 table-sort 自动生成）

**修饰**（同组互斥）：
- decor：`riko-table--striped` 斑马纹；`riko-table--bordered` 列之间虚线
- behavior：`riko-table--hover` 悬停行高亮
- size：`riko-table--compact` 紧凑
- layout：`riko-table-wrap--sticky` （加在 wrap 上）限制高度、表头吸顶；高度用 --riko-table-max-h

**状态**：
- `aria-sort="ascending|descending"`（在 `th`） 当前排序列（table-sort 自动维护）
- `aria-selected="true"`（在 `tr`） 选中行高亮
- `data-align="end|center"`（在 `th / td`） 单元格对齐（数字列建议 end）

**JS**：
- 启用：`data-riko="table-sort"`
- 选项 `data-riko-sort="false"`（false）：写在 th 上：该列不可排序
- 选项 `data-riko-value`（任意）：写在 td 上：用于排序的值（如日期时间戳）
- 方法 `table.riko.sort(column, direction)`：按列（序号或 th 元素）排序，direction 为 ascending / descending
- 事件 `riko:table:sort` detail { column, direction }：排序后触发

**无障碍**：
- 表头用 <th scope="col">，行标题用 <th scope="row">。
- 用 <caption> 说明表格内容。
- 排序状态通过 aria-sort 提供给读屏，无需额外文字。

**要点**：
- ✓ 始终包一层 <div class="riko-table-wrap">。
- ✓ 数字列加 data-align="end"，数字自动等宽对齐。

**避免**：
- ✗ 不要用表格做页面布局。
- ✗ 不要给 th 自己加排序图标，table-sort 会自动生成。

**示例 · 可排序表格**

```html
<div class="riko-table-wrap">
  <table class="riko-table riko-table--striped riko-table--hover" data-riko="table-sort">
    <caption>HV 骨干成员</caption>
    <thead>
      <tr><th scope="col">成员</th><th scope="col">职责</th><th scope="col" data-align="end">登场小节</th><th scope="col" data-riko-sort="false">状态</th></tr>
    </thead>
    <tbody>
      <tr><th scope="row">络可</th><td>画家</td><td data-align="end">1</td><td><span class="riko-tag riko-tag--sm riko-tag--success">在村中</span></td></tr>
      <tr><th scope="row">Star</th><td>工建 · 战斗</td><td data-align="end">2</td><td><span class="riko-tag riko-tag--sm riko-tag--warning">养伤中</span></td></tr>
      <tr><th scope="row">111</th><td>村长</td><td data-align="end">4</td><td><span class="riko-tag riko-tag--sm riko-tag--success">在村中</span></td></tr>
      <tr><th scope="row">无昵</th><td>交易场所</td><td data-align="end">29</td><td><span class="riko-tag riko-tag--sm riko-tag--ice">外出</span></td></tr>
    </tbody>
  </table>
</div>
```

**示例 · 紧凑与竖线**

```html
<div class="riko-table-wrap">
  <table class="riko-table riko-table--compact riko-table--bordered">
    <thead>
      <tr><th scope="col">幕</th><th scope="col">标题</th><th scope="col" data-align="end">小节数</th></tr>
    </thead>
    <tbody>
      <tr><td>序章 · 第一幕</td><td>沙滩上的画家</td><td data-align="end">3</td></tr>
      <tr><td>序章 · 第二幕</td><td>归途的微光</td><td data-align="end">5</td></tr>
      <tr><td>第一章 · 第五幕</td><td>落星摇曳，清风回荡</td><td data-align="end">17</td></tr>
    </tbody>
    <tfoot>
      <tr><td colspan="2">合计</td><td data-align="end">25</td></tr>
    </tfoot>
  </table>
</div>
```

### 标签 Tag `tag`

胶囊形的小标签，表示分类、状态或关键词，可带图标、星星，或做成可移除。

**何时用**：标注属性、状态、分类、关键词。数量提示用 badge；可编辑的标签输入用 tags-input。

**根**：`riko-tag`（推荐 `<span（可点击时 a）>`）

**部件**：
- `riko-tag__remove` 移除按钮（配合 data-riko-dismiss）

**修饰**（同组互斥）：
- tone：`riko-tag--accent` 暖橙（强调、最新）；`riko-tag--ice` 冰蓝；`riko-tag--soft` 米色无边；`riko-tag--success` 成功；`riko-tag--warning` 警告；`riko-tag--danger` 危险；`riko-tag--primary` 可可色实心
- decor：`riko-tag--outline` 透明底；`riko-tag--dashed` 虚线边框
- size：`riko-tag--sm` 小号；`riko-tag--lg` 大号
- shape：`riko-tag--square` 小圆角

**JS**：
- 启用：`data-riko-dismiss`
- 选项 `data-riko-dismiss`（空 | 选择器 | #id） 默认 空：点击后移除：空=最近的组件根（如 .riko-tag / .riko-alert / .riko-card）；选择器=最近匹配的祖先；#id=指定元素。对任何组件通用。
- 方法 `Riko.dismiss(element)`：以淡出动画移除元素（同样会派发 riko:dismiss）
- 事件 `riko:dismiss` detail { target, trigger }：移除前在目标上派发，可 preventDefault() 取消
- 事件 `riko:dismissed` detail { target }：移除后在原父元素上派发

**无障碍**：
- __remove 是仅图标按钮，必须有 aria-label（如「移除 星星酥」）。
- 移除后焦点会自动移到相邻标签的移除按钮。

**要点**：
- ✓ 图标或星星直接放在标签里：<span class="riko-tag"><span class="riko-star" aria-hidden="true"></span>文字</span>。
- ✓ 可点击的标签用 <a class="riko-tag" href>。
- ✓ data-riko-dismiss 是全站通用的「关闭/移除」机制，alert、card 等也可使用。

**避免**：
- ✗ 不要用 tag 显示纯数字计数，改用 badge。
- ✗ 不要把 riko-tag__remove 放在 riko-tag 外面。

**示例 · 色调**

```html
<div class="riko-cluster riko-cluster--sm">
  <span class="riko-tag">默认</span>
  <span class="riko-tag riko-tag--accent"><span class="riko-star" aria-hidden="true"></span>敬请期待后续更新！</span>
  <span class="riko-tag riko-tag--ice riko-tag--dashed"><i data-lucide="pencil"></i>设定集 · 未完成</span>
  <span class="riko-tag riko-tag--soft">米色</span>
  <span class="riko-tag riko-tag--success">已完结</span>
  <span class="riko-tag riko-tag--warning">修订中</span>
  <span class="riko-tag riko-tag--danger">含剧透</span>
  <span class="riko-tag riko-tag--primary">主线</span>
</div>
```

**示例 · 样式与尺寸**

```html
<div class="riko-cluster riko-cluster--sm">
  <span class="riko-tag riko-tag--sm">小号</span>
  <span class="riko-tag riko-tag--lg">大号</span>
  <span class="riko-tag riko-tag--outline riko-tag--accent">透明底</span>
  <span class="riko-tag riko-tag--dashed">虚线</span>
  <span class="riko-tag riko-tag--square riko-tag--ice">小圆角</span>
  <a class="riko-tag" href="#tag"><i data-lucide="hash"></i>可点击</a>
</div>
```

**示例 · 可移除**

```html
<div class="riko-cluster riko-cluster--sm">
  <span class="riko-tag riko-tag--accent">星星酥<button type="button" class="riko-tag__remove" data-riko-dismiss aria-label="移除 星星酥"></button></span>
  <span class="riko-tag riko-tag--accent">流星项链<button type="button" class="riko-tag__remove" data-riko-dismiss aria-label="移除 流星项链"></button></span>
  <span class="riko-tag riko-tag--accent">贝雷帽<button type="button" class="riko-tag__remove" data-riko-dismiss aria-label="移除 贝雷帽"></button></span>
</div>
```

### 时间轴 Timeline `timeline`

按时间顺序排列的事件，虚线串联，节点可以是小圆点或星星。

**何时用**：更新日志、故事年表、进度记录。表示流程步骤（可操作）用 steps。

**根**：`riko-timeline`（推荐 `<ol>`）

**部件**：
- `riko-timeline__item` 一个事件（li）
- `riko-timeline__dot` 节点（内部可放 riko-star 变成星星）
- `riko-timeline__content` 右侧内容列
- `riko-timeline__time` 时间（手写体，建议用 <time>）
- `riko-timeline__title` 标题
- `riko-timeline__body` 描述

**修饰**（同组互斥）：
- layout：`riko-timeline--alternate` 宽屏左右交替

**状态**：
- `aria-current="step"`（在 `riko-timeline__item`） 当前/最新节点高亮

**无障碍**：
- 用有序列表 <ol>；时间用 <time datetime="…">。

**要点**：
- ✓ 节点换成星星：<span class="riko-timeline__dot"><span class="riko-star" aria-hidden="true"></span></span>。

**避免**：
- ✗ 不要省略 __content 包裹，否则布局会错位。

**示例 · 更新日志**

```html
<ol class="riko-timeline" style="max-width: 520px">
  <li class="riko-timeline__item" aria-current="step">
    <span class="riko-timeline__dot"></span>
    <div class="riko-timeline__content">
      <time class="riko-timeline__time" datetime="2026-10-15">2026.10.15</time>
      <h3 class="riko-timeline__title">更新第 076 节</h3>
      <p class="riko-timeline__body">风过围垣，落星回响 —— 第一章完结！</p>
    </div>
  </li>
  <li class="riko-timeline__item">
    <span class="riko-timeline__dot"><span class="riko-star" aria-hidden="true"></span></span>
    <div class="riko-timeline__content">
      <time class="riko-timeline__time" datetime="2026-07-01">2026.07.01</time>
      <h3 class="riko-timeline__title">官方网站上线</h3>
      <p class="riko-timeline__body">小说阅读器与络可的笔记本同步开放。</p>
    </div>
  </li>
  <li class="riko-timeline__item">
    <span class="riko-timeline__dot"></span>
    <div class="riko-timeline__content">
      <time class="riko-timeline__time" datetime="2026-02-16">2026.02.16</time>
      <h3 class="riko-timeline__title">沙滩上的画家</h3>
      <p class="riko-timeline__body">故事从这里开始。</p>
    </div>
  </li>
</ol>
```

**示例 · 左右交替**

```html
<ol class="riko-timeline riko-timeline--alternate">
  <li class="riko-timeline__item">
    <span class="riko-timeline__dot"></span>
    <div class="riko-timeline__content"><span class="riko-timeline__time">序章</span><h3 class="riko-timeline__title">沙滩上的画家</h3><p class="riko-timeline__body">络可在边界之地作画。</p></div>
  </li>
  <li class="riko-timeline__item">
    <span class="riko-timeline__dot"><span class="riko-star" aria-hidden="true"></span></span>
    <div class="riko-timeline__content"><span class="riko-timeline__time">序章</span><h3 class="riko-timeline__title">涅槃的天使</h3><p class="riko-timeline__body">幽蓝重生，裁决降临。</p></div>
  </li>
  <li class="riko-timeline__item">
    <span class="riko-timeline__dot"></span>
    <div class="riko-timeline__content"><span class="riko-timeline__time">第一章</span><h3 class="riko-timeline__title">自晨曦中归来</h3><p class="riko-timeline__body">破空而来的归乡之箭。</p></div>
  </li>
</ol>
```

### 文字提示 Tooltip `tooltip`

悬停或聚焦时出现的小提示气泡，可可色底、带小箭头。

**何时用**：对按钮、图标做简短补充说明（一句话以内）。需要放链接、按钮或较长内容时改用 popover。

**部件**：
- `riko-tooltip` 提示浮层（由 JS 生成，无需手写）

**JS**：
- 启用：`data-riko="tooltip"`
- 选项 `data-riko-tooltip`（文本）：提示内容；缺省时使用 title 属性（并移除 title）
- 选项 `data-riko-placement`（top | bottom | left | right（可加 -start / -end）） 默认 top：位置，空间不足时自动翻转
- 选项 `data-riko-delay`（毫秒） 默认 150：悬停多久后显示
- 方法 `el.riko.show() / el.riko.hide()`：手动显示 / 隐藏
- 方法 `el.riko.setText(text)`：修改提示内容（也可直接改 data-riko-tooltip）

**无障碍**：
- 触发元素必须可聚焦（button、a 等），键盘聚焦时同样会显示。
- 自动建立 aria-describedby；按 Esc 隐藏。
- 提示只是补充：仅图标按钮仍然需要自己的 aria-label。

**要点**：
- ✓ 写法：<button class="riko-btn" data-riko="tooltip" data-riko-tooltip="提示">…</button>。
- ✓ 文字保持简短，一行为宜。

**避免**：
- ✗ 不要在 tooltip 里放可交互内容。
- ✗ 不要把 tooltip 加在不可聚焦的 <span> 上（键盘用户看不到）。

**示例 · 四个方向**

```html
<div class="riko-cluster riko-cluster--center">
  <button type="button" class="riko-btn" data-riko="tooltip" data-riko-tooltip="把这一节加入书签">收藏</button>
  <button type="button" class="riko-btn" data-riko="tooltip" data-riko-tooltip="在下方出现" data-riko-placement="bottom">下方</button>
  <button type="button" class="riko-btn" data-riko="tooltip" data-riko-tooltip="在左侧出现" data-riko-placement="left">左侧</button>
  <button type="button" class="riko-btn" data-riko="tooltip" data-riko-tooltip="在右侧出现" data-riko-placement="right">右侧</button>
  <button type="button" class="riko-btn riko-btn--icon riko-btn--ghost" aria-label="分享" data-riko="tooltip" data-riko-tooltip="分享给朋友"><i data-lucide="share-2"></i></button>
</div>
```

### 树形列表 Tree `tree`

用嵌套 <details> 构建的文件夹树，虚线连接层级，原生键盘可用。

**何时用**：层级目录（文件、设定分类、章节结构）。只有一层分组时用 accordion。

**根**：`riko-tree`（推荐 `<ul>`）

**部件**：
- `riko-tree__folder` 文件夹（<details>）
- `riko-tree__label` 文件夹名（<summary>）
- `riko-tree__group` 子级列表（<ul>）
- `riko-tree__file` 叶子节点（<a> 或 <button>）
- `riko-tree__meta` 右侧附注（如数量）

**状态**：
- `open`（在 `riko-tree__folder`） 原生属性：默认展开
- `aria-current="page"`（在 `riko-tree__file`） 当前项

**无障碍**：
- 文件夹使用 <details>/<summary>，可用 Tab + Enter/空格展开。
- 叶子节点用真正的链接或按钮。

**要点**：
- ✓ 图标自动显示（文件夹开/合、文件），不需要手写。

**避免**：
- ✗ 不要用 div 嵌套模拟树。

**示例 · 文件夹树**

```html
<ul class="riko-tree" style="max-width: 360px">
  <li>
    <details class="riko-tree__folder" open>
      <summary class="riko-tree__label">络可的笔记本 <span class="riko-tree__meta">4</span></summary>
      <ul class="riko-tree__group">
        <li>
          <details class="riko-tree__folder" open>
            <summary class="riko-tree__label">人物</summary>
            <ul class="riko-tree__group">
              <li><a class="riko-tree__file" href="#tree" aria-current="page">络可.md</a></li>
              <li><a class="riko-tree__file" href="#tree">Star.md</a></li>
            </ul>
          </details>
        </li>
        <li>
          <details class="riko-tree__folder">
            <summary class="riko-tree__label">地点</summary>
            <ul class="riko-tree__group">
              <li><a class="riko-tree__file" href="#tree">HV 村庄.md</a></li>
              <li><a class="riko-tree__file" href="#tree">边界之地.md</a></li>
            </ul>
          </details>
        </li>
      </ul>
    </details>
  </li>
</ul>
```

## 反馈

### 提示条 Alert `alert`

在内容中显示一条带色调图标的提示/标注，可带标题、操作按钮与关闭按钮。

**何时用**：页面内持续存在的提示或说明。短暂的操作反馈改用 toast；整页公告用 banner；需要用户做决定用 dialog/confirm。

**根**：`riko-alert`（推荐 `<div>`）

**部件**：
- `riko-alert__icon` 图标；留空时按色调显示内置图标，也可放 Lucide 图标
- `riko-alert__content` 文字容器（必需）
- `riko-alert__title` 标题（可选）
- `riko-alert__body` 正文
- `riko-alert__actions` 操作按钮区（放在 __content 内）
- `riko-alert__close` 关闭按钮：空 <button>，必须带 data-riko-dismiss 与 aria-label

**修饰**（同组互斥）：
- tone：`riko-alert--info` 信息（默认，可不写）；`riko-alert--success` 成功；`riko-alert--warning` 警告；`riko-alert--danger` 错误/危险；`riko-alert--accent` 橙色强调（星星图标）
- variant：`riko-alert--outline` 白底虚线描边；`riko-alert--note` 便签风：缝线内框 + 手写体标题 + 阴影

**JS**：
- 选项 `data-riko-dismiss`（（无值））：放在关闭按钮上：点击后淡出并移除所在 alert（通用移除机制，见 tag 组件）
- 方法 `Riko.dismiss(el)`：用 JS 移除（带淡出）
- 事件 `riko:dismiss` detail { target, trigger }：移除前派发，可 preventDefault 阻止

**无障碍**：
- 普通提示用 role="status"，错误等紧急信息用 role="alert"，静态说明用 role="note"。
- 图标为装饰：riko-alert__icon 加 aria-hidden="true"。
- 关闭按钮没有文字，必须写 aria-label（如「关闭提示」）。

**要点**：
- ✓ 色调用修饰类（riko-alert--success 等），图标会自动匹配，不需要自己找图标。
- ✓ 关闭只需在按钮上写 data-riko-dismiss，不要自己写 remove() 逻辑。
- ✓ 操作按钮放在 riko-alert__actions 中，使用 riko-btn riko-btn--sm。

**避免**：
- ✗ 不要用 alert 做几秒后自动消失的反馈（用 Riko.toast）。
- ✗ 不要把多个色调修饰写在同一个 alert 上。
- ✗ 不要省略 riko-alert__content 直接把文字放在根上。

**示例 · 色调**

```html
<div class="riko-stack">
  <div class="riko-alert" role="status">
    <span class="riko-alert__icon" aria-hidden="true"></span>
    <div class="riko-alert__content">
      <p class="riko-alert__title">小提示</p>
      <p class="riko-alert__body">阅读器会自动记住你上次读到的小节哦。</p>
    </div>
  </div>
  <div class="riko-alert riko-alert--success" role="status">
    <span class="riko-alert__icon" aria-hidden="true"></span>
    <div class="riko-alert__content">
      <p class="riko-alert__title">保存成功</p>
      <p class="riko-alert__body">络可的画稿已经好好地收进笔记本啦。</p>
    </div>
  </div>
  <div class="riko-alert riko-alert--warning" role="status">
    <span class="riko-alert__icon" aria-hidden="true"></span>
    <div class="riko-alert__content">
      <p class="riko-alert__title">前方剧透</p>
      <p class="riko-alert__body">建议先读完第一章，再来翻阅络可的笔记本。</p>
    </div>
  </div>
  <div class="riko-alert riko-alert--danger" role="alert">
    <span class="riko-alert__icon" aria-hidden="true"></span>
    <div class="riko-alert__content">
      <p class="riko-alert__title">连接失败</p>
      <p class="riko-alert__body">信号被暗林挡住了，请稍后再试一次。</p>
    </div>
  </div>
  <div class="riko-alert riko-alert--accent" role="status">
    <span class="riko-alert__icon" aria-hidden="true"></span>
    <div class="riko-alert__content">
      <p class="riko-alert__body">第 76 节「风过围垣，落星回响」已经更新！</p>
    </div>
  </div>
</div>
```

**示例 · 可关闭与操作按钮**

```html
<div class="riko-alert riko-alert--warning" role="status">
  <span class="riko-alert__icon" aria-hidden="true"></span>
  <div class="riko-alert__content">
    <p class="riko-alert__title">还有 3 节没有读完</p>
    <p class="riko-alert__body">要从「月下清辉，暗见净化」继续阅读吗？</p>
    <div class="riko-alert__actions">
      <button type="button" class="riko-btn riko-btn--sm riko-btn--primary">继续阅读</button>
      <button type="button" class="riko-btn riko-btn--sm riko-btn--ghost" data-riko-dismiss>稍后再说</button>
    </div>
  </div>
  <button type="button" class="riko-alert__close" data-riko-dismiss aria-label="关闭提示"></button>
</div>
```

**示例 · 描边与便签**

```html
<div class="riko-stack">
  <div class="riko-alert riko-alert--outline" role="note">
    <span class="riko-alert__icon" aria-hidden="true"><i data-lucide="lightbulb"></i></span>
    <div class="riko-alert__content">
      <p class="riko-alert__body">按 <kbd class="riko-kbd">←</kbd> <kbd class="riko-kbd">→</kbd> 可以快速切换小节。</p>
    </div>
  </div>
  <div class="riko-alert riko-alert--note riko-alert--accent" role="note">
    <span class="riko-alert__icon" aria-hidden="true"></span>
    <div class="riko-alert__content">
      <p class="riko-alert__title">络可的小纸条</p>
      <p class="riko-alert__body">今天也要记得画画、吃星星酥，还有——不要一个人跑去暗林！</p>
    </div>
  </div>
</div>
```

### 公告横幅 Banner `banner`

横跨页面或内容区顶部的一条公告，可带图标、链接与关闭按钮，可吸顶。

**何时用**：全站公告、更新通知、维护提醒。内容中的普通提示用 alert；临时反馈用 toast。

**根**：`riko-banner`（推荐 `<div>`）

**部件**：
- `riko-banner__icon` 图标：可直接写 riko-banner__icon riko-star（闪烁星星），或放 Lucide 图标
- `riko-banner__text` 公告文字（<p>）（必需）
- `riko-banner__link` 文字中的链接（波浪下划线）
- `riko-banner__close` 关闭按钮：空 <button>，带 data-riko-dismiss 与 aria-label

**修饰**（同组互斥）：
- tone：`riko-banner--ice` 冰蓝；`riko-banner--success` 成功；`riko-banner--warning` 警告；`riko-banner--danger` 危险
- layout：`riko-banner--sticky` 吸顶（position: sticky; top: 0）；`riko-banner--inline` 内容中的圆角虚线横幅（左对齐）

**JS**：
- 选项 `data-riko-dismiss`（（无值））：放在关闭按钮上，点击后淡出移除横幅
- 方法 `Riko.dismiss(el)`：用 JS 移除
- 事件 `riko:dismiss` detail { target, trigger }：移除前派发，可 preventDefault 阻止

**无障碍**：
- 根元素加 role="region" 与 aria-label（如「公告」），方便读屏用户跳转。
- 图标加 aria-hidden="true"；关闭按钮必须有 aria-label。

**要点**：
- ✓ 默认为橙色强调色调；整页顶部公告放在 <body> 最前面，需要时加 riko-banner--sticky。
- ✓ 文字要短，一行说清；更多内容用 riko-banner__link 链接出去。

**避免**：
- ✗ 不要在一个页面同时放多条横幅。
- ✗ 不要在横幅里放表单或大量按钮。

**示例 · 页面顶部公告**

```html
<div class="riko-stack">
  <div class="riko-banner" role="region" aria-label="公告">
    <span class="riko-banner__icon riko-star" aria-hidden="true"></span>
    <p class="riko-banner__text">第 76 节「风过围垣，落星回响」已更新！<a class="riko-banner__link" href="#">去看看</a></p>
    <button type="button" class="riko-banner__close" data-riko-dismiss aria-label="关闭公告"></button>
  </div>
  <div class="riko-banner riko-banner--ice" role="region" aria-label="公告">
    <span class="riko-banner__icon" aria-hidden="true"><i data-lucide="snowflake"></i></span>
    <p class="riko-banner__text">冬日限定：深色模式下的夜晚更安静哦。</p>
  </div>
</div>
```

**示例 · 内容中的圆角横幅**

```html
<div class="riko-banner riko-banner--inline riko-banner--warning" role="region" aria-label="维护通知">
  <span class="riko-banner__icon" aria-hidden="true"><i data-lucide="wrench"></i></span>
  <p class="riko-banner__text">今晚 23:00–23:30 维护，届时阅读器可能短暂不可用。<a class="riko-banner__link" href="#">了解详情</a></p>
</div>
```

### 对话框 Dialog `dialog`

基于原生 <dialog> 的模态对话框：线性动画、遮罩模糊、焦点锁定、Esc/遮罩关闭；另提供 Riko.confirm / Riko.alert。

**何时用**：需要用户专注处理的内容（设置、表单、确认）。从边缘滑出的面板用 drawer；不打断操作的提示用 toast。

**根**：`riko-dialog`（推荐 `<dialog>`）

**部件**：
- `riko-dialog__header` 头部（标题 + 关闭按钮）
- `riko-dialog__title` 标题（h2），id 供 aria-labelledby 引用；可在前面放 riko-star（必需）
- `riko-dialog__close` 右上角关闭按钮：空 <button>，带 data-riko-close 与 aria-label
- `riko-dialog__body` 内容区（超出时滚动）
- `riko-dialog__desc` 说明文字（次要色），可作为 aria-describedby 目标
- `riko-dialog__footer` 底部按钮区（右对齐）
- `riko-dialog__icon` 标题前的色调图标（空 <span>，默认星星；随根上的色调修饰变化）

**修饰**（同组互斥）：
- size：`riko-dialog--sm` 窄（380px）；`riko-dialog--lg` 宽（760px）；`riko-dialog--full` 超宽（1100px），窄屏下全屏
- variant：`riko-dialog--confirm` 确认框布局（Riko.confirm/alert 自动使用）
- tone：`riko-dialog--info` 信息色调（影响 __icon）；`riko-dialog--success` 成功色调；`riko-dialog--warning` 警告色调；`riko-dialog--danger` 危险色调

**状态**：
- `open` 打开中（原生属性，由 JS 维护；不要手写 open）
- `data-state="closing"` 关闭动画中
- `aria-expanded`（在 `[data-riko-open] 触发按钮`） JS 自动维护，并加上 aria-haspopup/aria-controls

**JS**：
- 启用：`data-riko="dialog"`
- 选项 `data-riko-open`（对话框 id）：写在任意按钮上：点击打开该对话框（也适用于 drawer）
- 选项 `data-riko-close`（可选返回值）：写在对话框内的按钮上：点击关闭；值会成为 returnValue
- 选项 `data-riko-backdrop`（static）：点击遮罩与按 Esc 都不关闭（只能用按钮关闭）
- 方法 `el.riko.open() / el.riko.close(returnValue?) / el.riko.toggle()`：实例方法；el.riko.isOpen 为当前状态
- 方法 `Riko.dialog.open(id | el) / Riko.dialog.close(id | el, value?) / Riko.dialog.toggle(id | el)`：全局方法
- 方法 `Riko.confirm({ title, message, confirmText, cancelText, tone }) → Promise<boolean>`：确认框；tone: 'accent'（默认）| 'danger' | 'warning' | 'info' | 'success'；danger 时确认按钮为危险样式，默认焦点在「取消」
- 方法 `Riko.alert({ title, message, okText, tone }) → Promise<void>`：只有一个按钮的提示框
- 事件 `riko:dialog:open` detail { id }：打开前派发，可 preventDefault 阻止打开
- 事件 `riko:dialog:opened` detail { id }：已打开
- 事件 `riko:dialog:close` detail { id, returnValue }：已关闭

**无障碍**：
- 必须用 <dialog> 元素，并用 aria-labelledby 指向 riko-dialog__title 的 id。
- 有说明文字时用 aria-describedby 指向它。
- 打开时焦点进入对话框（优先 [autofocus]），Tab 被锁定在内部，关闭后焦点回到触发按钮——JS 已处理。
- 关闭按钮必须有 aria-label。

**要点**：
- ✓ 打开用 data-riko-open="id"，关闭用 data-riko-close，不需要写 JS。
- ✓ 可在 <dialog> 内用 <form method="dialog">：提交按钮的 value 会成为 returnValue，并带关闭动画。
- ✓ 底部按钮顺序：次要（riko-btn--ghost）在左，主要（riko-btn--primary）在右。
- ✓ 简单的「确定吗？」用 await Riko.confirm()，不要为此手写对话框。

**避免**：
- ✗ data-riko-close 只用于关闭弹层（dialog/drawer）；移除 alert、banner 等组件用 data-riko-dismiss。
- ✗ 不要手写 open 属性或调用 dialog.showModal()——用 data-riko-open 或 el.riko.open()，否则不会锁滚动与焦点。
- ✗ 不要用 <div class="riko-dialog">（必须是 <dialog>）。
- ✗ 不要在对话框里再嵌套对话框。

**示例 · 基础用法**

```html
<button type="button" class="riko-btn riko-btn--primary" data-riko-open="settings-dialog"><i data-lucide="settings"></i>打开设置</button>
<dialog class="riko-dialog" id="settings-dialog" data-riko="dialog" aria-labelledby="settings-dialog-title">
  <header class="riko-dialog__header">
    <h2 class="riko-dialog__title" id="settings-dialog-title"><span class="riko-star" aria-hidden="true"></span>设置界面</h2>
    <button type="button" class="riko-dialog__close" data-riko-close aria-label="关闭"></button>
  </header>
  <div class="riko-dialog__body">
    <p class="riko-dialog__desc">选择你喜欢的阅读外观，设置会自动保存。</p>
    <div class="riko-theme-picker" data-riko="theme-picker"></div>
  </div>
</dialog>
```

**示例 · 带底部按钮**

```html
<button type="button" class="riko-btn" data-riko-open="bookmark-dialog"><i data-lucide="bookmark"></i>添加书签</button>
<dialog class="riko-dialog riko-dialog--sm" id="bookmark-dialog" data-riko="dialog" aria-labelledby="bookmark-dialog-title" aria-describedby="bookmark-dialog-desc">
  <header class="riko-dialog__header">
    <h2 class="riko-dialog__title" id="bookmark-dialog-title">夹一枚书签</h2>
    <button type="button" class="riko-dialog__close" data-riko-close aria-label="关闭"></button>
  </header>
  <div class="riko-dialog__body">
    <p class="riko-dialog__desc" id="bookmark-dialog-desc">把「晓窗梦醒，初览疮痍」加入书签，下次打开时可以一键回到这里。</p>
  </div>
  <footer class="riko-dialog__footer">
    <button type="button" class="riko-btn riko-btn--ghost" data-riko-close="cancel">取消</button>
    <button type="button" class="riko-btn riko-btn--primary" data-riko-close="save" autofocus>夹好啦</button>
  </footer>
</dialog>
```

**示例 · 尺寸与静态遮罩**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn" data-riko-open="story-dialog">大对话框</button>
  <button type="button" class="riko-btn" data-riko-open="agree-dialog">静态遮罩</button>
</div>
<dialog class="riko-dialog riko-dialog--lg" id="story-dialog" data-riko="dialog" aria-labelledby="story-dialog-title">
  <header class="riko-dialog__header">
    <h2 class="riko-dialog__title" id="story-dialog-title">001 沙滩上的画家</h2>
    <button type="button" class="riko-dialog__close" data-riko-close aria-label="关闭"></button>
  </header>
  <div class="riko-dialog__body riko-prose riko-prose--read">
    <p>轻柔的海浪涌来，在微风的吹拂下散入金黄的沙滩。无垠的大海倒映着碧空，也消解了一部分太阳的热。</p>
    <p>沙滩上，一个女孩哼着欢快的歌，挥动她的画笔，一道道鲜艳的色彩在画板上留下痕迹，逐渐勾勒出天空、大海、沙滩……</p>
  </div>
</dialog>
<dialog class="riko-dialog riko-dialog--sm" id="agree-dialog" data-riko="dialog" data-riko-backdrop="static" aria-labelledby="agree-dialog-title">
  <header class="riko-dialog__header">
    <h2 class="riko-dialog__title" id="agree-dialog-title">阅读须知</h2>
  </header>
  <div class="riko-dialog__body">
    <p class="riko-dialog__desc">本作品仍在连载中，设定可能随剧情调整。请点击下方按钮确认。</p>
  </div>
  <footer class="riko-dialog__footer">
    <button type="button" class="riko-btn riko-btn--primary" data-riko-close="agree">我知道啦</button>
  </footer>
</dialog>
```

**示例 · 确认框与提示框**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn riko-btn--danger" id="confirm-demo">清空阅读记录</button>
  <button type="button" class="riko-btn" id="alert-demo">显示提示</button>
</div>
<script>
  document.getElementById('confirm-demo').addEventListener('click', async () => {
    const ok = await Riko.confirm({
      title: '要清空阅读记录吗？',
      message: '已读标记和书签都会消失，这个操作不能撤销哦。',
      confirmText: '清空',
      tone: 'danger',
    });
    if (ok) Riko.toast.success('阅读记录已清空');
  });
  document.getElementById('alert-demo').addEventListener('click', () => {
    Riko.alert({ title: '敬请期待', message: '第二章正在努力创作中，预计 2027 年继续更新！' });
  });
</script>
```

### 抽屉 Drawer `drawer`

从屏幕左/右/底部滑出的模态面板（原生 <dialog>），用法与对话框一致。

**何时用**：移动端目录/导航、筛选条件、详情预览、分享面板。居中的确认/表单用 dialog。

**根**：`riko-drawer`（推荐 `<dialog>`）

**部件**：
- `riko-drawer__header` 头部
- `riko-drawer__title` 标题（h2），id 供 aria-labelledby 引用（必需）
- `riko-drawer__close` 关闭按钮：空 <button>，带 data-riko-close 与 aria-label
- `riko-drawer__body` 内容区（滚动）
- `riko-drawer__footer` 底部按钮区

**修饰**（同组互斥）：
- layout：`riko-drawer--left` 从左侧滑出（默认右侧）；`riko-drawer--bottom` 从底部滑出（带把手；桌面端居中限宽）
- size：`riko-drawer--sm` 窄（300px）；`riko-drawer--lg` 宽（560px）

**状态**：
- `open` 打开中（由 JS 维护）
- `data-state="closing"` 关闭动画中

**JS**：
- 启用：`data-riko="drawer"`
- 选项 `data-riko-open`（抽屉 id）：写在触发按钮上
- 选项 `data-riko-close`（可选返回值）：写在抽屉内的按钮上
- 选项 `data-riko-backdrop`（static）：点击遮罩与 Esc 不关闭
- 方法 `el.riko.open() / el.riko.close() / el.riko.toggle()`：实例方法；也可用 Riko.dialog.open(id)
- 事件 `riko:drawer:open` detail { id }：打开前派发，可取消
- 事件 `riko:drawer:opened` detail { id }：已打开
- 事件 `riko:drawer:close` detail { id, returnValue }：已关闭

**无障碍**：
- 必须是 <dialog>，并用 aria-labelledby 指向标题。
- 焦点锁定与返回由 JS 处理；关闭按钮需要 aria-label。

**要点**：
- ✓ 部件类名用 riko-drawer__*（不要混用 riko-dialog__*）。
- ✓ 打开/关闭与 dialog 相同：data-riko-open / data-riko-close。

**避免**：
- ✗ 不要用 <div> 自己做抽屉和遮罩。
- ✗ 不要把 --left 与 --bottom 同时使用。

**示例 · 三个方向**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn" data-riko-open="toc-drawer"><i data-lucide="list"></i>目录（左）</button>
  <button type="button" class="riko-btn" data-riko-open="detail-drawer"><i data-lucide="panel-right"></i>详情（右）</button>
  <button type="button" class="riko-btn" data-riko-open="share-drawer"><i data-lucide="share-2"></i>分享（底部）</button>
</div>
<dialog class="riko-drawer riko-drawer--left" id="toc-drawer" data-riko="drawer" aria-labelledby="toc-drawer-title">
  <header class="riko-drawer__header">
    <h2 class="riko-drawer__title" id="toc-drawer-title"><span class="riko-star" aria-hidden="true"></span>小说目录</h2>
    <button type="button" class="riko-drawer__close" data-riko-close aria-label="关闭目录"></button>
  </header>
  <div class="riko-drawer__body">
    <p>序章 · 第一幕：沙滩上的画家</p>
    <p>序章 · 第二幕：归途的微光</p>
    <p>序章 · 第三幕：暗林深处</p>
  </div>
</dialog>
<dialog class="riko-drawer" id="detail-drawer" data-riko="drawer" aria-labelledby="detail-drawer-title">
  <header class="riko-drawer__header">
    <h2 class="riko-drawer__title" id="detail-drawer-title">角色卡 · 络可</h2>
    <button type="button" class="riko-drawer__close" data-riko-close aria-label="关闭"></button>
  </header>
  <div class="riko-drawer__body">
    <p>喜欢画画的小女孩，戴着缀有橙色星星的贝雷帽。最喜欢的点心是星星酥。</p>
  </div>
  <footer class="riko-drawer__footer">
    <button type="button" class="riko-btn riko-btn--ghost" data-riko-close>关闭</button>
    <button type="button" class="riko-btn riko-btn--primary">查看笔记本</button>
  </footer>
</dialog>
<dialog class="riko-drawer riko-drawer--bottom" id="share-drawer" data-riko="drawer" aria-labelledby="share-drawer-title">
  <header class="riko-drawer__header">
    <h2 class="riko-drawer__title" id="share-drawer-title">分享这一节</h2>
    <button type="button" class="riko-drawer__close" data-riko-close aria-label="关闭"></button>
  </header>
  <div class="riko-drawer__body">
    <div class="riko-cluster">
      <button type="button" class="riko-btn riko-btn--soft" data-riko-toast="链接已复制" data-riko-toast-tone="success"><i data-lucide="link"></i>复制链接</button>
      <button type="button" class="riko-btn riko-btn--soft"><i data-lucide="image"></i>生成卡片</button>
    </div>
  </div>
</dialog>
```

### 进度 Progress `progress`

基于原生 <progress> 的渐变进度条（支持不确定进度），以及带小星星的环形进度。

**何时用**：有明确进度的任务（上传、阅读进度、完成度）。不确定时长的等待也可用不写 value 的进度条或 spinner。

**根**：`riko-progress`（推荐 `<div>`）

**部件**：
- `riko-progress__head` 标签行（标签 + 数值）
- `riko-progress__label` 标签（给 id，供 aria-labelledby）
- `riko-progress__value` 百分比文字
- `riko-progress__bar` 原生 <progress value max>；不写 value 为不确定进度（必需）
- `riko-progress-ring` 环形进度根元素：role="progressbar" + aria-valuenow + style="--riko-progress: 0~100"
- `riko-progress-ring__value` 环形中间的数字

**修饰**（同组互斥）：
- size：`riko-progress--sm` 细；`riko-progress--lg` 粗；`riko-progress-ring--sm` 环形小号；`riko-progress-ring--lg` 环形大号
- tone：`riko-progress--ice` 冰蓝；`riko-progress--success` 成功；`riko-progress--warning` 警告；`riko-progress--danger` 危险；`riko-progress-ring--ice` 环形冰蓝；`riko-progress-ring--success` 环形成功；`riko-progress-ring--warning` 环形警告；`riko-progress-ring--danger` 环形危险

**状态**：
- `value`（在 `riko-progress__bar`） 当前值；更新时同时更新 __value 文字
- `aria-valuenow`（在 `riko-progress-ring`） 环形当前值，需与 --riko-progress 保持一致

**无障碍**：
- <progress> 需要可访问名称：aria-labelledby 指向 __label，或 aria-label。
- 环形进度用 role="progressbar" 并写 aria-valuenow / aria-valuemin / aria-valuemax / aria-label。

**要点**：
- ✓ 用 JS 更新：bar.value = 62；环形：ring.style.setProperty('--riko-progress', 62) 并同步 aria-valuenow。
- ✓ 环形的 --riko-progress 是 0–100 的纯数字（不带 %）。

**避免**：
- ✗ 不要用 div 宽度百分比自己画进度条。

**示例 · 进度条**

```html
<div class="riko-stack riko-stack--lg">
  <div class="riko-progress">
    <div class="riko-progress__head">
      <span class="riko-progress__label" id="read-progress-label">阅读进度</span>
      <span class="riko-progress__value">62%</span>
    </div>
    <progress class="riko-progress__bar" value="62" max="100" aria-labelledby="read-progress-label"></progress>
  </div>
  <div class="riko-progress riko-progress--sm riko-progress--success">
    <div class="riko-progress__head">
      <span class="riko-progress__label" id="upload-progress-label">画稿上传</span>
      <span class="riko-progress__value">100%</span>
    </div>
    <progress class="riko-progress__bar" value="100" max="100" aria-labelledby="upload-progress-label"></progress>
  </div>
  <div class="riko-progress riko-progress--lg riko-progress--ice">
    <progress class="riko-progress__bar" value="35" max="100" aria-label="下载进度"></progress>
  </div>
</div>
```

**示例 · 不确定进度**

```html
<div class="riko-progress">
  <div class="riko-progress__head">
    <span class="riko-progress__label" id="sync-progress-label">正在同步书签…</span>
  </div>
  <progress class="riko-progress__bar" max="100" aria-labelledby="sync-progress-label"></progress>
</div>
```

**示例 · 环形进度**

```html
<div class="riko-cluster riko-cluster--lg">
  <div class="riko-progress-ring riko-progress-ring--sm" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" aria-label="今日阅读" style="--riko-progress: 25"><span class="riko-progress-ring__value">25%</span></div>
  <div class="riko-progress-ring" role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100" aria-label="序章进度" style="--riko-progress: 72"><span class="riko-progress-ring__value">72%</span></div>
  <div class="riko-progress-ring riko-progress-ring--lg riko-progress-ring--ice" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" aria-label="第一章进度" style="--riko-progress: 90"><span class="riko-progress-ring__value">90%</span></div>
</div>
```

### 结果页 Result `result`

操作完成、出错、空结果或 404 时的整块居中反馈：插画/图标、标题、说明与操作。

**何时用**：提交成功页、错误页、404 页、功能未开放。列表为空用 empty（数据展示类）。

**根**：`riko-result`（推荐 `<div>`）

**部件**：
- `riko-result__art` 插画区：留空显示色调图标；可放 Lucide 图标、<img>，或 404 时写数字（必需）
- `riko-result__title` 标题（必需）
- `riko-result__desc` 说明
- `riko-result__actions` 操作按钮
- `riko-result__extra` 额外内容（如错误详情）

**修饰**（同组互斥）：
- tone：`riko-result--success` 成功；`riko-result--info` 信息；`riko-result--warning` 警告；`riko-result--danger` 错误；`riko-result--404` 404：__art 内写「404」，显示为大号手写数字
- size：`riko-result--sm` 小号（卡片内使用）

**无障碍**：
- __art 为装饰，加 aria-hidden="true"。
- 标题使用与页面层级相符的标题标签。

**要点**：
- ✓ 默认（不加色调）为橙色星星。
- ✓ 操作按钮：主要操作 riko-btn--primary 在前。

**避免**：
- ✗ 不要在 __art 中放很长的文字。

**示例 · 成功**

```html
<div class="riko-result riko-result--success">
  <div class="riko-result__art" aria-hidden="true"></div>
  <h2 class="riko-result__title">反馈提交成功</h2>
  <p class="riko-result__desc">谢谢你的建议！络可会把它认真地抄进笔记本里。</p>
  <div class="riko-result__actions">
    <a class="riko-btn riko-btn--primary" href="#">回到主页</a>
    <a class="riko-btn" href="#">继续阅读</a>
  </div>
</div>
```

**示例 · 404**

```html
<div class="riko-result riko-result--404">
  <div class="riko-result__art" aria-hidden="true">404</div>
  <h2 class="riko-result__title">这一页被海浪冲走啦</h2>
  <p class="riko-result__desc">你要找的页面不在这片沙滩上，回主页看看别的故事吧。</p>
  <div class="riko-result__actions">
    <a class="riko-btn riko-btn--primary" href="#"><i data-lucide="house"></i>回到主页</a>
  </div>
</div>
```

**示例 · 小号与其他色调**

```html
<div class="riko-grid riko-grid--cols-2">
  <div class="riko-result riko-result--sm riko-result--danger">
    <div class="riko-result__art" aria-hidden="true"></div>
    <h2 class="riko-result__title">加载失败</h2>
    <p class="riko-result__desc">信号被暗林挡住了。</p>
    <div class="riko-result__actions">
      <button type="button" class="riko-btn riko-btn--sm">重试</button>
    </div>
  </div>
  <div class="riko-result riko-result--sm">
    <div class="riko-result__art" aria-hidden="true"><i data-lucide="palette"></i></div>
    <h2 class="riko-result__title">敬请期待</h2>
    <p class="riko-result__desc">第二章正在努力创作中～</p>
  </div>
</div>
```

### 骨架屏 Skeleton `skeleton`

内容加载前的柔和闪光占位块：文字行、圆形头像、矩形图片。

**何时用**：已知布局的内容正在加载时。未知布局或很短的等待用 spinner。

**根**：`riko-skeleton`（推荐 `<span>`）

**部件**：
- `riko-skeleton-group` 纵向排列多个占位块的容器（组内最后一行文字自动变短）

**修饰**（同组互斥）：
- shape：`riko-skeleton--text` 一行文字；`riko-skeleton--circle` 圆形（头像），尺寸用 --riko-skeleton-size；`riko-skeleton--rect` 矩形（图片/卡片），高度用 --riko-skeleton-h

**状态**：
- `aria-busy="true"`（在 `外层容器`） 表示该区域正在加载

**无障碍**：
- 外层容器加 aria-busy="true" 和 aria-label（如「正在加载章节」），加载完成后移除 aria-busy 并替换内容。

**要点**：
- ✓ 占位块的大致形状应与真实内容一致。
- ✓ 尺寸用 --riko-skeleton-h / --riko-skeleton-size 变量调整。

**避免**：
- ✗ 不要在骨架屏里放文字。

**示例 · 卡片占位**

```html
<div class="riko-cluster riko-cluster--start" aria-busy="true" aria-label="正在加载章节">
  <span class="riko-skeleton riko-skeleton--circle"></span>
  <div class="riko-skeleton-group riko-u-flex-1">
    <span class="riko-skeleton riko-skeleton--text"></span>
    <span class="riko-skeleton riko-skeleton--text"></span>
    <span class="riko-skeleton riko-skeleton--text"></span>
  </div>
</div>
```

**示例 · 图片 + 文字**

```html
<div class="riko-skeleton-group" style="max-width: 320px" aria-busy="true" aria-label="正在加载图片">
  <span class="riko-skeleton riko-skeleton--rect"></span>
  <span class="riko-skeleton riko-skeleton--text"></span>
  <span class="riko-skeleton riko-skeleton--text"></span>
</div>
```

### 加载中 Spinner `spinner`

旋转的品牌星星（或三颗跳动的小星星）加可读文字。

**何时用**：等待时间不确定的短加载。已知布局的内容加载用 skeleton；有进度数值用 progress。

**根**：`riko-spinner`（推荐 `<span>`）

**部件**：
- `riko-spinner__label` 可读文字（必需；只显示图标时加 riko-u-sr-only）（必需）
- `riko-spinner__dot` --dots 样式中的小星星，写三个

**修饰**（同组互斥）：
- size：`riko-spinner--sm` 小号；`riko-spinner--lg` 大号（图标在上，文字在下）
- variant：`riko-spinner--dots` 三颗跳动小星星
- tone：`riko-spinner--ice` 冰蓝色

**无障碍**：
- 根元素加 role="status"；必须包含 riko-spinner__label 文字。

**要点**：
- ✓ 按钮内的加载状态用按钮自己的 aria-busy="true"，不要在按钮里塞 spinner。

**避免**：
- ✗ 不要只放一个没有文字的 spinner。

**示例 · 样式与尺寸**

```html
<div class="riko-cluster riko-cluster--lg">
  <span class="riko-spinner riko-spinner--sm" role="status"><span class="riko-spinner__label">加载中…</span></span>
  <span class="riko-spinner" role="status"><span class="riko-spinner__label">正在翻页…</span></span>
  <span class="riko-spinner riko-spinner--ice" role="status"><span class="riko-spinner__label riko-u-sr-only">加载中</span></span>
  <span class="riko-spinner riko-spinner--dots" role="status">
    <span class="riko-spinner__dot"></span><span class="riko-spinner__dot"></span><span class="riko-spinner__dot"></span>
    <span class="riko-spinner__label">络可正在画画…</span>
  </span>
</div>
```

**示例 · 大号**

```html
<span class="riko-spinner riko-spinner--lg" role="status"><span class="riko-spinner__label">正在打开笔记本…</span></span>
```

### 轻提示 Toast `toast`

由 JS 弹出、几秒后自动消失的通知卡片；悬停/聚焦时暂停计时，可带操作按钮。

**何时用**：操作结果的短暂反馈（已保存、已复制、发送失败）。需要用户确认用 Riko.confirm；需要长期显示用 alert。

**根**：`riko-toast`（推荐 `<div>`）

**部件**：
- `riko-toaster` 固定定位的容器（自动创建），data-position 决定位置
- `riko-toast__icon` 色调图标（自动）
- `riko-toast__content` 文字容器
- `riko-toast__title` 标题
- `riko-toast__message` 消息
- `riko-toast__action` 操作按钮（如「撤销」）
- `riko-toast__close` 关闭按钮
- `riko-toast__timer` 底部倒计时条

**修饰**（同组互斥）：
- tone：`riko-toast--success` 成功；`riko-toast--warning` 警告；`riko-toast--danger` 错误（role=alert，立即播报）；`riko-toast--accent` 橙色强调

**状态**：
- `data-state="closing"` 离场动画中

**JS**：
- 选项 `data-riko-toast`（消息文字）：声明式：点击该元素弹出 toast
- 选项 `data-riko-toast-tone`（info | success | warning | danger | accent） 默认 info：声明式色调
- 选项 `data-riko-toast-title`（文字）：声明式标题
- 方法 `Riko.toast(message | { title, message, tone, duration, action, icon, position, onClose })`：弹出提示，返回 { el, close() }。duration 默认 4000ms，0 为不自动关闭；action = { label, onClick(close), close?: false }；icon 为 Lucide 图标名
- 方法 `Riko.toast.success(message, options?) / .warning / .danger / .info / .accent`：带色调的快捷方法
- 方法 `Riko.toast.configure({ position, max, duration })`：全局配置：position 为 top-right | top-center | top-left | bottom-right（默认）| bottom-center | bottom-left；max 同时最多显示条数（默认 4）
- 方法 `Riko.toast.clear()`：关闭全部

**无障碍**：
- 容器自带 aria-live="polite"；danger 色调使用 role="alert" 立即播报。
- 不要用 toast 承载唯一的关键信息或必须完成的操作——它会自动消失。

**要点**：
- ✓ 签名：Riko.toast(message | { title, message, tone, duration, action, icon, position, onClose })；快捷方法 Riko.toast.success(message, { title, duration, … }) 的第二个参数接受除 tone 外的全部选项。
- ✓ 用 Riko.toast() 创建，不要手写 riko-toast 结构放进页面。
- ✓ 消息控制在一句话内；需要撤销时用 action。
- ✓ 简单场景可直接写 data-riko-toast 属性，无需 JS。

**避免**：
- ✗ 不要同时连续弹出大量 toast。
- ✗ 不要把 duration 设得太短（< 2500ms）导致来不及阅读。

**示例 · 声明式触发**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn" data-riko-toast="书签已经夹好啦～">普通</button>
  <button type="button" class="riko-btn" data-riko-toast="笔记已保存" data-riko-toast-tone="success">成功</button>
  <button type="button" class="riko-btn" data-riko-toast="还有内容没写完哦" data-riko-toast-tone="warning">警告</button>
  <button type="button" class="riko-btn" data-riko-toast="网络开小差了，请重试" data-riko-toast-title="发送失败" data-riko-toast-tone="danger">错误</button>
</div>
```

**示例 · JS 调用（带撤销）**

```html
<button type="button" class="riko-btn riko-btn--primary" id="toast-demo-undo">删除这条书签</button>
<script>
  document.getElementById('toast-demo-undo').addEventListener('click', () => {
    Riko.toast({
      title: '书签已删除',
      message: '「月下清辉，暗见净化」',
      tone: 'accent',
      duration: 6000,
      action: { label: '撤销', onClick: () => Riko.toast.success('已恢复书签') },
    });
  });
</script>
```

## 装饰

### 柔光背景 Glow `glow`

页面角落的冰蓝与暖橙柔光（fixed，不影响布局）。

**何时用**：每个页面放一个即可。

**根**：`riko-glow`

**无障碍**：
- 加 aria-hidden="true"。

**示例 · 基础**

```html
<div class="riko-glow" aria-hidden="true"></div>
```

### 便利贴 Note `note`

略微倾斜、右下角折页的便利贴。

**何时用**：温馨提示、作者的话、小贴士。

**根**：`riko-note`（推荐 `<aside>`）

**修饰**（同组互斥）：
- tone：`riko-note--ice` 冰蓝；`riko-note--accent` 浅橙

**示例 · 基础**

```html
<aside class="riko-note">
  记得先读完第一幕再翻笔记本哦～
</aside>
```

### 笔记本纸 Notebook `notebook`

左侧装订孔 + 橙色页边线，可选横线格。

**何时用**：目录、笔记、设定集等面板。

**根**：`riko-notebook`

**修饰**（同组互斥）：
- variant：`riko-notebook--lined` 横线格

**示例 · 基础**

```html
<div class="riko-notebook">
  <h3 class="riko-h4">络可的笔记本</h3>
  <p>这里记下了世界的设定。</p>
</div>
```

**示例 · 横线格**

```html
<div class="riko-notebook riko-notebook--lined">
  <p>今天学会了画海豚。</p>
  <p>明天想去村庄看看。</p>
</div>
```

### 格纹背景 Plaid `plaid`

络可裙摆般的淡格纹背景。

**何时用**：加在 <body> 或大面积背景块上。

**根**：`riko-plaid`

**示例 · 页面背景**

```html
<body class="riko-plaid">…</body>
```

### 扇贝花边 Scallop `scallop`

色块顶部（或底部）的圆弧花边。

**何时用**：页脚顶边、分区色块。

**根**：`riko-scallop`

**修饰**（同组互斥）：
- layout：`riko-scallop--bottom` 花边朝下（在底部）

**要点**：
- ✓ 花边颜色默认 --riko-color-surface-muted，需与色块背景一致；可用 --riko-scallop-color 修改。

**示例 · 页脚顶边**

```html
<footer class="riko-scallop" style="background: var(--riko-color-surface-muted); padding: var(--riko-space-8);">…</footer>
```

### 漂浮星星 Sky `sky`

背景中缓慢闪烁的小星星（最多 7 颗位置预设）。

**何时用**：首页、空状态等需要童话氛围的页面。

**根**：`riko-sky`

**示例 · 基础**

```html
<div class="riko-sky" aria-hidden="true">
  <span class="riko-star"></span><span class="riko-star"></span><span class="riko-star"></span>
  <span class="riko-star"></span><span class="riko-star"></span>
</div>
```

### 波浪下划线 Squiggle `squiggle`

手绘感的橙色波浪线。

**何时用**：大标题下方的点缀。

**根**：`riko-squiggle`

**修饰**（同组互斥）：
- tone：`riko-squiggle--ice` 冰蓝
- layout：`riko-squiggle--center` 居中

**要点**：
- ✓ 长度用 --riko-squiggle-w（默认 200px）。

**示例 · 标题下方**

```html
<h1 class="riko-display">《络的世界》</h1>
<span class="riko-squiggle" aria-hidden="true"></span>
```

### 贴纸 Sticker `sticker`

倾斜的手写体小贴纸标签。

**何时用**：点缀"NEW""连载中"等氛围文字。

**根**：`riko-sticker`（推荐 `<span>`）

**修饰**（同组互斥）：
- tone：`riko-sticker--accent` 橙色；`riko-sticker--ice` 冰蓝

**示例 · 基础**

```html
<span class="riko-sticker riko-sticker--accent"><span class="riko-star" aria-hidden="true"></span>NEW!</span>
```

### 缝线内框 Stitched `stitched`

在有背景的块内画一圈虚线缝线（像布艺/裙摆的走线）。

**何时用**：卡片、面板、引用框等需要手作感时。

**根**：`riko-stitched`

**要点**：
- ✓ 内缩距离 --riko-stitch-inset（默认 9px），圆角 --riko-stitch-radius。
- ✓ 会设置 position: relative 与 isolation，注意别再覆盖。

**避免**：
- ✗ 不要再给宿主元素写 position: static——缝线依赖宿主的定位，否则会铺满整个页面。

**示例 · 基础**

```html
<div class="riko-stitched" style="padding: var(--riko-space-6); background: var(--riko-color-surface); border-radius: var(--riko-radius-wobble);">缝线内框</div>
```

### 胶带 Tape `tape`

贴在卡片/照片顶部的半透明条纹胶带。

**何时用**：拍立得、便签、阅读页纸张顶部。

**根**：`riko-tape`

**修饰**（同组互斥）：
- layout：`riko-tape--left` 左上角斜贴；`riko-tape--right` 右上角斜贴
- tone：`riko-tape--accent` 橙色胶带

**要点**：
- ✓ 父元素需要 position: relative。

**示例 · 贴在卡片上**

```html
<div class="riko-card" style="position: relative;">
  <span class="riko-tape" aria-hidden="true"></span>
  …
</div>
```

### 轻微倾斜 Tilt `tilt`

让元素微微倾斜，悬停时回正。

**何时用**：照片、卡片墙的错落感。

**根**：`riko-tilt`

**修饰**（同组互斥）：
- variant：`riko-tilt--left` 向左倾斜

**要点**：
- ✓ 角度变量 --riko-tilt。

**示例 · 错落的卡片**

```html
<div class="riko-grid riko-grid--cols-2">
  <article class="riko-card riko-tilt">
    <h3 class="riko-card__title">向右歪一点</h3>
    <p class="riko-card__body">悬停时会轻轻回正。</p>
  </article>
  <article class="riko-card riko-tilt riko-tilt--left">
    <h3 class="riko-card__title">向左歪一点</h3>
    <p class="riko-card__body">像随手贴在墙上的卡片。</p>
  </article>
</div>
```

## 自检

```sh
npx riko-ui check src/        # 或具体文件；--json 输出机器可读结果
```
检查项：未知类名（并给出最接近的正确写法）、修饰类缺少根类、部件修饰、部件不在根内、同组修饰冲突、状态类、未知 data-riko、组件必需结构/属性/元素、仅图标按钮缺 aria-label、img 缺 alt、内联写死颜色；语义警告：一页多个 h1、同组多个主按钮。

确有需要时，在元素上写 `data-riko-ignore="规则名"`（空值表示全部规则）可跳过该元素及其子树的检查，例如第三方生成的 HTML。
