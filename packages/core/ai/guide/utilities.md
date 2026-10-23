<!-- Riko UI v0.1.0 · 自动生成 · 通用规则见 ../../llms.txt -->
# 工具类 Utilities `utilities`

少量高频工具类：读屏专用、显示隐藏、文字对齐/截断、宽度、外边距。

**何时用**：仅在组件/布局原语无法满足的小调整时使用。

**部件**：
- `riko-u-sr-only` 只对读屏可见
- `riko-u-hidden` 隐藏
- `riko-u-hide-sm` ≤520px 隐藏
- `riko-u-hide-md` ≤768px 隐藏
- `riko-u-only-mobile` 仅 ≤768px 显示
- `riko-u-text-left` text-left
- `riko-u-text-center` text-center
- `riko-u-text-right` text-right
- `riko-u-nowrap` nowrap
- `riko-u-truncate` 单行省略
- `riko-u-clamp-2` 两行省略
- `riko-u-clamp-3` 三行省略
- `riko-u-tabular` 等宽数字
- `riko-u-w-full` w-full
- `riko-u-flex-1` flex-1
- `riko-u-relative` relative
- `riko-u-mx-auto` mx-auto
- `riko-u-mt-0` mt-0
- `riko-u-mt-2` mt-2
- `riko-u-mt-4` mt-4
- `riko-u-mt-6` mt-6
- `riko-u-mt-8` mt-8
- `riko-u-mt-10` mt-10
- `riko-u-mb-0` mb-0
- `riko-u-mb-2` mb-2
- `riko-u-mb-4` mb-4
- `riko-u-mb-6` mb-6
- `riko-u-mb-8` mb-8
- `riko-u-mb-10` mb-10

**要点**：
- ✓ 间距工具只有 mt/mb 的 0/2/4/6/8/10 档（对应 --riko-space-*）；更复杂的间距请用 riko-stack / riko-cluster。

**避免**：
- ✗ 不要用工具类堆砌组件外观（颜色、阴影、圆角），那是组件的职责。

**示例 · 读屏专用文字**

```html
<a class="riko-link" href="#chapters">继续阅读<span class="riko-u-sr-only">：第 76 节 风过围垣，落星回响</span></a>
```
