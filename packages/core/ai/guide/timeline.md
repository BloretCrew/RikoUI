<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 时间轴 Timeline `timeline`

按时间顺序排列的事件，虚线串联，节点可以是小圆点或星星。

**何时用**：更新日志、故事年表、进度记录。表示流程步骤（可操作）用 steps。

**根**：`riko-timeline`（推荐 `<ol>`）

**部件**：
- `riko-timeline__item` 一个事件（li）
- `riko-timeline__dot` 节点（内部可放 riko-star 变成星星）
- `riko-timeline__content` 右侧内容列
- `riko-timeline__time` 时间（手写体，建议用 <time>）
- `riko-timeline__title` 标题
- `riko-timeline__body` 描述

**修饰**（同组互斥）：
- layout：`riko-timeline--alternate` 宽屏左右交替

**状态**：
- `aria-current="step"`（在 `riko-timeline__item`） 当前/最新节点高亮

**无障碍**：
- 用有序列表 <ol>；时间用 <time datetime="…">。

**要点**：
- ✓ 节点换成星星：<span class="riko-timeline__dot"><span class="riko-star" aria-hidden="true"></span></span>。

**避免**：
- ✗ 不要省略 __content 包裹，否则布局会错位。

**示例 · 更新日志**

```html
<ol class="riko-timeline" style="max-width: 520px">
  <li class="riko-timeline__item" aria-current="step">
    <span class="riko-timeline__dot"></span>
    <div class="riko-timeline__content">
      <time class="riko-timeline__time" datetime="2026-10-15">2026.10.15</time>
      <h3 class="riko-timeline__title">更新第 076 节</h3>
      <p class="riko-timeline__body">风过围垣，落星回响 —— 第一章完结！</p>
    </div>
  </li>
  <li class="riko-timeline__item">
    <span class="riko-timeline__dot"><span class="riko-star" aria-hidden="true"></span></span>
    <div class="riko-timeline__content">
      <time class="riko-timeline__time" datetime="2026-07-01">2026.07.01</time>
      <h3 class="riko-timeline__title">官方网站上线</h3>
      <p class="riko-timeline__body">小说阅读器与络可的笔记本同步开放。</p>
    </div>
  </li>
  <li class="riko-timeline__item">
    <span class="riko-timeline__dot"></span>
    <div class="riko-timeline__content">
      <time class="riko-timeline__time" datetime="2026-02-16">2026.02.16</time>
      <h3 class="riko-timeline__title">沙滩上的画家</h3>
      <p class="riko-timeline__body">故事从这里开始。</p>
    </div>
  </li>
</ol>
```

**示例 · 左右交替**

```html
<ol class="riko-timeline riko-timeline--alternate">
  <li class="riko-timeline__item">
    <span class="riko-timeline__dot"></span>
    <div class="riko-timeline__content"><span class="riko-timeline__time">序章</span><h3 class="riko-timeline__title">沙滩上的画家</h3><p class="riko-timeline__body">络可在边界之地作画。</p></div>
  </li>
  <li class="riko-timeline__item">
    <span class="riko-timeline__dot"><span class="riko-star" aria-hidden="true"></span></span>
    <div class="riko-timeline__content"><span class="riko-timeline__time">序章</span><h3 class="riko-timeline__title">涅槃的天使</h3><p class="riko-timeline__body">幽蓝重生，裁决降临。</p></div>
  </li>
  <li class="riko-timeline__item">
    <span class="riko-timeline__dot"></span>
    <div class="riko-timeline__content"><span class="riko-timeline__time">第一章</span><h3 class="riko-timeline__title">自晨曦中归来</h3><p class="riko-timeline__body">破空而来的归乡之箭。</p></div>
  </li>
</ol>
```

相关：[steps](steps.md)、[list](list.md)
