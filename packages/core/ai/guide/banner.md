<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 公告横幅 Banner `banner`

横跨页面或内容区顶部的一条公告，可带图标、链接与关闭按钮，可吸顶。

**何时用**：全站公告、更新通知、维护提醒。内容中的普通提示用 alert；临时反馈用 toast。

**根**：`riko-banner`（推荐 `<div>`）

**部件**：
- `riko-banner__icon` 图标：可直接写 riko-banner__icon riko-star（闪烁星星），或放 Lucide 图标
- `riko-banner__text` 公告文字（<p>）（必需）
- `riko-banner__link` 文字中的链接（波浪下划线）
- `riko-banner__close` 关闭按钮：空 <button>，带 data-riko-dismiss 与 aria-label

**修饰**（同组互斥）：
- tone：`riko-banner--ice` 冰蓝；`riko-banner--success` 成功；`riko-banner--warning` 警告；`riko-banner--danger` 危险
- layout：`riko-banner--sticky` 吸顶（position: sticky; top: 0）；`riko-banner--inline` 内容中的圆角虚线横幅（左对齐）

**JS**：
- 选项 `data-riko-dismiss`（（无值））：放在关闭按钮上，点击后淡出移除横幅
- 方法 `Riko.dismiss(el)`：用 JS 移除
- 事件 `riko:dismiss` detail { target, trigger }：移除前派发，可 preventDefault 阻止

**无障碍**：
- 根元素加 role="region" 与 aria-label（如「公告」），方便读屏用户跳转。
- 图标加 aria-hidden="true"；关闭按钮必须有 aria-label。

**要点**：
- ✓ 默认为橙色强调色调；整页顶部公告放在 <body> 最前面，需要时加 riko-banner--sticky。
- ✓ 文字要短，一行说清；更多内容用 riko-banner__link 链接出去。

**避免**：
- ✗ 不要在一个页面同时放多条横幅。
- ✗ 不要在横幅里放表单或大量按钮。

**示例 · 页面顶部公告**

```html
<div class="riko-stack">
  <div class="riko-banner" role="region" aria-label="公告">
    <span class="riko-banner__icon riko-star" aria-hidden="true"></span>
    <p class="riko-banner__text">第 76 节「风过围垣，落星回响」已更新！<a class="riko-banner__link" href="#">去看看</a></p>
    <button type="button" class="riko-banner__close" data-riko-dismiss aria-label="关闭公告"></button>
  </div>
  <div class="riko-banner riko-banner--ice" role="region" aria-label="公告">
    <span class="riko-banner__icon" aria-hidden="true"><i data-lucide="snowflake"></i></span>
    <p class="riko-banner__text">冬日限定：深色模式下的夜晚更安静哦。</p>
  </div>
</div>
```

**示例 · 内容中的圆角横幅**

```html
<div class="riko-banner riko-banner--inline riko-banner--warning" role="region" aria-label="维护通知">
  <span class="riko-banner__icon" aria-hidden="true"><i data-lucide="wrench"></i></span>
  <p class="riko-banner__text">今晚 23:00–23:30 维护，届时阅读器可能短暂不可用。<a class="riko-banner__link" href="#">了解详情</a></p>
</div>
```

相关：[alert](alert.md)、[toast](toast.md)
