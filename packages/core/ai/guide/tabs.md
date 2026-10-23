<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 标签页 Tabs `tabs`

在同一区域内切换几组平级内容；支持波浪下划线、胶囊滑块、笔记本分隔页、纵向四种外观。

**何时用**：2–7 组平级内容、一次只看一组时用。需要同时展开多组用 accordion；切换页面用链接/navbar。

**根**：`riko-tabs`（推荐 `<div>`）

**部件**：
- `riko-tabs__list` 页签容器（role="tablist"，需 aria-label）（必需）
- `riko-tabs__tab` 页签按钮（role="tab"）（必需）
- `riko-tabs__badge` 页签内的小计数
- `riko-tabs__panel` 内容面板（role="tabpanel"），与页签按顺序对应；非选中面板加 hidden（必需）

**修饰**（同组互斥）：
- variant：`riko-tabs--pills` 胶囊外观，选中滑块带回弹；`riko-tabs--cards` 卡片外观，像笔记本分隔页
- layout：`riko-tabs--vertical` 纵向排列（窄屏自动变横向）
- shape：`riko-tabs--fill` 页签平分整行宽度

**状态**：
- `aria-selected="true"`（在 `riko-tabs__tab`） 当前页签（JS 维护）
- `disabled`（在 `riko-tabs__tab`） 禁用的页签
- `hidden`（在 `riko-tabs__panel`） 未选中的面板

**JS**：
- 启用：`data-riko="tabs"`
- 选项 `data-riko-activation`（auto | manual） 默认 auto：manual：方向键只移动焦点，Enter/Space 才切换
- 方法 `el.riko.select(index)`：切换到第 index 个页签
- 方法 `el.riko.index`：当前索引
- 事件 `riko:tabs:change` detail { index, tab, panel }：切换后派发

**无障碍**：
- role、aria-controls、aria-labelledby、tabindex 由 JS 补齐；没有 JS 时请自行写全。
- __list 需要 aria-label 说明这组页签的用途。
- 键盘：←/→（纵向为 ↑/↓）、Home、End。

**要点**：
- ✓ 页签与面板按出现顺序一一对应；也可以用 aria-controls 显式指定。
- ✓ 初始选中项写 aria-selected="true"，其余面板写 hidden，避免无 JS 时全部显示。
- ✓ 页签用 <button type="button">。

**避免**：
- ✗ 不要用 <a href> 做页签（那是导航，不是 tabs）。
- ✗ 不要用 .active 标记选中项。

**示例 · 默认（波浪下划线）**

```html
<div class="riko-tabs" data-riko="tabs">
  <div class="riko-tabs__list" aria-label="设定集">
    <button type="button" class="riko-tabs__tab" aria-selected="true">人物</button>
    <button type="button" class="riko-tabs__tab">地点</button>
    <button type="button" class="riko-tabs__tab">道具 <span class="riko-tabs__badge">12</span></button>
    <button type="button" class="riko-tabs__tab" disabled>未解锁</button>
  </div>
  <div class="riko-tabs__panel">络可：喜欢画画的小女孩，戴着带星星的贝雷帽。</div>
  <div class="riko-tabs__panel" hidden>百络谷：海边的温柔小村，HV 的大家都住在这里。</div>
  <div class="riko-tabs__panel" hidden>画笔、颜料盒，还有一串会发光的流星项链。</div>
  <div class="riko-tabs__panel" hidden>这一页还没有写好哦。</div>
</div>
```

**示例 · 胶囊**

```html
<div class="riko-tabs riko-tabs--pills" data-riko="tabs">
  <div class="riko-tabs__list" aria-label="设定集">
    <button type="button" class="riko-tabs__tab" aria-selected="true">人物</button>
    <button type="button" class="riko-tabs__tab">地点</button>
    <button type="button" class="riko-tabs__tab">道具 <span class="riko-tabs__badge">12</span></button>
    <button type="button" class="riko-tabs__tab" disabled>未解锁</button>
  </div>
  <div class="riko-tabs__panel">络可：喜欢画画的小女孩，戴着带星星的贝雷帽。</div>
  <div class="riko-tabs__panel" hidden>百络谷：海边的温柔小村，HV 的大家都住在这里。</div>
  <div class="riko-tabs__panel" hidden>画笔、颜料盒，还有一串会发光的流星项链。</div>
  <div class="riko-tabs__panel" hidden>这一页还没有写好哦。</div>
</div>
```

**示例 · 卡片（笔记本分隔页）**

```html
<div class="riko-tabs riko-tabs--cards" data-riko="tabs">
  <div class="riko-tabs__list" aria-label="设定集">
    <button type="button" class="riko-tabs__tab" aria-selected="true">人物</button>
    <button type="button" class="riko-tabs__tab">地点</button>
    <button type="button" class="riko-tabs__tab">道具 <span class="riko-tabs__badge">12</span></button>
    <button type="button" class="riko-tabs__tab" disabled>未解锁</button>
  </div>
  <div class="riko-tabs__panel">络可：喜欢画画的小女孩，戴着带星星的贝雷帽。</div>
  <div class="riko-tabs__panel" hidden>百络谷：海边的温柔小村，HV 的大家都住在这里。</div>
  <div class="riko-tabs__panel" hidden>画笔、颜料盒，还有一串会发光的流星项链。</div>
  <div class="riko-tabs__panel" hidden>这一页还没有写好哦。</div>
</div>
```

**示例 · 纵向 + 手动激活**

```html
<div class="riko-tabs riko-tabs--vertical" data-riko="tabs" data-riko-activation="manual">
  <div class="riko-tabs__list" aria-label="设定集">
    <button type="button" class="riko-tabs__tab" aria-selected="true">人物</button>
    <button type="button" class="riko-tabs__tab">地点</button>
    <button type="button" class="riko-tabs__tab">道具 <span class="riko-tabs__badge">12</span></button>
    <button type="button" class="riko-tabs__tab" disabled>未解锁</button>
  </div>
  <div class="riko-tabs__panel">络可：喜欢画画的小女孩，戴着带星星的贝雷帽。</div>
  <div class="riko-tabs__panel" hidden>百络谷：海边的温柔小村，HV 的大家都住在这里。</div>
  <div class="riko-tabs__panel" hidden>画笔、颜料盒，还有一串会发光的流星项链。</div>
  <div class="riko-tabs__panel" hidden>这一页还没有写好哦。</div>
</div>
```

相关：[accordion](accordion.md)、[segmented](segmented.md)
