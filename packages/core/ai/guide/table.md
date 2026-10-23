<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 表格 Table `table`

手绘风数据表格，外层负责横向滚动与圆角，支持斑马纹、悬停、紧凑、竖线与点击表头排序。

**何时用**：需要按列对比的结构化数据。只有一列信息时用 list。

**根**：`riko-table`（推荐 `<table>`）

**部件**：
- `riko-table-wrap` 外层容器（必需）：圆角边框、窄屏横向滚动
- `riko-table__sort` 排序按钮（由 table-sort 自动生成）

**修饰**（同组互斥）：
- decor：`riko-table--striped` 斑马纹；`riko-table--bordered` 列之间虚线
- behavior：`riko-table--hover` 悬停行高亮
- size：`riko-table--compact` 紧凑
- layout：`riko-table-wrap--sticky` （加在 wrap 上）限制高度、表头吸顶；高度用 --riko-table-max-h

**状态**：
- `aria-sort="ascending|descending"`（在 `th`） 当前排序列（table-sort 自动维护）
- `aria-selected="true"`（在 `tr`） 选中行高亮
- `data-align="end|center"`（在 `th / td`） 单元格对齐（数字列建议 end）

**JS**：
- 启用：`data-riko="table-sort"`
- 选项 `data-riko-sort="false"`（false）：写在 th 上：该列不可排序
- 选项 `data-riko-value`（任意）：写在 td 上：用于排序的值（如日期时间戳）
- 方法 `table.riko.sort(column, direction)`：按列（序号或 th 元素）排序，direction 为 ascending / descending
- 事件 `riko:table:sort` detail { column, direction }：排序后触发

**无障碍**：
- 表头用 <th scope="col">，行标题用 <th scope="row">。
- 用 <caption> 说明表格内容。
- 排序状态通过 aria-sort 提供给读屏，无需额外文字。

**要点**：
- ✓ 始终包一层 <div class="riko-table-wrap">。
- ✓ 数字列加 data-align="end"，数字自动等宽对齐。

**避免**：
- ✗ 不要用表格做页面布局。
- ✗ 不要给 th 自己加排序图标，table-sort 会自动生成。

**示例 · 可排序表格**

```html
<div class="riko-table-wrap">
  <table class="riko-table riko-table--striped riko-table--hover" data-riko="table-sort">
    <caption>HV 骨干成员</caption>
    <thead>
      <tr><th scope="col">成员</th><th scope="col">职责</th><th scope="col" data-align="end">登场小节</th><th scope="col" data-riko-sort="false">状态</th></tr>
    </thead>
    <tbody>
      <tr><th scope="row">络可</th><td>画家</td><td data-align="end">1</td><td><span class="riko-tag riko-tag--sm riko-tag--success">在村中</span></td></tr>
      <tr><th scope="row">Star</th><td>工建 · 战斗</td><td data-align="end">2</td><td><span class="riko-tag riko-tag--sm riko-tag--warning">养伤中</span></td></tr>
      <tr><th scope="row">111</th><td>村长</td><td data-align="end">4</td><td><span class="riko-tag riko-tag--sm riko-tag--success">在村中</span></td></tr>
      <tr><th scope="row">无昵</th><td>交易场所</td><td data-align="end">29</td><td><span class="riko-tag riko-tag--sm riko-tag--ice">外出</span></td></tr>
    </tbody>
  </table>
</div>
```

**示例 · 紧凑与竖线**

```html
<div class="riko-table-wrap">
  <table class="riko-table riko-table--compact riko-table--bordered">
    <thead>
      <tr><th scope="col">幕</th><th scope="col">标题</th><th scope="col" data-align="end">小节数</th></tr>
    </thead>
    <tbody>
      <tr><td>序章 · 第一幕</td><td>沙滩上的画家</td><td data-align="end">3</td></tr>
      <tr><td>序章 · 第二幕</td><td>归途的微光</td><td data-align="end">5</td></tr>
      <tr><td>第一章 · 第五幕</td><td>落星摇曳，清风回荡</td><td data-align="end">17</td></tr>
    </tbody>
    <tfoot>
      <tr><td colspan="2">合计</td><td data-align="end">25</td></tr>
    </tfoot>
  </table>
</div>
```

相关：[list](list.md)、[desc-list](desc-list.md)
