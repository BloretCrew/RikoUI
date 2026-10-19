// Riko UI 构建脚本：node tools/build.mjs [--watch]
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import * as esbuild from 'esbuild';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CORE = join(ROOT, 'packages/core');
const SRC = join(CORE, 'src');
const DIST = join(CORE, 'dist');
const pkg = JSON.parse(readFileSync(join(CORE, 'package.json'), 'utf8'));
const banner = `/*! Riko UI v${pkg.version} | MIT License | 内置图标来自 Lucide (ISC) */`;
mkdirSync(DIST, { recursive: true });

const t0 = Date.now();
const list = (dir, ext) => existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith(ext) && !f.startsWith('_')).sort() : [];

// 1) 内置图标
execFileSync(process.execPath, [join(ROOT, 'tools/gen-icons.mjs')], { stdio: 'inherit' });

// 2) JS 组件注册表（自动收集 src/js/components/*.js）
const jsComps = list(join(SRC, 'js/components'), '.js');
writeFileSync(join(SRC, 'js/components/_registry.js'),
  '// 由 tools/build.mjs 自动生成，请勿手改\n' +
  jsComps.map((f, i) => `import * as m${i} from './${f}';`).join('\n') +
  `\n\nexport const components = [${jsComps.map((f, i) => /export\s+default\b/.test(readFileSync(join(SRC, 'js/components', f), 'utf8')) ? `m${i}.default` : null).filter(Boolean).join(', ')}];\n` +
  `export const api = Object.assign({}${jsComps.map((f, i) => /export\s+const\s+api\b/.test(readFileSync(join(SRC, 'js/components', f), 'utf8')) ? `, m${i}.api` : '').join('')});\n`);

// 3) CSS：按层顺序拼接
const LAYERS = '@layer riko.reset, riko.tokens, riko.base, riko.layout, riko.components, riko.decor, riko.utilities;\n';
const cssParts = ['tokens.css', 'icons.css', 'base.css', 'typography.css', 'layout.css',
  ...list(join(SRC, 'css/components'), '.css').map(f => 'components/' + f), 'decor.css', 'utilities.css'];
const css = LAYERS + cssParts.map(f => `\n/* ---- ${f} ---- */\n` + readFileSync(join(SRC, 'css', f), 'utf8')).join('');
// 无 JS / 无防闪烁脚本时也跟随系统深色：把 [data-theme="dark"] 的变量块复制到媒体查询中（仅作用于未设置 data-theme 的页面）
const tokensSrc = readFileSync(join(SRC, 'css/tokens.css'), 'utf8');
const darkStart = tokensSrc.indexOf('[data-theme="dark"] {');
const darkBody = tokensSrc.slice(tokensSrc.indexOf('{', darkStart) + 1, tokensSrc.indexOf('\n  }', darkStart));
const darkFallback = `\n/* ---- 系统深色兜底（自动生成） ---- */\n@layer riko.tokens {\n  @media (prefers-color-scheme: dark) {\n    :root:not([data-theme]) {${darkBody}\n    }\n  }\n}\n`;
const cssOut = css + darkFallback;
writeFileSync(join(DIST, 'riko-ui.css'), banner + '\n' + cssOut);
const min = await esbuild.transform(cssOut, { loader: 'css', minify: true, target: ['chrome111', 'safari16.4', 'firefox121'] });
writeFileSync(join(DIST, 'riko-ui.min.css'), banner + '\n' + min.code);
if (min.warnings.length) console.warn(min.warnings.map(w => w.text).join('\n'));
// 仅设计变量（给只想要配色/间距的项目）
writeFileSync(join(DIST, 'tokens.css'), banner + '\n' + LAYERS + tokensSrc + darkFallback);

// 4) JS
const common = { entryPoints: [join(SRC, 'js/index.js')], bundle: true, target: ['es2022'], banner: { js: banner },
  define: { __RIKO_VERSION__: JSON.stringify(pkg.version) }, logLevel: 'warning' };
// 源码里用占位字符串表示版本
const versionPlugin = { name: 'version', setup(b) {
  b.onLoad({ filter: /src[\\/]js[\\/]index\.js$/ }, a => ({ contents: readFileSync(a.path, 'utf8').replace("'__RIKO_VERSION__'", JSON.stringify(pkg.version)), loader: 'js', resolveDir: dirname(a.path) }));
} };
await Promise.all([
  esbuild.build({ ...common, plugins: [versionPlugin], format: 'esm', outfile: join(DIST, 'riko-ui.esm.js') }),
  esbuild.build({ ...common, plugins: [versionPlugin], format: 'esm', minify: true, outfile: join(DIST, 'riko-ui.esm.min.js') }),
  esbuild.build({ ...common, plugins: [versionPlugin], format: 'iife', outfile: join(DIST, 'riko-ui.js') }),
  esbuild.build({ ...common, plugins: [versionPlugin], format: 'iife', minify: true, outfile: join(DIST, 'riko-ui.min.js') }),
]);

// 5) 防闪烁脚本
const { themeInitSnippet } = await import(pathToFileURL(join(SRC, 'js/theme.js')).href + '?t=' + Date.now());
writeFileSync(join(DIST, 'riko-theme-init.js'), banner + '\n' + themeInitSnippet() + '\n');

// 6) AI 组件清单
const AI = join(CORE, 'ai');
const manifest = list(join(AI, 'components'), '.json').map(f => {
  try { return JSON.parse(readFileSync(join(AI, 'components', f), 'utf8')); }
  catch (e) { throw new Error(`ai/components/${f} 不是合法 JSON：${e.message}`); }
}).sort((a, b) => (a.category + a.name).localeCompare(b.category + b.name));
writeFileSync(join(AI, 'components.json'), JSON.stringify({ name: pkg.name, version: pkg.version, components: manifest }, null, 2) + '\n');
// 文档站用的清单副本（file:// 下无法 fetch JSON，所以输出为 JS）
writeFileSync(join(ROOT, 'docs/assets/manifest.js'), '// 由 tools/build.mjs 生成\nwindow.RIKO_MANIFEST = ' + JSON.stringify({ version: pkg.version, components: manifest }) + ';\n');

// 7) AI 文档（llms.txt / AI_GUIDE.md / AGENTS.snippet.md）
execFileSync(process.execPath, [join(ROOT, 'tools/gen-guide.mjs')], { stdio: 'inherit' });

const size = f => (statSync(join(DIST, f)).size / 1024).toFixed(1) + 'KB';
console.log(`✓ 构建完成 ${Date.now() - t0}ms · CSS ${size('riko-ui.min.css')} · JS ${size('riko-ui.min.js')} · ${jsComps.length} 个 JS 组件 · ${cssParts.length - 7} 个组件样式 · 清单 ${manifest.length} 项`);
