<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 拍立得 Polaroid `polaroid`

带白边与手写说明的照片框，轻微倾斜，悬停回正。

**何时用**：展示插画、角色图、头图等需要「贴在手账上」感觉的图片。普通内容图用 card 的 __media。

**根**：`riko-polaroid`（推荐 `<figure>`）

**部件**：
- `riko-polaroid__caption` 手写体说明（figcaption）

**修饰**（同组互斥）：
- layout：`riko-polaroid--left` 向左倾斜；`riko-polaroid--straight` 不倾斜
- size：`riko-polaroid--sm` 小号（180px）；`riko-polaroid--lg` 大号（360px）

**无障碍**：
- <img> 必须有描述性的 alt；__caption 是可见说明，不能替代 alt。

**要点**：
- ✓ 内部可放 <span class="riko-tape" aria-hidden="true"></span> 加胶带。
- ✓ 宽度可用 style="--riko-polaroid-w: 240px" 自定义；图片比例用 --riko-polaroid-ratio。

**避免**：
- ✗ 不要把拍立得放进 overflow:hidden 的小容器，倾斜与胶带会被裁掉。

**示例 · 基础用法**

```html
<div class="riko-cluster riko-cluster--lg riko-cluster--center">
  <figure class="riko-polaroid">
    <span class="riko-tape" aria-hidden="true"></span>
    <img src="https://riko.land/assets/logo.jpg" alt="《络的世界》封面插画">
    <figcaption class="riko-polaroid__caption">Riko's World ✦</figcaption>
  </figure>
  <figure class="riko-polaroid riko-polaroid--left riko-polaroid--sm">
    <img src="https://riko.land/assets/logo.jpg" alt="《络的世界》封面插画">
    <figcaption class="riko-polaroid__caption">little star</figcaption>
  </figure>
  <figure class="riko-polaroid riko-polaroid--straight riko-polaroid--sm">
    <img src="https://riko.land/assets/logo.jpg" alt="《络的世界》封面插画">
    <figcaption class="riko-polaroid__caption">summer, 2026</figcaption>
  </figure>
</div>
```

相关：[card](card.md)、[tape](tape.md)
