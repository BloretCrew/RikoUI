// 交互测试（实时运行，不用虚拟时间）：node tools/interact.mjs <页面.html> [等待毫秒=8000] [--dark] [--shot out.png --w 1280 --h 900]
// 通过 Chrome DevTools 协议加载页面，实时打印页面 console 输出与未捕获异常，可选截图。
// 适合测试弹层、键盘、焦点等行为：在测试页里用 console.log 输出断言结果。
// 注：screenshot.mjs 使用 --virtual-time-budget，原生 <dialog> 的 close 事件在该模式下可能不触发，交互测试请用本脚本。
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const args = process.argv.slice(2);
const file = resolve(args[0]); const ms = +(args[1] || 8000);
const val = n => { const i = args.indexOf(n); return i < 0 ? null : args[i + 1]; };
const CHROME = process.env.CHROME || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
if (!CHROME) { console.error('找不到 Chrome，可用环境变量 CHROME 指定'); process.exit(1); }
const port = 9300 + Math.floor(Math.random() * 500);
const prof = mkdtempSync(join(tmpdir(), 'cdp-'));
const w = +(val('--w') || 1280), h = +(val('--h') || 900);
const ch = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, `--window-size=${w},${h}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = t => new Promise(r => setTimeout(r, t));
let targets;
for (let i = 0; i < 50; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (targets.length) break; } catch {} await sleep(200); }
const page = targets.find(t => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map();
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result || m.error); pending.delete(m.id); }
  if (m.method === 'Runtime.consoleAPICalled') console.log(m.params.args.map(a => a.value ?? a.description).join(' '));
  if (m.method === 'Runtime.exceptionThrown') console.log('EXCEPTION', m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
};
await send('Runtime.enable');
await send('Page.enable');
if (args.includes('--dark')) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
else await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'file://' + file });
await sleep(ms);
const out = val('--shot');
if (out) { const r = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(out, Buffer.from(r.data, 'base64')); console.log('shot', out); }
ch.kill('SIGKILL'); try { rmSync(prof, { recursive: true, force: true }); } catch {} process.exit(0);
