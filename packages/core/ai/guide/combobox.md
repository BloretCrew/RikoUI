<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 可搜索选择 Combobox `combobox`

可输入关键字过滤的单选下拉（WAI-ARIA combobox + listbox），支持内联选项或增强原生 <select>；附带可复用的 riko-listbox 选项列表样式。

**何时用**：选项较多（> 7 个）需要搜索时。选项很少用 riko-select（原生下拉）或 radio / segmented；可自由输入多个值用 tags-input。

**根**：`riko-combobox`（推荐 `<div>`）

**部件**：
- `riko-combobox__input` 文本输入框（role=combobox 等 ARIA 由 JS 补全）（必需）
- `riko-combobox__list` 弹出的选项列表 <ul>，同时加 riko-listbox（必需）
- `riko-combobox__value` 隐藏 input，保存选中值（写 data-riko-name 时自动生成）
- `riko-listbox` 选项列表容器（可脱离 combobox 单独用于菜单式列表）
- `riko-listbox__option` 选项 <li>，data-value 为提交值，文本为显示名
- `riko-listbox__desc` 选项内的次要说明
- `riko-listbox__group` 分组标题（role=presentation）
- `riko-listbox__empty` 无结果提示（JS 自动生成）

**修饰**（同组互斥）：
- size：`riko-combobox--sm` 小号；`riko-combobox--lg` 大号
- shape：`riko-combobox--block` 占满容器宽度

**状态**：
- `aria-expanded="true"`（在 `riko-combobox__input`） 列表展开（JS 维护）
- `aria-selected="true"`（在 `riko-listbox__option`） 已选中（可在 HTML 中预设初始值）
- `aria-disabled="true"`（在 `riko-listbox__option`） 不可选的选项
- `data-state="active"`（在 `riko-listbox__option`） 键盘高亮项（JS 维护）
- `disabled`（在 `riko-combobox__input`） 禁用

**JS**：
- 启用：`data-riko="combobox"`
- 选项 `data-riko-name`（字符串）：内联模式下生成隐藏 input 的 name
- 选项 `data-riko-empty`（字符串） 默认 没有找到呢……换个关键词试试吧 ✦：无结果提示文案
- 方法 `el.riko.value`：当前选中值
- 方法 `el.riko.setValue(value)`：按 data-value 选中
- 方法 `el.riko.open()`：打开列表
- 方法 `el.riko.close()`：关闭列表
- 方法 `el.riko.refresh()`：动态增删选项后重新扫描
- 事件 `riko:combobox:change` detail { value, label, option }：选中值改变
- 事件 `riko:combobox:open`：列表打开
- 事件 `riko:combobox:close`：列表关闭

**无障碍**：
- 输入框需要 aria-label 或 <label for>；增强 select 时会自动把 <label for> 转接到生成的输入框。
- 键盘：↓ 打开 / 下移，↑ 上移，Home / End 首尾，Enter 选中，Esc 关闭（再按清空）。

**要点**：
- ✓ 只写结构，role / aria-* / id 全部交给 JS。
- ✓ 内联选项用 data-value 指定提交值；显示文本取选项的第一段文字（可用 data-label 覆盖）。
- ✓ 列表以 popover 顶层显示，放在弹窗、卡片里也不会被遮挡。

**避免**：
- ✗ 不要把 riko-listbox__option 写成 <button> 或 <a>。
- ✗ 不要给 combobox 输入框加 riko-input 类。

**示例 · 内联选项**

```html
<div class="riko-combobox" data-riko="combobox" data-riko-name="character">
  <input class="riko-combobox__input" type="text" placeholder="选择一位角色…" aria-label="角色">
  <ul class="riko-combobox__list riko-listbox">
    <li class="riko-listbox__option" data-value="riko">络可<span class="riko-listbox__desc">沙滩上的小画家</span></li>
    <li class="riko-listbox__option" data-value="star">Star<span class="riko-listbox__desc">戴眼罩的少年</span></li>
    <li class="riko-listbox__option" data-value="111">111<span class="riko-listbox__desc">HV 的村长</span></li>
    <li class="riko-listbox__option" data-value="wuni">无昵</li>
    <li class="riko-listbox__option" data-value="rhedar">Rhedar</li>
    <li class="riko-listbox__option" data-value="mizu" aria-disabled="true">Mizu（暂未登场）</li>
  </ul>
</div>
```

**示例 · 增强原生下拉**

```html
<div class="riko-field" style="max-width: 320px">
  <label class="riko-field__label" for="act">想从哪一幕开始读？</label>
  <div class="riko-combobox riko-combobox--block" data-riko="combobox">
    <select id="act" name="act">
      <option value="">搜索幕名…</option>
      <optgroup label="序章">
        <option value="p1">第一幕：沙滩上的画家</option>
        <option value="p2">第二幕：归途的微光</option>
        <option value="p3">第三幕：暗林深处</option>
      </optgroup>
      <optgroup label="第一章">
        <option value="c1">第一幕：自晨曦中归来</option>
        <option value="c2">第二幕：于木石间相嬉</option>
        <option value="c5">第五幕：落星摇曳，清风回荡</option>
      </optgroup>
    </select>
  </div>
</div>
```

相关：[select](select.md)、[search](search.md)、[tags-input](tags-input.md)、[dropdown](dropdown.md)
