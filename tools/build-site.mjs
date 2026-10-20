// 组装 GitHub Pages 静态站点到 .site/（发布到 gh-pages 分支根目录）
// 结构：文档页直接放在站点根目录（打开站点即文档首页，无跳转），其余保持仓库内的相对结构：
//   /index.html、/foundation.html …   ← docs/*.html（路径已改写）
//   /assets/                           ← docs/assets/
//   /templates/                        ← templates/
//   /packages/core/{dist,ai,llms.txt}  /packages/fonts/{riko-fonts.css,files,LICENSES}
//   /docs/*.html                       ← 旧地址跳转到根目录对应页面
import { cpSync, rmSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, '.site');
const need = ['packages/core/dist/riko-ui.css', 'packages/core/dist/riko-ui.js', 'packages/fonts/riko-fonts.css', 'docs/assets/manifest.js'];
for (const f of need) if (!existsSync(join(ROOT, f))) throw new Error(`缺少 ${f}，请先运行 npm run build`);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const keep = src => !/\/\.[^/]*$/.test(src) && !/\/_template\.html$/.test(src);
const copy = (from, to = from) => cpSync(join(ROOT, from), join(OUT, to), { recursive: true, filter: keep });

// 文档页 → 站点根目录（docs 原本位于仓库的 docs/ 下，因此 ../ 开头的路径都上移一层）
const docsPages = readdirSync(join(ROOT, 'docs')).filter(f => f.endsWith('.html') && !/^[._]/.test(f));
for (const f of docsPages) {
  const html = readFileSync(join(ROOT, 'docs', f), 'utf8')
    .replace(/(["'(])\.\.\/(packages|templates)\//g, '$1$2/');
  writeFileSync(join(OUT, f), html);
}
copy('docs/assets', 'assets');
// 文档样式里引用字体包的相对路径同样上移一层
const fontsCss = join(OUT, 'assets/fonts.css');
writeFileSync(fontsCss, readFileSync(fontsCss, 'utf8').replace('../../packages/', '../packages/'));

// 模板：引用的 ../docs/assets/ 改为站点根目录的 ../assets/
copy('templates');
for (const f of readdirSync(join(OUT, 'templates')).filter(f => f.endsWith('.html'))) {
  const p = join(OUT, 'templates', f);
  writeFileSync(p, readFileSync(p, 'utf8').replace(/(["'(])\.\.\/docs\/assets\//g, '$1../assets/').replace(/(["'(])\.\.\/docs\//g, '$1../'));
}

copy('packages/core/dist');
copy('packages/core/ai');
copy('packages/core/llms.txt');
copy('packages/fonts/riko-fonts.css');
copy('packages/fonts/files');
copy('packages/fonts/LICENSES');

// 旧地址 /docs/xxx.html → 根目录 xxx.html（避免已分享的链接失效）
mkdirSync(join(OUT, 'docs'), { recursive: true });
for (const f of docsPages) {
  writeFileSync(join(OUT, 'docs', f), `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>Riko UI</title>` +
    `<link rel="canonical" href="../${f}"><script>location.replace('../${f}' + location.hash)</script>` +
    `<meta http-equiv="refresh" content="0; url=../${f}"></head><body></body></html>\n`);
}

writeFileSync(join(OUT, '.nojekyll'), '');

// 自检：根目录页面中不应残留指向仓库结构的 ../ 路径
const leftovers = docsPages.filter(f => /(["'(])\.\.\/(packages|templates|docs)\//.test(readFileSync(join(OUT, f), 'utf8')));
if (leftovers.length) throw new Error('以下页面仍有未改写的 ../ 路径：' + leftovers.join(', '));
console.log(`✓ 站点已输出到 .site/（${docsPages.length} 个文档页位于根目录）`);
