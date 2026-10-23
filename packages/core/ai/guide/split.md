<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 侧栏布局 Split `split`

左侧（或右侧）固定宽度侧栏 + 主区；侧栏吸顶；窄屏变为上下。

**何时用**：阅读器、文档、后台、设置页。

**根**：`riko-split`（推荐 `<div>`）

**部件**：
- `riko-split__aside` 侧栏（sticky）（必需）
- `riko-split__main` 主区（必需）

**修饰**（同组互斥）：
- layout：`riko-split--reverse` 侧栏在右
- size：`riko-split--wide-aside` 侧栏 360px
- behavior：`riko-split--static` 侧栏不吸顶（内容区的右侧栏、后台卡片栏）

**要点**：
- ✓ 侧栏宽度可用 --riko-split-aside 覆盖。

**示例 · 阅读器布局**

```html
<div class="riko-split riko-container riko-container--wide">
  <aside class="riko-split__aside">…目录…</aside>
  <main class="riko-split__main">…正文…</main>
</div>
```
