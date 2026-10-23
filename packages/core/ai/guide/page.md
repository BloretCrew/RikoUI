<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 页面外壳 Page `page`

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
