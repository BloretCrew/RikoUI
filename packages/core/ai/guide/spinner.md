<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 加载中 Spinner `spinner`

旋转的品牌星星（或三颗跳动的小星星）加可读文字。

**何时用**：等待时间不确定的短加载。已知布局的内容加载用 skeleton；有进度数值用 progress。

**根**：`riko-spinner`（推荐 `<span>`）

**部件**：
- `riko-spinner__label` 可读文字（必需；只显示图标时加 riko-u-sr-only）（必需）
- `riko-spinner__dot` --dots 样式中的小星星，写三个

**修饰**（同组互斥）：
- size：`riko-spinner--sm` 小号；`riko-spinner--lg` 大号（图标在上，文字在下）
- variant：`riko-spinner--dots` 三颗跳动小星星
- tone：`riko-spinner--ice` 冰蓝色

**无障碍**：
- 根元素加 role="status"；必须包含 riko-spinner__label 文字。

**要点**：
- ✓ 按钮内的加载状态用按钮自己的 aria-busy="true"，不要在按钮里塞 spinner。

**避免**：
- ✗ 不要只放一个没有文字的 spinner。

**示例 · 样式与尺寸**

```html
<div class="riko-cluster riko-cluster--lg">
  <span class="riko-spinner riko-spinner--sm" role="status"><span class="riko-spinner__label">加载中…</span></span>
  <span class="riko-spinner" role="status"><span class="riko-spinner__label">正在翻页…</span></span>
  <span class="riko-spinner riko-spinner--ice" role="status"><span class="riko-spinner__label riko-u-sr-only">加载中</span></span>
  <span class="riko-spinner riko-spinner--dots" role="status">
    <span class="riko-spinner__dot"></span><span class="riko-spinner__dot"></span><span class="riko-spinner__dot"></span>
    <span class="riko-spinner__label">络可正在画画…</span>
  </span>
</div>
```

**示例 · 大号**

```html
<span class="riko-spinner riko-spinner--lg" role="status"><span class="riko-spinner__label">正在打开笔记本…</span></span>
```

相关：[skeleton](skeleton.md)、[progress](progress.md)、[button](button.md)
