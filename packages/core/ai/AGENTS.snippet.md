## UI：Riko UI

本项目使用 Riko UI（@bloret-crew/riko-ui）构建界面，保持温馨手绘风格统一。

- 写 UI 前先读 `node_modules/@bloret-crew/riko-ui/llms.txt`；需要具体组件时读 `node_modules/@bloret-crew/riko-ui/ai/AI_GUIDE.md` 的对应小节。
- 优先使用 Riko UI 组件与布局原语（riko-container / riko-stack / riko-cluster / riko-grid / riko-split），不要手写重复的组件样式。
- 类名：`riko-<组件>`、`riko-<组件>__<部件>`、`riko-<组件>--<修饰>`（修饰必须和根类同元素）。状态用 ARIA/原生属性，不用 .active 之类状态类。
- 颜色、间距、圆角、阴影只用 `var(--riko-*)` 设计变量；深色模式交给 `<html data-theme>` 与 `Riko.theme`。
- 图标用 Lucide（`<i data-lucide="名称">`）；仅图标按钮要有 aria-label。
- 交付前运行 `npx riko-ui check <改动的文件>`，0 错误才算完成。
