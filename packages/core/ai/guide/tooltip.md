<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 文字提示 Tooltip `tooltip`

悬停或聚焦时出现的小提示气泡，可可色底、带小箭头。

**何时用**：对按钮、图标做简短补充说明（一句话以内）。需要放链接、按钮或较长内容时改用 popover。

**部件**：
- `riko-tooltip` 提示浮层（由 JS 生成，无需手写）

**JS**：
- 启用：`data-riko="tooltip"`
- 选项 `data-riko-tooltip`（文本）：提示内容；缺省时使用 title 属性（并移除 title）
- 选项 `data-riko-placement`（top | bottom | left | right（可加 -start / -end）） 默认 top：位置，空间不足时自动翻转
- 选项 `data-riko-delay`（毫秒） 默认 150：悬停多久后显示
- 方法 `el.riko.show() / el.riko.hide()`：手动显示 / 隐藏
- 方法 `el.riko.setText(text)`：修改提示内容（也可直接改 data-riko-tooltip）

**无障碍**：
- 触发元素必须可聚焦（button、a 等），键盘聚焦时同样会显示。
- 自动建立 aria-describedby；按 Esc 隐藏。
- 提示只是补充：仅图标按钮仍然需要自己的 aria-label。

**要点**：
- ✓ 写法：<button class="riko-btn" data-riko="tooltip" data-riko-tooltip="提示">…</button>。
- ✓ 文字保持简短，一行为宜。

**避免**：
- ✗ 不要在 tooltip 里放可交互内容。
- ✗ 不要把 tooltip 加在不可聚焦的 <span> 上（键盘用户看不到）。

**示例 · 四个方向**

```html
<div class="riko-cluster riko-cluster--center">
  <button type="button" class="riko-btn" data-riko="tooltip" data-riko-tooltip="把这一节加入书签">收藏</button>
  <button type="button" class="riko-btn" data-riko="tooltip" data-riko-tooltip="在下方出现" data-riko-placement="bottom">下方</button>
  <button type="button" class="riko-btn" data-riko="tooltip" data-riko-tooltip="在左侧出现" data-riko-placement="left">左侧</button>
  <button type="button" class="riko-btn" data-riko="tooltip" data-riko-tooltip="在右侧出现" data-riko-placement="right">右侧</button>
  <button type="button" class="riko-btn riko-btn--icon riko-btn--ghost" aria-label="分享" data-riko="tooltip" data-riko-tooltip="分享给朋友"><i data-lucide="share-2"></i></button>
</div>
```

相关：[popover](popover.md)
