<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 主题选择器 Theme Picker `theme-picker`

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

相关：[dialog](dialog.md)、[button](button.md)
