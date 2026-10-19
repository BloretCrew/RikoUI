<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 导航栏 Navbar `navbar`

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

相关：[sidenav](sidenav.md)、[footer](footer.md)、[button](button.md)、[theme-picker](theme-picker.md)
