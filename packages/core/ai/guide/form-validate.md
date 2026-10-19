<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 表单校验 Form Validate `form-validate`

基于浏览器原生约束的表单校验：失焦 / 提交时校验，把中文错误写入 riko-field__error、设置 aria-invalid，并聚焦第一个错误。

**何时用**：任何需要前端校验的 <form>。纯展示表单或由框架（如 React Hook Form）接管校验时不需要。

**状态**：
- `aria-invalid="true"`（在 `riko-input`） 校验失败的控件（JS 维护）
- `hidden`（在 `riko-field__error`） 无错误时隐藏（JS 维护）

**JS**：
- 启用：`data-riko="form-validate"`
- 选项 `data-riko-message-*`（required / type / pattern / minlength / maxlength / min / max / step / match） 默认 内置中文文案：写在控件上，自定义对应错误的提示，如 data-riko-message-required="请填写昵称"
- 选项 `data-riko-match`（选择器）：写在控件上：值必须与另一个控件相同（如确认密码），文案用 data-riko-message-match
- 选项 `data-riko-required`（布尔属性）：写在 riko-otp / riko-tags-input 上：必填
- 方法 `form.riko.validate()`：立即校验全部，返回错误数组 [{ control, message }]
- 方法 `form.riko.valid`：是否全部通过
- 方法 `form.riko.setError(control, message)`：手动设置错误（如服务端返回），message 为空则清除
- 方法 `form.riko.clear()`：清除所有错误
- 事件 `riko:form:invalid` detail { errors }：提交时有错误
- 事件 `riko:form:submit` detail { data: FormData }：校验通过、即将提交；调用 preventDefault() 可阻止原生提交（适合 AJAX）

**无障碍**：
- 错误信息自动 aria-live 并通过 aria-describedby 关联到控件。
- 每个控件都应放在 riko-field 内，并有 riko-field__label。

**要点**：
- ✓ 规则全部用原生属性：required、type="email"、minlength、pattern（配 title 作为提示）等。
- ✓ 错误显示在同一 riko-field 内；没有 riko-field__error 时会自动创建。
- ✓ AJAX 提交：监听 riko:form:submit，preventDefault() 后自行发送 e.detail.data。
- ✓ 事件 riko:form:submit / riko:form:invalid 在 <form> 元素上派发（会冒泡）：form.addEventListener("riko:form:submit", e => { e.preventDefault(); …AJAX…; Riko.toast.success("已提交"); form.reset(); })。
- ✓ form.reset() 会自动清除错误状态，字数计数（field）与自动增高（autosize）也会同步，无需手动调用。
- ✓ 必填下拉：<select required> 并以 <option value="">请选择…</option> 作为第一项（空值即视为未选）。
- ✓ 复选框/单选组的错误：把它们放进同一个 riko-field，错误写入该 field 的 riko-field__error（不存在时自动创建在 field 末尾，并通过 aria-describedby 关联）。

**避免**：
- ✗ 不要自己写 alert() 提示错误。
- ✗ 不要在 submit 事件里重复写一遍校验逻辑。

**示例 · 注册表单**

```html
<form class="riko-form" data-riko="form-validate" style="max-width: 460px">
  <div class="riko-field" data-riko="field">
    <label class="riko-field__label" for="reg-name">昵称<span class="riko-field__required" aria-hidden="true">*</span></label>
    <input class="riko-input" id="reg-name" name="name" required minlength="2" maxlength="12" placeholder="小伙伴们会这样称呼你">
  </div>
  <div class="riko-field" data-riko="field">
    <label class="riko-field__label" for="reg-mail">邮箱<span class="riko-field__required" aria-hidden="true">*</span></label>
    <input class="riko-input" id="reg-mail" name="email" type="email" required placeholder="riko@riko.land">
  </div>
  <div class="riko-field" data-riko="field">
    <label class="riko-field__label" for="reg-pwd">密码<span class="riko-field__required" aria-hidden="true">*</span></label>
    <input class="riko-input" id="reg-pwd" name="password" type="password" required minlength="8" autocomplete="new-password">
    <p class="riko-field__hint">至少 8 个字符</p>
  </div>
  <div class="riko-field" data-riko="field">
    <label class="riko-field__label" for="reg-pwd2">确认密码<span class="riko-field__required" aria-hidden="true">*</span></label>
    <input class="riko-input" id="reg-pwd2" name="password2" type="password" required data-riko-match="#reg-pwd" data-riko-message-match="两次输入的密码不一样哦" autocomplete="new-password">
  </div>
  <div class="riko-field">
    <span class="riko-field__label" id="reg-code-label">邀请码<span class="riko-field__required" aria-hidden="true">*</span></span>
    <div class="riko-otp riko-otp--sm" data-riko="otp" data-riko-length="4" data-riko-required aria-labelledby="reg-code-label">
      <input class="riko-otp__value" type="hidden" name="invite">
    </div>
  </div>
  <div class="riko-field">
    <label class="riko-checkbox"><input type="checkbox" name="agree" required data-riko-message-required="请先同意 HV 村规哦"> 我已阅读并同意 HV 村规</label>
  </div>
  <div class="riko-form__actions">
    <button type="reset" class="riko-btn riko-btn--ghost">重置</button>
    <button type="submit" class="riko-btn riko-btn--primary">加入 HV</button>
  </div>
</form>
```

**示例 · 必填下拉**

```html
<div class="riko-field">
  <label class="riko-field__label" for="role">角色类型</label>
  <select class="riko-select" id="role" name="role" required>
    <option value="">请选择…</option>
    <option>主要角色</option>
    <option>次要角色</option>
  </select>
</div>
```

相关：[field](field.md)、[form](form.md)、[input](input.md)、[otp](otp.md)
