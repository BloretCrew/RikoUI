<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 描述列表 Description List `desc-list`

「名称—内容」成对展示的信息列表，可竖排、横排、多列或带边框。

**何时用**：角色资料、订单详情、设置摘要等键值信息。

**根**：`riko-desc-list`（推荐 `<dl>`）

**部件**：
- `riko-desc-list__row` 一组（<div> 包住 dt + dd）
- `riko-desc-list__term` 名称（<dt>）
- `riko-desc-list__detail` 内容（<dd>）

**修饰**（同组互斥）：
- layout：`riko-desc-list--horizontal` 名称与内容左右排列；`riko-desc-list--columns` 多列自适应
- decor：`riko-desc-list--bordered` 带边框与虚线分隔

**无障碍**：
- 使用语义化的 <dl>/<dt>/<dd>。

**要点**：
- ✓ 名称列宽可用 style="--riko-desc-term-w: 6em" 调整。

**避免**：
- ✗ 不要用表格或 div 模拟键值对。

**示例 · 角色资料**

```html
<dl class="riko-desc-list riko-desc-list--horizontal riko-desc-list--bordered" style="max-width: 480px">
  <div class="riko-desc-list__row"><dt class="riko-desc-list__term">姓名</dt><dd class="riko-desc-list__detail">络可（Riko）</dd></div>
  <div class="riko-desc-list__row"><dt class="riko-desc-list__term">年龄</dt><dd class="riko-desc-list__detail">十二岁</dd></div>
  <div class="riko-desc-list__row"><dt class="riko-desc-list__term">爱好</dt><dd class="riko-desc-list__detail">画画、星星酥、在沙滩上发呆</dd></div>
  <div class="riko-desc-list__row"><dt class="riko-desc-list__term">标志</dt><dd class="riko-desc-list__detail"><span class="riko-tag riko-tag--accent riko-tag--sm"><span class="riko-star" aria-hidden="true"></span>星星贝雷帽</span></dd></div>
</dl>
```

**示例 · 多列**

```html
<dl class="riko-desc-list riko-desc-list--columns">
  <div class="riko-desc-list__row"><dt class="riko-desc-list__term">作者</dt><dd class="riko-desc-list__detail">星星酥</dd></div>
  <div class="riko-desc-list__row"><dt class="riko-desc-list__term">状态</dt><dd class="riko-desc-list__detail">连载中</dd></div>
  <div class="riko-desc-list__row"><dt class="riko-desc-list__term">最新</dt><dd class="riko-desc-list__detail">076 风过围垣，落星回响</dd></div>
  <div class="riko-desc-list__row"><dt class="riko-desc-list__term">字数</dt><dd class="riko-desc-list__detail">约 9 万字</dd></div>
</dl>
```

相关：[table](table.md)
