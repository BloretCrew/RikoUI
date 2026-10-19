<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 页脚 Footer `footer`

米色扇贝花边页脚：三颗星星、一行文字链接、两行版权信息。

**何时用**：每个页面底部。

**根**：`riko-footer`（推荐 `<footer>`）

**部件**：
- `riko-footer__inner` 可选限宽容器
- `riko-footer__stars` 三颗星星装饰（放 3 个带 aria-hidden 的 riko-star）
- `riko-footer__brand` 可选品牌名
- `riko-footer__nav` 链接导航 <nav>
- `riko-footer__link` 链接（之间自动出现「·」）
- `riko-footer__copy` 版权文字段落

**修饰**（同组互斥）：
- decor：`riko-footer--flat` 去掉扇贝花边，改为顶部虚线

**无障碍**：
- __nav 用 <nav aria-label="页脚导航">。
- 每颗装饰星星加 aria-hidden="true"。

**要点**：
- ✓ 放在 <body> 末尾、页面主体之后；与 riko-page 一起使用可让页脚贴底。
- ✓ 扇贝花边颜色跟随 --riko-color-surface-muted。

**避免**：
- ✗ 不要手写分隔符「·」。

**示例 · 页脚**

```html
<footer class="riko-footer">
  <div class="riko-footer__stars"><span class="riko-star" aria-hidden="true"></span><span class="riko-star" aria-hidden="true"></span><span class="riko-star" aria-hidden="true"></span></div>
  <nav class="riko-footer__nav" aria-label="页脚导航">
    <a class="riko-footer__link" href="https://read.riko.land">小说阅读器</a>
    <a class="riko-footer__link" href="https://wiki.riko.land">Wiki</a>
    <a class="riko-footer__link" href="https://contact.riko.land">联系我们</a>
  </nav>
  <p class="riko-footer__copy">© 2021–2026 Bloret.All rights reserved.</p>
  <p class="riko-footer__copy">《络的世界》项目组</p>
</footer>
```

相关：[navbar](navbar.md)、[page](page.md)
