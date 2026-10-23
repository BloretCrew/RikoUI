<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 代码块 Code Block `codeblock`

带标题栏与复制按钮的代码块，标题栏左侧是三颗彩色小圆点。

**何时用**：展示多行代码或配置。行内代码用 riko-code。

**根**：`riko-codeblock`（推荐 `<div>`）

**部件**：
- `riko-codeblock__header` 标题栏
- `riko-codeblock__lang` 语言或文件名
- `riko-codeblock__copy` 复制按钮（配合 data-riko="copy"）
- `riko-codeblock__pre` <pre> 容器（内部放 <code>）

**无障碍**：
- 复制按钮是仅图标按钮，要写 aria-label="复制代码"。

**要点**：
- ✓ 复制按钮：data-riko="copy" data-riko-target="#代码元素id"。
- ✓ 代码中的 < 和 & 要转义。

**避免**：
- ✗ 不要把长代码放进 riko-code（行内代码）。

**示例 · 基础用法**

```html
<div class="riko-codeblock">
  <div class="riko-codeblock__header">
    <span class="riko-codeblock__lang">index.html</span>
    <button type="button" class="riko-codeblock__copy" data-riko="copy" data-riko-target="#code-hello" aria-label="复制代码"></button>
  </div>
  <pre class="riko-codeblock__pre"><code id="code-hello">&lt;link rel="stylesheet" href="riko-ui.css"&gt;
&lt;script src="riko-ui.js"&gt;&lt;/script&gt;
&lt;button class="riko-btn riko-btn--primary"&gt;你好，络可&lt;/button&gt;</code></pre>
</div>
```

相关：[copy](copy.md)
