<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 主视觉 / 页头 Hero `hero`

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

相关：[section-head](section-head.md)、[polaroid](polaroid.md)、[squiggle](squiggle.md)
