<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 头像 Avatar `avatar`

圆形头像，支持图片、文字缩写、图标、在线状态与重叠头像组。

**何时用**：代表一个人或角色。站点 Logo 也可用 --ring 风格。

**根**：`riko-avatar`（推荐 `<span>`）

**部件**：
- `riko-avatar__status` 右下角状态点，配合 data-status="online|busy|away|offline"
- `riko-avatar-group` 头像组容器（重叠排列）

**修饰**（同组互斥）：
- size：`riko-avatar--xs` 24px；`riko-avatar--sm` 32px；`riko-avatar--lg` 64px；`riko-avatar--xl` 96px
- decor：`riko-avatar--ring` 纸白边 + 浅棕环（同站点 Logo）
- shape：`riko-avatar--square` 手绘圆角方形
- tone：`riko-avatar--accent` 浅橙底（文字/图标头像）；`riko-avatar--soft` 米色底（文字/图标头像）

**状态**：
- `data-status="online|busy|away|offline"`（在 `riko-avatar__status`） 状态颜色：绿 / 红 / 黄 / 灰

**无障碍**：
- 图片头像：<img> 写 alt（人名）。
- 文字或图标头像：在 riko-avatar 上加 role="img" 与 aria-label。
- __status 要有 aria-label（如「在线」）或 aria-hidden="true"。
- 旁边已有可见名字（如卡片标题）时，头像是装饰：图片 alt=""，文字/图标头像加 aria-hidden="true"，避免重复朗读。

**要点**：
- ✓ 头像组用 <div class="riko-avatar-group">，内部头像会自动加白边并重叠。

**避免**：
- ✗ 不要直接给 <img> 加 riko-avatar，应外包一层 <span class="riko-avatar">。

**示例 · 尺寸与类型**

```html
<div class="riko-cluster riko-cluster--lg">
  <span class="riko-avatar riko-avatar--xs"><img src="https://riko.land/assets/logo.jpg" alt="络可"></span>
  <span class="riko-avatar riko-avatar--sm"><img src="https://riko.land/assets/logo.jpg" alt="络可"></span>
  <span class="riko-avatar"><img src="https://riko.land/assets/logo.jpg" alt="络可"></span>
  <span class="riko-avatar riko-avatar--lg riko-avatar--ring"><img src="https://riko.land/assets/logo.jpg" alt="络可"></span>
  <span class="riko-avatar riko-avatar--xl riko-avatar--ring"><img src="https://riko.land/assets/logo.jpg" alt="络可"></span>
  <span class="riko-avatar riko-avatar--lg" role="img" aria-label="星星酥">星</span>
  <span class="riko-avatar riko-avatar--lg riko-avatar--accent" role="img" aria-label="Star"><span class="riko-star" aria-hidden="true"></span></span>
  <span class="riko-avatar riko-avatar--lg riko-avatar--soft riko-avatar--square" role="img" aria-label="访客"><i data-lucide="user"></i></span>
</div>
```

**示例 · 状态与头像组**

```html
<div class="riko-cluster riko-cluster--lg">
  <span class="riko-avatar riko-avatar--lg"><img src="https://riko.land/assets/logo.jpg" alt="络可"><span class="riko-avatar__status" data-status="online" aria-label="在线"></span></span>
  <span class="riko-avatar riko-avatar--lg riko-avatar--soft" role="img" aria-label="111"><span aria-hidden="true">111</span><span class="riko-avatar__status" data-status="busy" aria-label="忙碌"></span></span>
  <span class="riko-avatar riko-avatar--lg riko-avatar--accent" role="img" aria-label="无昵">昵<span class="riko-avatar__status" data-status="away" aria-label="离开"></span></span>
  <div class="riko-avatar-group">
    <span class="riko-avatar"><img src="https://riko.land/assets/logo.jpg" alt="络可"></span>
    <span class="riko-avatar riko-avatar--accent" role="img" aria-label="Star">S</span>
    <span class="riko-avatar riko-avatar--soft" role="img" aria-label="111">1</span>
    <span class="riko-avatar" role="img" aria-label="还有 5 人">+5</span>
  </div>
</div>
```

相关：[badge](badge.md)
