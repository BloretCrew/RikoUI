<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 列表 List `list`

一行一条信息的列表，支持图标、手写编号、说明、元信息与操作，可做成可点击列表或小卡片网格。

**何时用**：消息、设置项、章节目录、文件列表等纵向条目。需要多列对比时用 table。

**根**：`riko-list`（推荐 `<ul / ol>`）

**部件**：
- `riko-list__item` 一行（li，或可点击时 li 内的 a / button）
- `riko-list__icon` 左侧圆角图标
- `riko-list__num` 左侧手写编号（如章节号 001）
- `riko-list__content` 中间文字列
- `riko-list__title` 标题
- `riko-list__desc` 说明
- `riko-list__meta` 右侧元信息（时间、数量）
- `riko-list__action` 右侧操作按钮区

**修饰**（同组互斥）：
- layout：`riko-list--divided` 行间虚线分隔；`riko-list--cards` 小卡片网格（如章节目录）
- behavior：`riko-list--interactive` 每行可点击：悬停高亮右移、右侧箭头

**状态**：
- `aria-current="page"`（在 `riko-list__item`） 可点击列表中的当前项（橙色高亮）

**无障碍**：
- 可点击列表中，可点击的是 li 内部的 <a class="riko-list__item"> 或 <button class="riko-list__item">，不要给 li 绑点击。
- 当前项用 aria-current="page"（导航）或 aria-current="true"。

**要点**：
- ✓ 非交互列表：<li class="riko-list__item">；交互列表：<li><a class="riko-list__item" href>…</a></li>。
- ✓ 章节目录：riko-list--cards riko-list--interactive + __num。

**避免**：
- ✗ --interactive 的行里不要再放其他按钮（会形成嵌套交互）；需要行内操作时不要加 --interactive，改用 __action。

**示例 · 基础列表**

```html
<ul class="riko-list riko-list--divided" style="max-width: 520px">
  <li class="riko-list__item">
    <span class="riko-list__icon"><i data-lucide="mail"></i></span>
    <div class="riko-list__content">
      <span class="riko-list__title">来自 111 的信</span>
      <span class="riko-list__desc">今晚的会议改到红石灯下开。</span>
    </div>
    <span class="riko-list__meta">3 分钟前</span>
  </li>
  <li class="riko-list__item">
    <span class="riko-list__icon"><i data-lucide="fish"></i></span>
    <div class="riko-list__content">
      <span class="riko-list__title">钓鱼场</span>
      <span class="riko-list__desc">第一竿：皮革靴子，第二竿：俩荷叶……</span>
    </div>
    <div class="riko-list__action">
      <button type="button" class="riko-btn riko-btn--sm riko-btn--ghost">再试一竿</button>
    </div>
  </li>
  <li class="riko-list__item">
    <span class="riko-list__icon"><i data-lucide="cookie"></i></span>
    <div class="riko-list__content">
      <span class="riko-list__title">甜品店</span>
      <span class="riko-list__desc">星星酥今日特价。</span>
    </div>
    <span class="riko-list__meta">昨天</span>
  </li>
</ul>
```

**示例 · 可点击列表**

```html
<ul class="riko-list riko-list--interactive" style="max-width: 420px">
  <li><a class="riko-list__item" href="#list"><span class="riko-list__num">001</span><span class="riko-list__content"><span class="riko-list__title">沙滩上的画家</span></span></a></li>
  <li><a class="riko-list__item" href="#list" aria-current="page"><span class="riko-list__num">002</span><span class="riko-list__content"><span class="riko-list__title">世界的边缘</span></span></a></li>
  <li><a class="riko-list__item" href="#list"><span class="riko-list__num">003</span><span class="riko-list__content"><span class="riko-list__title">熟悉的身影</span></span></a></li>
</ul>
```

**示例 · 小卡片网格**

```html
<ul class="riko-list riko-list--cards riko-list--interactive">
  <li><a class="riko-list__item" href="#list"><span class="riko-list__num">074</span><span class="riko-list__content"><span class="riko-list__title">夜出医庐，独巡残村</span></span></a></li>
  <li><a class="riko-list__item" href="#list"><span class="riko-list__num">075</span><span class="riko-list__content"><span class="riko-list__title">月下清辉，暗见净化</span></span></a></li>
  <li><a class="riko-list__item" href="#list"><span class="riko-list__num">076</span><span class="riko-list__content"><span class="riko-list__title">风过围垣，落星回响 <span class="riko-badge riko-badge--sm">最新</span></span></span></a></li>
</ul>
```

相关：[card](card.md)、[table](table.md)、[sidenav](sidenav.md)
