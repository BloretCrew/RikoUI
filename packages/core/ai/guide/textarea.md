<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 多行文本 Textarea `textarea`

多行输入，可自动增高，也有横线信纸外观。

**何时用**：留言、日记、描述等多行内容。

**根**：`riko-textarea`（推荐 `<textarea>`）

**修饰**（同组互斥）：
- size：`riko-textarea--sm` 小号；`riko-textarea--lg` 大号
- variant：`riko-textarea--notebook` 横线信纸外观（衬线字体）

**状态**：
- `disabled` 禁用
- `readonly` 只读：虚线边框
- `aria-invalid="true"` 校验失败：红色边框（配合 riko-field__error）

**JS**：
- 启用：`data-riko="autosize"`
- 选项 `data-riko-max-rows`（数字） 默认 不限：最多增高到几行，超出后滚动
- 方法 `el.riko.update()`：用 JS 修改 value 后手动重算高度

**无障碍**：
- 与输入框相同：必须有 label 或 aria-label。

**要点**：
- ✓ 自动增高：加 data-riko="autosize"，用 rows 设置初始行数。
- ✓ 需要字数统计时放进 riko-field 并加 riko-field__counter，配合 maxlength。

**避免**：
- ✗ 自动增高时不要再设置固定 height。

**示例 · 基础**

```html
<textarea class="riko-textarea" rows="3" placeholder="写下今天的冒险日记…" aria-label="日记"></textarea>
```

**示例 · 自动增高**

```html
<textarea class="riko-textarea" data-riko="autosize" data-riko-max-rows="8" rows="2" placeholder="越写越长也没关系，会自己长高哦" aria-label="留言"></textarea>
```

**示例 · 信纸外观**

```html
<textarea class="riko-textarea riko-textarea--notebook" rows="4" aria-label="信纸">亲爱的 Star：
今天的晚霞像橘子汽水一样。</textarea>
```

相关：[field](field.md)、[input](input.md)
