<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 分页 Pagination `pagination`

页码分页，当前页是一颗微微倾斜的橙色小方块；可由 JS 根据总页数自动渲染。

**何时用**：列表数据分多页时用。上一篇/下一篇式的线性阅读用 pager；无限滚动则不需要分页。

**根**：`riko-pagination`（推荐 `<nav>`）

**部件**：
- `riko-pagination__item` 页码（a / button / 当前页用 span aria-current="page"）（必需）
- `riko-pagination__prev` 上一页（与 __item 同用；留空只显示箭头，需 aria-label）
- `riko-pagination__next` 下一页（与 __item 同用）
- `riko-pagination__ellipsis` 省略号
- `riko-pagination__info` 右侧说明文字，如「共 76 节」

**修饰**（同组互斥）：
- size：`riko-pagination--sm` 小号
- layout：`riko-pagination--center` 居中对齐

**状态**：
- `aria-current="page"`（在 `riko-pagination__item`） 当前页
- `aria-disabled="true"`（在 `riko-pagination__item`） 不可用（如第一页的「上一页」）

**JS**：
- 启用：`data-riko="pagination"`
- 选项 `data-riko-total`（数字） 默认 1：总页数
- 选项 `data-riko-current`（数字） 默认 1：当前页
- 选项 `data-riko-siblings`（数字） 默认 1：当前页两侧显示几个页码
- 选项 `data-riko-href`（含 {page} 的地址）：设置后渲染为链接，否则渲染为按钮
- 方法 `el.riko.set(page)`：跳到某页（按钮模式）
- 方法 `el.riko.setTotal(n)`：修改总页数
- 方法 `el.riko.page / el.riko.total`：当前页 / 总页数
- 事件 `riko:pagination:change` detail { page, total }：按钮模式下页码改变

**无障碍**：
- <nav aria-label="分页">。
- 只有箭头的上一页/下一页必须写 aria-label。
- 当前页用 aria-current="page"。

**要点**：
- ✓ 服务端渲染时直接手写结构，无需 data-riko。
- ✓ 前端分页用 data-riko="pagination"，内容留空，监听 riko:pagination:change 加载数据。

**避免**：
- ✗ 不要用 .active 标记当前页。

**示例 · 自动渲染**

```html
<nav class="riko-pagination" data-riko="pagination" data-riko-total="20" data-riko-current="6" aria-label="分页"></nav>
```

**示例 · 手写结构（服务端渲染）**

```html
<nav class="riko-pagination riko-pagination--sm" aria-label="分页">
  <a class="riko-pagination__item riko-pagination__prev" href="?page=1">上一页</a>
  <a class="riko-pagination__item" href="?page=1">1</a>
  <span class="riko-pagination__item" aria-current="page">2</span>
  <a class="riko-pagination__item" href="?page=3">3</a>
  <span class="riko-pagination__ellipsis" aria-hidden="true">…</span>
  <a class="riko-pagination__item" href="?page=9">9</a>
  <a class="riko-pagination__item riko-pagination__next" href="?page=3">下一页</a>
  <span class="riko-pagination__info">共 76 节</span>
</nav>
```

相关：[pager](pager.md)
