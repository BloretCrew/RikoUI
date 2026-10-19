<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 开关 Switch `switch`

立即生效的开/关设置，打开时圆钮里出现一颗小星星。

**何时用**：设置项「打开/关闭」且立即生效。需要提交表单才生效的勾选用 checkbox。

**根**：`riko-switch`（推荐 `<label>`）

**部件**：
- `riko-switch__text` 标题 + 说明的文字容器
- `riko-switch__desc` 说明小字

**修饰**（同组互斥）：
- size：`riko-switch--sm` 小号；`riko-switch--lg` 大号
- layout：`riko-switch--end` 文字在左、开关在右，占满一行（设置列表）

**状态**：
- `checked`（在 `input`） 打开
- `disabled`（在 `input`） 禁用

**无障碍**：
- input 写 role="switch"，读屏会读作「开关，开/关」。

**要点**：
- ✓ 结构：<label class="riko-switch"><input type="checkbox" role="switch"> 文字</label>。

**避免**：
- ✗ 不要用按钮 + 类名模拟开关。

**示例 · 基础**

```html
<div class="riko-stack riko-stack--sm">
  <label class="riko-switch"><input type="checkbox" role="switch" checked> 新章节提醒</label>
  <label class="riko-switch"><input type="checkbox" role="switch"> 夜间护眼</label>
  <label class="riko-switch"><input type="checkbox" role="switch" disabled> 自动翻页（即将推出）</label>
</div>
```

**示例 · 尺寸**

```html
<div class="riko-cluster riko-cluster--lg">
  <label class="riko-switch riko-switch--sm"><input type="checkbox" role="switch" checked> 小号</label>
  <label class="riko-switch"><input type="checkbox" role="switch" checked> 默认</label>
  <label class="riko-switch riko-switch--lg"><input type="checkbox" role="switch" checked> 大号</label>
</div>
```

**示例 · 设置列表**

```html
<div class="riko-stack">
  <label class="riko-switch riko-switch--end"><input type="checkbox" role="switch" checked><span class="riko-switch__text">漂浮星星<span class="riko-switch__desc">在页面背景中显示闪烁的小星星</span></span></label>
  <label class="riko-switch riko-switch--end"><input type="checkbox" role="switch"><span class="riko-switch__text">减少动画<span class="riko-switch__desc">关闭回弹与淡入效果</span></span></label>
</div>
```

相关：[checkbox](checkbox.md)
