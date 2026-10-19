// 质量门禁：node tools/verify.mjs（npm test 会先构建再运行）
import { readFileSync, readdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CORE = join(ROOT, 'packages/core');
const failures = [];
const warn = [];
const fail = (area, msg) => failures.push(`[${area}] ${msg}`);
const section = t => console.log(`\n— ${t}`);

const schema = JSON.parse(readFileSync(join(CORE, 'ai/components/_schema.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(CORE, 'ai/components.json'), 'utf8')).components;
const css = readFileSync(join(CORE, 'dist/riko-ui.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/url\([^)]*\)/g, '');
const js = readFileSync(join(CORE, 'dist/riko-ui.js'), 'utf8');
const cssClasses = new Set(Array.from(css.matchAll(/\.(riko-[a-z0-9_-]+)/g), m => m[1]));
const docsFiles = readdirSync(join(ROOT, 'docs')).filter(f => f.endsWith('.html') && !f.startsWith('_') && !f.startsWith('.'));
const docsHtml = Object.fromEntries(docsFiles.map(f => [f, readFileSync(join(ROOT, 'docs', f), 'utf8')]));

// 1) 清单字段
section('组件清单字段');
const files = readdirSync(join(CORE, 'ai/components')).filter(f => f.endsWith('.json') && !f.startsWith('_'));
for (const f of files) {
  const c = JSON.parse(readFileSync(join(CORE, 'ai/components', f), 'utf8'));
  if (c.name + '.json' !== f) fail('清单', `${f}：name "${c.name}" 与文件名不一致`);
  for (const k of schema.required) if (c[k] === undefined || c[k] === '') fail('清单', `${f}：缺少 ${k}`);
  if (!schema.properties.category.enum.includes(c.category)) fail('清单', `${f}：category "${c.category}" 无效`);
  if (!/^[a-z][a-z0-9-]*$/.test(c.name)) fail('清单', `${f}：name 不是 kebab-case`);
  for (const m of c.modifiers || []) if (m.group && !schema.properties.modifiers.items.properties.group.enum.includes(m.group)) fail('清单', `${f}：修饰 ${m.class} 的 group "${m.group}" 无效`);
}
console.log(`${files.length} 个清单`);

// 2) 清单中的类名都存在（CSS 或 JS 注入）
section('清单类名存在于 CSS');
const documented = new Set();
for (const c of manifest) {
  for (const cls of [c.root, ...(c.parts || []).map(p => p.class), ...(c.modifiers || []).map(m => m.class)].filter(Boolean)) {
    documented.add(cls);
    if (!cssClasses.has(cls) && !js.includes(cls)) fail('类名', `${c.name}：清单中的 "${cls}" 在 CSS/JS 中都不存在`);
  }
}

// 3) CSS 类名都有文档（覆盖率）
section('CSS 类名文档覆盖');
const undocumented = [...cssClasses].filter(c => !documented.has(c)).sort();
for (const c of undocumented) fail('覆盖', `CSS 类 "${c}" 没有出现在任何组件清单中`);
console.log(`CSS 类 ${cssClasses.size} 个，已文档化 ${cssClasses.size - undocumented.length} 个`);

// 4) 每个组件都有文档小节
section('文档小节');
for (const c of manifest) {
  const page = docsFiles.find(f => new RegExp(`<section[^>]*\\sid="${c.name}"`).test(docsHtml[f]));
  if (!page) fail('文档', `组件 "${c.name}" 在 docs/ 中没有 id="${c.name}" 的 section`);
}

// 5) data-riko 都有 JS 模块
section('data-riko 与 JS 模块');
const jsNames = new Set(readdirSync(join(CORE, 'src/js/components')).filter(f => f.endsWith('.js') && !f.startsWith('_'))
  .flatMap(f => Array.from(readFileSync(join(CORE, 'src/js/components', f), 'utf8').matchAll(/name:\s*['"]([a-z0-9-]+)['"]/g), m => m[1])));
for (const c of manifest) {
  const m = (c.js?.attr || '').match(/data-riko="([^"]+)"/);
  if (m) for (const n of m[1].split(/\s+/)) if (!jsNames.has(n)) fail('JS', `${c.name}：${c.js.attr} 没有对应的 JS 组件模块`);
}
console.log(`JS 组件：${[...jsNames].sort().join(', ')}`);

// 6) 清单示例与文档页通过 riko-ui check
section('riko-ui check（示例 + 文档）');
const tmp = mkdtempSync(join(tmpdir(), 'riko-verify-'));
for (const c of manifest) (c.examples || []).forEach((e, i) => {
  if (/^\s*<script/.test(e.html) || /^\s*<style/.test(e.html)) return;
  writeFileSync(join(tmp, `${c.name}-${i}.html`), e.html);
});
const runCheck = target => {
  try { return JSON.parse(execFileSync(process.execPath, [join(CORE, 'bin/riko-ui.mjs'), 'check', target, '--json'], { encoding: 'utf8', cwd: ROOT })); }
  catch (e) { return JSON.parse(e.stdout); }
};
for (const [label, target] of [['示例', tmp], ['文档', join(ROOT, 'docs')]]) {
  const r = runCheck(target);
  for (const i of r.issues) {
    const msg = `${i.file}:${i.line} ${i.message}`;
    if (i.level === 'error') fail(label, msg); else warn.push(`[${label}] ${msg}`);
  }
  console.log(`${label}：${r.files} 个文件，${r.errors} 错误，${r.warnings} 警告`);
}
rmSync(tmp, { recursive: true, force: true });

// 7) 对比度
section('对比度');
try { execFileSync(process.execPath, [join(ROOT, 'tools/contrast.mjs')], { stdio: 'pipe' }); console.log('全部达标'); }
catch (e) { fail('对比度', e.stdout.toString().split('\n').filter(l => l.startsWith('✗')).join('; ')); }

console.log('');
if (warn.length) console.log(`⚠ ${warn.length} 个警告：\n  ` + warn.slice(0, 30).join('\n  ') + (warn.length > 30 ? '\n  …' : ''));
if (failures.length) {
  console.log(`\n✗ ${failures.length} 项未通过：\n  ` + failures.join('\n  '));
  process.exit(1);
}
console.log('✓ 全部通过');
