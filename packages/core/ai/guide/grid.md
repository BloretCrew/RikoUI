<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 栅格 Grid `grid`

自适应栅格：按最小列宽自动排列，或固定 2/3/4/6 列（小屏自动减少）。

**何时用**：卡片网格、统计面板、相册。

**根**：`riko-grid`（推荐 `<div>`）

**部件**：
- `riko-grid__span-2` 占 2 列（窄屏自动整行）
- `riko-grid__span-3` 占 3 列（窄屏自动整行）
- `riko-grid__span-full` 占满整行

**修饰**（同组互斥）：
- layout：`riko-grid--cols-2` 两列；`riko-grid--cols-3` 三列；`riko-grid--cols-4` 四列（≤1024px 两列，≤420px 一列）；`riko-grid--cols-6` 六列
- size：`riko-grid--sm` 小间距；`riko-grid--lg` 大间距

**要点**：
- ✓ 默认自适应列：最小列宽 240px，可用 style="--riko-grid-min: 180px" 调整。

**避免**：
- ✗ 不要写 style="grid-column: span 2"，窄屏会撑出隐式列导致溢出，请用 riko-grid__span-2。

**示例 · 自适应**

```html
<div class="riko-grid">
  <article class="riko-card">…</article>
  <article class="riko-card">…</article>
  <article class="riko-card">…</article>
</div>
```
