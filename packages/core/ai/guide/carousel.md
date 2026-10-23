<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 轮播 Carousel `carousel`

基于滚动吸附的横向轮播，自动生成箭头与圆点，支持触摸滑动、键盘与自动播放。

**何时用**：一组同类的图片或卡片需要在有限空间内轮换展示。重要信息不要只放在轮播里。

**根**：`riko-carousel`（推荐 `<div>`）

**部件**：
- `riko-carousel__track` 滚动轨道（必需）
- `riko-carousel__slide` 每一张（必需）
- `riko-carousel__prev` 上一张按钮（自动生成）
- `riko-carousel__next` 下一张按钮（自动生成）
- `riko-carousel__dots` 圆点容器（自动生成）
- `riko-carousel__dot` 圆点按钮（自动生成）
- `riko-carousel__play` 播放/暂停按钮（自动播放时生成）

**修饰**（同组互斥）：
- layout：`riko-carousel--peek` 露出两侧相邻卡片；`riko-carousel--multi` 一屏多张（宽屏 3 张，窄屏 1.3 张）

**状态**：
- `aria-current="true"`（在 `riko-carousel__dot`） 当前圆点（JS 维护）

**JS**：
- 启用：`data-riko="carousel"`
- 选项 `data-riko-autoplay`（毫秒（空值=5000））：自动播放；悬停或聚焦时暂停，「减少动态效果」时默认不播放，并生成暂停按钮
- 方法 `el.riko.next() / prev() / goTo(i)`：切换
- 方法 `el.riko.play() / pause()`：自动播放控制
- 方法 `el.riko.index`：当前序号
- 事件 `riko:carousel:change` detail { index }：当前张变化时

**无障碍**：
- 根元素需要 aria-label（如「络可的画册」）。
- JS 会设置 role="region"、aria-roledescription 与每张的「n / 总数」标签。
- 轨道可聚焦，方向键 ← → 切换，Home / End 跳到首尾。

**要点**：
- ✓ 只需写 track 与 slide，箭头和圆点自动生成。
- ✓ 每张可以放图片、卡片或任意内容。

**避免**：
- ✗ 不要在一页放多个自动播放的轮播。

**示例 · 基础用法**

```html
<div class="riko-carousel" data-riko="carousel" aria-label="络可的画册">
  <div class="riko-carousel__track">
    <div class="riko-carousel__slide"><div class="riko-card riko-card--ice riko-card--flat riko-u-w-full" style="min-height: 200px"><h3 class="riko-card__title">碧空</h3><p class="riko-card__body">无垠的大海倒映着碧空。</p></div></div>
    <div class="riko-carousel__slide"><div class="riko-card riko-card--accent riko-card--flat riko-u-w-full" style="min-height: 200px"><h3 class="riko-card__title">落日</h3><p class="riko-card__body">晚霞把沙滩染成了橘子色。</p></div></div>
    <div class="riko-carousel__slide"><div class="riko-card riko-card--soft riko-card--flat riko-u-w-full" style="min-height: 200px"><h3 class="riko-card__title">沙滩</h3><p class="riko-card__body">金黄的沙滩上留下一串小脚印。</p></div></div>
  </div>
</div>
```

**示例 · 露出相邻 · 自动播放**

```html
<div class="riko-carousel riko-carousel--peek" data-riko="carousel" data-riko-autoplay="4000" aria-label="章节推荐">
  <div class="riko-carousel__track">
    <div class="riko-carousel__slide"><a class="riko-card riko-card--interactive riko-u-w-full" href="#carousel"><h3 class="riko-card__title">001 沙滩上的画家</h3><p class="riko-card__body">轻柔的海浪涌来，散入金黄的沙滩。</p></a></div>
    <div class="riko-carousel__slide"><a class="riko-card riko-card--interactive riko-u-w-full" href="#carousel"><h3 class="riko-card__title">035 钓鱼场的闹剧</h3><p class="riko-card__body">第一竿：皮革靴子，第二竿：俩荷叶……</p></a></div>
    <div class="riko-carousel__slide"><a class="riko-card riko-card--interactive riko-u-w-full" href="#carousel"><h3 class="riko-card__title">076 风过围垣，落星回响</h3><p class="riko-card__body">回来就好。</p></a></div>
  </div>
</div>
```

相关：[card](card.md)、[polaroid](polaroid.md)
