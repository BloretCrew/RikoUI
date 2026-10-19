<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 标签 Tag `tag`

胶囊形的小标签，表示分类、状态或关键词，可带图标、星星，或做成可移除。

**何时用**：标注属性、状态、分类、关键词。数量提示用 badge；可编辑的标签输入用 tags-input。

**根**：`riko-tag`（推荐 `<span（可点击时 a）>`）

**部件**：
- `riko-tag__remove` 移除按钮（配合 data-riko-dismiss）

**修饰**（同组互斥）：
- tone：`riko-tag--accent` 暖橙（强调、最新）；`riko-tag--ice` 冰蓝；`riko-tag--soft` 米色无边；`riko-tag--success` 成功；`riko-tag--warning` 警告；`riko-tag--danger` 危险；`riko-tag--primary` 可可色实心
- decor：`riko-tag--outline` 透明底；`riko-tag--dashed` 虚线边框
- size：`riko-tag--sm` 小号；`riko-tag--lg` 大号
- shape：`riko-tag--square` 小圆角

**JS**：
- 启用：`data-riko-dismiss`
- 选项 `data-riko-dismiss`（空 | 选择器 | #id） 默认 空：点击后移除：空=最近的组件根（如 .riko-tag / .riko-alert / .riko-card）；选择器=最近匹配的祖先；#id=指定元素。对任何组件通用。
- 方法 `Riko.dismiss(element)`：以淡出动画移除元素（同样会派发 riko:dismiss）
- 事件 `riko:dismiss` detail { target, trigger }：移除前在目标上派发，可 preventDefault() 取消
- 事件 `riko:dismissed` detail { target }：移除后在原父元素上派发

**无障碍**：
- __remove 是仅图标按钮，必须有 aria-label（如「移除 星星酥」）。
- 移除后焦点会自动移到相邻标签的移除按钮。

**要点**：
- ✓ 图标或星星直接放在标签里：<span class="riko-tag"><span class="riko-star" aria-hidden="true"></span>文字</span>。
- ✓ 可点击的标签用 <a class="riko-tag" href>。
- ✓ data-riko-dismiss 是全站通用的「关闭/移除」机制，alert、card 等也可使用。

**避免**：
- ✗ 不要用 tag 显示纯数字计数，改用 badge。
- ✗ 不要把 riko-tag__remove 放在 riko-tag 外面。

**示例 · 色调**

```html
<div class="riko-cluster riko-cluster--sm">
  <span class="riko-tag">默认</span>
  <span class="riko-tag riko-tag--accent"><span class="riko-star" aria-hidden="true"></span>敬请期待后续更新！</span>
  <span class="riko-tag riko-tag--ice riko-tag--dashed"><i data-lucide="pencil"></i>设定集 · 未完成</span>
  <span class="riko-tag riko-tag--soft">米色</span>
  <span class="riko-tag riko-tag--success">已完结</span>
  <span class="riko-tag riko-tag--warning">修订中</span>
  <span class="riko-tag riko-tag--danger">含剧透</span>
  <span class="riko-tag riko-tag--primary">主线</span>
</div>
```

**示例 · 样式与尺寸**

```html
<div class="riko-cluster riko-cluster--sm">
  <span class="riko-tag riko-tag--sm">小号</span>
  <span class="riko-tag riko-tag--lg">大号</span>
  <span class="riko-tag riko-tag--outline riko-tag--accent">透明底</span>
  <span class="riko-tag riko-tag--dashed">虚线</span>
  <span class="riko-tag riko-tag--square riko-tag--ice">小圆角</span>
  <a class="riko-tag" href="#tag"><i data-lucide="hash"></i>可点击</a>
</div>
```

**示例 · 可移除**

```html
<div class="riko-cluster riko-cluster--sm">
  <span class="riko-tag riko-tag--accent">星星酥<button type="button" class="riko-tag__remove" data-riko-dismiss aria-label="移除 星星酥"></button></span>
  <span class="riko-tag riko-tag--accent">流星项链<button type="button" class="riko-tag__remove" data-riko-dismiss aria-label="移除 流星项链"></button></span>
  <span class="riko-tag riko-tag--accent">贝雷帽<button type="button" class="riko-tag__remove" data-riko-dismiss aria-label="移除 贝雷帽"></button></span>
</div>
```

相关：[badge](badge.md)、[tags-input](tags-input.md)
