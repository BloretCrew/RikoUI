<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 居中与占位 Center & Spacer `layout-helpers`

riko-center 让内容水平垂直居中；riko-spacer 在 flex 容器中推开两侧。

**何时用**：空状态居中、导航栏左右分布。

**根**：`riko-center`（推荐 `<div>`）

**部件**：
- `riko-spacer` 在 flex 行中占满剩余空间

**示例 · 推开两侧**

```html
<div class="riko-cluster riko-cluster--nowrap">
  <strong>《络的世界》</strong>
  <span class="riko-spacer"></span>
  <button type="button" class="riko-btn riko-btn--sm">设置</button>
</div>
```
