<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 翻页 Pager `pager`

「上一节 / 下一节」两张大卡片，显示前后内容的标题。

**何时用**：小说章节、文档、教程等线性阅读内容的底部。多页列表用 pagination。

**根**：`riko-pager`（推荐 `<nav>`）

**部件**：
- `riko-pager__prev` 上一项卡片（a / button）
- `riko-pager__next` 下一项卡片（a / button），总在右侧
- `riko-pager__label` 小字标签（上一节/下一节），箭头由 CSS 生成（必需）
- `riko-pager__title` 前后内容的标题（必需）

**状态**：
- `aria-disabled="true"`（在 `riko-pager__prev`） 不可用（用于 span/a）
- `disabled`（在 `riko-pager__next`） 不可用（用于 button）

**无障碍**：
- <nav aria-label="…翻页">。

**要点**：
- ✓ 只有下一项时可以只写 __next，它会保持在右栏。
- ✓ 窄屏（≤520px）自动改为上下排列。

**避免**：
- ✗ 不要在 __label 里再手写箭头。

**示例 · 上一节 / 下一节**

```html
<nav class="riko-pager" aria-label="小节翻页">
  <a class="riko-pager__prev" href="#001"><span class="riko-pager__label">上一节</span><span class="riko-pager__title">001 沙滩上的画家</span></a>
  <a class="riko-pager__next" href="#003"><span class="riko-pager__label">下一节</span><span class="riko-pager__title">003 熟悉的身影</span></a>
</nav>
```

相关：[pagination](pagination.md)
