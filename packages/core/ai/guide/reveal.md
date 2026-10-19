<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 滚动进场 Reveal `reveal`

元素滚动进入视口时淡入上移。

**何时用**：首页版块、卡片网格的进场点缀；不要用于首屏关键内容。

**部件**：
- `riko-u-reveal` 由 JS 自动添加的进场过渡类（无需手写）

**JS**：
- 启用：`data-riko="reveal"`
- 选项 `data-riko-delay`（毫秒） 默认 0：进场延迟（可做错落效果）

**无障碍**：
- 用户开启「减少动态效果」时直接显示，无动画。

**要点**：
- ✓ 无 JS 时内容正常显示（渐进增强）。

**示例 · 基础**

```html
<section class="riko-section" data-riko="reveal">…</section>
```
