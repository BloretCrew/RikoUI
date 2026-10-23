<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 纵向堆叠 Stack `stack`

子元素纵向排列并保持统一间距。

**何时用**：表单项、卡片内容、任何纵向列表。

**根**：`riko-stack`（推荐 `<div>`）

**修饰**（同组互斥）：
- size：`riko-stack--xs` 4px；`riko-stack--sm` 8px；`riko-stack--lg` 24px；`riko-stack--xl` 48px
- layout：`riko-stack--center` 水平居中

**要点**：
- ✓ 默认间距 16px；也可用 style="--riko-stack-gap: var(--riko-space-5)" 精调。

**示例 · 基础**

```html
<div class="riko-stack">
  <h3 class="riko-h3">标题</h3>
  <p>正文</p>
</div>
```
