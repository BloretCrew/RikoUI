<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 下拉选择 Select `select`

美化后的原生 <select>，支持分组、多选列表。

**何时用**：选项较少（< 15）且不需要搜索时。需要搜索/自定义选项时用 combobox。

**根**：`riko-select`（推荐 `<select>`）

**修饰**（同组互斥）：
- size：`riko-select--sm` 小号；`riko-select--lg` 大号

**状态**：
- `disabled` 禁用
- `aria-invalid="true"` 校验失败：红色边框（配合 riko-field__error）

**无障碍**：
- 必须有 label 或 aria-label。

**要点**：
- ✓ 选项直接写 <option>，分组用 <optgroup label>。
- ✓ 写 multiple 或 size 时自动变为列表外观。

**避免**：
- ✗ 不要用 div 模拟下拉框（需要时用 combobox 组件）。

**示例 · 基础**

```html
<select class="riko-select" aria-label="喜欢的角色">
  <option>络可</option>
  <option>Star</option>
  <option>111</option>
  <option disabled>神秘人（未解锁）</option>
</select>
```

**示例 · 分组与尺寸**

```html
<div class="riko-stack riko-stack--sm">
  <select class="riko-select riko-select--sm" aria-label="章节">
    <optgroup label="序章">
      <option>沙滩上的画家</option>
      <option>世界的边缘</option>
    </optgroup>
    <optgroup label="第一章">
      <option>晨会上的沉重决议</option>
    </optgroup>
  </select>
  <select class="riko-select riko-select--lg" aria-label="字号">
    <option>大字号阅读</option>
  </select>
</div>
```

**示例 · 多选列表**

```html
<select class="riko-select" multiple aria-label="标签">
  <option selected>温馨</option>
  <option>冒险</option>
  <option selected>治愈</option>
  <option>悬疑</option>
</select>
```

相关：[field](field.md)、[combobox](combobox.md)、[segmented](segmented.md)
