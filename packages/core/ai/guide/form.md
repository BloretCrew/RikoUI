<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 表单布局 Form `form`

表单整体排版：纵向或两列栅格，底部操作区。

**何时用**：任何 <form>。

**根**：`riko-form`（推荐 `<form>`）

**部件**：
- `riko-form__full` 在 --grid 中跨两列
- `riko-form__actions` 底部按钮区（虚线分隔，右对齐）

**修饰**（同组互斥）：
- layout：`riko-form--grid` 两列栅格（窄屏单列）
- behavior：`riko-form--compact` 紧凑间距

**无障碍**：
- 提交按钮用 type="submit"；错误信息用 riko-field__error 显示在对应控件下方。

**要点**：
- ✓ 表单项用 riko-field，分组用 riko-fieldset，按钮放 riko-form__actions。
- ✓ 主要按钮放在操作区最右侧。

**避免**：
- ✗ 不要用 <br> 或空 div 撑间距。

**示例 · 完整表单**

```html
<form class="riko-form riko-form--grid">
  <div class="riko-field" data-riko="field">
    <label class="riko-field__label" for="f-name">昵称<span class="riko-field__required" aria-hidden="true">*</span></label>
    <input class="riko-input" id="f-name" type="text" required placeholder="小星星">
  </div>
  <div class="riko-field" data-riko="field">
    <label class="riko-field__label" for="f-role">最喜欢的角色</label>
    <select class="riko-select" id="f-role">
      <option>络可</option>
      <option>Star</option>
    </select>
  </div>
  <div class="riko-field riko-form__full" data-riko="field">
    <label class="riko-field__label" for="f-msg">想对作者说的话</label>
    <textarea class="riko-textarea" id="f-msg" rows="3" maxlength="200" data-riko="autosize"></textarea>
    <p class="riko-field__counter"></p>
  </div>
  <fieldset class="riko-fieldset riko-fieldset--inline">
    <legend class="riko-fieldset__legend">订阅</legend>
    <label class="riko-checkbox"><input type="checkbox" checked> 章节更新</label>
    <label class="riko-checkbox"><input type="checkbox"> 设定集</label>
  </fieldset>
  <div class="riko-form__actions">
    <button type="reset" class="riko-btn riko-btn--ghost">重置</button>
    <button type="submit" class="riko-btn riko-btn--primary"><i data-lucide="send"></i>寄出信件</button>
  </div>
</form>
```

相关：[field](field.md)、[fieldset](fieldset.md)、[button](button.md)
