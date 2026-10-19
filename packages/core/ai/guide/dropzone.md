<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 拖拽上传 Dropzone `dropzone`

拖拽或点击选择文件的上传区域，显示文件列表、大小与图片缩略图，支持类型 / 大小 / 数量限制。

**何时用**：上传图片、附件、手稿。只需一个简单文件按钮时可用 <input class="riko-input" type="file">。

**根**：`riko-dropzone`（推荐 `<div>`）

**部件**：
- `riko-dropzone__area` 可点击 / 拖入的区域，用 <label> 包住 input（必需）
- `riko-dropzone__input` 原生 <input type="file">（视觉隐藏，accept / multiple 写在这里）（必需）
- `riko-dropzone__icon` 图标框；留空显示默认上传图标，也可放 Lucide 图标
- `riko-dropzone__title` 主提示
- `riko-dropzone__hint` 次要提示（格式、大小）
- `riko-dropzone__list` 文件列表（JS 生成）
- `riko-dropzone__file` 文件项
- `riko-dropzone__thumb` 缩略图 / 文件图标
- `riko-dropzone__meta` 文件名与大小容器
- `riko-dropzone__name` 文件名
- `riko-dropzone__size` 大小或拒绝原因
- `riko-dropzone__remove` 移除按钮

**修饰**（同组互斥）：
- size：`riko-dropzone--sm` 紧凑尺寸

**状态**：
- `data-state="dragover"` 文件拖入时（JS 维护）
- `aria-invalid="true"`（在 `riko-dropzone__file`） 被拒绝的文件
- `disabled`（在 `riko-dropzone__input`） 禁用

**JS**：
- 启用：`data-riko="dropzone"`
- 选项 `data-riko-max-size`（如 500KB / 5MB） 默认 不限：单个文件大小上限
- 选项 `data-riko-max-files`（数字） 默认 multiple 时不限，否则 1：最多文件数
- 方法 `el.riko.files`：当前文件数组（同时已同步到 input.files，可随表单提交）
- 方法 `el.riko.add(files)`：添加文件（数组或 FileList）
- 方法 `el.riko.remove(index)`：移除第 index 个
- 方法 `el.riko.clear()`：清空
- 事件 `riko:dropzone:change` detail { files }：文件列表变化
- 事件 `riko:dropzone:reject` detail { file, reason }：文件因类型 / 大小 / 数量被拒绝

**无障碍**：
- input 保持可聚焦（只是视觉隐藏），键盘 Tab 到区域后按空格 / 回车即可选择文件。
- 移除按钮自动带 aria-label，文件列表为 aria-live。

**要点**：
- ✓ 必须用 <label class="riko-dropzone__area"> 包住 input，这样点击整个区域都能选文件。
- ✓ 类型限制写在 input 的 accept 上，JS 会同时用于拖入校验。

**避免**：
- ✗ 不要把文件列表放进 label 内（点击移除按钮会再次打开文件选择）。

**示例 · 基础用法**

```html
<div class="riko-dropzone" data-riko="dropzone" data-riko-max-size="5MB">
  <label class="riko-dropzone__area">
    <input class="riko-dropzone__input" type="file" name="drawings" accept="image/*" multiple>
    <span class="riko-dropzone__icon" aria-hidden="true"></span>
    <span class="riko-dropzone__title">把画稿拖到这里，或点击选择</span>
    <span class="riko-dropzone__hint">支持 PNG / JPG / WebP，单张不超过 5MB</span>
  </label>
</div>
```

**示例 · 小尺寸 · 单个文件**

```html
<div class="riko-dropzone riko-dropzone--sm" data-riko="dropzone" style="max-width: 360px">
  <label class="riko-dropzone__area">
    <input class="riko-dropzone__input" type="file" name="manuscript" accept=".txt,.docx">
    <span class="riko-dropzone__icon" aria-hidden="true"><i data-lucide="feather"></i></span>
    <span class="riko-dropzone__title">上传小说手稿</span>
    <span class="riko-dropzone__hint">.txt 或 .docx</span>
  </label>
</div>
```

相关：[field](field.md)、[input](input.md)、[progress](progress.md)
