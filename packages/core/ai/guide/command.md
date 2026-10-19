<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 命令面板 Command Palette `command`

快捷键唤起的全局搜索/命令弹窗：输入即过滤、分组结果、↑↓ 选择、Enter 执行，线性动画开合。

**何时用**：站点内容较多、需要快速跳转或执行操作时；也可作为全局搜索。只是表单里的可搜索选择请用 combobox。

**根**：`riko-command`（推荐 `<dialog>`）

**部件**：
- `riko-command__search` 顶部搜索栏（放大镜由 CSS 绘制）（必需）
- `riko-command__input` 搜索输入框（需 aria-label）（必需）
- `riko-command__esc` 右侧 Esc 提示
- `riko-command__list` 结果列表（role="listbox"）（必需）
- `riko-command__group` 结果分组
- `riko-command__group-label` 分组标题
- `riko-command__item` 结果项（a 或 button，role="option"）（必需）
- `riko-command__icon` 项前图标方块
- `riko-command__text` 项标题（匹配文字会被 <mark> 高亮）
- `riko-command__desc` 项说明（放在 __text 内）
- `riko-command__shortcut` 项右侧快捷键
- `riko-command__empty` 无结果提示（初始 hidden）
- `riko-command__footer` 底部按键说明

**状态**：
- `aria-selected="true"`（在 `riko-command__item`） 键盘当前项（JS 维护）
- `hidden`（在 `riko-command__item`） 被过滤掉的项
- `data-state="closing"` 关闭动画进行中

**JS**：
- 启用：`data-riko="command"`
- 选项 `data-riko-hotkey`（单个字母）：Ctrl/⌘ + 该字母开关面板，如 k
- 选项 `data-riko-open`（面板 id（写在任意按钮上））：点击该元素打开面板
- 选项 `data-riko-keywords`（空格分隔（写在条目上））：额外的搜索别名
- 方法 `el.riko.open() / close() / toggle()`：开关面板
- 方法 `el.riko.filter(query)`：以指定关键词过滤
- 事件 `riko:command:open`：打开
- 事件 `riko:command:close`：关闭
- 事件 `riko:command:filter` detail { query, count }：过滤后
- 事件 `riko:command:select` detail { item, value, query }：选择条目（可 preventDefault 阻止链接跳转）

**无障碍**：
- 必须使用原生 <dialog>，并有 aria-label。
- 输入框是 combobox，结果是 listbox；用 aria-activedescendant 指示当前项（JS 维护）。
- 关闭后焦点回到打开前的元素；Esc 关闭。

**要点**：
- ✓ 链接型条目选择后会跳转；按钮型条目通过 riko:command:select 处理（读取 data-value）。
- ✓ 空格分隔的多个关键词需同时匹配。
- ✓ 打开时页面滚动被锁定。

**避免**：
- ✗ 不要用 <div> 代替 <dialog>。
- ✗ 不要自己写 Ctrl+K 监听，用 data-riko-hotkey。

**示例 · 命令面板**

```html
<button type="button" class="riko-btn riko-btn--soft" data-riko-open="demo-command"><i data-lucide="search"></i>快速搜索 <kbd class="riko-kbd">Ctrl K</kbd></button>
<dialog class="riko-command" id="demo-command" data-riko="command" data-riko-hotkey="k" aria-label="快速搜索">
  <div class="riko-command__search">
    <input class="riko-command__input" type="text" placeholder="搜索章节、设定或操作…" aria-label="搜索">
    <kbd class="riko-command__esc">Esc</kbd>
  </div>
  <div class="riko-command__list">
    <div class="riko-command__group">
      <p class="riko-command__group-label">章节</p>
      <a class="riko-command__item" href="#001"><span class="riko-command__icon"><i data-lucide="book-open"></i></span><span class="riko-command__text">沙滩上的画家<span class="riko-command__desc">序章 · 第一幕 · 001</span></span></a>
      <a class="riko-command__item" href="#076"><span class="riko-command__icon"><i data-lucide="sparkles"></i></span><span class="riko-command__text">风过围垣，落星回响<span class="riko-command__desc">第一章 · 第五幕 · 最新</span></span></a>
    </div>
    <div class="riko-command__group">
      <p class="riko-command__group-label">设定</p>
      <a class="riko-command__item" href="#riko" data-riko-keywords="主角 贝雷帽 画家"><span class="riko-command__icon"><i data-lucide="palette"></i></span><span class="riko-command__text">络可<span class="riko-command__desc">喜欢画画的小女孩</span></span></a>
      <a class="riko-command__item" href="#hv" data-riko-keywords="村庄 百络谷"><span class="riko-command__icon"><i data-lucide="house"></i></span><span class="riko-command__text">HV 村<span class="riko-command__desc">大家的家</span></span></a>
    </div>
    <div class="riko-command__group">
      <p class="riko-command__group-label">操作</p>
      <button type="button" class="riko-command__item" data-value="theme"><span class="riko-command__icon"><i data-lucide="moon"></i></span><span class="riko-command__text">切换深浅色</span><kbd class="riko-command__shortcut">T</kbd></button>
    </div>
  </div>
  <p class="riko-command__empty" hidden>没有找到呢……换个关键词试试吧 ✦</p>
  <div class="riko-command__footer"><span><kbd>↑</kbd><kbd>↓</kbd>选择</span><span><kbd>↵</kbd>打开</span><span><kbd>Esc</kbd>关闭</span></div>
</dialog>
```

相关：[dialog](dialog.md)、[search](search.md)、[combobox](combobox.md)
