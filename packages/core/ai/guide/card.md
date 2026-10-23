<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 卡片 Card `card`

纸白底、手绘圆角的内容容器，可加缝线、胶带，或做成整卡可点击的入口。

**何时用**：承载一组相关内容（文章摘要、功能入口、个人资料）。只需要一行信息时用 list；需要大号统计数字时用 stat。

**根**：`riko-card`（推荐 `<article / a（可点击时）>`）

**部件**：
- `riko-card__media` 顶部（或横排时左侧）图片区，会贴边
- `riko-card__header` 顶部一行：图标 + 标签
- `riko-card__icon` 倾斜的方块图标
- `riko-card__tag` 让标签靠右的包裹类（可直接加在 riko-tag 上）
- `riko-card__title` 标题（标题字体）
- `riko-card__sub` 标题下的手写副标
- `riko-card__body` 正文，自动撑开剩余高度
- `riko-card__content` 横排卡片中的文字列
- `riko-card__footer` 底部操作区（虚线分隔）
- `riko-card__cta` 视觉上的「按钮」，仅用于可点击整卡内部
- `riko-card__actions` __header 右侧的操作区（下拉菜单、图标按钮）

**修饰**（同组互斥）：
- decor：`riko-card--stitched` 缝线内框；`riko-card--flat` 去阴影
- behavior：`riko-card--taped` 顶部胶带（会自动留出上边距）；`riko-card--interactive` 整卡可点击：悬停上浮微旋、右下角色团放大
- size：`riko-card--feature` 首页大入口卡：更大内边距、图标与标题；`riko-card--compact` 紧凑；`riko-card--lg` 大内边距（阅读纸张、文章正文）
- tone：`riko-card--soft` 米色底；`riko-card--ice` 冰蓝底；`riko-card--accent` 浅橙底
- layout：`riko-card--horizontal` 图文横排（窄屏自动变竖排）

**无障碍**：
- 整卡可点击时整张卡就是一个链接：用 <a class="riko-card riko-card--interactive" href>，卡片内部不要再放其他链接或按钮。
- __icon 中的图标是装饰，Lucide 图标会自动 aria-hidden。

**要点**：
- ✓ 普通卡片里的操作放在 __footer，用 riko-btn。
- ✓ 可点击卡片里的「开始阅读」用 <span class="riko-card__cta">，它只是视觉提示。
- ✓ 多张卡片用 riko-grid 排列，高度会自动对齐。
- ✓ 标签放在 __header 里，加 riko-card__tag 即可靠右。
- ✓ 头像/人物卡：把 riko-avatar 放在 __header 里（与 __tag 同行），名字写在 __title。
- ✓ 底部一组标签：<div class="riko-card__footer"><div class="riko-cluster riko-cluster--sm">…riko-tag…</div></div>。
- ✓ --stitched 与 --taped 可以同时使用（像贴着胶带的手作纸张）。

**避免**：
- ✗ 不要在 riko-card--interactive（<a>）里嵌套 <a> 或 <button>。
- ✗ 不要自己写阴影/圆角覆盖，改用 --flat / tone 修饰。

**示例 · 基础卡片**

```html
<div class="riko-grid">
  <article class="riko-card">
    <div class="riko-card__header">
      <span class="riko-card__icon"><i data-lucide="palette"></i></span>
      <span class="riko-tag riko-tag--ice riko-card__tag">设定</span>
    </div>
    <h3 class="riko-card__title">络可的画板</h3>
    <p class="riko-card__body">沙滩上的第一幅画，画的是碧空、大海和一只跃出水面的海豚。</p>
    <div class="riko-card__footer">
      <button type="button" class="riko-btn riko-btn--sm riko-btn--soft">查看设定</button>
    </div>
  </article>
  <article class="riko-card riko-card--stitched">
    <h3 class="riko-card__title">星星酥</h3>
    <p class="riko-card__sub">today's special</p>
    <p class="riko-card__body">HV 甜品店的招牌点心，酥脆香甜，今天还是特价哦。</p>
  </article>
  <article class="riko-card riko-card--taped">
    <h3 class="riko-card__title">今日便签</h3>
    <p class="riko-card__body">记得给 Star 哥哥带一份星星酥，再去钓鱼场看看。</p>
  </article>
</div>
```

**示例 · 可点击的大入口卡**

```html
<div class="riko-grid riko-grid--cols-2">
  <a class="riko-card riko-card--feature riko-card--interactive riko-card--stitched" href="#card">
    <div class="riko-card__header">
      <span class="riko-card__icon"><i data-lucide="book-open"></i></span>
      <span class="riko-tag riko-tag--accent riko-card__tag"><span class="riko-star" aria-hidden="true"></span>敬请期待后续更新！</span>
    </div>
    <h3 class="riko-card__title">《络的世界》</h3>
    <p class="riko-card__body">从沙滩上的第一幅画开始，跟随主角一同踏入这个世界的边缘与深处。</p>
    <span class="riko-card__cta">开始阅读</span>
  </a>
  <a class="riko-card riko-card--feature riko-card--interactive riko-card--stitched" href="#card">
    <div class="riko-card__header">
      <span class="riko-card__icon"><i data-lucide="notebook-pen"></i></span>
      <span class="riko-tag riko-tag--ice riko-tag--dashed riko-card__tag">设定集 · 未完成</span>
    </div>
    <h3 class="riko-card__title">络可的笔记本</h3>
    <p class="riko-card__body">小说中已出现设定的整理与解释。建议先阅读已更新章节后再翻阅，避免剧透。</p>
    <span class="riko-card__cta">翻阅笔记本</span>
  </a>
</div>
```

**示例 · 带图片与横排**

```html
<div class="riko-stack riko-stack--lg">
  <article class="riko-card" style="max-width: 320px">
    <div class="riko-card__media"><img src="https://riko.land/assets/logo.jpg" alt="《络的世界》封面"></div>
    <h3 class="riko-card__title">络的世界</h3>
    <p class="riko-card__body">一个关于画笔、星星与归途的故事。</p>
  </article>
  <article class="riko-card riko-card--horizontal">
    <div class="riko-card__media"><img src="https://riko.land/assets/logo.jpg" alt="《络的世界》封面"></div>
    <div class="riko-card__content">
      <h3 class="riko-card__title">第一章 · 第五幕</h3>
      <p class="riko-card__sub">落星摇曳，清风回荡</p>
      <p class="riko-card__body">风过围垣，落星回响。少年脖颈上的流星项链轻轻摇曳，像一颗真正的落星。</p>
      <div class="riko-card__footer">
        <span class="riko-tag riko-tag--sm">17 节</span>
        <span class="riko-tag riko-tag--sm riko-tag--accent">最新</span>
      </div>
    </div>
  </article>
</div>
```

**示例 · 色调与紧凑**

```html
<div class="riko-grid" style="--riko-grid-min: 200px">
  <article class="riko-card riko-card--soft riko-card--compact">
    <h3 class="riko-card__title">米色</h3>
    <p class="riko-card__body">像旧纸张一样温柔。</p>
  </article>
  <article class="riko-card riko-card--ice riko-card--compact">
    <h3 class="riko-card__title">冰蓝</h3>
    <p class="riko-card__body">边界之地的蓝色屏障。</p>
  </article>
  <article class="riko-card riko-card--accent riko-card--compact">
    <h3 class="riko-card__title">暖橙</h3>
    <p class="riko-card__body">贝雷帽上的小星星。</p>
  </article>
  <article class="riko-card riko-card--flat riko-card--compact">
    <h3 class="riko-card__title">无阴影</h3>
    <p class="riko-card__body">适合嵌在其他容器里。</p>
  </article>
</div>
```

**示例 · 人物卡（头像 + 标签组）**

```html
<article class="riko-card riko-card--stitched">
  <div class="riko-card__header">
    <span class="riko-avatar riko-avatar--ring"><img src="https://riko.land/assets/logo.jpg" alt=""></span>
    <span class="riko-tag riko-tag--accent riko-card__tag">主角</span>
  </div>
  <h3 class="riko-card__title">络可</h3>
  <p class="riko-card__sub">little painter</p>
  <p class="riko-card__body">喜欢画画的小女孩，戴着带星星的贝雷帽。</p>
  <div class="riko-card__footer">
    <div class="riko-cluster riko-cluster--sm">
      <span class="riko-tag riko-tag--sm">画家</span>
      <span class="riko-tag riko-tag--sm riko-tag--ice">HV 村</span>
    </div>
  </div>
</article>
```

相关：[list](list.md)、[stat](stat.md)、[tag](tag.md)、[polaroid](polaroid.md)
