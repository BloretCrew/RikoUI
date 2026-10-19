// 组装 GitHub Pages 静态站点到 .site/（发布到 gh-pages 分支根目录）
// 保持仓库内的相对路径结构，文档与模板中的 ../packages/... 引用无需改写。
import { cpSync, rmSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, '.site');
const need = ['packages/core/dist/riko-ui.css', 'packages/core/dist/riko-ui.js', 'packages/fonts/riko-fonts.css', 'docs/assets/manifest.js'];
for (const f of need) if (!existsSync(join(ROOT, f))) throw new Error(`缺少 ${f}，请先运行 npm run build`);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const copy = (from, to = from) => cpSync(join(ROOT, from), join(OUT, to), { recursive: true, filter: src => !/\/\.[^/]*$/.test(src) && !/\/_template\.html$/.test(src) && !/\/\._shot-/.test(src) });
copy('docs');
copy('templates');
copy('packages/core/dist');
copy('packages/core/ai');
copy('packages/core/llms.txt');
copy('packages/fonts/riko-fonts.css');
copy('packages/fonts/files');
copy('packages/fonts/LICENSES');

// 站点根：跳转到文档首页
writeFileSync(join(OUT, 'index.html'), `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><title>Riko UI</title>
<meta http-equiv="refresh" content="0; url=docs/index.html">
<link rel="canonical" href="docs/index.html"></head>
<body><p>正在前往 <a href="docs/index.html">Riko UI 文档</a>…</p></body></html>
`);
writeFileSync(join(OUT, '.nojekyll'), '');
console.log('✓ 站点已输出到 .site/');
