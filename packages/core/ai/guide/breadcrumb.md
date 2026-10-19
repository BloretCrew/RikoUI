<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 面包屑 Breadcrumb `breadcrumb`

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

相关：[navbar](navbar.md)
