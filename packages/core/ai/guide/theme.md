<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 主题与深色模式 Theme `theme`

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

相关：[theme-picker](theme-picker.md)
