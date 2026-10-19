<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 排版 Typography `typography`

标题、手写副标、正文色调、引用、键位、行内代码、高亮与长文排版。

**何时用**：所有文字都优先用这些类而不是自己写字体/颜色。长文章、小说正文用 riko-prose（小说加 --read）。

**部件**：
- `riko-display` 超大展示标题（首页主视觉）
- `riko-h1` 一级标题（ZCOOL XiaoWei）
- `riko-h2` 二级标题
- `riko-h3` 三级标题
- `riko-h4` 四级标题
- `riko-h5` 五级标题
- `riko-h6` 六级标题
- `riko-hand` 手写体英文点缀（Caveat），可加 --ice / --accent
- `riko-lead` 导语段落（大一号、次要色）
- `riko-text` 正文文字，配合 --sm/--xs/--lg、--muted/--strong/--accent/--ice/--success/--warning/--danger、--read
- `riko-caption` 图注/小字说明
- `riko-eyebrow` 标题上方的小号字距标签
- `riko-quote` 引用块（blockquote），可含 __cite
- `riko-quote__cite` 引用出处
- `riko-kbd` 键盘按键
- `riko-code` 行内代码
- `riko-mark` 高亮（--current 为当前匹配）
- `riko-prose` 长文容器：自动排版内部 h1–h6、p、ul、blockquote、code、pre、table、img；--read 小说阅读、--lg、--wide

**修饰**（同组互斥）：
- tone：`riko-hand--ice` 冰蓝手写；`riko-hand--accent` 橙色手写；`riko-text--muted` 次要色；`riko-text--strong` 加粗强调色；`riko-text--accent` 橙色文字；`riko-text--ice` 冰蓝文字；`riko-text--success` 成功色；`riko-text--warning` 警告色；`riko-text--danger` 危险色
- size：`riko-text--xs` 12px；`riko-text--sm` 14px；`riko-text--lg` 18px；`riko-prose--lg` 大一号
- variant：`riko-text--read` 衬线阅读字体；`riko-mark--current` 当前搜索结果；`riko-prose--read` 小说/散文：衬线、首行缩进、宽松行距；字号读取 --riko-reading-size
- layout：`riko-prose--wide` 取消最大宽度

**无障碍**：
- 标题层级按语义使用 h1–h6 元素，riko-h* 只负责外观，可与元素层级不同。
- 手写体只用于短英文点缀，不要承载重要信息。

**要点**：
- ✓ 标题元素加 riko-h1…riko-h6；需要手写英文副标时在旁边放 <span class="riko-hand">…</span>。
- ✓ Markdown/CMS 输出的 HTML 包在 <article class="riko-prose"> 里即可获得完整排版。
- ✓ 修饰类必须与根类同时写：<p class="riko-text riko-text--muted">。
- ✓ 标题字体 ZCOOL XiaoWei 风格化较强（如木字旁、「于」），少数字可能不易辨认；若标题中这类字很多或要求严肃易读，可改用 style="font-family: var(--riko-font-read)" 或 riko-text--read。

**避免**：
- ✗ 不要写 style="font-family:…" 或写死颜色。
- ✗ 不要单独写 riko-text--muted 而漏掉 riko-text。

**示例 · 标题 + 手写副标**

```html
<h2 class="riko-h2">小说目录 <span class="riko-hand">table of contents</span></h2>
```

**示例 · 导语与次要文字**

```html
<p class="riko-lead">从沙滩上的第一幅画开始，踏入这个世界的边缘与深处。</p>
<p class="riko-text riko-text--sm riko-text--muted">建议先阅读已更新章节，避免剧透。</p>
```

**示例 · 小说正文**

```html
<article class="riko-prose riko-prose--read">
  <p>轻柔的海浪涌来，在微风的吹拂下散入金黄的沙滩。</p>
  <p>沙滩上，一个女孩哼着欢快的歌，挥动她的画笔。</p>
</article>
```

**示例 · 引用、键位、代码、高亮**

```html
<blockquote class="riko-quote">愿你在字里行间找到属于自己的那片海。<cite class="riko-quote__cite">《络的世界》</cite></blockquote>
<p>按 <kbd class="riko-kbd">/</kbd> 搜索，配置项 <code class="riko-code">themeMode</code>，<mark class="riko-mark">星星酥</mark> 今日特价。</p>
```

相关：[section-head](section-head.md)、[icon](icon.md)
