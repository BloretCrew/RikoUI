// 生成 AI 文档：packages/core/llms.txt（精简索引）、ai/AI_GUIDE.md（完整指南）、ai/AGENTS.snippet.md（粘贴到项目的 AI 说明）
// 数据来源：ai/components.json（组件清单）+ src/css/tokens.css（设计变量）
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CORE = join(ROOT, 'packages/core');
const pkg = JSON.parse(readFileSync(join(CORE, 'package.json'), 'utf8'));
const { components } = JSON.parse(readFileSync(join(CORE, 'ai/components.json'), 'utf8'));
const tokensCss = readFileSync(join(CORE, 'src/css/tokens.css'), 'utf8');

const CATS = [
  ['foundation', '设计基础'], ['layout', '布局'], ['general', '通用'], ['form', '表单'],
  ['navigation', '导航'], ['data', '数据展示'], ['feedback', '反馈'], ['decor', '装饰'],
];
const CDN = `https://cdn.jsdelivr.net/npm/${pkg.name}@${pkg.version.split('.')[0]}`;
const byCat = cat => components.filter(c => c.category === cat);

const RULES = [
  '类名前缀一律 `riko-`。根类 `riko-<组件>`，部件 `riko-<组件>__<部件>`，修饰 `riko-<组件>--<修饰>`。**修饰类必须与根类写在同一元素上**（`class="riko-btn riko-btn--primary"`）。',
  '状态用原生属性/ARIA，不用状态类：`disabled`、`aria-pressed`、`aria-selected`、`aria-expanded`、`aria-current="page"`、`aria-invalid="true"`、`aria-busy="true"`、`hidden`。**不要写 `.active` `.is-open` `.dark`**。',
  '需要 JS 的组件在根元素加 `data-riko="<组件>"`，Riko 会自动初始化（包括之后动态插入的元素）；打开弹层用 `data-riko-open="<id>"`，关闭用 `data-riko-close`。',
  '只用设计变量，不写死颜色/阴影/圆角：`var(--riko-color-*)`、`var(--riko-space-*)`、`var(--riko-radius-*)`、`var(--riko-shadow-*)`。定制品牌色就覆盖变量。',
  '深色模式由 `<html data-theme="dark">` 控制，交给 `Riko.theme`；不要自己写 `prefers-color-scheme` 或深色类。在 `<head>`、样式表之前用 `<script src>` 引入 `riko-theme-init.js` 防闪烁（SSR 可内联 `Riko.themeInitSnippet()`）。',
  '布局用原语：`riko-container`、`riko-section`、`riko-stack`（纵向）、`riko-cluster`（横向）、`riko-grid`、`riko-split`（侧栏+主区），不要为常规排版手写 flex/grid CSS。',
  '图标用 Lucide：`<i data-lucide="名称"></i>`（先引入 lucide 再引入 riko-ui）。仅图标的按钮必须有 `aria-label`；装饰图标/星星加 `aria-hidden="true"`。',
  '同一组（group）的修饰互斥，只选一个；尺寸默认 md 不写修饰。',
  '照抄本指南 examples 中的结构，不要增删部件层级；不确定时查 `ai/components/<组件>.json`。',
  '写完运行 `npx riko-ui check <文件或目录>`，把错误全部修掉再交付。check 只检查结构、类名与无障碍，交互行为请自己在浏览器里点一遍。',
  '页面最上方的标题区用 `riko-hero`（h1，每页唯一）；页面内的版块标题用 `riko-section-head`（h2）。',
];

const code = (s, lang = 'html') => '```' + lang + '\n' + s.trim() + '\n```';

// ---- 设计变量 ----
function tokenList() {
  const names = new Set(Array.from(tokensCss.matchAll(/(--riko-(?!palette)[\w-]+):/g), m => m[1]));
  const groups = {};
  for (const n of names) {
    const g = n.replace(/^--riko-/, '').split('-')[0];
    (groups[g] ||= []).push(n);
  }
  return Object.entries(groups).map(([g, list]) => `- **${g}**：${list.map(n => '`' + n + '`').join(' ')}`).join('\n');
}

// ---- 组件详情 ----
function detail(c) {
  const out = [`### ${c.title} ${c.titleEn} \`${c.name}\``, '', c.summary, '', `**何时用**：${c.when}`, ''];
  if (c.root) out.push(`**根**：\`${c.root}\`${c.element ? `（推荐 \`<${c.element}>\`）` : ''}`, '');
  if (c.parts?.length) out.push('**部件**：', ...c.parts.map(p => `- \`${p.class}\` ${p.desc}${p.required ? '（必需）' : ''}`), '');
  if (c.modifiers?.length) {
    const g = {};
    for (const m of c.modifiers) (g[m.group || 'other'] ||= []).push(m);
    out.push('**修饰**（同组互斥）：', ...Object.entries(g).map(([k, ms]) => `- ${k}：${ms.map(m => `\`${m.class}\` ${m.desc}`).join('；')}`), '');
  }
  if (c.states?.length) out.push('**状态**：', ...c.states.map(s => `- \`${s.attr}\`${s.on ? `（在 \`${s.on}\`）` : ''} ${s.desc}`), '');
  if (c.js) {
    const js = [];
    if (c.js.attr) js.push(`- 启用：\`${c.js.attr}\``);
    for (const o of c.js.options || []) js.push(`- 选项 \`${o.attr}\`${o.values ? `（${o.values}）` : ''}${o.default ? ` 默认 ${o.default}` : ''}：${o.desc}`);
    for (const m of c.js.methods || []) js.push(`- 方法 \`${m.signature}\`：${m.desc}`);
    for (const e of c.js.events || []) js.push(`- 事件 \`${e.name}\`${e.detail ? ` detail ${e.detail}` : ''}：${e.desc}`);
    if (js.length) out.push('**JS**：', ...js, '');
  }
  if (c.a11y?.length) out.push('**无障碍**：', ...c.a11y.map(s => '- ' + s), '');
  if (c.rules?.length) out.push('**要点**：', ...c.rules.map(s => '- ✓ ' + s), '');
  if (c.avoid?.length) out.push('**避免**：', ...c.avoid.map(s => '- ✗ ' + s), '');
  for (const e of c.examples || []) out.push(`**示例 · ${e.title}**`, '', code(e.html), '');
  return out.join('\n');
}

const quickStart = `## 快速开始

**npm**

${code(`npm i ${pkg.name} lucide`, 'sh')}

${code(`import '${pkg.name}/css';          // 样式
import Riko from '${pkg.name}';       // 自动初始化，并挂到 window.Riko
import { createIcons, icons } from 'lucide';
createIcons({ icons });               // 或让 Riko 自动渲染（需 window.lucide）`, 'js')}

**CDN / 纯 HTML**（中国大陆可把 cdn.jsdelivr.net 换成 registry.npmmirror.com 镜像或自托管 dist/）

${code(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="${CDN}/dist/riko-theme-init.js"></script>
  <link rel="stylesheet" href="${CDN}/dist/riko-ui.min.css">
</head>
<body class="riko-plaid">
  <div class="riko-glow" aria-hidden="true"></div>
  <div class="riko-page">
    <main class="riko-page__main riko-container riko-section">
      <h1 class="riko-h1">你好，Riko UI <span class="riko-star" aria-hidden="true"></span></h1>
    </main>
  </div>
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="${CDN}/dist/riko-ui.min.js"></script>
</body>
</html>`)}

**React / Vue 等框架**：照常写 \`className\` / \`class\`；组件挂载或更新后若有新的 \`data-riko\` 元素，Riko 的 MutationObserver 会自动初始化；也可手动 \`Riko.init(rootEl)\`。服务端渲染时在 \`<head>\` 内联 \`Riko.themeInitSnippet()\` 的返回值。`;

// ---- AI_GUIDE.md ----
const guide = [
  `# Riko UI · AI 使用指南（v${pkg.version}）`, '',
  '> 本文件由构建自动生成（tools/gen-guide.mjs），是写 Riko UI 页面时的完整参考。',
  '> 温馨、可爱、童话感的手绘风格：米色纸张、浅棕描边、冰蓝点缀、暖橙五角星；不规则圆角、虚线缝线、胶带、波浪线。', '',
  '## 核心规则（必须遵守）', '', ...RULES.map((r, i) => `${i + 1}. ${r}`), '',
  quickStart, '',
  '## 组件速查', '',
  ...CATS.flatMap(([cat, label]) => {
    const list = byCat(cat);
    if (!list.length) return [];
    return [`### ${label}`, '', '| 组件 | 根类 | JS | 说明 |', '|---|---|---|---|',
      ...list.map(c => `| ${c.title} \`${c.name}\` | ${c.root ? '`' + c.root + '`' : '—'} | ${c.js?.attr ? '`' + c.js.attr + '`' : '—'} | ${c.summary.replace(/\|/g, '\\|')} |`), ''];
  }),
  '## 设计变量', '', '组件与自定义样式只使用这些变量（深浅色自动切换）：', '', tokenList(), '',
  '## 组件详情', '',
  ...CATS.flatMap(([cat, label]) => {
    const list = byCat(cat);
    return list.length ? [`## ${label}`, '', ...list.map(detail)] : [];
  }),
  '## 自检', '', code('npx riko-ui check src/        # 或具体文件；--json 输出机器可读结果', 'sh'),
  '检查项：未知类名（并给出最接近的正确写法）、修饰类缺少根类、部件修饰、部件不在根内、同组修饰冲突、状态类、未知 data-riko、组件必需结构/属性/元素、仅图标按钮缺 aria-label、img 缺 alt、内联写死颜色；语义警告：一页多个 h1、同组多个主按钮。', '',
  '确有需要时，在元素上写 `data-riko-ignore="规则名"`（空值表示全部规则）可跳过该元素及其子树的检查，例如第三方生成的 HTML。', '',
].join('\n');

// ---- llms.txt（精简索引） ----
const llms = [
  `# Riko UI (${pkg.name})`, '',
  `> 温馨手绘风的通用 UI 框架：纯 CSS + 原生 JS、零依赖、深浅色、无障碍、对 AI 友好。v${pkg.version}`, '',
  '**阅读方式**：先读完本文件的「核心规则」；然后只读你要用到的组件文档 `ai/guide/<组件>.md`（每份约 1–2k tokens，含结构、修饰、状态、JS、无障碍与可复制示例）。不要整篇读 AI_GUIDE.md（合订本，很长）。', '',
  '## 核心规则', '', ...RULES.map((r, i) => `${i + 1}. ${r}`), '',
  '## 引入', '',
  code(`<script src="${CDN}/dist/riko-theme-init.js"></script>   <!-- head，防闪烁 -->
<link rel="stylesheet" href="${CDN}/dist/riko-ui.min.css">
<script src="https://unpkg.com/lucide@latest"></script>              <!-- body 末尾 -->
<script src="${CDN}/dist/riko-ui.min.js"></script>`),
  '', `npm：\`import '${pkg.name}/css'; import Riko from '${pkg.name}';\``, '',
  '## 组件索引', '',
  ...CATS.flatMap(([cat, label]) => {
    const list = byCat(cat);
    return list.length ? [`### ${label}`, ...list.map(c => `- [${c.name}](ai/guide/${c.name}.md)（${c.title}）${c.root ? ' `' + c.root + '`' : ''}${c.js?.attr ? ' `' + c.js.attr + '`' : ''}：${c.summary}`), ''] : [];
  }),
  '## 文件', '',
  '- `ai/guide/<组件>.md`：单个组件的完整说明（推荐按需阅读）',
  '- [ai/guide/_tokens.md](ai/guide/_tokens.md)：全部设计变量',
  '- [ai/AI_GUIDE.md](ai/AI_GUIDE.md)：合订本（全部组件，很长，仅供检索）',
  '- [ai/components.json](ai/components.json)：机器可读的组件清单',
  '- [types/index.d.ts](types/index.d.ts)：JS API 类型',
  '- `npx riko-ui check <路径>`：用法检查', '',
].join('\n');

// ---- 粘贴到项目的 AI 说明 ----
const snippet = `## UI：Riko UI

本项目使用 Riko UI（${pkg.name}）构建界面，保持温馨手绘风格统一。

- 写 UI 前先读 \`node_modules/${pkg.name}/llms.txt\`；需要具体组件时读 \`node_modules/${pkg.name}/ai/AI_GUIDE.md\` 的对应小节。
- 优先使用 Riko UI 组件与布局原语（riko-container / riko-stack / riko-cluster / riko-grid / riko-split），不要手写重复的组件样式。
- 类名：\`riko-<组件>\`、\`riko-<组件>__<部件>\`、\`riko-<组件>--<修饰>\`（修饰必须和根类同元素）。状态用 ARIA/原生属性，不用 .active 之类状态类。
- 颜色、间距、圆角、阴影只用 \`var(--riko-*)\` 设计变量；深色模式交给 \`<html data-theme>\` 与 \`Riko.theme\`。
- 图标用 Lucide（\`<i data-lucide="名称">\`）；仅图标按钮要有 aria-label。
- 交付前运行 \`npx riko-ui check <改动的文件>\`，0 错误才算完成。
`;

writeFileSync(join(CORE, 'ai/AI_GUIDE.md'), guide);
// 按需阅读：每个组件一份文档 + 设计变量
const GUIDE_DIR = join(CORE, 'ai/guide');
rmSync(GUIDE_DIR, { recursive: true, force: true });
mkdirSync(GUIDE_DIR, { recursive: true });
for (const c of components) {
  const related = (c.related || []).filter(n => components.some(x => x.name === n)).map(n => `[${n}](${n}.md)`).join('、');
  writeFileSync(join(GUIDE_DIR, `${c.name}.md`),
    `<!-- Riko UI v${pkg.version} · 自动生成 · 通用规则见 ../../llms.txt -->\n` + detail(c).replace(/^### /, '# ') + (related ? `\n相关：${related}\n` : ''));
}
writeFileSync(join(GUIDE_DIR, '_tokens.md'), `# 设计变量（v${pkg.version}）\n\n组件与自定义样式只使用这些变量（深浅色自动切换）：\n\n${tokenList()}\n`);
writeFileSync(join(CORE, 'llms.txt'), llms);
writeFileSync(join(CORE, 'ai/AGENTS.snippet.md'), snippet);
const tok = s => Math.round(s.length / 1.6);
console.log(`AI 文档：llms.txt ≈${tok(llms)} tokens · AI_GUIDE.md ≈${tok(guide)} tokens · ${components.length} 个组件`);
