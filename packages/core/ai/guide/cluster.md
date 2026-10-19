<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 横向排列 Cluster `cluster`

子元素横向排列、自动换行、垂直居中。

**何时用**：按钮组、标签组、工具栏、页头左右分布。

**根**：`riko-cluster`（推荐 `<div>`）

**修饰**（同组互斥）：
- size：`riko-cluster--xs` 4px；`riko-cluster--sm` 8px；`riko-cluster--lg` 24px
- layout：`riko-cluster--between` 两端对齐；`riko-cluster--center` 居中；`riko-cluster--end` 靠右
- behavior：`riko-cluster--start` 顶部对齐；`riko-cluster--nowrap` 不换行

**示例 · 按钮组**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn riko-btn--primary">保存</button>
  <button type="button" class="riko-btn">取消</button>
</div>
```
