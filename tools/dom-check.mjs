// DOM 完整性检查（真实浏览器解析）：node tools/dom-check.mjs [文件…]（默认 docs/*.html 与 templates/*.html）
// 发现「源码里的结构」与「浏览器实际解析出的结构」不一致——例如说明文字里未转义的 <select> 吞掉了后续内容。
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = process.argv.slice(2).length ? process.argv.slice(2) :
  ['docs', 'templates'].flatMap(d => readdirSync(join(ROOT, d)).filter(f => f.endsWith('.html') && !/^[._]/.test(f)).map(f => join(ROOT, d, f)));
const CHROME = process.env.CHROME || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
if (!CHROME) { console.error('找不到 Chrome，可用环境变量 CHROME 指定'); process.exit(1); }

const port = 9500 + Math.floor(Math.random() * 400);
const prof = mkdtempSync(join(tmpdir(), 'riko-dom-'));
const ch = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, 'about:blank'], { stdio: 'ignore' });
const sleep = t => new Promise(r => setTimeout(r, t));
let targets;
for (let i = 0; i < 60; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (targets.length) break; } catch {} await sleep(200); }
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => (ws.onopen = r));
let id = 0; const pending = new Map();
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } };
await send('Page.enable');

// 在页面中执行：返回问题列表（只看解析结果，不依赖 JS 运行）
const probe = expected => `(() => {
  const issues = [];
  const exp = ${JSON.stringify(expected)};
  // 1) 文档小节都应是 .docs-main 的直接子元素
  const secs = [...document.querySelectorAll('.docs-section')];
  if (exp.sections !== null) {
    const direct = document.querySelectorAll('.docs-main > .docs-section').length;
    if (secs.length !== exp.sections) issues.push('源码有 ' + exp.sections + ' 个 docs-section，浏览器解析出 ' + secs.length + ' 个');
    if (direct !== secs.length) issues.push((secs.length - direct) + ' 个 docs-section 跑出了 .docs-main（之前的 HTML 结构被破坏）');
    secs.filter(s => s.parentElement.closest('.docs-section')).forEach(s => issues.push('小节 #' + s.id + ' 被嵌进了另一个小节'));
  }
  // 2) select 里只能有选项
  document.querySelectorAll('select').forEach(sel => {
    const bad = [...sel.children].filter(c => !['OPTION', 'OPTGROUP', 'HR'].includes(c.tagName));
    if (bad.length) issues.push('<select' + (sel.id ? ' id=' + sel.id : '') + '> 里出现了非选项元素：' + bad.map(b => b.tagName.toLowerCase()).join(', '));
    if (!sel.querySelector('option') && !sel.hasAttribute('data-riko-empty')) issues.push('<select' + (sel.id ? ' id=' + sel.id : '') + '> 没有任何 <option>（可能是说明文字里的未转义标签）');
  });
  // 3) 源码中带 id 的元素都应存在
  exp.ids.forEach(i => { if (!document.getElementById(i)) issues.push('源码中的 #' + i + ' 在解析结果中不存在'); });
  return issues;
})()`;

let failed = 0;
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const noScript = src.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<template[\s\S]*?<\/template>/g, '');
  const expected = {
    sections: /class="docs-main"/.test(src) ? (noScript.match(/<section class="docs-section"/g) || []).length : null,
    ids: Array.from(noScript.matchAll(/\sid="([^"]+)"/g), m => m[1]),
  };
  await send('Page.navigate', { url: pathToFileURL(f).href });
  await sleep(700);
  const r = await send('Runtime.evaluate', { expression: probe(expected), returnByValue: true });
  const issues = r?.result?.value || ['无法执行检查'];
  if (issues.length) { failed++; console.log(`✗ ${relative(ROOT, f)}`); issues.forEach(i => console.log('   ' + i)); }
}
ch.kill('SIGKILL'); try { rmSync(prof, { recursive: true, force: true }); } catch {}
console.log(failed ? `\n${failed} 个页面的 DOM 结构有问题` : `✓ ${files.length} 个页面 DOM 结构完整`);
process.exit(failed ? 1 : 0);
