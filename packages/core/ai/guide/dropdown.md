<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 下拉菜单 Dropdown Menu `dropdown`

点击按钮弹出的操作菜单（riko-menu），支持图标、快捷键、分组标题、分隔线、勾选项与危险操作。

**何时用**：收纳次要操作或选项。需要从列表里选一个值并提交表单时用 select / combobox；悬停提示用 tooltip。

**根**：`riko-dropdown`（推荐 `<div>`）

**部件**：
- `riko-menu` 菜单面板（role="menu"，初始 hidden）（必需）
- `riko-menu__item` 菜单项（button 或 a，role="menuitem" / menuitemcheckbox / menuitemradio）（必需）
- `riko-menu__icon` 项前图标容器
- `riko-menu__shortcut` 右侧快捷键提示（<kbd>）
- `riko-menu__desc` 项内第二行说明
- `riko-menu__label` 分组标题
- `riko-menu__separator` 分隔线（<hr>）
- `riko-menu__danger` 危险操作项：与 riko-menu__item 同时写在同一元素上

**修饰**（同组互斥）：
- decor：`riko-dropdown--no-caret` 触发按钮不显示下拉箭头

**状态**：
- `aria-expanded="true"`（在 `[aria-haspopup]`） 菜单打开（JS 维护）
- `aria-checked="true"`（在 `riko-menu__item`） 勾选项被选中
- `disabled`（在 `riko-menu__item`） 不可用项
- `hidden`（在 `riko-menu`） 菜单关闭

**JS**：
- 启用：`data-riko="dropdown"`
- 选项 `data-riko-placement`（bottom-start | bottom-end | bottom | top-start | top-end | right-start | left-start …） 默认 bottom-start：菜单相对按钮的位置（空间不足自动翻转）
- 选项 `data-riko-keep-open`（（写在菜单项上））：选择该项后不关闭菜单
- 方法 `el.riko.open() / close() / toggle()`：开关菜单
- 方法 `el.riko.isOpen`：是否打开
- 事件 `riko:dropdown:open`：菜单打开
- 事件 `riko:dropdown:close`：菜单关闭
- 事件 `riko:dropdown:select` detail { item, value, checked }：选择菜单项（value 取 data-value 或文字）

**无障碍**：
- 触发按钮需要 aria-haspopup="menu"（JS 会补 aria-expanded / aria-controls）。
- 键盘：↓/Enter/Space 打开并聚焦首项，↑ 打开并聚焦末项；菜单内 ↑↓ Home End、首字母跳转、Esc 关闭、Tab 离开。
- 勾选项用 role="menuitemcheckbox|menuitemradio" + aria-checked；单选项放进 role="group"。

**要点**：
- ✓ 结构：.riko-dropdown 的直接子元素是触发按钮和 .riko-menu。
- ✓ 菜单项是链接时用 <a class="riko-menu__item" role="menuitem" href>。
- ✓ 危险项写 class="riko-menu__item riko-menu__danger"。

**避免**：
- ✗ 不要在菜单里放输入框等复杂控件（那是 popover）。
- ✗ 不要用 riko-menu__item--danger（部件不能带修饰），改用 riko-menu__danger。

**示例 · 操作菜单**

```html
<div class="riko-dropdown" data-riko="dropdown">
  <button type="button" class="riko-btn" aria-haspopup="menu">更多操作</button>
  <div class="riko-menu" role="menu" hidden>
    <p class="riko-menu__label">本节</p>
    <button type="button" class="riko-menu__item" role="menuitem"><span class="riko-menu__icon"><i data-lucide="bookmark"></i></span>加入书签<kbd class="riko-menu__shortcut">B</kbd></button>
    <button type="button" class="riko-menu__item" role="menuitem"><span class="riko-menu__icon"><i data-lucide="share-2"></i></span>分享给朋友</button>
    <a class="riko-menu__item" role="menuitem" href="#"><span class="riko-menu__icon"><i data-lucide="message-circle"></i></span>去论坛讨论</a>
    <hr class="riko-menu__separator">
    <button type="button" class="riko-menu__item riko-menu__danger" role="menuitem"><span class="riko-menu__icon"><i data-lucide="trash-2"></i></span>清除阅读记录</button>
  </div>
</div>
```

**示例 · 勾选菜单（右对齐）**

```html
<div class="riko-dropdown" data-riko="dropdown" data-riko-placement="bottom-end">
  <button type="button" class="riko-btn riko-btn--soft" aria-haspopup="menu"><i data-lucide="sliders-horizontal"></i>阅读设置</button>
  <div class="riko-menu" role="menu" hidden>
    <button type="button" class="riko-menu__item" role="menuitemcheckbox" aria-checked="true" data-riko-keep-open>显示已读星星</button>
    <button type="button" class="riko-menu__item" role="menuitemcheckbox" aria-checked="false" data-riko-keep-open>首行缩进</button>
    <hr class="riko-menu__separator">
    <div role="group" aria-label="字体">
      <p class="riko-menu__label">字体</p>
      <button type="button" class="riko-menu__item" role="menuitemradio" aria-checked="true" data-riko-keep-open>宋体（衬线）</button>
      <button type="button" class="riko-menu__item" role="menuitemradio" aria-checked="false" data-riko-keep-open>黑体（无衬线）</button>
    </div>
  </div>
</div>
```

相关：[popover](popover.md)、[select](select.md)、[button](button.md)
