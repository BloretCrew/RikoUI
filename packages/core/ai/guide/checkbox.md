<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 复选框 Checkbox `checkbox`

原生 checkbox 美化：勾选时橙色小方块弹出对勾，支持半选与卡片样式。

**何时用**：多选、同意条款、可独立开关的选项（立即生效的设置更适合 switch）。

**根**：`riko-checkbox`（推荐 `<label>`）

**部件**：
- `riko-checkbox__text` 标题 + 说明的文字容器
- `riko-checkbox__desc` 说明小字（放在 __text 内）

**修饰**（同组互斥）：
- size：`riko-checkbox--sm` 小号；`riko-checkbox--lg` 大号
- variant：`riko-checkbox--card` 可选卡片

**状态**：
- `checked`（在 `input`） 选中
- `disabled`（在 `input`） 禁用
- `indeterminate（JS 属性）`（在 `input`） 半选：input.indeterminate = true
- `aria-invalid="true"`（在 `input`） 校验失败

**无障碍**：
- 结构必须是 <label class="riko-checkbox"><input type="checkbox"> 文字</label>，点击文字即可勾选。
- 一组复选框放进 <fieldset class="riko-fieldset"> 并写 legend。

**要点**：
- ✓ input 必须是 label 的直接子元素。

**避免**：
- ✗ 不要隐藏原生 input 后用 div 模拟。

**示例 · 基础**

```html
<div class="riko-stack riko-stack--sm">
  <label class="riko-checkbox"><input type="checkbox" name="snack" checked> 星星酥</label>
  <label class="riko-checkbox"><input type="checkbox" name="snack"> 橘子汽水</label>
  <label class="riko-checkbox"><input type="checkbox" name="snack" disabled> 神秘点心（售罄）</label>
</div>
```

**示例 · 带说明与半选**

```html
<div class="riko-stack riko-stack--sm">
  <label class="riko-checkbox"><input type="checkbox" id="all-chapters"><span class="riko-checkbox__text">全部章节<span class="riko-checkbox__desc">已选择部分章节（半选状态由 JS 设置 indeterminate）</span></span></label>
  <label class="riko-checkbox riko-checkbox--sm"><input type="checkbox" checked> 小号复选框</label>
  <label class="riko-checkbox riko-checkbox--lg"><input type="checkbox"> 大号复选框</label>
</div>
```

**示例 · 卡片**

```html
<div class="riko-grid riko-grid--sm">
  <label class="riko-checkbox riko-checkbox--card"><input type="checkbox" checked><span class="riko-checkbox__text">更新提醒<span class="riko-checkbox__desc">新章节发布时通知我</span></span></label>
  <label class="riko-checkbox riko-checkbox--card"><input type="checkbox"><span class="riko-checkbox__text">设定集剧透<span class="riko-checkbox__desc">显示尚未出现的设定</span></span></label>
</div>
```

相关：[radio](radio.md)、[switch](switch.md)、[fieldset](fieldset.md)
