<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 数字输入 Number `number`

带减 / 加按钮的数字输入，支持范围、步长、长按连续增减与键盘微调。

**何时用**：数量、页码、份数等小范围整数或固定步长的数值。大范围连续数值用 range（滑块）；只读数字展示用 stat。

**根**：`riko-number`（推荐 `<div>`）

**部件**：
- `riko-number__input` 原生 <input type="number">，min / max / step 写在它上面（必需）
- `riko-number__btn` 减 / 加按钮（data-step="down|up"），JS 自动生成，无需手写

**修饰**（同组互斥）：
- size：`riko-number--sm` 小号；`riko-number--lg` 大号
- shape：`riko-number--block` 占满容器宽度

**状态**：
- `disabled`（在 `riko-number__input`） 禁用整个控件
- `aria-invalid="true"`（在 `riko-number__input`） 错误状态（外框变红）

**JS**：
- 启用：`data-riko="number"`
- 方法 `el.riko.stepUp()`：按 step 增加一次
- 方法 `el.riko.stepDown()`：按 step 减少一次
- 方法 `el.riko.set(value)`：设置数值（自动夹在 min / max 之间）
- 方法 `el.riko.value`：当前数值
- 事件 `riko:number:change` detail { value }：数值通过按钮或键盘改变时派发；同时会触发原生 input / change 事件

**无障碍**：
- 输入框需要可访问名称：用 riko-field__label 的 <label for>，或 aria-label。
- 加减按钮不进入 Tab 顺序，键盘用户在输入框内用 ↑↓ / PageUp / PageDown / Home / End 调整。

**要点**：
- ✓ 只写一个 input.riko-number__input，按钮交给 JS 生成。
- ✓ min / max / step / value 写在 input 上，小数步进（如 0.5）会自动保留小数位。

**避免**：
- ✗ 不要再给 input 加 riko-input 类（外框由 riko-number 提供）。
- ✗ 不要用 type="text" 自己做数字校验。

**示例 · 基础用法**

```html
<div class="riko-number" data-riko="number">
  <input class="riko-number__input" type="number" min="1" max="12" step="1" value="3" aria-label="星星酥数量">
</div>
```

**示例 · 尺寸与小数步进**

```html
<div class="riko-cluster">
  <div class="riko-number riko-number--sm" data-riko="number">
    <input class="riko-number__input" type="number" min="0" max="5" step="0.5" value="2.5" aria-label="评分">
  </div>
  <div class="riko-number" data-riko="number">
    <input class="riko-number__input" type="number" min="0" max="99" value="7" aria-label="章节">
  </div>
  <div class="riko-number riko-number--lg" data-riko="number">
    <input class="riko-number__input" type="number" min="0" step="10" value="100" aria-label="绿宝石">
  </div>
</div>
```

**示例 · 放在表单项中**

```html
<div class="riko-field" data-riko="field" style="max-width: 280px">
  <label class="riko-field__label" for="ticket">船票张数</label>
  <div class="riko-number riko-number--block" data-riko="number">
    <input class="riko-number__input" id="ticket" type="number" min="1" max="6" value="2">
  </div>
  <p class="riko-field__hint">白桦木船最多能坐 6 个人哦</p>
</div>
```

相关：[field](field.md)、[range](range.md)、[input](input.md)
