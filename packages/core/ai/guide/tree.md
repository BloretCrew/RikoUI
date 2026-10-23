<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 树形列表 Tree `tree`

用嵌套 <details> 构建的文件夹树，虚线连接层级，原生键盘可用。

**何时用**：层级目录（文件、设定分类、章节结构）。只有一层分组时用 accordion。

**根**：`riko-tree`（推荐 `<ul>`）

**部件**：
- `riko-tree__folder` 文件夹（<details>）
- `riko-tree__label` 文件夹名（<summary>）
- `riko-tree__group` 子级列表（<ul>）
- `riko-tree__file` 叶子节点（<a> 或 <button>）
- `riko-tree__meta` 右侧附注（如数量）

**状态**：
- `open`（在 `riko-tree__folder`） 原生属性：默认展开
- `aria-current="page"`（在 `riko-tree__file`） 当前项

**无障碍**：
- 文件夹使用 <details>/<summary>，可用 Tab + Enter/空格展开。
- 叶子节点用真正的链接或按钮。

**要点**：
- ✓ 图标自动显示（文件夹开/合、文件），不需要手写。

**避免**：
- ✗ 不要用 div 嵌套模拟树。

**示例 · 文件夹树**

```html
<ul class="riko-tree" style="max-width: 360px">
  <li>
    <details class="riko-tree__folder" open>
      <summary class="riko-tree__label">络可的笔记本 <span class="riko-tree__meta">4</span></summary>
      <ul class="riko-tree__group">
        <li>
          <details class="riko-tree__folder" open>
            <summary class="riko-tree__label">人物</summary>
            <ul class="riko-tree__group">
              <li><a class="riko-tree__file" href="#tree" aria-current="page">络可.md</a></li>
              <li><a class="riko-tree__file" href="#tree">Star.md</a></li>
            </ul>
          </details>
        </li>
        <li>
          <details class="riko-tree__folder">
            <summary class="riko-tree__label">地点</summary>
            <ul class="riko-tree__group">
              <li><a class="riko-tree__file" href="#tree">HV 村庄.md</a></li>
              <li><a class="riko-tree__file" href="#tree">边界之地.md</a></li>
            </ul>
          </details>
        </li>
      </ul>
    </details>
  </li>
</ul>
```

相关：[accordion](accordion.md)、[sidenav](sidenav.md)
