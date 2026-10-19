<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 色块选择 Swatches `swatches`

基于单选框的圆形色块选择，选中时显示勾与描边。

**何时用**：选择主题色、标签颜色、画笔颜色等少量预设颜色。任意颜色用 <input class="riko-input" type="color">。

**根**：`riko-swatches`（推荐 `<div>`）

**部件**：
- `riko-swatches__item` <label>，用 style="--riko-swatch: …" 指定颜色（必需）
- `riko-swatches__input` <input type="radio">（视觉隐藏）（必需）
- `riko-swatches__color` 色块（必需）
- `riko-swatches__label` 颜色名（可加 riko-u-sr-only 只给读屏）

**修饰**（同组互斥）：
- size：`riko-swatches--sm` 小号；`riko-swatches--lg` 大号
- shape：`riko-swatches--square` 手绘圆角方块

**状态**：
- `checked`（在 `riko-swatches__input`） 选中
- `disabled`（在 `riko-swatches__input`） 不可选

**无障碍**：
- 根元素写 role="radiogroup" 与 aria-label；每个色块都要有颜色名（可视或 riko-u-sr-only）。

**要点**：
- ✓ 颜色优先用设计变量，例如 style="--riko-swatch: var(--riko-color-ice-strong)"。
- ✓ 结构顺序：input → color → label（勾选样式依赖相邻关系）。

**避免**：
- ✗ 不要只靠颜色区分而不提供名称。

**示例 · 基础用法**

```html
<div class="riko-swatches" role="radiogroup" aria-label="主题色">
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-accent)">
    <input class="riko-swatches__input" type="radio" name="color" value="star" checked>
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label">星星橙</span>
  </label>
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-ice-strong)">
    <input class="riko-swatches__input" type="radio" name="color" value="ice">
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label">冰蓝</span>
  </label>
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-primary)">
    <input class="riko-swatches__input" type="radio" name="color" value="cocoa">
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label">可可</span>
  </label>
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-success)">
    <input class="riko-swatches__input" type="radio" name="color" value="leaf">
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label">嫩叶</span>
  </label>
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-danger)">
    <input class="riko-swatches__input" type="radio" name="color" value="berry">
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label">莓果</span>
  </label>
</div>
```

**示例 · 小号方形（仅色块）**

```html
<div class="riko-swatches riko-swatches--sm riko-swatches--square" role="radiogroup" aria-label="画笔颜色">
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-tan)">
    <input class="riko-swatches__input" type="radio" name="brush" value="sand" checked>
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label riko-u-sr-only">沙滩</span>
  </label>
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-ice)">
    <input class="riko-swatches__input" type="radio" name="brush" value="sea">
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label riko-u-sr-only">海水</span>
  </label>
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-warning)">
    <input class="riko-swatches__input" type="radio" name="brush" value="sun">
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label riko-u-sr-only">阳光</span>
  </label>
  <label class="riko-swatches__item" style="--riko-swatch: var(--riko-color-brown)">
    <input class="riko-swatches__input" type="radio" name="brush" value="wood">
    <span class="riko-swatches__color"></span>
    <span class="riko-swatches__label riko-u-sr-only">木头</span>
  </label>
</div>
```

相关：[radio](radio.md)、[segmented](segmented.md)
