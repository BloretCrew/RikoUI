<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 对话框 Dialog `dialog`

基于原生 <dialog> 的模态对话框：线性动画、遮罩模糊、焦点锁定、Esc/遮罩关闭；另提供 Riko.confirm / Riko.alert。

**何时用**：需要用户专注处理的内容（设置、表单、确认）。从边缘滑出的面板用 drawer；不打断操作的提示用 toast。

**根**：`riko-dialog`（推荐 `<dialog>`）

**部件**：
- `riko-dialog__header` 头部（标题 + 关闭按钮）
- `riko-dialog__title` 标题（h2），id 供 aria-labelledby 引用；可在前面放 riko-star（必需）
- `riko-dialog__close` 右上角关闭按钮：空 <button>，带 data-riko-close 与 aria-label
- `riko-dialog__body` 内容区（超出时滚动）
- `riko-dialog__desc` 说明文字（次要色），可作为 aria-describedby 目标
- `riko-dialog__footer` 底部按钮区（右对齐）
- `riko-dialog__icon` 标题前的色调图标（空 <span>，默认星星；随根上的色调修饰变化）

**修饰**（同组互斥）：
- size：`riko-dialog--sm` 窄（380px）；`riko-dialog--lg` 宽（760px）；`riko-dialog--full` 超宽（1100px），窄屏下全屏
- variant：`riko-dialog--confirm` 确认框布局（Riko.confirm/alert 自动使用）
- tone：`riko-dialog--info` 信息色调（影响 __icon）；`riko-dialog--success` 成功色调；`riko-dialog--warning` 警告色调；`riko-dialog--danger` 危险色调

**状态**：
- `open` 打开中（原生属性，由 JS 维护；不要手写 open）
- `data-state="closing"` 关闭动画中
- `aria-expanded`（在 `[data-riko-open] 触发按钮`） JS 自动维护，并加上 aria-haspopup/aria-controls

**JS**：
- 启用：`data-riko="dialog"`
- 选项 `data-riko-open`（对话框 id）：写在任意按钮上：点击打开该对话框（也适用于 drawer）
- 选项 `data-riko-close`（可选返回值）：写在对话框内的按钮上：点击关闭；值会成为 returnValue
- 选项 `data-riko-backdrop`（static）：点击遮罩与按 Esc 都不关闭（只能用按钮关闭）
- 方法 `el.riko.open() / el.riko.close(returnValue?) / el.riko.toggle()`：实例方法；el.riko.isOpen 为当前状态
- 方法 `Riko.dialog.open(id | el) / Riko.dialog.close(id | el, value?) / Riko.dialog.toggle(id | el)`：全局方法
- 方法 `Riko.confirm({ title, message, confirmText, cancelText, tone }) → Promise<boolean>`：确认框；tone: 'accent'（默认）| 'danger' | 'warning' | 'info' | 'success'；danger 时确认按钮为危险样式，默认焦点在「取消」
- 方法 `Riko.alert({ title, message, okText, tone }) → Promise<void>`：只有一个按钮的提示框
- 事件 `riko:dialog:open` detail { id }：打开前派发，可 preventDefault 阻止打开
- 事件 `riko:dialog:opened` detail { id }：已打开
- 事件 `riko:dialog:close` detail { id, returnValue }：已关闭

**无障碍**：
- 必须用 <dialog> 元素，并用 aria-labelledby 指向 riko-dialog__title 的 id。
- 有说明文字时用 aria-describedby 指向它。
- 打开时焦点进入对话框（优先 [autofocus]），Tab 被锁定在内部，关闭后焦点回到触发按钮——JS 已处理。
- 关闭按钮必须有 aria-label。

**要点**：
- ✓ 打开用 data-riko-open="id"，关闭用 data-riko-close，不需要写 JS。
- ✓ 可在 <dialog> 内用 <form method="dialog">：提交按钮的 value 会成为 returnValue，并带关闭动画。
- ✓ 底部按钮顺序：次要（riko-btn--ghost）在左，主要（riko-btn--primary）在右。
- ✓ 简单的「确定吗？」用 await Riko.confirm()，不要为此手写对话框。

**避免**：
- ✗ data-riko-close 只用于关闭弹层（dialog/drawer）；移除 alert、banner 等组件用 data-riko-dismiss。
- ✗ 不要手写 open 属性或调用 dialog.showModal()——用 data-riko-open 或 el.riko.open()，否则不会锁滚动与焦点。
- ✗ 不要用 <div class="riko-dialog">（必须是 <dialog>）。
- ✗ 不要在对话框里再嵌套对话框。

**示例 · 基础用法**

```html
<button type="button" class="riko-btn riko-btn--primary" data-riko-open="settings-dialog"><i data-lucide="settings"></i>打开设置</button>
<dialog class="riko-dialog" id="settings-dialog" data-riko="dialog" aria-labelledby="settings-dialog-title">
  <header class="riko-dialog__header">
    <h2 class="riko-dialog__title" id="settings-dialog-title"><span class="riko-star" aria-hidden="true"></span>设置界面</h2>
    <button type="button" class="riko-dialog__close" data-riko-close aria-label="关闭"></button>
  </header>
  <div class="riko-dialog__body">
    <p class="riko-dialog__desc">选择你喜欢的阅读外观，设置会自动保存。</p>
    <div class="riko-theme-picker" data-riko="theme-picker"></div>
  </div>
</dialog>
```

**示例 · 带底部按钮**

```html
<button type="button" class="riko-btn" data-riko-open="bookmark-dialog"><i data-lucide="bookmark"></i>添加书签</button>
<dialog class="riko-dialog riko-dialog--sm" id="bookmark-dialog" data-riko="dialog" aria-labelledby="bookmark-dialog-title" aria-describedby="bookmark-dialog-desc">
  <header class="riko-dialog__header">
    <h2 class="riko-dialog__title" id="bookmark-dialog-title">夹一枚书签</h2>
    <button type="button" class="riko-dialog__close" data-riko-close aria-label="关闭"></button>
  </header>
  <div class="riko-dialog__body">
    <p class="riko-dialog__desc" id="bookmark-dialog-desc">把「晓窗梦醒，初览疮痍」加入书签，下次打开时可以一键回到这里。</p>
  </div>
  <footer class="riko-dialog__footer">
    <button type="button" class="riko-btn riko-btn--ghost" data-riko-close="cancel">取消</button>
    <button type="button" class="riko-btn riko-btn--primary" data-riko-close="save" autofocus>夹好啦</button>
  </footer>
</dialog>
```

**示例 · 尺寸与静态遮罩**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn" data-riko-open="story-dialog">大对话框</button>
  <button type="button" class="riko-btn" data-riko-open="agree-dialog">静态遮罩</button>
</div>
<dialog class="riko-dialog riko-dialog--lg" id="story-dialog" data-riko="dialog" aria-labelledby="story-dialog-title">
  <header class="riko-dialog__header">
    <h2 class="riko-dialog__title" id="story-dialog-title">001 沙滩上的画家</h2>
    <button type="button" class="riko-dialog__close" data-riko-close aria-label="关闭"></button>
  </header>
  <div class="riko-dialog__body riko-prose riko-prose--read">
    <p>轻柔的海浪涌来，在微风的吹拂下散入金黄的沙滩。无垠的大海倒映着碧空，也消解了一部分太阳的热。</p>
    <p>沙滩上，一个女孩哼着欢快的歌，挥动她的画笔，一道道鲜艳的色彩在画板上留下痕迹，逐渐勾勒出天空、大海、沙滩……</p>
  </div>
</dialog>
<dialog class="riko-dialog riko-dialog--sm" id="agree-dialog" data-riko="dialog" data-riko-backdrop="static" aria-labelledby="agree-dialog-title">
  <header class="riko-dialog__header">
    <h2 class="riko-dialog__title" id="agree-dialog-title">阅读须知</h2>
  </header>
  <div class="riko-dialog__body">
    <p class="riko-dialog__desc">本作品仍在连载中，设定可能随剧情调整。请点击下方按钮确认。</p>
  </div>
  <footer class="riko-dialog__footer">
    <button type="button" class="riko-btn riko-btn--primary" data-riko-close="agree">我知道啦</button>
  </footer>
</dialog>
```

**示例 · 确认框与提示框**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn riko-btn--danger" id="confirm-demo">清空阅读记录</button>
  <button type="button" class="riko-btn" id="alert-demo">显示提示</button>
</div>
<script>
  document.getElementById('confirm-demo').addEventListener('click', async () => {
    const ok = await Riko.confirm({
      title: '要清空阅读记录吗？',
      message: '已读标记和书签都会消失，这个操作不能撤销哦。',
      confirmText: '清空',
      tone: 'danger',
    });
    if (ok) Riko.toast.success('阅读记录已清空');
  });
  document.getElementById('alert-demo').addEventListener('click', () => {
    Riko.alert({ title: '敬请期待', message: '第二章正在努力创作中，预计 2027 年继续更新！' });
  });
</script>
```

相关：[drawer](drawer.md)、[toast](toast.md)、[theme-picker](theme-picker.md)
