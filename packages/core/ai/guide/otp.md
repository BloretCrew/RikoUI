<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 验证码输入 OTP Input `otp`

分格输入验证码：自动跳格、粘贴拆分、退格回退、短信自动填充，完整值同步到隐藏 input。

**何时用**：短信 / 邮箱验证码、邀请码、PIN。

**根**：`riko-otp`（推荐 `<div>`）

**部件**：
- `riko-otp__value` 隐藏 input（name 写在这里，随表单提交）（必需）
- `riko-otp__cell` 单个输入格（JS 生成）
- `riko-otp__sep` 分隔短线（data-riko-split 时生成）

**修饰**（同组互斥）：
- size：`riko-otp--sm` 小号；`riko-otp--lg` 大号

**状态**：
- `data-state="complete"` 已填满（JS 维护）
- `aria-invalid="true"` 错误状态

**JS**：
- 启用：`data-riko="otp"`
- 选项 `data-riko-length`（数字） 默认 6：位数
- 选项 `data-riko-type`（numeric | alphanumeric） 默认 numeric：字符类型（字母自动转大写）
- 选项 `data-riko-split`（数字） 默认 0：在第 N 位后加分隔线
- 选项 `data-riko-required`（布尔属性）：配合 form-validate：必须填满
- 方法 `el.riko.value`：当前值
- 方法 `el.riko.set(value)`：设置值
- 方法 `el.riko.clear()`：清空并聚焦第一格
- 方法 `el.riko.focus()`：聚焦第一个空格
- 事件 `riko:otp:change` detail { value }：任一格变化
- 事件 `riko:otp:complete` detail { value }：全部填满时（适合自动提交）

**无障碍**：
- 根元素需要 aria-label 或 aria-labelledby（自动设为 role=group）；每格自动带「第 N 位，共 M 位」。

**要点**：
- ✓ 只写一个隐藏的 input.riko-otp__value，输入格交给 JS 生成。
- ✓ 第一格自动带 autocomplete="one-time-code"，手机可直接填入短信验证码。

**避免**：
- ✗ 不要手写 6 个 input。

**示例 · 6 位数字**

```html
<div class="riko-otp" data-riko="otp" data-riko-length="6" aria-label="短信验证码">
  <input class="riko-otp__value" type="hidden" name="code">
</div>
```

**示例 · 字母数字 · 中间分隔**

```html
<div class="riko-otp riko-otp--sm" data-riko="otp" data-riko-length="6" data-riko-split="3" data-riko-type="alphanumeric" aria-label="邀请码">
  <input class="riko-otp__value" type="hidden" name="invite">
</div>
```

相关：[form-validate](form-validate.md)、[input](input.md)
