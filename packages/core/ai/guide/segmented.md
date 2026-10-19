<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 分段选择 Segmented Control `segmented`

胶囊形的单选按钮组，选中项橙色并带回弹动画。

**何时用**：2–5 个短选项的互斥切换（视图、排序、字号等）。

**根**：`riko-segmented`（推荐 `<div>`）

**部件**：
- `riko-segmented__item` 选项（<label>，内含隐藏的 radio）（必需）

**修饰**（同组互斥）：
- size：`riko-segmented--sm` 小号；`riko-segmented--lg` 大号
- layout：`riko-segmented--block` 撑满宽度、平分
- variant：`riko-segmented--ice` 冰蓝选中色

**状态**：
- `checked`（在 `input`） 选中项
- `disabled`（在 `input`） 禁用某项

**无障碍**：
- 容器写 role="radiogroup" 与 aria-label；方向键切换由原生 radio 提供。

**要点**：
- ✓ 每项：<label class="riko-segmented__item"><input type="radio" name="组名" value="值">文字</label>。
- ✓ 可在文字前放 Lucide 图标。

**避免**：
- ✗ 不要用按钮组模拟需要提交值的单选。

**示例 · 基础**

```html
<div class="riko-segmented" role="radiogroup" aria-label="外观">
  <label class="riko-segmented__item"><input type="radio" name="look" value="day" checked><i data-lucide="sun"></i>白天</label>
  <label class="riko-segmented__item"><input type="radio" name="look" value="dusk"><i data-lucide="sunset"></i>黄昏</label>
  <label class="riko-segmented__item"><input type="radio" name="look" value="night"><i data-lucide="moon"></i>夜晚</label>
</div>
```

**示例 · 尺寸与色调**

```html
<div class="riko-stack riko-stack--sm">
  <div class="riko-segmented riko-segmented--sm riko-segmented--ice" role="radiogroup" aria-label="字号">
    <label class="riko-segmented__item"><input type="radio" name="size" value="s">小</label>
    <label class="riko-segmented__item"><input type="radio" name="size" value="m" checked>中</label>
    <label class="riko-segmented__item"><input type="radio" name="size" value="l">大</label>
  </div>
  <div class="riko-segmented riko-segmented--block" role="radiogroup" aria-label="排序">
    <label class="riko-segmented__item"><input type="radio" name="order" value="new" checked>最新</label>
    <label class="riko-segmented__item"><input type="radio" name="order" value="hot">最热</label>
    <label class="riko-segmented__item"><input type="radio" name="order" value="old" disabled>最早</label>
  </div>
</div>
```

相关：[radio](radio.md)、[button-group](button-group.md)、[theme-picker](theme-picker.md)
