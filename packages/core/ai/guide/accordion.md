<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 折叠面板 Accordion `accordion`

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

相关：[tree](tree.md)、[sidenav](sidenav.md)
