# Riko UI 开发仓库

| 包 | 说明 |
|---|---|
| `packages/core` → `@bloret-crew/riko-ui` | 框架本体（CSS + JS + 类型 + AI 文档 + CLI） |
| `packages/fonts` → `@bloret-crew/riko-ui-fonts` | 自托管字体 |
| `docs/` | 文档站（用框架自身编写，直接打开 `docs/index.html`） |
| `templates/` | 页面模板（官网首页、小说阅读器、登录、后台、文章、设置、404） |

## 常用命令

```sh
npm install
npm run build          # 构建 dist/、生成内置图标、组件注册表、AI 文档（llms.txt / AI_GUIDE.md）
npm test               # 构建 + 质量门禁：清单字段、类名覆盖、文档小节、示例与文档 check、对比度
npm run check          # 对 docs/ 运行 riko-ui check
npm run contrast       # 设计变量对比度（WCAG）
npm run build:fonts    # 重新生成字体包（需要 Python：pip install fonttools brotli，可用 RIKO_PYTHON 指定解释器）
node tools/screenshot.mjs docs/data.html [--dark] [--width 520] [--hash 小节id]   # 截图
node tools/interact.mjs  测试页.html [毫秒] [--dark]                                # 实时运行并打印 console（交互测试）
```

## 新增一个组件

1. 读 `SPEC.md`（唯一规范来源）。
2. `packages/core/src/css/components/<名>.css`（整个文件包在 `@layer riko.components` 中，只用语义变量）。
3. 需要交互时 `packages/core/src/js/components/<名>.js`：`export default { name, init(el), destroy(el) }`，全局 API 用 `export const api = {…}`；构建会自动注册。
4. `packages/core/ai/components/<名>.json`（格式见 `_schema.json`）：示例必须与文档演示一致，写好 `requires` 结构规则。
5. 在对应的 `docs/<分类>.html` 加一个 `<section class="docs-section" id="<名>">`，演示放在 `.docs-demo` 中（自动显示代码，API 表由清单自动生成）。
6. `npm test` 全部通过，并在浅色、深色、520px 下截图检查。

## 发布

```sh
npm test
npm publish -w packages/core --access public
npm publish -w packages/fonts --access public
```
