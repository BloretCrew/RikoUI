<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 阅读进度条 Reading Progress `reading-progress`

固定在页面顶部的细进度条（冰蓝到橙色渐变），显示整页或某篇文章的阅读进度。

**何时用**：小说、长文章阅读页。表示任务/上传进度请用 progress。

**根**：`riko-reading-progress`（推荐 `<div>`）

**修饰**（同组互斥）：
- layout：`riko-reading-progress--static` 不固定定位、带底色的进度条

**JS**：
- 启用：`data-riko="reading-progress"`
- 选项 `data-riko-target`（CSS 选择器）：只计算该元素（如文章正文）的阅读进度
- 方法 `el.riko.update()`：重新计算
- 方法 `el.riko.progress`：当前进度 0–1
- 事件 `riko:reading-progress:change` detail { progress }：进度变化

**无障碍**：
- 默认是装饰（aria-hidden）；加 aria-label 后会变成 role="progressbar" 并维护 aria-valuenow。

**要点**：
- ✓ 进度写在 CSS 变量 --riko-progress（0–1）上，也可以手动设置。
- ✓ 高度可用 --riko-reading-progress-h 调整。

**示例 · 阅读进度条**

```html
<div class="riko-reading-progress riko-reading-progress--static" style="--riko-progress: .62"></div>
```

相关：[backtop](backtop.md)、[progress](progress.md)
