<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 空状态 Empty `empty`

没有内容时的温馨占位：默认插画是一颗漂浮的星星和小云朵。

**何时用**：列表、搜索结果、收藏夹等为空时。整页错误（404 等）用 result。

**根**：`riko-empty`（推荐 `<div>`）

**部件**：
- `riko-empty__art` 插画区；为空时显示默认星星云朵，也可放自己的图片/图标
- `riko-empty__title` 标题
- `riko-empty__desc` 说明
- `riko-empty__actions` 操作按钮区

**修饰**（同组互斥）：
- size：`riko-empty--sm` 小号（嵌在卡片、下拉框中）

**无障碍**：
- 默认插画是装饰，__art 加 aria-hidden="true"。

**要点**：
- ✓ 给出下一步操作（如「去看看」「清除筛选」）。

**避免**：
- ✗ 不要只写「暂无数据」，用温暖的语气说明原因。

**示例 · 基础用法**

```html
<div class="riko-empty">
  <div class="riko-empty__art" aria-hidden="true"></div>
  <h3 class="riko-empty__title">书签夹还空空的</h3>
  <p class="riko-empty__desc">读到喜欢的小节时，点一下星星就能收藏到这里啦。</p>
  <div class="riko-empty__actions">
    <a class="riko-btn riko-btn--primary" href="#empty">去读小说</a>
  </div>
</div>
```

**示例 · 小号**

```html
<div class="riko-card" style="max-width: 320px">
  <div class="riko-empty riko-empty--sm">
    <div class="riko-empty__art" aria-hidden="true"></div>
    <h3 class="riko-empty__title">没有找到「河豚」</h3>
    <p class="riko-empty__desc">换个关键词试试吧 ✦</p>
  </div>
</div>
```

相关：[result](result.md)
