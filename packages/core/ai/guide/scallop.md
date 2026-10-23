<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 扇贝花边 Scallop `scallop`

色块顶部（或底部）的圆弧花边。

**何时用**：页脚顶边、分区色块。

**根**：`riko-scallop`

**修饰**（同组互斥）：
- layout：`riko-scallop--bottom` 花边朝下（在底部）

**要点**：
- ✓ 花边颜色默认 --riko-color-surface-muted，需与色块背景一致；可用 --riko-scallop-color 修改。

**示例 · 页脚顶边**

```html
<footer class="riko-scallop" style="background: var(--riko-color-surface-muted); padding: var(--riko-space-8);">…</footer>
```
