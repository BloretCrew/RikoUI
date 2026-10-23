<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 返回顶部 Back to Top `backtop`

页面右下角的橙色星形按钮，滚动一段后出现，点击平滑回到顶部。

**何时用**：较长的页面（文章、目录、列表）。

**根**：`riko-backtop`（推荐 `<button>`）

**修饰**（同组互斥）：
- layout：`riko-backtop--static` 不固定定位（用于演示或嵌入工具栏）

**状态**：
- `data-state="hidden|shown"` 是否显示（JS 维护）

**JS**：
- 启用：`data-riko="backtop"`
- 选项 `data-riko-offset`（像素） 默认 400：滚动超过多少后出现
- 方法 `el.riko.update()`：重新判断是否显示

**无障碍**：
- 必须有 aria-label="返回顶部"（JS 会补默认值）。
- 键盘触发时焦点会移到页面第一个可聚焦元素。

**要点**：
- ✓ 按钮内容留空，星星和箭头由 CSS 绘制。
- ✓ 位置可用 --riko-backtop-right / --riko-backtop-bottom 调整。

**避免**：
- ✗ 不要在按钮里再放图标。

**示例 · 星形按钮**

```html
<button type="button" class="riko-backtop riko-backtop--static" aria-label="返回顶部"></button>
```

相关：[reading-progress](reading-progress.md)、[toc](toc.md)
