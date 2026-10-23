<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 输入组 Input Group `input-group`

给输入框加前后缀文字、图标或内嵌按钮，整体一个边框。

**何时用**：网址前缀、单位后缀、搜索框带按钮、密码显示切换等。

**根**：`riko-input-group`（推荐 `<div>`）

**部件**：
- `riko-input-group__addon` 前缀/后缀文字块（放在开头或末尾）
- `riko-input-group__icon` 输入框内的装饰图标
- `riko-password-toggle__show` （JS 生成）密码切换按钮中的「显示」图标
- `riko-password-toggle__hide` （JS 生成）密码切换按钮中的「隐藏」图标

**修饰**（同组互斥）：
- size：`riko-input-group--sm` 小号；`riko-input-group--lg` 大号
- shape：`riko-input-group--round` 胶囊形

**状态**：
- `aria-invalid="true"`（在 `riko-input`） 写在内部 input 上，整个组变红

**JS**：
- 启用：`data-riko="password-toggle"`
- 选项 `data-riko-target`（CSS 选择器） 默认 同组内的 input：要切换的密码框
- 方法 `el.riko.toggle()`：切换显示/隐藏

**无障碍**：
- 图标只是装饰；输入框仍需 label 或 aria-label。
- 密码切换按钮需要 aria-label，JS 会在显示后改为「隐藏密码」并维护 aria-pressed。

**要点**：
- ✓ 内部直接放 riko-input / riko-select / riko-btn，不需要给它们去边框。
- ✓ 密码切换按钮留空即可，图标由 JS 生成。

**避免**：
- ✗ 不要在输入组外层再包 riko-input 的边框样式。

**示例 · 前后缀**

```html
<div class="riko-input-group">
  <span class="riko-input-group__addon">https://</span>
  <input class="riko-input" type="text" value="riko.land" aria-label="网址">
  <span class="riko-input-group__addon">.com</span>
</div>
```

**示例 · 图标与按钮**

```html
<div class="riko-input-group riko-input-group--round">
  <span class="riko-input-group__icon"><i data-lucide="search"></i></span>
  <input class="riko-input" type="search" placeholder="搜索小说内容…" aria-label="搜索小说内容">
  <button type="button" class="riko-btn riko-btn--primary riko-btn--sm">搜索</button>
</div>
```

**示例 · 密码显示/隐藏**

```html
<div class="riko-input-group">
  <span class="riko-input-group__icon"><i data-lucide="lock"></i></span>
  <input class="riko-input" id="password" type="password" value="star-cake-2026" aria-label="密码">
  <button type="button" class="riko-btn riko-btn--ghost riko-btn--icon" data-riko="password-toggle" aria-label="显示密码"></button>
</div>
```

相关：[input](input.md)、[button](button.md)、[field](field.md)
