<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 轻微倾斜 Tilt `tilt`

让元素微微倾斜，悬停时回正。

**何时用**：照片、卡片墙的错落感。

**根**：`riko-tilt`

**修饰**（同组互斥）：
- variant：`riko-tilt--left` 向左倾斜

**要点**：
- ✓ 角度变量 --riko-tilt。

**示例 · 错落的卡片**

```html
<div class="riko-grid riko-grid--cols-2">
  <article class="riko-card riko-tilt">
    <h3 class="riko-card__title">向右歪一点</h3>
    <p class="riko-card__body">悬停时会轻轻回正。</p>
  </article>
  <article class="riko-card riko-tilt riko-tilt--left">
    <h3 class="riko-card__title">向左歪一点</h3>
    <p class="riko-card__body">像随手贴在墙上的卡片。</p>
  </article>
</div>
```
