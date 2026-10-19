<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 单选框 Radio `radio`

原生 radio 美化：选中时中心弹出一颗橙色小星星，支持卡片样式。

**何时用**：从 2–6 个互斥选项中选一个。选项很短且想要紧凑外观时用 segmented；选项多时用 select。

**根**：`riko-radio`（推荐 `<label>`）

**部件**：
- `riko-radio__text` 标题 + 说明的文字容器
- `riko-radio__desc` 说明小字（放在 __text 内）

**修饰**（同组互斥）：
- size：`riko-radio--sm` 小号；`riko-radio--lg` 大号
- variant：`riko-radio--card` 可选卡片

**状态**：
- `checked`（在 `input`） 选中
- `disabled`（在 `input`） 禁用

**无障碍**：
- 同组单选框写相同 name，并放进 <fieldset> + <legend>。

**要点**：
- ✓ 结构：<label class="riko-radio"><input type="radio" name="组名" value="值"> 文字</label>。

**避免**：
- ✗ 不要省略 name，否则无法互斥。

**示例 · 基础**

```html
<fieldset class="riko-fieldset riko-fieldset--inline">
  <legend class="riko-fieldset__legend">下午茶</legend>
  <label class="riko-radio"><input type="radio" name="tea" value="black" checked> 热红茶</label>
  <label class="riko-radio"><input type="radio" name="tea" value="milk"> 牛奶</label>
  <label class="riko-radio"><input type="radio" name="tea" value="soda" disabled> 汽水（喝完啦）</label>
</fieldset>
```

**示例 · 卡片**

```html
<fieldset class="riko-fieldset">
  <legend class="riko-fieldset__legend">阅读方式</legend>
  <div class="riko-grid riko-grid--sm">
    <label class="riko-radio riko-radio--card"><input type="radio" name="read-mode" value="scroll" checked><span class="riko-radio__text">连续滚动<span class="riko-radio__desc">像展开一卷长长的画</span></span></label>
    <label class="riko-radio riko-radio--card"><input type="radio" name="read-mode" value="page"><span class="riko-radio__text">分页翻阅<span class="riko-radio__desc">一页一页慢慢看</span></span></label>
  </div>
</fieldset>
```

相关：[checkbox](checkbox.md)、[segmented](segmented.md)、[fieldset](fieldset.md)
