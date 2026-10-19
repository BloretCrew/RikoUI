<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 统计数值 Stat `stat`

大号手写数字的指标卡，带标签、图标与涨跌趋势。

**何时用**：仪表盘、个人主页的关键数字。

**根**：`riko-stat`（推荐 `<div>`）

**部件**：
- `riko-stat__icon` 右上角倾斜图标
- `riko-stat__label` 指标名称
- `riko-stat__value` 数值（大号手写体）
- `riko-stat__unit` 单位（放在 __value 内）
- `riko-stat__trend` 趋势说明，配合 data-trend="up|down"

**修饰**（同组互斥）：
- tone：`riko-stat--accent` 橙色描边与图标
- layout：`riko-stat--plain` 去掉卡片外观（嵌在其他卡片里时）

**状态**：
- `data-trend="up|down"`（在 `riko-stat__trend`） 上升（绿）/ 下降（红），带箭头

**无障碍**：
- 趋势不要只靠颜色和箭头表达：文字里写明「增加 / 减少」或「+12 / -3」。

**要点**：
- ✓ 多个 stat 用 riko-grid 排列。

**避免**：
- ✗ __value 中不要放长文字。

**示例 · 指标卡**

```html
<div class="riko-grid" style="--riko-grid-min: 200px">
  <div class="riko-stat">
    <span class="riko-stat__icon"><i data-lucide="book-open"></i></span>
    <span class="riko-stat__label">已更新小节</span>
    <span class="riko-stat__value">76<span class="riko-stat__unit">节</span></span>
    <span class="riko-stat__trend" data-trend="up">本月 +12</span>
  </div>
  <div class="riko-stat riko-stat--accent">
    <span class="riko-stat__icon"><i data-lucide="star"></i></span>
    <span class="riko-stat__label">收到的星星</span>
    <span class="riko-stat__value">2,048</span>
    <span class="riko-stat__trend" data-trend="up">较上周 +8%</span>
  </div>
  <div class="riko-stat">
    <span class="riko-stat__icon"><i data-lucide="type"></i></span>
    <span class="riko-stat__label">总字数</span>
    <span class="riko-stat__value">9.0<span class="riko-stat__unit">万字</span></span>
    <span class="riko-stat__trend">连载中</span>
  </div>
  <div class="riko-stat">
    <span class="riko-stat__icon"><i data-lucide="bug"></i></span>
    <span class="riko-stat__label">待修复错别字</span>
    <span class="riko-stat__value">3</span>
    <span class="riko-stat__trend" data-trend="down">较上周减少 5 个</span>
  </div>
</div>
```

相关：[card](card.md)
