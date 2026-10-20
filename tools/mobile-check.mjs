// 手机端排查：node tools/mobile-check.mjs [页面…] [--width 375] [--shots]
// 以手机视口（默认 375×812，触屏）打开页面，报告：页面横向溢出、超出屏幕右边缘的元素、文字被截断的元素。
// --shots 时把每页首屏截图保存到 .shots/mobile-<页面>.png
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i < 0 ? d : args[i + 1]; };
const width = +flag('width', 375), height = 812;
const shots = args.includes('--shots');
const files = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--width');
const pages = files.length ? files : ['docs', 'templates'].flatMap(d => readdirSync(join(ROOT, d)).filter(f => f.endsWith('.html') && !/^[._]/.test(f)).map(f => join(ROOT, d, f)));
const CHROME = process.env.CHROME || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);

const port = 9300 + Math.floor(Math.random() * 400);
const prof = mkdtempSync(join(tmpdir(), 'riko-mobile-'));
const ch = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, 'about:blank'], { stdio: 'ignore' });
const sleep = t => new Promise(r => setTimeout(r, t));
let targets;
for (let i = 0; i < 60; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (targets.length) break; } catch {} await sleep(200); }
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => (ws.onopen = r));
let id = 0; const pending = new Map();
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } };
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true });

const probe = `(() => {
  const vw = document.documentElement.clientWidth, out = [];
  const name = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.classList.length ? '.' + [...el.classList].slice(0, 3).join('.') : '');
  const hiddenScroller = el => { for (let p = el.parentElement; p; p = p.parentElement) { const s = getComputedStyle(p); if (/(auto|scroll|hidden|clip)/.test(s.overflowX)) return p; } return null; };
  const doc = document.documentElement.scrollWidth;
  if (doc > vw + 1) out.push('页面横向溢出：内容宽 ' + doc + 'px > 视口 ' + vw + 'px');
  const seen = new Set();
  for (const el of document.querySelectorAll('body *')) {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || s.position === 'fixed' && s.pointerEvents === 'none') continue;
    if (el.closest('[hidden],dialog:not([open]),[popover]:not(:popover-open),template,.riko-sky,.riko-glow,.docs-sidebar,[aria-hidden="true"]')) continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 2 || r.height <= 2) continue; // 读屏专用（sr-only）等不可见元素
    // 3) 圆形元素被挤变形（logo、头像、图标圆圈被 flex 压扁）
    const rad = parseFloat(s.borderTopLeftRadius);
    if (rad > 0 && s.borderTopLeftRadius.endsWith('%') && rad >= 50 && r.width > 16 && Math.abs(r.width - r.height) / Math.max(r.width, r.height) > .1 && Math.min(r.width, r.height) / Math.max(r.width, r.height) > .5)
      out.push('圆形元素被挤变形 ' + Math.round(r.width) + '×' + Math.round(r.height) + '：' + name(el));
    // 1) 超出屏幕右边缘（且不在横向滚动容器内）
    if (r.right > vw + 2 && r.left < vw) {
      const sc = hiddenScroller(el);
      if (!sc || sc === document.body || sc === document.documentElement) {
        const parentOver = el.parentElement && el.parentElement.getBoundingClientRect().right > vw + 2;
        if (!parentOver && !seen.has(el)) { seen.add(el); out.push('超出右边缘 ' + Math.round(r.right - vw) + 'px：' + name(el)); }
      }
    }
    // 2) 单行文字被截断/裁切（nowrap 且内容比盒子宽，且没有省略号设计）
    if (el.children.length === 0 && el.textContent.trim() && s.whiteSpace === 'nowrap' && s.textOverflow !== 'ellipsis' && el.scrollWidth > el.clientWidth + 2 && /(hidden|clip)/.test(s.overflow))
      out.push('文字被裁切：' + name(el) + '「' + el.textContent.trim().slice(0, 16) + '」');
  }
  return out.slice(0, 25);
})()`;

const outDir = join(ROOT, '.shots'); mkdirSync(outDir, { recursive: true });
let bad = 0;
for (const f of pages) {
  await send('Page.navigate', { url: pathToFileURL(f).href });
  await sleep(1500);
  const r = await send('Runtime.evaluate', { expression: probe, returnByValue: true });
  const issues = r?.result?.value || ['无法执行检查'];
  const label = relative(ROOT, f);
  if (issues.length) { bad++; console.log(`✗ ${label}`); issues.forEach(i => console.log('   ' + i)); }
  else console.log(`✓ ${label}`);
  if (shots) {
    const s = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(outDir, `mobile-${basename(dirname(f))}-${basename(f, '.html')}.png`), Buffer.from(s.data, 'base64'));
  }
}
ch.kill('SIGKILL'); try { rmSync(prof, { recursive: true, force: true }); } catch {}
console.log(bad ? `\n${bad} 个页面在 ${width}px 下有问题` : `\n✓ 全部页面在 ${width}px 下无溢出`);
process.exit(bad ? 1 : 0);
