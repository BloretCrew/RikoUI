<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 侧边目录 Side Nav `sidenav`

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

相关：[toc](toc.md)、[navbar](navbar.md)、[list](list.md)
