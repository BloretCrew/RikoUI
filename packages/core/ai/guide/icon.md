<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 图标与星星 Icon & Star `icon`

页面图标推荐 Lucide；框架内置 47 个 Lucide 图标可用 riko-icon--<名> 直接显示；品牌五角星 riko-star。

**何时用**：任何图标位置。普通页面图标用 Lucide（<i data-lucide="名称">），不想加载 Lucide 时用内置 riko-icon--*；装饰与强调用 riko-star。

**根**：`riko-icon`（推荐 `<span>`）

**部件**：
- `riko-star` 品牌五角星（实心圆润），颜色默认橙色

**修饰**（同组互斥）：
- variant：`riko-icon--check` 内置图标 check；`riko-icon--x` 内置图标 x；`riko-icon--minus` 内置图标 minus；`riko-icon--plus` 内置图标 plus；`riko-icon--chevron-down` 内置图标 chevron-down；`riko-icon--chevron-up` 内置图标 chevron-up；`riko-icon--chevron-left` 内置图标 chevron-left；`riko-icon--chevron-right` 内置图标 chevron-right；`riko-icon--chevrons-up-down` 内置图标 chevrons-up-down；`riko-icon--arrow-up` 内置图标 arrow-up；`riko-icon--arrow-right` 内置图标 arrow-right；`riko-icon--arrow-left` 内置图标 arrow-left；`riko-icon--search` 内置图标 search；`riko-icon--info` 内置图标 info；`riko-icon--success` 内置图标 success；`riko-icon--warning` 内置图标 warning；`riko-icon--danger` 内置图标 danger；`riko-icon--help` 内置图标 help；`riko-icon--loader` 内置图标 loader；`riko-icon--upload` 内置图标 upload；`riko-icon--file` 内置图标 file；`riko-icon--calendar` 内置图标 calendar；`riko-icon--clock` 内置图标 clock；`riko-icon--eye` 内置图标 eye；`riko-icon--eye-off` 内置图标 eye-off；`riko-icon--copy` 内置图标 copy；`riko-icon--menu` 内置图标 menu；`riko-icon--more-horizontal` 内置图标 more-horizontal；`riko-icon--external-link` 内置图标 external-link；`riko-icon--sun` 内置图标 sun；`riko-icon--moon` 内置图标 moon；`riko-icon--monitor` 内置图标 monitor；`riko-icon--settings` 内置图标 settings；`riko-icon--inbox` 内置图标 inbox；`riko-icon--image` 内置图标 image；`riko-icon--user` 内置图标 user；`riko-icon--bell` 内置图标 bell；`riko-icon--grip-vertical` 内置图标 grip-vertical；`riko-icon--folder` 内置图标 folder；`riko-icon--folder-open` 内置图标 folder-open；`riko-icon--circle` 内置图标 circle；`riko-icon--dot` 内置图标 dot；`riko-icon--pencil` 内置图标 pencil；`riko-icon--feather` 内置图标 feather；`riko-icon--lock` 内置图标 lock；`riko-icon--send` 内置图标 send
- behavior：`riko-icon--spin` 旋转（加载中）；`riko-star--twinkle` 闪烁动画；`riko-star--bob` 上下漂浮动画
- size：`riko-icon--sm` 0.9em；`riko-icon--lg` 1.5em；`riko-icon--xl` 2em；`riko-star--xs` 星星 0.6em；`riko-star--sm` 星星 0.8em；`riko-star--lg` 星星 1.5em；`riko-star--xl` 星星 2.4em
- tone：`riko-star--ice` 冰蓝星星；`riko-star--muted` 浅棕星星

**JS**：
- 方法 `Riko.init(root)`：页面已加载 lucide 时，会自动把 root 内的 <i data-lucide> 渲染为 svg

**无障碍**：
- 纯装饰图标加 aria-hidden="true"；有含义的独立图标加 role="img" 与 aria-label。
- 仅含图标的按钮要在按钮上写 aria-label。

**要点**：
- ✓ Lucide：<i data-lucide="heart"></i>，先引入 lucide 再引入 riko-ui.js，Riko 会自动渲染。
- ✓ 内置图标：<span class="riko-icon riko-icon--search" aria-hidden="true"></span>。
- ✓ 图标颜色继承 currentColor，尺寸默认 1.15em，可用 --riko-icon-size 覆盖。
- ✓ 星星颜色可用 --riko-star-color 覆盖，尺寸用 --riko-star-size。

**避免**：
- ✗ 不要混用多个图标库，统一 Lucide。
- ✗ 不要写 <span class="riko-icon--check">（缺少根类 riko-icon）。

**示例 · Lucide 图标**

```html
<i data-lucide="book-open"></i>
```

**示例 · 内置图标**

```html
<span class="riko-icon riko-icon--search" aria-hidden="true"></span>
```

**示例 · 品牌星星**

```html
<span class="riko-star riko-star--lg riko-star--twinkle" aria-hidden="true"></span>
```

相关：[button](button.md)、[typography](typography.md)
