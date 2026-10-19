<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 按钮组 Button Group `button-group`

把相关按钮放在一起：默认带间距，--attached 拼接成一体。

**何时用**：一组并列操作或切换视图、对齐方式等互斥选项（互斥且需要表单值时用 segmented）。

**根**：`riko-btn-group`（推荐 `<div>`）

**修饰**（同组互斥）：
- layout：`riko-btn-group--attached` 按钮拼接成一体
- behavior：`riko-btn-group--vertical` 纵向排列

**状态**：
- `aria-pressed="true"`（在 `riko-btn`） 组内当前选中的按钮

**无障碍**：
- 容器加 role="group" 与 aria-label 说明这组按钮的用途。

**要点**：
- ✓ 子元素直接放 .riko-btn，尺寸修饰写在每个按钮上。

**避免**：
- ✗ 不要在 --attached 组里混用不同尺寸的按钮。

**示例 · 间隔排列**

```html
<div class="riko-btn-group" role="group" aria-label="章节操作">
  <button type="button" class="riko-btn riko-btn--sm"><i data-lucide="arrow-left"></i>上一节</button>
  <button type="button" class="riko-btn riko-btn--sm">目录</button>
  <button type="button" class="riko-btn riko-btn--sm">下一节<i data-lucide="arrow-right"></i></button>
</div>
```

**示例 · 拼接**

```html
<div class="riko-btn-group riko-btn-group--attached" role="group" aria-label="对齐方式">
  <button type="button" class="riko-btn" aria-pressed="true" aria-label="左对齐"><i data-lucide="align-left"></i></button>
  <button type="button" class="riko-btn" aria-pressed="false" aria-label="居中"><i data-lucide="align-center"></i></button>
  <button type="button" class="riko-btn" aria-pressed="false" aria-label="右对齐"><i data-lucide="align-right"></i></button>
</div>
```

**示例 · 纵向拼接**

```html
<div class="riko-btn-group riko-btn-group--attached riko-btn-group--vertical" role="group" aria-label="排序">
  <button type="button" class="riko-btn" aria-pressed="true">最新更新</button>
  <button type="button" class="riko-btn" aria-pressed="false">最多收藏</button>
  <button type="button" class="riko-btn" aria-pressed="false">章节顺序</button>
</div>
```

相关：[button](button.md)、[segmented](segmented.md)
