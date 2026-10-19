<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 星星评分 Rating `rating`

品牌五角星评分：可选模式基于单选框（纯 CSS、可键盘操作），只读模式支持小数。

**何时用**：打分、满意度、喜爱程度。只展示数值时用 --readonly。

**根**：`riko-rating`（推荐 `<fieldset>`）

**部件**：
- `riko-rating__legend` <legend> 标题（可选，但需要可访问名称）
- `riko-rating__input` <input type="radio">，同一组 name 相同，按 1→5 顺序（必需）
- `riko-rating__star` <label for> 星星，内含 riko-u-sr-only 文字如「3 星」（必需）

**修饰**（同组互斥）：
- variant：`riko-rating--readonly` 只读展示（无子元素，用 style="--riko-rating-value: 3.5"）
- size：`riko-rating--sm` 小号；`riko-rating--lg` 大号

**状态**：
- `checked`（在 `riko-rating__input`） 当前分数
- `disabled` 禁用（加在 fieldset 上）

**无障碍**：
- 可选模式用 <fieldset> + <legend>（或 role="radiogroup" + aria-label），每颗星的 label 内放 riko-u-sr-only 的「N 星」。
- 只读模式写 role="img" 与 aria-label="评分 3.5 / 5"。

**要点**：
- ✓ input 与 label 交替书写：input → label → input → label …，顺序为 1 到 5。
- ✓ 星星颜色可通过 --riko-rating-on 覆盖。

**避免**：
- ✗ 不要倒序书写或用 flex-direction: row-reverse。
- ✗ 不要用 5 个 <button> 加 JS 模拟。

**示例 · 可选评分**

```html
<fieldset class="riko-rating">
  <legend class="riko-rating__legend">给这一章打个分吧</legend>
  <input class="riko-rating__input" type="radio" name="score" id="score-1" value="1">
  <label class="riko-rating__star" for="score-1"><span class="riko-u-sr-only">1 星</span></label>
  <input class="riko-rating__input" type="radio" name="score" id="score-2" value="2">
  <label class="riko-rating__star" for="score-2"><span class="riko-u-sr-only">2 星</span></label>
  <input class="riko-rating__input" type="radio" name="score" id="score-3" value="3">
  <label class="riko-rating__star" for="score-3"><span class="riko-u-sr-only">3 星</span></label>
  <input class="riko-rating__input" type="radio" name="score" id="score-4" value="4" checked>
  <label class="riko-rating__star" for="score-4"><span class="riko-u-sr-only">4 星</span></label>
  <input class="riko-rating__input" type="radio" name="score" id="score-5" value="5">
  <label class="riko-rating__star" for="score-5"><span class="riko-u-sr-only">5 星</span></label>
</fieldset>
```

**示例 · 只读展示与尺寸**

```html
<div class="riko-stack riko-stack--sm">
  <span class="riko-rating riko-rating--readonly riko-rating--sm" style="--riko-rating-value: 4.5" role="img" aria-label="评分 4.5 / 5"></span>
  <span class="riko-rating riko-rating--readonly" style="--riko-rating-value: 3.5" role="img" aria-label="评分 3.5 / 5"></span>
  <span class="riko-rating riko-rating--readonly riko-rating--lg" style="--riko-rating-value: 2" role="img" aria-label="评分 2 / 5"></span>
</div>
```

相关：[radio](radio.md)、[icon](icon.md)
