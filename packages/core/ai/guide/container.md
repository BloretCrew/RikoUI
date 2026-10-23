<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 容器 Container `container`

水平居中、限制最大宽度并留出左右边距。

**何时用**：包住每个版块的内容。阅读正文用 --narrow，后台/阅读器用 --wide。

**根**：`riko-container`（推荐 `<div>`）

**修饰**（同组互斥）：
- size：`riko-container--wide` 1320px；`riko-container--narrow` 760px（阅读宽度）；`riko-container--fluid` 占满宽度（保留边距）

**要点**：
- ✓ 宽度变量：--riko-container / --riko-container-wide / --riko-container-narrow，可在 :root 覆盖。

**示例 · 基础**

```html
<div class="riko-container">…</div>
```
