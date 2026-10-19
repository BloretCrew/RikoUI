<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 版块标题 Section Head `section-head`

版块大标题 + 手写副标 + 说明 + 右侧操作区。

**何时用**：每个版块开头（如「小说目录」「其他内容」）。

**根**：`riko-section-head`（推荐 `<div>`）

**部件**：
- `riko-section-head__text` 左侧文字容器（必需）
- `riko-section-head__title` 标题（h2），可在前面放 riko-star（必需）
- `riko-section-head__sub` 手写英文副标
- `riko-section-head__desc` 说明文字
- `riko-section-head__actions` 右侧操作（按钮、搜索）

**修饰**（同组互斥）：
- layout：`riko-section-head--center` 居中
- size：`riko-section-head--sm` 小号标题

**示例 · 完整**

```html
<div class="riko-section-head">
  <div class="riko-section-head__text">
    <h2 class="riko-section-head__title"><span class="riko-star" aria-hidden="true"></span>小说目录</h2>
    <span class="riko-section-head__sub">table of contents</span>
    <p class="riko-section-head__desc">点击章节即可跳转到对应的剧情内容。</p>
  </div>
  <div class="riko-section-head__actions">
    <button type="button" class="riko-btn riko-btn--sm">全部展开</button>
  </div>
</div>
```
