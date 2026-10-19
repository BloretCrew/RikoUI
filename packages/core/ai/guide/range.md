<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 滑块 Range `range`

美化的原生滑块：已选段为暖橙色，可同步显示数值。

**何时用**：在连续区间内调节数值（音量、字号、亮度）。需要精确数字时配合 number 输入。

**根**：`riko-range`（推荐 `<input>`）

**部件**：
- `riko-output` 数值显示徽章：独立的 <output class="riko-output" for="滑块 id">（不放在 input 内）

**修饰**（同组互斥）：
- size：`riko-range--sm` 细轨道小圆钮
- variant：`riko-range--ice` 冰蓝色

**状态**：
- `disabled` 禁用

**JS**：
- 启用：`data-riko="range"`
- 选项 `data-riko-output`（CSS 选择器） 默认 output[for=该 id]：额外要同步显示值的元素
- 选项 `data-riko-suffix`（文本） 默认 无：显示值的后缀，如 px、%
- 方法 `el.riko.update()`：用 JS 改 value 后刷新填充与显示

**无障碍**：
- 必须有 label 或 aria-label。

**要点**：
- ✓ 建议总是加 data-riko="range"，否则 Chrome/Safari 中已选段不会着色（Firefox 原生支持）。

**避免**：
- ✗ 不要用 div 模拟滑块。

**示例 · 基础**

```html
<input class="riko-range" type="range" min="0" max="100" value="40" data-riko="range" aria-label="背景音乐音量">
```

**示例 · 显示数值**

```html
<div class="riko-field">
  <div class="riko-cluster riko-cluster--between">
    <label class="riko-field__label" for="font-size">正文字号</label>
    <output class="riko-output" for="font-size">18px</output>
  </div>
  <input class="riko-range" id="font-size" type="range" min="14" max="26" value="18" data-riko="range" data-riko-suffix="px">
</div>
```

**示例 · 小号与冰蓝**

```html
<div class="riko-stack">
  <input class="riko-range riko-range--sm" type="range" value="70" data-riko="range" aria-label="亮度">
  <input class="riko-range riko-range--ice" type="range" value="25" data-riko="range" aria-label="海浪声">
  <input class="riko-range" type="range" value="50" disabled data-riko="range" aria-label="不可调节">
</div>
```

相关：[field](field.md)、[input](input.md)
