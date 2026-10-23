<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 抽屉 Drawer `drawer`

从屏幕左/右/底部滑出的模态面板（原生 <dialog>），用法与对话框一致。

**何时用**：移动端目录/导航、筛选条件、详情预览、分享面板。居中的确认/表单用 dialog。

**根**：`riko-drawer`（推荐 `<dialog>`）

**部件**：
- `riko-drawer__header` 头部
- `riko-drawer__title` 标题（h2），id 供 aria-labelledby 引用（必需）
- `riko-drawer__close` 关闭按钮：空 <button>，带 data-riko-close 与 aria-label
- `riko-drawer__body` 内容区（滚动）
- `riko-drawer__footer` 底部按钮区

**修饰**（同组互斥）：
- layout：`riko-drawer--left` 从左侧滑出（默认右侧）；`riko-drawer--bottom` 从底部滑出（带把手；桌面端居中限宽）
- size：`riko-drawer--sm` 窄（300px）；`riko-drawer--lg` 宽（560px）

**状态**：
- `open` 打开中（由 JS 维护）
- `data-state="closing"` 关闭动画中

**JS**：
- 启用：`data-riko="drawer"`
- 选项 `data-riko-open`（抽屉 id）：写在触发按钮上
- 选项 `data-riko-close`（可选返回值）：写在抽屉内的按钮上
- 选项 `data-riko-backdrop`（static）：点击遮罩与 Esc 不关闭
- 方法 `el.riko.open() / el.riko.close() / el.riko.toggle()`：实例方法；也可用 Riko.dialog.open(id)
- 事件 `riko:drawer:open` detail { id }：打开前派发，可取消
- 事件 `riko:drawer:opened` detail { id }：已打开
- 事件 `riko:drawer:close` detail { id, returnValue }：已关闭

**无障碍**：
- 必须是 <dialog>，并用 aria-labelledby 指向标题。
- 焦点锁定与返回由 JS 处理；关闭按钮需要 aria-label。

**要点**：
- ✓ 部件类名用 riko-drawer__*（不要混用 riko-dialog__*）。
- ✓ 打开/关闭与 dialog 相同：data-riko-open / data-riko-close。

**避免**：
- ✗ 不要用 <div> 自己做抽屉和遮罩。
- ✗ 不要把 --left 与 --bottom 同时使用。

**示例 · 三个方向**

```html
<div class="riko-cluster">
  <button type="button" class="riko-btn" data-riko-open="toc-drawer"><i data-lucide="list"></i>目录（左）</button>
  <button type="button" class="riko-btn" data-riko-open="detail-drawer"><i data-lucide="panel-right"></i>详情（右）</button>
  <button type="button" class="riko-btn" data-riko-open="share-drawer"><i data-lucide="share-2"></i>分享（底部）</button>
</div>
<dialog class="riko-drawer riko-drawer--left" id="toc-drawer" data-riko="drawer" aria-labelledby="toc-drawer-title">
  <header class="riko-drawer__header">
    <h2 class="riko-drawer__title" id="toc-drawer-title"><span class="riko-star" aria-hidden="true"></span>小说目录</h2>
    <button type="button" class="riko-drawer__close" data-riko-close aria-label="关闭目录"></button>
  </header>
  <div class="riko-drawer__body">
    <p>序章 · 第一幕：沙滩上的画家</p>
    <p>序章 · 第二幕：归途的微光</p>
    <p>序章 · 第三幕：暗林深处</p>
  </div>
</dialog>
<dialog class="riko-drawer" id="detail-drawer" data-riko="drawer" aria-labelledby="detail-drawer-title">
  <header class="riko-drawer__header">
    <h2 class="riko-drawer__title" id="detail-drawer-title">角色卡 · 络可</h2>
    <button type="button" class="riko-drawer__close" data-riko-close aria-label="关闭"></button>
  </header>
  <div class="riko-drawer__body">
    <p>喜欢画画的小女孩，戴着缀有橙色星星的贝雷帽。最喜欢的点心是星星酥。</p>
  </div>
  <footer class="riko-drawer__footer">
    <button type="button" class="riko-btn riko-btn--ghost" data-riko-close>关闭</button>
    <button type="button" class="riko-btn riko-btn--primary">查看笔记本</button>
  </footer>
</dialog>
<dialog class="riko-drawer riko-drawer--bottom" id="share-drawer" data-riko="drawer" aria-labelledby="share-drawer-title">
  <header class="riko-drawer__header">
    <h2 class="riko-drawer__title" id="share-drawer-title">分享这一节</h2>
    <button type="button" class="riko-drawer__close" data-riko-close aria-label="关闭"></button>
  </header>
  <div class="riko-drawer__body">
    <div class="riko-cluster">
      <button type="button" class="riko-btn riko-btn--soft" data-riko-toast="链接已复制" data-riko-toast-tone="success"><i data-lucide="link"></i>复制链接</button>
      <button type="button" class="riko-btn riko-btn--soft"><i data-lucide="image"></i>生成卡片</button>
    </div>
  </div>
</dialog>
```

相关：[dialog](dialog.md)
