<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 进度 Progress `progress`

基于原生 <progress> 的渐变进度条（支持不确定进度），以及带小星星的环形进度。

**何时用**：有明确进度的任务（上传、阅读进度、完成度）。不确定时长的等待也可用不写 value 的进度条或 spinner。

**根**：`riko-progress`（推荐 `<div>`）

**部件**：
- `riko-progress__head` 标签行（标签 + 数值）
- `riko-progress__label` 标签（给 id，供 aria-labelledby）
- `riko-progress__value` 百分比文字
- `riko-progress__bar` 原生 <progress value max>；不写 value 为不确定进度（必需）
- `riko-progress-ring` 环形进度根元素：role="progressbar" + aria-valuenow + style="--riko-progress: 0~100"
- `riko-progress-ring__value` 环形中间的数字

**修饰**（同组互斥）：
- size：`riko-progress--sm` 细；`riko-progress--lg` 粗；`riko-progress-ring--sm` 环形小号；`riko-progress-ring--lg` 环形大号
- tone：`riko-progress--ice` 冰蓝；`riko-progress--success` 成功；`riko-progress--warning` 警告；`riko-progress--danger` 危险；`riko-progress-ring--ice` 环形冰蓝；`riko-progress-ring--success` 环形成功；`riko-progress-ring--warning` 环形警告；`riko-progress-ring--danger` 环形危险

**状态**：
- `value`（在 `riko-progress__bar`） 当前值；更新时同时更新 __value 文字
- `aria-valuenow`（在 `riko-progress-ring`） 环形当前值，需与 --riko-progress 保持一致

**无障碍**：
- <progress> 需要可访问名称：aria-labelledby 指向 __label，或 aria-label。
- 环形进度用 role="progressbar" 并写 aria-valuenow / aria-valuemin / aria-valuemax / aria-label。

**要点**：
- ✓ 用 JS 更新：bar.value = 62；环形：ring.style.setProperty('--riko-progress', 62) 并同步 aria-valuenow。
- ✓ 环形的 --riko-progress 是 0–100 的纯数字（不带 %）。

**避免**：
- ✗ 不要用 div 宽度百分比自己画进度条。

**示例 · 进度条**

```html
<div class="riko-stack riko-stack--lg">
  <div class="riko-progress">
    <div class="riko-progress__head">
      <span class="riko-progress__label" id="read-progress-label">阅读进度</span>
      <span class="riko-progress__value">62%</span>
    </div>
    <progress class="riko-progress__bar" value="62" max="100" aria-labelledby="read-progress-label"></progress>
  </div>
  <div class="riko-progress riko-progress--sm riko-progress--success">
    <div class="riko-progress__head">
      <span class="riko-progress__label" id="upload-progress-label">画稿上传</span>
      <span class="riko-progress__value">100%</span>
    </div>
    <progress class="riko-progress__bar" value="100" max="100" aria-labelledby="upload-progress-label"></progress>
  </div>
  <div class="riko-progress riko-progress--lg riko-progress--ice">
    <progress class="riko-progress__bar" value="35" max="100" aria-label="下载进度"></progress>
  </div>
</div>
```

**示例 · 不确定进度**

```html
<div class="riko-progress">
  <div class="riko-progress__head">
    <span class="riko-progress__label" id="sync-progress-label">正在同步书签…</span>
  </div>
  <progress class="riko-progress__bar" max="100" aria-labelledby="sync-progress-label"></progress>
</div>
```

**示例 · 环形进度**

```html
<div class="riko-cluster riko-cluster--lg">
  <div class="riko-progress-ring riko-progress-ring--sm" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" aria-label="今日阅读" style="--riko-progress: 25"><span class="riko-progress-ring__value">25%</span></div>
  <div class="riko-progress-ring" role="progressbar" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100" aria-label="序章进度" style="--riko-progress: 72"><span class="riko-progress-ring__value">72%</span></div>
  <div class="riko-progress-ring riko-progress-ring--lg riko-progress-ring--ice" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" aria-label="第一章进度" style="--riko-progress: 90"><span class="riko-progress-ring__value">90%</span></div>
</div>
```

相关：[spinner](spinner.md)、[skeleton](skeleton.md)
