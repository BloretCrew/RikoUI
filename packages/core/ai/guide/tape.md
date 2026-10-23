<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 胶带 Tape `tape`

贴在卡片/照片顶部的半透明条纹胶带。

**何时用**：拍立得、便签、阅读页纸张顶部。

**根**：`riko-tape`

**修饰**（同组互斥）：
- layout：`riko-tape--left` 左上角斜贴；`riko-tape--right` 右上角斜贴
- tone：`riko-tape--accent` 橙色胶带

**要点**：
- ✓ 父元素需要 position: relative。

**示例 · 贴在卡片上**

```html
<div class="riko-card" style="position: relative;">
  <span class="riko-tape" aria-hidden="true"></span>
  …
</div>
```
