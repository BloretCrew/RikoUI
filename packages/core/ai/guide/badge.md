<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 徽标 Badge `badge`

小小的数字或圆点，用于未读数、计数和状态提示，可挂在按钮或头像右上角。

**何时用**：提示数量或「有新内容」。表示分类或属性用 tag。

**根**：`riko-badge`（推荐 `<span>`）

**部件**：
- `riko-badge-anchor` 定位容器：把徽标挂到内部元素（按钮/头像）的右上角

**修饰**（同组互斥）：
- tone：`riko-badge--ice` 冰蓝；`riko-badge--success` 成功；`riko-badge--warning` 警告；`riko-badge--danger` 危险/未读；`riko-badge--neutral` 中性灰棕
- size：`riko-badge--sm` 小号；`riko-badge--lg` 大号
- shape：`riko-badge--dot` 只显示小圆点
- decor：`riko-badge--pulse` 脉冲光环（吸引注意）

**无障碍**：
- 挂在图标按钮上的徽标要有 aria-label（如「3 条未读」），或把数量写进按钮的 aria-label 并给徽标 aria-hidden="true"。
- --dot 没有文字，必须提供 aria-label 或 aria-hidden="true"。

**要点**：
- ✓ 挂角：<span class="riko-badge-anchor">按钮或头像 + <span class="riko-badge">3</span></span>。
- ✓ 数字超过 99 时显示 99+。

**避免**：
- ✗ 不要用徽标承载长文字，改用 tag。

**示例 · 基础用法**

```html
<div class="riko-cluster">
  <span class="riko-badge">12</span>
  <span class="riko-badge riko-badge--ice">新</span>
  <span class="riko-badge riko-badge--success">3</span>
  <span class="riko-badge riko-badge--warning">!</span>
  <span class="riko-badge riko-badge--danger">99+</span>
  <span class="riko-badge riko-badge--neutral">0</span>
  <span class="riko-badge riko-badge--sm">sm</span>
  <span class="riko-badge riko-badge--lg">76</span>
</div>
```

**示例 · 挂在按钮与头像上**

```html
<div class="riko-cluster riko-cluster--lg">
  <span class="riko-badge-anchor">
    <button type="button" class="riko-btn riko-btn--icon" aria-label="消息，3 条未读"><i data-lucide="bell"></i></button>
    <span class="riko-badge riko-badge--danger" aria-hidden="true">3</span>
  </span>
  <span class="riko-badge-anchor">
    <span class="riko-avatar riko-avatar--ring"><img src="https://riko.land/assets/logo.jpg" alt="络可"></span>
    <span class="riko-badge riko-badge--dot riko-badge--pulse" aria-label="有新动态"></span>
  </span>
  <span class="riko-badge-anchor">
    <button type="button" class="riko-btn riko-btn--soft">收件箱</button>
    <span class="riko-badge riko-badge--ice" aria-label="12 封新邮件">12</span>
  </span>
</div>
```

相关：[tag](tag.md)、[avatar](avatar.md)、[button](button.md)
