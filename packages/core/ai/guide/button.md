<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 按钮 Button `button`

触发操作的按钮：纸白描边 + 底部实体阴影，悬停上浮、按下下沉。

**何时用**：用于提交、打开弹窗、执行操作等。跳转页面时用 <a class="riko-btn" href>；只是行内文字链接改用 riko-link。

**根**：`riko-btn`（推荐 `<button>`）

**部件**：
- `riko-btn__badge` 按钮内的计数徽章

**修饰**（同组互斥）：
- variant：`riko-btn--primary` 主要操作：可可色实心（每个区域最多一个）；`riko-btn--accent` 强调：暖橙色实心；`riko-btn--ice` 冰蓝色；`riko-btn--soft` 浅橙底，无描边；`riko-btn--outline` 虚线描边，透明底；`riko-btn--ghost` 无边框，悬停出现浅底（工具栏、次要操作）；`riko-btn--link` 像链接一样的按钮；`riko-btn--danger` 危险操作（删除等）
- size：`riko-btn--xs` 超小 28px；`riko-btn--sm` 小号 34px；`riko-btn--lg` 大号 52px；`riko-btn--xl` 超大 60px
- shape：`riko-btn--icon` 仅图标的正圆角方形按钮（必须有 aria-label）；`riko-btn--round` 正圆按钮（仅图标，必须有 aria-label）；`riko-btn--square` 手绘不规则圆角
- layout：`riko-btn--block` 占满父容器宽度

**状态**：
- `disabled` <button> 禁用
- `aria-disabled="true"` <a> 链接按钮禁用（同时去掉 href）
- `aria-busy="true"` 加载中：显示旋转图标并阻止点击
- `aria-pressed="true"` 切换按钮的按下状态

**无障碍**：
- <button> 必须写 type（button / submit / reset）。
- 仅图标按钮（--icon / --round）必须有 aria-label。
- 切换型按钮用 aria-pressed 表示状态，不要用类名。

**要点**：
- ✓ 图标直接放在按钮里：<i data-lucide="名称"></i>，间距自动处理；图标放在文字后面时悬停会轻轻右移。
- ✓ 一个区域只放一个 --primary 按钮，其余用默认或 --ghost。
- ✓ 外观、尺寸、形状三组修饰各选一个即可自由组合。

**避免**：
- ✗ 不要用 <div onclick> 代替按钮。
- ✗ 不要给按钮写内联颜色，用外观修饰或覆盖 --riko-btn-bg 等私有变量。
- ✗ 不要同时写两个外观修饰（如 --primary 和 --ghost）。

**示例 · 外观**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn">默认按钮</button>
  <button type="button" class="riko-btn riko-btn--primary">开始阅读</button>
  <button type="button" class="riko-btn riko-btn--accent">点亮星星</button>
  <button type="button" class="riko-btn riko-btn--ice">冰蓝色</button>
  <button type="button" class="riko-btn riko-btn--soft">柔和</button>
  <button type="button" class="riko-btn riko-btn--outline">虚线描边</button>
  <button type="button" class="riko-btn riko-btn--ghost">幽灵</button>
  <button type="button" class="riko-btn riko-btn--link">文字链接</button>
  <button type="button" class="riko-btn riko-btn--danger">删除画稿</button>
</div>
```

**示例 · 带图标**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn riko-btn--primary"><i data-lucide="book-open"></i>开始阅读</button>
  <a class="riko-btn" href="#button">下一节<i data-lucide="arrow-right"></i></a>
  <button type="button" class="riko-btn riko-btn--soft"><span class="riko-star" aria-hidden="true"></span>收藏</button>
  <button type="button" class="riko-btn">消息<span class="riko-btn__badge">3</span></button>
</div>
```

**示例 · 尺寸**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn riko-btn--xs">超小</button>
  <button type="button" class="riko-btn riko-btn--sm">小号</button>
  <button type="button" class="riko-btn">默认</button>
  <button type="button" class="riko-btn riko-btn--lg">大号</button>
  <button type="button" class="riko-btn riko-btn--xl">超大</button>
</div>
```

**示例 · 仅图标与形状**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn riko-btn--icon" aria-label="设置"><i data-lucide="settings"></i></button>
  <button type="button" class="riko-btn riko-btn--icon riko-btn--ice" aria-label="搜索"><i data-lucide="search"></i></button>
  <button type="button" class="riko-btn riko-btn--round riko-btn--accent" aria-label="点赞"><i data-lucide="heart"></i></button>
  <button type="button" class="riko-btn riko-btn--square riko-btn--soft">方角按钮</button>
  <button type="button" class="riko-btn riko-btn--ghost riko-btn--icon riko-btn--sm" aria-label="更多"><i data-lucide="ellipsis"></i></button>
</div>
```

**示例 · 状态**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn" disabled>不可用</button>
  <button type="button" class="riko-btn riko-btn--primary" aria-busy="true">保存中</button>
  <button type="button" class="riko-btn" aria-pressed="true"><i data-lucide="bookmark"></i>已加书签</button>
  <a class="riko-btn riko-btn--outline" aria-disabled="true">链接不可用</a>
</div>
```

**示例 · 占满宽度**

```html
<button type="button" class="riko-btn riko-btn--primary riko-btn--lg riko-btn--block"><i data-lucide="sparkles"></i>踏入络的世界</button>
```

相关：[button-group](button-group.md)、[link](link.md)、[theme-picker](theme-picker.md)
