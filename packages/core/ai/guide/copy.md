<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 复制 Copy `copy`

给任意按钮加上「一键复制」：复制成功时图标变成勾，并告诉读屏「已复制」。

**何时用**：邀请码、链接、代码等需要用户复制的内容。

**部件**：
- `riko-copy__icon` 复制图标（按钮为空时自动生成；成功时变为勾）

**状态**：
- `data-state="copied"`（在 `按钮`） 复制成功后约 1.8 秒内（JS 维护）

**JS**：
- 启用：`data-riko="copy"`
- 选项 `data-riko-copy`（文本）：要复制的文字
- 选项 `data-riko-target`（CSS 选择器）：复制该元素的 value（输入框）或文字内容
- 选项 `data-riko-copied-text`（文本） 默认 已复制：读屏播报的成功提示
- 方法 `Riko.copy(text)`：复制任意文本，返回 Promise<boolean>
- 方法 `el.riko.copy()`：触发该按钮的复制
- 事件 `riko:copy:success` detail { text }：复制成功
- 事件 `riko:copy:error` detail { text }：复制失败

**无障碍**：
- 仅图标的复制按钮必须有 aria-label（如「复制链接」）。
- 成功提示通过隐藏的 aria-live 区域播报。

**要点**：
- ✓ data-riko-copy 与 data-riko-target 二选一。
- ✓ 需要额外视觉反馈时可监听 riko:copy:success 弹出 toast。

**避免**：
- ✗ 不要自己调用 navigator.clipboard 再手动改图标，直接用 data-riko="copy"。

**示例 · 基础用法**

```html
<div class="riko-cluster">
  <code class="riko-code" id="invite-code">RIKO-2026</code>
  <button type="button" class="riko-btn riko-btn--soft riko-btn--sm" data-riko="copy" data-riko-target="#invite-code"><span class="riko-copy__icon" aria-hidden="true"></span>复制邀请码</button>
  <button type="button" class="riko-btn riko-btn--icon riko-btn--ghost" data-riko="copy" data-riko-copy="https://riko.land" aria-label="复制网站链接"></button>
</div>
```

相关：[codeblock](codeblock.md)、[toast](toast.md)
