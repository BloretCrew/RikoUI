<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 步骤条 Steps `steps`

展示流程进度：已完成显示勾，当前步骤是倾斜的橙色小方块，出错显示红叉。

**何时用**：注册、下单、引导等多步流程；也可以表示故事进度。纯时间顺序的记录用 timeline。

**根**：`riko-steps`（推荐 `<ol>`）

**部件**：
- `riko-steps__item` 一个步骤 <li>（必需）
- `riko-steps__marker` 序号方块（完成/出错时序号被图标替换）（必需）
- `riko-steps__body` 文字容器
- `riko-steps__title` 步骤名
- `riko-steps__desc` 说明（横向窄屏时隐藏）

**修饰**（同组互斥）：
- layout：`riko-steps--vertical` 纵向排列
- size：`riko-steps--sm` 小号

**状态**：
- `aria-current="step"`（在 `riko-steps__item`） 当前步骤
- `data-status="done"`（在 `riko-steps__item`） 已完成
- `data-status="error"`（在 `riko-steps__item`） 出错

**无障碍**：
- 用 <ol>，屏幕阅读器会读出「第几项，共几项」。
- 当前步骤写 aria-current="step"。

**要点**：
- ✓ 当前步骤之前的步骤写 data-status="done"。
- ✓ 连接线颜色自动跟随完成状态。

**避免**：
- ✗ 不要用 class 表示状态（.done/.active），用 data-status 与 aria-current。

**示例 · 横向**

```html
<ol class="riko-steps">
  <li class="riko-steps__item" data-status="done"><span class="riko-steps__marker">1</span><span class="riko-steps__body"><span class="riko-steps__title">踏上沙滩</span><span class="riko-steps__desc">第一幅画</span></span></li>
  <li class="riko-steps__item" data-status="done"><span class="riko-steps__marker">2</span><span class="riko-steps__body"><span class="riko-steps__title">世界边缘</span><span class="riko-steps__desc">遇见屏障</span></span></li>
  <li class="riko-steps__item" aria-current="step"><span class="riko-steps__marker">3</span><span class="riko-steps__body"><span class="riko-steps__title">踏上归途</span><span class="riko-steps__desc">进行中</span></span></li>
  <li class="riko-steps__item"><span class="riko-steps__marker">4</span><span class="riko-steps__body"><span class="riko-steps__title">回到 HV</span><span class="riko-steps__desc">敬请期待</span></span></li>
</ol>
```

**示例 · 纵向 + 出错状态**

```html
<ol class="riko-steps riko-steps--vertical riko-steps--sm">
  <li class="riko-steps__item" data-status="done"><span class="riko-steps__marker">1</span><span class="riko-steps__body"><span class="riko-steps__title">填写昵称</span><span class="riko-steps__desc">好啦，你叫「小星星」</span></span></li>
  <li class="riko-steps__item" data-status="error"><span class="riko-steps__marker">2</span><span class="riko-steps__body"><span class="riko-steps__title">验证邮箱</span><span class="riko-steps__desc">验证码过期了，再发一次吧</span></span></li>
  <li class="riko-steps__item" aria-current="step"><span class="riko-steps__marker">3</span><span class="riko-steps__body"><span class="riko-steps__title">选择头像</span></span></li>
  <li class="riko-steps__item"><span class="riko-steps__marker">4</span><span class="riko-steps__body"><span class="riko-steps__title">完成</span></span></li>
</ol>
```

相关：[timeline](timeline.md)、[progress](progress.md)
