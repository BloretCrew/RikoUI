<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 字段组 Fieldset `fieldset`

用 legend 给一组相关控件起标题，可做成缝线卡片。

**何时用**：一组单选/复选框，或把长表单分成几个小节。

**根**：`riko-fieldset`（推荐 `<fieldset>`）

**部件**：
- `riko-fieldset__legend` 标题（<legend>）（必需）
- `riko-fieldset__desc` 说明文字

**修饰**（同组互斥）：
- layout：`riko-fieldset--inline` 选项横向排列
- variant：`riko-fieldset--card` 缝线卡片外框

**状态**：
- `disabled` 整组禁用（原生行为）

**无障碍**：
- 用原生 <fieldset> + <legend>，读屏会在每个选项前读出组名。

**要点**：
- ✓ 单选组、复选组一律放进 fieldset。

**避免**：
- ✗ 不要用 div + 标题代替 fieldset/legend。

**示例 · 基础**

```html
<fieldset class="riko-fieldset">
  <legend class="riko-fieldset__legend">喜欢的点心</legend>
  <p class="riko-fieldset__desc">可以多选哦</p>
  <label class="riko-checkbox"><input type="checkbox" checked> 星星酥</label>
  <label class="riko-checkbox"><input type="checkbox"> 海盐饼干</label>
</fieldset>
```

**示例 · 卡片**

```html
<fieldset class="riko-fieldset riko-fieldset--card">
  <legend class="riko-fieldset__legend"><span class="riko-star" aria-hidden="true"></span>通知设置</legend>
  <label class="riko-switch riko-switch--end"><input type="checkbox" role="switch" checked> 新章节更新</label>
  <label class="riko-switch riko-switch--end"><input type="checkbox" role="switch"> 设定集更新</label>
</fieldset>
```

相关：[form](form.md)、[checkbox](checkbox.md)、[radio](radio.md)
