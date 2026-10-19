<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 搜索框 Search `search`

胶囊形搜索框：清除按钮、快捷键聚焦、防抖输入事件、可选结果计数与上一处 / 下一处；配合 Riko.highlight() 实现搜索并高亮。

**何时用**：站内搜索、列表过滤、文章 / 小说内查找。需要从候选项中选择一个值时改用 combobox。

**根**：`riko-search`（推荐 `<div>`）

**部件**：
- `riko-search__input` <input type="search">（必需）
- `riko-search__hint` 快捷键提示（<kbd>），输入后自动隐藏
- `riko-search__count` 结果计数，内容由 el.riko.setResult() 写入
- `riko-search__nav` 上一处 / 下一处按钮容器（有结果时显示）
- `riko-search__btn` 导航按钮，data-step="prev|next"，需要 aria-label
- `riko-search__clear` 清除按钮（JS 自动生成）

**修饰**（同组互斥）：
- size：`riko-search--sm` 小号；`riko-search--lg` 大号
- layout：`riko-search--block` 占满容器宽度
- shape：`riko-search--square` 圆角矩形（默认胶囊）

**状态**：
- `data-state="filled|empty"` 是否有内容（JS 维护）

**JS**：
- 启用：`data-riko="search"`
- 选项 `data-riko-hotkey`（单个按键 | none） 默认 /：聚焦快捷键；Ctrl/Cmd+K 始终可用（页面上只有第一个启用快捷键的搜索框生效）
- 选项 `data-riko-debounce`（毫秒） 默认 160：riko:search:input 防抖时间
- 方法 `el.riko.setResult(result)`：显示结果计数与导航：{ current, total, label? }；传 null 清除
- 方法 `el.riko.clear()`：清空
- 方法 `el.riko.focus()`：聚焦输入框
- 方法 `el.riko.value`：原始值
- 方法 `el.riko.query`：去空格并转小写的查询词
- 方法 `Riko.highlight(root, query, opts)`：在容器内用 <mark class="riko-mark"> 高亮全部匹配，返回 { count, marks, index, next(), prev(), go(i), clear() }；options：caseSensitive、className、currentClass、exclude、scroll
- 事件 `riko:search:input` detail { value, query }：输入防抖后派发（清空时也会派发）
- 事件 `riko:search:step` detail { dir: 1 | -1, query }：Enter / Shift+Enter 或点击导航按钮
- 事件 `riko:search:clear`：被清空时

**无障碍**：
- 输入框必须有 aria-label 或关联的 <label>。
- 导航按钮必须有 aria-label（如「上一处」「下一处」）；计数区自动设为 aria-live。

**要点**：
- ✓ 放大镜图标由 CSS 绘制，不要再手写图标。
- ✓ 每次输入都重新调用 Riko.highlight(root, query)，它会先清除上一次的高亮。
- ✓ 页面上有多个搜索框时，只给主搜索框保留快捷键，其余写 data-riko-hotkey="none"。

**避免**：
- ✗ 不要给 input 再加 riko-input 类。
- ✗ 不要自己用 innerHTML 替换文本来高亮（会破坏事件与结构），用 Riko.highlight()。

**示例 · 基础用法**

```html
<div class="riko-search" data-riko="search">
  <input class="riko-search__input" type="search" placeholder="搜索小说内容，例如：星星酥" aria-label="搜索小说内容">
  <kbd class="riko-search__hint">/</kbd>
</div>
```

**示例 · 尺寸**

```html
<div class="riko-stack">
  <div class="riko-search riko-search--sm" data-riko="search" data-riko-hotkey="none">
    <input class="riko-search__input" type="search" placeholder="小号搜索" aria-label="小号搜索">
  </div>
  <div class="riko-search riko-search--lg riko-search--block" data-riko="search" data-riko-hotkey="none">
    <input class="riko-search__input" type="search" placeholder="占满一行的大号搜索" aria-label="大号搜索">
  </div>
</div>
```

**示例 · 搜索并高亮**

```html
<div class="riko-search" data-riko="search" data-riko-hotkey="none" id="story-search">
  <input class="riko-search__input" type="search" placeholder="在下面的段落里搜索…" aria-label="搜索段落">
  <span class="riko-search__count"></span>
  <span class="riko-search__nav">
    <button type="button" class="riko-search__btn" data-step="prev" aria-label="上一处"></button>
    <button type="button" class="riko-search__btn" data-step="next" aria-label="下一处"></button>
  </span>
</div>
<div class="riko-prose riko-prose--read" id="story">…正文…</div>

<script>
  const box = document.getElementById('story-search');
  let hl = null;
  box.addEventListener('riko:search:input', e => {
    hl = Riko.highlight('#story', e.detail.query);
    hl.next();
    box.riko.setResult(e.detail.query ? { current: hl.index + 1, total: hl.count } : null);
  });
  box.addEventListener('riko:search:step', e => {
    if (!hl || !hl.count) return;
    e.detail.dir > 0 ? hl.next() : hl.prev();
    box.riko.setResult({ current: hl.index + 1, total: hl.count });
  });
</script>
```

相关：[combobox](combobox.md)、[input](input.md)、[typography](typography.md)
