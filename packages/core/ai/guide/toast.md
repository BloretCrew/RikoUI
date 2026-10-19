<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 轻提示 Toast `toast`

由 JS 弹出、几秒后自动消失的通知卡片；悬停/聚焦时暂停计时，可带操作按钮。

**何时用**：操作结果的短暂反馈（已保存、已复制、发送失败）。需要用户确认用 Riko.confirm；需要长期显示用 alert。

**根**：`riko-toast`（推荐 `<div>`）

**部件**：
- `riko-toaster` 固定定位的容器（自动创建），data-position 决定位置
- `riko-toast__icon` 色调图标（自动）
- `riko-toast__content` 文字容器
- `riko-toast__title` 标题
- `riko-toast__message` 消息
- `riko-toast__action` 操作按钮（如「撤销」）
- `riko-toast__close` 关闭按钮
- `riko-toast__timer` 底部倒计时条

**修饰**（同组互斥）：
- tone：`riko-toast--success` 成功；`riko-toast--warning` 警告；`riko-toast--danger` 错误（role=alert，立即播报）；`riko-toast--accent` 橙色强调

**状态**：
- `data-state="closing"` 离场动画中

**JS**：
- 选项 `data-riko-toast`（消息文字）：声明式：点击该元素弹出 toast
- 选项 `data-riko-toast-tone`（info | success | warning | danger | accent） 默认 info：声明式色调
- 选项 `data-riko-toast-title`（文字）：声明式标题
- 方法 `Riko.toast(message | { title, message, tone, duration, action, icon, position, onClose })`：弹出提示，返回 { el, close() }。duration 默认 4000ms，0 为不自动关闭；action = { label, onClick(close), close?: false }；icon 为 Lucide 图标名
- 方法 `Riko.toast.success(message, options?) / .warning / .danger / .info / .accent`：带色调的快捷方法
- 方法 `Riko.toast.configure({ position, max, duration })`：全局配置：position 为 top-right | top-center | top-left | bottom-right（默认）| bottom-center | bottom-left；max 同时最多显示条数（默认 4）
- 方法 `Riko.toast.clear()`：关闭全部

**无障碍**：
- 容器自带 aria-live="polite"；danger 色调使用 role="alert" 立即播报。
- 不要用 toast 承载唯一的关键信息或必须完成的操作——它会自动消失。

**要点**：
- ✓ 签名：Riko.toast(message | { title, message, tone, duration, action, icon, position, onClose })；快捷方法 Riko.toast.success(message, { title, duration, … }) 的第二个参数接受除 tone 外的全部选项。
- ✓ 用 Riko.toast() 创建，不要手写 riko-toast 结构放进页面。
- ✓ 消息控制在一句话内；需要撤销时用 action。
- ✓ 简单场景可直接写 data-riko-toast 属性，无需 JS。

**避免**：
- ✗ 不要同时连续弹出大量 toast。
- ✗ 不要把 duration 设得太短（< 2500ms）导致来不及阅读。

**示例 · 声明式触发**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn" data-riko-toast="书签已经夹好啦～">普通</button>
  <button type="button" class="riko-btn" data-riko-toast="笔记已保存" data-riko-toast-tone="success">成功</button>
  <button type="button" class="riko-btn" data-riko-toast="还有内容没写完哦" data-riko-toast-tone="warning">警告</button>
  <button type="button" class="riko-btn" data-riko-toast="网络开小差了，请重试" data-riko-toast-title="发送失败" data-riko-toast-tone="danger">错误</button>
</div>
```

**示例 · JS 调用（带撤销）**

```html
<button type="button" class="riko-btn riko-btn--primary" id="toast-demo-undo">删除这条书签</button>
<script>
  document.getElementById('toast-demo-undo').addEventListener('click', () => {
    Riko.toast({
      title: '书签已删除',
      message: '「月下清辉，暗见净化」',
      tone: 'accent',
      duration: 6000,
      action: { label: '撤销', onClick: () => Riko.toast.success('已恢复书签') },
    });
  });
</script>
```

相关：[alert](alert.md)、[dialog](dialog.md)
