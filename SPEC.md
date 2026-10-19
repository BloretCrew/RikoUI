# Riko UI 框架规范（SPEC）

> 本文件是 Riko UI 的**唯一规范来源**。所有组件的 CSS、JS、文档、AI 清单都必须遵守。
> 面向使用者（含 AI）的说明见 `packages/core/ai/AI_GUIDE.md`，那份文件由本规范与组件清单生成/维护。

## 1. 设计语言

温馨、可爱、童话感的手绘风格：

- **色彩**：米色纸张底（cream / paper）、浅棕文字与描边（tan / brown / cocoa）、冰蓝点缀（ice）、暖橙五角星强调（star）。
- **形状**：不规则"手绘"圆角（`--riko-radius-wobble`）、虚线"缝线"内框、胶带、扇贝边、波浪下划线。
- **质感**：淡格纹背景、柔光晕、按钮底部 3px "实体阴影"（按下时下沉）。
- **动效**：轻微回弹（`--riko-ease-bounce`），悬停时上浮 2–6px 并带极小角度旋转；尊重 `prefers-reduced-motion`。
- **字体**：标题 ZCOOL XiaoWei，正文 Noto Sans SC，长文阅读 Noto Serif SC，手写点缀 Caveat。均有系统字体兜底。

## 2. 命名

| 类型 | 规则 | 例子 |
|---|---|---|
| 组件根 | `riko-<组件>` | `riko-btn`、`riko-card` |
| 组件部件 | `riko-<组件>__<部件>` | `riko-card__title`、`riko-tabs__list` |
| 修饰（变体/尺寸） | `riko-<组件>--<修饰>`，**必须与根类同时出现在同一元素上** | `riko-btn riko-btn--primary riko-btn--sm` |
| 布局原语 | `riko-<原语>` | `riko-stack`、`riko-cluster`、`riko-grid` |
| 工具类 | `riko-u-<作用>` | `riko-u-text-muted`、`riko-u-mt-4` |
| 设计变量 | `--riko-<分类>-<名>` | `--riko-color-accent`、`--riko-space-4` |
| 组件私有变量 | `--riko-<组件>-<名>` | `--riko-btn-bg` |
| JS 增强 | 根元素加 `data-riko="<组件>"` | `<div class="riko-tabs" data-riko="tabs">` |
| JS 触发器 | `data-riko-open="<id>"`、`data-riko-close`、`data-riko-toggle="<id>"` | `<button data-riko-open="dlg">` |

- 类名全部小写、用 `-` 连字；部件用 `__`，修饰用 `--`。不要嵌套部件名（✗ `riko-card__head__title`）。
- **修饰只能加在组件根上**，不允许部件修饰（✗ `riko-menu__item--danger`）。部件需要变体时，用属性表达（如 `data-tone="danger"`、`aria-current`），或在根上加修饰。
- 修饰的通用词汇（同一含义只用一个词）：
  - 外观：`--primary`（可可色实心）、`--accent`（橙色实心）、`--ice`（冰蓝）、`--soft`（浅底）、`--outline`、`--ghost`、`--link`
  - 语义色调：`--success`、`--warning`、`--danger`、`--info`
  - 尺寸：`--xs`、`--sm`、（默认 md 不写）、`--lg`、`--xl`
  - 形状：`--round`（圆形/胶囊）、`--square`、`--block`（占满宽度）
  - 装饰：`--stitched`（缝线内框）、`--taped`（胶带）、`--tilt`（轻微倾斜）、`--flat`（去阴影）

## 3. 状态：一律用原生属性 / ARIA，不用状态类

| 状态 | 写法 |
|---|---|
| 禁用 | `disabled`（表单控件）或 `aria-disabled="true"`（链接等） |
| 选中/按下 | `aria-pressed="true"`、`aria-selected="true"`、`aria-checked`、`aria-current="page"` |
| 展开 | `aria-expanded="true"`；面板用 `hidden` 隐藏 |
| 校验错误 | `aria-invalid="true"`，错误信息用 `aria-describedby` 关联 |
| 加载中 | `aria-busy="true"` |
| 打开（弹层） | 原生 `<dialog open>` / `[popover]` / `data-open` 由 JS 维护 |

CSS 选择器写作 `.riko-btn[aria-pressed="true"]`、`.riko-input[aria-invalid="true"]`。**禁止**出现 `.is-active`、`.active`、`.open` 这类状态类（JS 内部过渡用的 `data-state` 除外）。

## 4. 设计变量（tokens）

组件**只能**使用语义变量，不得写死颜色值（`#xxx`、`rgb()`），阴影/圆角/间距/时长同理。

- 颜色：`--riko-color-bg / surface / surface-sunken / surface-muted / fg / fg-strong / fg-muted / fg-subtle / border / border-strong / stitch / primary / primary-fg / primary-shade / accent / accent-soft / accent-fg / accent-ink / ice / ice-soft / ice-strong / ice-ink / success(-soft,-ink) / warning(-soft,-ink) / danger(-soft,-ink) / info(-soft,-ink) / overlay / focus`
- 间距：`--riko-space-0 … --riko-space-10`（0,4,8,12,16,20,24,32,40,48,64 px）
- 圆角：`--riko-radius-xs / sm / md / lg / xl / pill / wobble / wobble-sm / wobble-lg`
- 阴影：`--riko-shadow-sm / md / lg / press / press-accent / inset`
- 字体：`--riko-font-title / body / read / hand / mono`；字号 `--riko-text-xs … --riko-text-5xl`；行高 `--riko-leading-tight / normal / relaxed / read`
- 动效：`--riko-ease-out / bounce / linear`，`--riko-duration-fast / base / slow`
- 层级：`--riko-z-base / sticky / dropdown / overlay / modal / toast / tooltip`
- 控件尺寸：`--riko-control-h-sm / md / lg`（34 / 44 / 52px）

深色模式：`<html data-theme="dark">`。所有组件靠变量自动适配，**不得**在组件里写 `[data-theme="dark"]` 分支（确有必要时只改该组件的私有变量）。

## 5. CSS 组织

```
@layer riko.reset, riko.tokens, riko.base, riko.layout, riko.components, riko.decor, riko.utilities;
```

- 每个组件一个文件：`packages/core/src/css/components/<组件>.css`，整个文件包在 `@layer riko.components { … }` 中。
- 文件开头注释：组件名、中文名、结构示例。
- 组件私有变量写在根选择器上（如 `.riko-btn { --riko-btn-bg: …; }`），修饰类只改私有变量，便于用户覆盖。
- 选择器保持低特异性：最多「一个类 + 一个属性/伪类」，不用 `#id`、不用 `!important`。例外：reduced-motion，以及 JS 维护的短暂过渡状态（如 `[data-riko-dismissing]` 移除动画）需要压过任意组件时。
- 动画必须在 `@media (prefers-reduced-motion: reduce)` 下关闭或降级（base 层已全局处理，组件不需重复）。
- 响应式断点：`sm 520px`、`md 768px`、`lg 1024px`、`xl 1280px`（媒体查询中直接写数值）。
- 移动端触控目标 ≥ 40px。

## 6. JS 约定

- 原生 ES2022 模块，无依赖。入口 `src/js/index.js`，产出 ESM（`riko-ui.esm.js`）与 IIFE（`riko-ui.js`，全局 `window.Riko`）。
- 每个交互组件一个模块：`src/js/components/<组件>.js`，导出 `export default { name, selector, init(el), destroy?(el) }`，并在 `src/js/index.js` 中注册。
- **自动初始化**：页面加载后扫描 `[data-riko]`，并用 `MutationObserver` 处理之后插入的节点；同一元素只初始化一次（`el.__riko`）。框架（React/Vue）中也可手动 `Riko.init(root)`。
- 实例方法挂在元素上：`el.riko.open()`、`el.riko.close()` 等；同时派发事件 `riko:<组件>:<动作>`（如 `riko:dialog:open`、`riko:tabs:change`），`detail` 中带上下文。
- 全局 API：`Riko.init(root?)`、`Riko.theme`、`Riko.toast()`、`Riko.confirm()`、`Riko.dialog`、`Riko.highlight()` 等，见 `types/index.d.ts`。
- 通用工具在 `src/js/core/`：`dom.js`（查询/事件/uid）、`focus.js`（焦点陷阱、返回焦点）、`position.js`（浮层定位）、`store.js`（localStorage 安全读写）、`registry.js`（自动初始化）。
- JS 不得写内联样式颜色；状态改变只改属性（ARIA / hidden / data-state），样式交给 CSS。
- 没有 JS 时页面要尽量可用（渐进增强）：例如手风琴优先用 `<details>`，弹窗用原生 `<dialog>`。

## 7. 图标

- 官方图标库：**Lucide**（`<i data-lucide="star"></i>`，或 `lucide` 包的 SVG）。Riko 会在 `Riko.init()` 时自动调用已加载的 `lucide.createIcons()`。
- 组件中图标统一用 `.riko-icon` 或 Lucide 生成的 `svg.lucide`，尺寸默认 `1.15em`，描边宽 2，`currentColor`。
- 框架内部所需的少量图标（勾、叉、箭头、星、减号、搜索、加载）以 CSS mask 内置在 `icons.css` 中（`--riko-icon-<名>`），**不依赖** Lucide。
- 品牌星星：`<span class="riko-star"></span>`，支持 `riko-star--sm/lg/xl`、`riko-star--ice/muted`、`riko-star--twinkle`。

## 8. 无障碍（必须）

- 浅色与深色下，正文文字对比度 ≥ 4.5:1，大字/图形 ≥ 3:1（`npm run contrast` 校验 token 组合）。
- 所有交互可用键盘完成；焦点样式统一为 `--riko-focus-ring`（橙色虚线），不得移除。
- 仅图标按钮必须有 `aria-label`。
- 弹层：焦点陷阱、Esc 关闭、关闭后焦点返回触发元素；遵循 WAI-ARIA APG 对应模式（tabs、menu、combobox、dialog、tooltip、disclosure、listbox、slider…）。

## 9. 文档与 AI 清单（每个组件都要有）

1. **CSS**：`src/css/components/<组件>.css`
2. **JS**（如需）：`src/js/components/<组件>.js`
3. **清单**：`packages/core/ai/components/<组件>.json`，格式见 `packages/core/ai/components/_schema.json`
4. **文档演示**：所在分类的文档页 `docs/<分类>.html` 中的一个 `<section class="docs-section" id="<组件>">`，每个演示写在 `<div class="docs-demo">` 里——文档脚本会把演示的 HTML 原样显示为代码，所以**演示即标准写法**，必须规范、干净、可直接复制。

## 10. 质量门槛

- `npm run build` 无报错；`npm run check` 对 `docs/` 0 错误 0 警告；`npm test` 通过（类名与清单一致、清单字段完整）。
- 文档演示确需违反语义规则时（如展示全部标题级别），在 `.docs-demo` 上加 `data-riko-ignore="规则名"`。
- 每个组件在浅色、深色、窄屏（390px）下截图检查，无溢出、无错位、文字无缺字。
