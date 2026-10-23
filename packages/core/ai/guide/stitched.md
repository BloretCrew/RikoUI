<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 缝线内框 Stitched `stitched`

在有背景的块内画一圈虚线缝线（像布艺/裙摆的走线）。

**何时用**：卡片、面板、引用框等需要手作感时。

**根**：`riko-stitched`

**要点**：
- ✓ 内缩距离 --riko-stitch-inset（默认 9px），圆角 --riko-stitch-radius。
- ✓ 会设置 position: relative 与 isolation，注意别再覆盖。

**避免**：
- ✗ 不要再给宿主元素写 position: static——缝线依赖宿主的定位，否则会铺满整个页面。

**示例 · 基础**

```html
<div class="riko-stitched" style="padding: var(--riko-space-6); background: var(--riko-color-surface); border-radius: var(--riko-radius-wobble);">缝线内框</div>
```
