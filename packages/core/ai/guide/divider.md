<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 分割线 Divider `divider`

虚线、波浪线、带文字或星星的分割线，以及竖向分隔。

**何时用**：分隔内容块；行内分隔用 --vertical。

**根**：`riko-divider`（推荐 `<div>`）

**修饰**（同组互斥）：
- variant：`riko-divider--squiggle` 橙色波浪线；`riko-divider--stars` 中间放星星；`riko-divider--solid` 实线
- layout：`riko-divider--vertical` 竖向（行内）

**无障碍**：
- 纯装饰分割用 <div role="separator">；带文字时文字会被读出。

**示例 · 带文字**

```html
<div class="riko-divider" role="separator">或者</div>
```

**示例 · 波浪线**

```html
<div class="riko-divider riko-divider--squiggle" role="separator"></div>
```

**示例 · 星星**

```html
<div class="riko-divider riko-divider--stars" role="separator"><span class="riko-star" aria-hidden="true"></span></div>
```
