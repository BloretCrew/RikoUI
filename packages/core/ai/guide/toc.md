<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 页内目录 Table of Contents `toc`

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

相关：[sidenav](sidenav.md)、[backtop](backtop.md)
