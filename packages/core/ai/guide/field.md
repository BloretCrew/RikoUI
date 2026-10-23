<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 表单项 Field `field`

标签 + 控件 + 提示 / 错误 / 字数计数的标准组合，JS 自动处理无障碍关联。

**何时用**：表单中每个输入控件都建议包一层 riko-field。

**根**：`riko-field`（推荐 `<div>`）

**部件**：
- `riko-field__label` 标签（<label for>）（必需）
- `riko-field__required` 必填星号（aria-hidden，控件本身写 required）
- `riko-field__optional` 「选填」小字
- `riko-field__hint` 提示文字
- `riko-field__error` 错误信息；hidden 时隐藏，显示时控件自动 aria-invalid
- `riko-field__counter` 字数计数（内容由 JS 生成，读取控件 maxlength）
- `riko-field__footer` 把提示和计数放在同一行

**修饰**（同组互斥）：
- layout：`riko-field--inline` 标签在左、控件在右（窄屏自动上下排列）

**状态**：
- `hidden`（在 `riko-field__error`） 隐藏错误信息

**JS**：
- 启用：`data-riko="field"`
- 方法 `el.riko.setError(message)`：显示错误并标记控件 aria-invalid
- 方法 `el.riko.clearError()`：清除错误
- 方法 `el.riko.update()`：重新计算关联与计数

**无障碍**：
- 用 data-riko="field" 时，hint / error / counter 会自动通过 aria-describedby 关联到控件，错误信息带 aria-live。
- 必填项控件本身要写 required；星号只是视觉提示。

**要点**：
- ✓ 结构顺序：label → 控件 → hint / error / counter。
- ✓ 需要字数统计：控件写 maxlength，并放一个空的 <p class="riko-field__counter"></p>。

**避免**：
- ✗ 不要手写 aria-describedby 的 id 拼接，交给 data-riko="field"。
- ✗ 不要用红色文字类代替 riko-field__error。

**示例 · 标签 + 提示**

```html
<div class="riko-field" data-riko="field">
  <label class="riko-field__label" for="nickname">昵称<span class="riko-field__required" aria-hidden="true">*</span></label>
  <input class="riko-input" id="nickname" type="text" required placeholder="例如：小星星">
  <p class="riko-field__hint">小伙伴们会这样称呼你</p>
</div>
```

**示例 · 错误信息**

```html
<div class="riko-field" data-riko="field">
  <label class="riko-field__label" for="email">邮箱</label>
  <input class="riko-input" id="email" type="email" value="riko@">
  <p class="riko-field__error">邮箱好像少了点什么，再检查一下吧</p>
</div>
```

**示例 · 字数计数**

```html
<div class="riko-field" data-riko="field">
  <label class="riko-field__label" for="motto">个性签名<span class="riko-field__optional">（选填）</span></label>
  <textarea class="riko-textarea" id="motto" rows="2" maxlength="40">平凡日子里的一颗小星星</textarea>
  <div class="riko-field__footer">
    <p class="riko-field__hint">最多 40 个字</p>
    <p class="riko-field__counter"></p>
  </div>
</div>
```

**示例 · 横向标签**

```html
<div class="riko-field riko-field--inline" data-riko="field">
  <label class="riko-field__label" for="village">所在村庄</label>
  <input class="riko-input" id="village" type="text" value="HV 村">
  <p class="riko-field__hint">将显示在你的个人卡片上</p>
</div>
```

相关：[input](input.md)、[textarea](textarea.md)、[select](select.md)、[form](form.md)
