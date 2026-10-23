<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 提示条 Alert `alert`

在内容中显示一条带色调图标的提示/标注，可带标题、操作按钮与关闭按钮。

**何时用**：页面内持续存在的提示或说明。短暂的操作反馈改用 toast；整页公告用 banner；需要用户做决定用 dialog/confirm。

**根**：`riko-alert`（推荐 `<div>`）

**部件**：
- `riko-alert__icon` 图标；留空时按色调显示内置图标，也可放 Lucide 图标
- `riko-alert__content` 文字容器（必需）
- `riko-alert__title` 标题（可选）
- `riko-alert__body` 正文
- `riko-alert__actions` 操作按钮区（放在 __content 内）
- `riko-alert__close` 关闭按钮：空 <button>，必须带 data-riko-dismiss 与 aria-label

**修饰**（同组互斥）：
- tone：`riko-alert--info` 信息（默认，可不写）；`riko-alert--success` 成功；`riko-alert--warning` 警告；`riko-alert--danger` 错误/危险；`riko-alert--accent` 橙色强调（星星图标）
- variant：`riko-alert--outline` 白底虚线描边；`riko-alert--note` 便签风：缝线内框 + 手写体标题 + 阴影

**JS**：
- 选项 `data-riko-dismiss`（（无值））：放在关闭按钮上：点击后淡出并移除所在 alert（通用移除机制，见 tag 组件）
- 方法 `Riko.dismiss(el)`：用 JS 移除（带淡出）
- 事件 `riko:dismiss` detail { target, trigger }：移除前派发，可 preventDefault 阻止

**无障碍**：
- 普通提示用 role="status"，错误等紧急信息用 role="alert"，静态说明用 role="note"。
- 图标为装饰：riko-alert__icon 加 aria-hidden="true"。
- 关闭按钮没有文字，必须写 aria-label（如「关闭提示」）。

**要点**：
- ✓ 色调用修饰类（riko-alert--success 等），图标会自动匹配，不需要自己找图标。
- ✓ 关闭只需在按钮上写 data-riko-dismiss，不要自己写 remove() 逻辑。
- ✓ 操作按钮放在 riko-alert__actions 中，使用 riko-btn riko-btn--sm。

**避免**：
- ✗ 不要用 alert 做几秒后自动消失的反馈（用 Riko.toast）。
- ✗ 不要把多个色调修饰写在同一个 alert 上。
- ✗ 不要省略 riko-alert__content 直接把文字放在根上。

**示例 · 色调**

```html
<div class="riko-stack">
  <div class="riko-alert" role="status">
    <span class="riko-alert__icon" aria-hidden="true"></span>
    <div class="riko-alert__content">
      <p class="riko-alert__title">小提示</p>
      <p class="riko-alert__body">阅读器会自动记住你上次读到的小节哦。</p>
    </div>
  </div>
  <div class="riko-alert riko-alert--success" role="status">
    <span class="riko-alert__icon" aria-hidden="true"></span>
    <div class="riko-alert__content">
      <p class="riko-alert__title">保存成功</p>
      <p class="riko-alert__body">络可的画稿已经好好地收进笔记本啦。</p>
    </div>
  </div>
  <div class="riko-alert riko-alert--warning" role="status">
    <span class="riko-alert__icon" aria-hidden="true"></span>
    <div class="riko-alert__content">
      <p class="riko-alert__title">前方剧透</p>
      <p class="riko-alert__body">建议先读完第一章，再来翻阅络可的笔记本。</p>
    </div>
  </div>
  <div class="riko-alert riko-alert--danger" role="alert">
    <span class="riko-alert__icon" aria-hidden="true"></span>
    <div class="riko-alert__content">
      <p class="riko-alert__title">连接失败</p>
      <p class="riko-alert__body">信号被暗林挡住了，请稍后再试一次。</p>
    </div>
  </div>
  <div class="riko-alert riko-alert--accent" role="status">
    <span class="riko-alert__icon" aria-hidden="true"></span>
    <div class="riko-alert__content">
      <p class="riko-alert__body">第 76 节「风过围垣，落星回响」已经更新！</p>
    </div>
  </div>
</div>
```

**示例 · 可关闭与操作按钮**

```html
<div class="riko-alert riko-alert--warning" role="status">
  <span class="riko-alert__icon" aria-hidden="true"></span>
  <div class="riko-alert__content">
    <p class="riko-alert__title">还有 3 节没有读完</p>
    <p class="riko-alert__body">要从「月下清辉，暗见净化」继续阅读吗？</p>
    <div class="riko-alert__actions">
      <button type="button" class="riko-btn riko-btn--sm riko-btn--primary">继续阅读</button>
      <button type="button" class="riko-btn riko-btn--sm riko-btn--ghost" data-riko-dismiss>稍后再说</button>
    </div>
  </div>
  <button type="button" class="riko-alert__close" data-riko-dismiss aria-label="关闭提示"></button>
</div>
```

**示例 · 描边与便签**

```html
<div class="riko-stack">
  <div class="riko-alert riko-alert--outline" role="note">
    <span class="riko-alert__icon" aria-hidden="true"><i data-lucide="lightbulb"></i></span>
    <div class="riko-alert__content">
      <p class="riko-alert__body">按 <kbd class="riko-kbd">←</kbd> <kbd class="riko-kbd">→</kbd> 可以快速切换小节。</p>
    </div>
  </div>
  <div class="riko-alert riko-alert--note riko-alert--accent" role="note">
    <span class="riko-alert__icon" aria-hidden="true"></span>
    <div class="riko-alert__content">
      <p class="riko-alert__title">络可的小纸条</p>
      <p class="riko-alert__body">今天也要记得画画、吃星星酥，还有——不要一个人跑去暗林！</p>
    </div>
  </div>
</div>
```

相关：[banner](banner.md)、[toast](toast.md)、[dialog](dialog.md)
