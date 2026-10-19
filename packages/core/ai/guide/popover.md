<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 气泡卡片 Popover `popover`

点击触发的浮层卡片，可放任意内容（文字、链接、按钮、表单），点外部或按 Esc 关闭。

**何时用**：需要在原地展示补充信息或少量操作。只有一句提示用 tooltip；操作菜单用 dropdown；需要用户专注完成任务用 dialog。

**根**：`riko-popover`（推荐 `<div>`）

**部件**：
- `riko-popover__header` 标题行
- `riko-popover__title` 标题
- `riko-popover__close` 关闭按钮（加 data-riko-close 与 aria-label）
- `riko-popover__body` 内容
- `riko-popover__footer` 底部操作区

**修饰**（同组互斥）：
- size：`riko-popover--sm` 窄（220px）；`riko-popover--lg` 宽（400px）
- tone：`riko-popover--ice` 冰蓝底

**状态**：
- `aria-expanded="true"`（在 `触发器`） 打开时由 JS 维护

**JS**：
- 启用：`data-riko="popover"`
- 选项 `data-riko-toggle="<popover id>"`（popover 的 id）：写在触发按钮上：点击切换
- 选项 `popover`（auto）：原生属性，写在 popover 上（推荐手写，避免首屏闪现）
- 选项 `data-riko-placement`（bottom | top | left | right（可加 -start / -end）） 默认 bottom：写在 popover 上：相对触发器的位置
- 选项 `data-riko-close`：写在 popover 内的按钮上：点击关闭
- 方法 `pop.riko.open(anchor?) / pop.riko.close() / pop.riko.toggle(anchor?)`：手动控制；anchor 为定位参照元素
- 事件 `riko:popover:open` detail { anchor }：打开后
- 事件 `riko:popover:close` detail { anchor }：关闭后

**无障碍**：
- 触发器用 <button>；JS 会设置 aria-expanded / aria-controls / aria-haspopup。
- 打开后焦点移入卡片（第一个可聚焦元素，没有则卡片本身），Esc 关闭并把焦点还给触发器。
- 有标题时给 popover 加 aria-labelledby 指向标题 id。

**要点**：
- ✓ popover 元素可以放在页面任何位置（通常放在触发器旁边或 body 末尾），它会在顶层渲染。
- ✓ 关闭按钮：<button class="riko-popover__close" data-riko-close aria-label="关闭"></button>。

**避免**：
- ✗ 不要用 popover 做必须完成的流程（改用 dialog）。
- ✗ 不要给触发器同时加 popovertarget 和 data-riko-toggle。

**示例 · 基础用法**

```html
<div class="riko-cluster riko-cluster--center">
  <button type="button" class="riko-btn riko-btn--soft" data-riko-toggle="pop-riko">关于络可</button>
  <div class="riko-popover" id="pop-riko" data-riko="popover" popover aria-labelledby="pop-riko-title">
    <div class="riko-popover__header">
      <h3 class="riko-popover__title" id="pop-riko-title"><span class="riko-star" aria-hidden="true"></span>络可</h3>
      <button type="button" class="riko-popover__close" data-riko-close aria-label="关闭"></button>
    </div>
    <div class="riko-popover__body">自小在 HV 长大的小画家，戴着有星星的贝雷帽，最喜欢在沙滩上画海。</div>
    <div class="riko-popover__footer">
      <a class="riko-btn riko-btn--sm riko-btn--primary" href="#popover">查看设定</a>
    </div>
  </div>
  <button type="button" class="riko-btn" data-riko-toggle="pop-tip">小提示</button>
  <div class="riko-popover riko-popover--sm riko-popover--ice" id="pop-tip" data-riko="popover" popover data-riko-placement="top">
    <div class="riko-popover__body">按 ← → 可以切换小节哦 ✦</div>
  </div>
</div>
```

相关：[tooltip](tooltip.md)、[dropdown](dropdown.md)、[dialog](dialog.md)
