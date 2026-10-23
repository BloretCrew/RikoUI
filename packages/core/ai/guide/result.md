<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 结果页 Result `result`

操作完成、出错、空结果或 404 时的整块居中反馈：插画/图标、标题、说明与操作。

**何时用**：提交成功页、错误页、404 页、功能未开放。列表为空用 empty（数据展示类）。

**根**：`riko-result`（推荐 `<div>`）

**部件**：
- `riko-result__art` 插画区：留空显示色调图标；可放 Lucide 图标、<img>，或 404 时写数字（必需）
- `riko-result__title` 标题（必需）
- `riko-result__desc` 说明
- `riko-result__actions` 操作按钮
- `riko-result__extra` 额外内容（如错误详情）

**修饰**（同组互斥）：
- tone：`riko-result--success` 成功；`riko-result--info` 信息；`riko-result--warning` 警告；`riko-result--danger` 错误；`riko-result--404` 404：__art 内写「404」，显示为大号手写数字
- size：`riko-result--sm` 小号（卡片内使用）

**无障碍**：
- __art 为装饰，加 aria-hidden="true"。
- 标题使用与页面层级相符的标题标签。

**要点**：
- ✓ 默认（不加色调）为橙色星星。
- ✓ 操作按钮：主要操作 riko-btn--primary 在前。

**避免**：
- ✗ 不要在 __art 中放很长的文字。

**示例 · 成功**

```html
<div class="riko-result riko-result--success">
  <div class="riko-result__art" aria-hidden="true"></div>
  <h2 class="riko-result__title">反馈提交成功</h2>
  <p class="riko-result__desc">谢谢你的建议！络可会把它认真地抄进笔记本里。</p>
  <div class="riko-result__actions">
    <a class="riko-btn riko-btn--primary" href="#">回到主页</a>
    <a class="riko-btn" href="#">继续阅读</a>
  </div>
</div>
```

**示例 · 404**

```html
<div class="riko-result riko-result--404">
  <div class="riko-result__art" aria-hidden="true">404</div>
  <h2 class="riko-result__title">这一页被海浪冲走啦</h2>
  <p class="riko-result__desc">你要找的页面不在这片沙滩上，回主页看看别的故事吧。</p>
  <div class="riko-result__actions">
    <a class="riko-btn riko-btn--primary" href="#"><i data-lucide="house"></i>回到主页</a>
  </div>
</div>
```

**示例 · 小号与其他色调**

```html
<div class="riko-grid riko-grid--cols-2">
  <div class="riko-result riko-result--sm riko-result--danger">
    <div class="riko-result__art" aria-hidden="true"></div>
    <h2 class="riko-result__title">加载失败</h2>
    <p class="riko-result__desc">信号被暗林挡住了。</p>
    <div class="riko-result__actions">
      <button type="button" class="riko-btn riko-btn--sm">重试</button>
    </div>
  </div>
  <div class="riko-result riko-result--sm">
    <div class="riko-result__art" aria-hidden="true"><i data-lucide="palette"></i></div>
    <h2 class="riko-result__title">敬请期待</h2>
    <p class="riko-result__desc">第二章正在努力创作中～</p>
  </div>
</div>
```

相关：[alert](alert.md)
