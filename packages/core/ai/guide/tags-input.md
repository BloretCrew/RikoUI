<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 标签输入 Tags Input `tags-input`

输入后按回车 / 逗号生成标签，可删除、可粘贴批量添加，结果以逗号分隔同步到隐藏 input。

**何时用**：关键词、标签、收件人等可自由输入的多个短值。只能从固定选项多选时用 checkbox（--card / chip 样式）。

**根**：`riko-tags-input`（推荐 `<div>`）

**部件**：
- `riko-tags-input__input` 文字输入框（必需）
- `riko-tags-input__tag` 标签（JS 生成；也可预先写好作为初始值）
- `riko-tags-input__label` 标签文字
- `riko-tags-input__remove` 标签的删除按钮

**修饰**（同组互斥）：
- shape：`riko-tags-input--block` 占满容器宽度

**状态**：
- `aria-invalid="true"` 错误状态
- `data-state="armed"`（在 `riko-tags-input__tag`） 按一次退格后待删除（JS 维护）

**JS**：
- 启用：`data-riko="tags-input"`
- 选项 `data-riko-name`（字符串）：隐藏 input 的 name（随表单提交，逗号分隔）
- 选项 `data-riko-value`（逗号分隔）：初始标签
- 选项 `data-riko-max`（数字） 默认 不限：最多几个标签
- 选项 `data-riko-unique`（true | false） 默认 true：是否去重（不区分大小写）
- 选项 `data-riko-add-on-blur`（true | false） 默认 true：失焦时把未确认的文字加为标签
- 选项 `data-riko-required`（布尔属性）：配合 form-validate：至少一个标签
- 方法 `el.riko.tags`：标签数组
- 方法 `el.riko.add(text)`：添加（可逗号分隔多个）
- 方法 `el.riko.remove(index)`：删除第 index 个
- 方法 `el.riko.set(list)`：整体替换
- 方法 `el.riko.clear()`：清空
- 事件 `riko:tags-input:change` detail { tags, value }：标签变化

**无障碍**：
- 输入框需要 aria-label 或 <label for>；根元素自动设为 role=group。
- 每个删除按钮自动带「移除标签 X」的 aria-label，增删结果通过隐藏的 aria-live 区域播报。

**要点**：
- ✓ 只写一个输入框，标签和隐藏 input 交给 JS。
- ✓ 分隔符：回车、英文逗号、中文逗号、顿号、换行。

**避免**：
- ✗ 不要把多个值写在一个普通 input 里让用户自己用逗号分隔。

**示例 · 基础用法**

```html
<div class="riko-tags-input" data-riko="tags-input" data-riko-name="tags" data-riko-value="络可,星星酥,百络谷">
  <input class="riko-tags-input__input" type="text" placeholder="输入后按回车添加" aria-label="作品标签">
</div>
```

**示例 · 限制数量**

```html
<div class="riko-field" style="max-width: 420px">
  <label class="riko-field__label" for="fav">最喜欢的三个角色</label>
  <div class="riko-tags-input riko-tags-input--block" data-riko="tags-input" data-riko-name="favorites" data-riko-max="3">
    <input class="riko-tags-input__input" id="fav" type="text" placeholder="最多 3 个">
  </div>
  <p class="riko-field__hint">支持一次粘贴多个，用逗号分隔</p>
</div>
```

相关：[combobox](combobox.md)、[tag](tag.md)、[field](field.md)
