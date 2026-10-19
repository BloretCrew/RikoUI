<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 骨架屏 Skeleton `skeleton`

内容加载前的柔和闪光占位块：文字行、圆形头像、矩形图片。

**何时用**：已知布局的内容正在加载时。未知布局或很短的等待用 spinner。

**根**：`riko-skeleton`（推荐 `<span>`）

**部件**：
- `riko-skeleton-group` 纵向排列多个占位块的容器（组内最后一行文字自动变短）

**修饰**（同组互斥）：
- shape：`riko-skeleton--text` 一行文字；`riko-skeleton--circle` 圆形（头像），尺寸用 --riko-skeleton-size；`riko-skeleton--rect` 矩形（图片/卡片），高度用 --riko-skeleton-h

**状态**：
- `aria-busy="true"`（在 `外层容器`） 表示该区域正在加载

**无障碍**：
- 外层容器加 aria-busy="true" 和 aria-label（如「正在加载章节」），加载完成后移除 aria-busy 并替换内容。

**要点**：
- ✓ 占位块的大致形状应与真实内容一致。
- ✓ 尺寸用 --riko-skeleton-h / --riko-skeleton-size 变量调整。

**避免**：
- ✗ 不要在骨架屏里放文字。

**示例 · 卡片占位**

```html
<div class="riko-cluster riko-cluster--start" aria-busy="true" aria-label="正在加载章节">
  <span class="riko-skeleton riko-skeleton--circle"></span>
  <div class="riko-skeleton-group riko-u-flex-1">
    <span class="riko-skeleton riko-skeleton--text"></span>
    <span class="riko-skeleton riko-skeleton--text"></span>
    <span class="riko-skeleton riko-skeleton--text"></span>
  </div>
</div>
```

**示例 · 图片 + 文字**

```html
<div class="riko-skeleton-group" style="max-width: 320px" aria-busy="true" aria-label="正在加载图片">
  <span class="riko-skeleton riko-skeleton--rect"></span>
  <span class="riko-skeleton riko-skeleton--text"></span>
  <span class="riko-skeleton riko-skeleton--text"></span>
</div>
```

相关：[spinner](spinner.md)
