<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 输入框 Input `input`

单行文本输入，统一美化 text / email / password / number / date / time / color / file 等原生类型。

**何时用**：任何单行输入。需要标签和提示时包进 riko-field；需要前后缀或按钮时包进 riko-input-group。

**根**：`riko-input`（推荐 `<input>`）

**修饰**（同组互斥）：
- size：`riko-input--sm` 小号；`riko-input--lg` 大号
- shape：`riko-input--round` 胶囊形（搜索框常用）

**状态**：
- `disabled` 禁用
- `readonly` 只读：虚线边框
- `aria-invalid="true"` 校验失败：红色边框（配合 riko-field__error）

**无障碍**：
- 每个输入框都要有可见的 <label for> 或 aria-label。
- 错误时设置 aria-invalid="true"，并用 aria-describedby 关联错误文字（riko-field 会自动处理）。

**要点**：
- ✓ 选对 type（email、tel、number…）以获得合适的移动端键盘。
- ✓ 外观已统一，不需要再给原生日期/文件控件写样式。
- ✓ 日期类（date / datetime-local / month / week）的 riko-input 若未写 max，Riko 会自动设为 9999 年上限，防止浏览器允许输入 5–6 位年份；需要更严格的范围请自己写 min / max。

**避免**：
- ✗ 不要用 placeholder 代替 label。
- ✗ 不要直接改 border-color 表示错误，用 aria-invalid。

**示例 · 基础**

```html
<input class="riko-input" type="text" placeholder="给你的画起个名字吧…" aria-label="画作名称">
```

**示例 · 尺寸与形状**

```html
<div class="riko-stack riko-stack--sm">
  <input class="riko-input riko-input--sm" type="text" placeholder="小号输入框" aria-label="小号">
  <input class="riko-input" type="text" placeholder="默认输入框" aria-label="默认">
  <input class="riko-input riko-input--lg" type="text" placeholder="大号输入框" aria-label="大号">
  <input class="riko-input riko-input--round" type="search" placeholder="胶囊搜索框" aria-label="搜索">
</div>
```

**示例 · 状态**

```html
<div class="riko-stack riko-stack--sm">
  <input class="riko-input" type="email" value="riko@bloret" aria-invalid="true" aria-label="邮箱">
  <input class="riko-input" type="text" value="只读：百络谷" readonly aria-label="只读">
  <input class="riko-input" type="text" placeholder="不可用" disabled aria-label="不可用">
</div>
```

**示例 · 原生类型**

```html
<div class="riko-grid riko-grid--sm">
  <input class="riko-input" type="date" aria-label="日期">
  <input class="riko-input" type="time" value="08:00" aria-label="时间">
  <input class="riko-input" type="number" value="76" min="1" aria-label="章节号">
  <input class="riko-input" type="password" value="starcake" aria-label="密码">
  <input class="riko-input" type="color" value="#F2994A" aria-label="颜色">
  <input class="riko-input" type="file" aria-label="上传画稿">
</div>
```

相关：[field](field.md)、[input-group](input-group.md)、[textarea](textarea.md)、[select](select.md)
