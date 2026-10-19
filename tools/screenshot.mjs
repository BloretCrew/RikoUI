// 截图：node tools/screenshot.mjs <页面.html> [--dark] [--width 1280] [--height 4000] [--hash id] [--out 文件.png]
// 使用系统 Chrome 无头模式；每次使用独立的临时配置目录，可并行运行。
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync, mkdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, basename, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i < 0 ? d : args[i + 1]; };
const page = args.find(a => !a.startsWith('--') && /\.html?$/.test(a));
if (!page) { console.error('用法：node tools/screenshot.mjs <页面.html> [--dark] [--width 1280] [--height 4000] [--hash id] [--out 文件.png]'); process.exit(1); }
const dark = args.includes('--dark');
const width = +flag('width', 1280), height = +flag('height', 4000);
const hash = flag('hash', '');
const outDir = join(ROOT, '.shots'); mkdirSync(outDir, { recursive: true });
const out = resolve(flag('out', join(outDir, `${basename(page, '.html')}${hash ? '-' + hash : ''}-${dark ? 'dark' : 'light'}-${width}.png`)));
const CHROME = process.env.CHROME || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
if (!CHROME) { console.error('找不到 Chrome，可用环境变量 CHROME 指定'); process.exit(1); }

const profile = mkdtempSync(join(tmpdir(), 'riko-shot-'));
// 指定 --hash 时：生成只含该小节的临时页面（与原页同目录，保证相对路径可用），避免无头模式滚动到锚点后截到空白
let target = resolve(page), tempPage = null;
if (hash) {
  const html = readFileSync(target, 'utf8');
  const start = html.search(new RegExp(`<section[^>]*\\sid="${hash}"`));
  if (start < 0) { console.error(`✗ 页面中找不到 id="${hash}" 的 section`); process.exit(1); }
  const end = html.indexOf('</section>', start) + '</section>'.length;
  const mainStart = html.indexOf('>', html.indexOf('<main')) + 1, mainEnd = html.indexOf('</main>');
  tempPage = join(dirname(target), `._shot-${hash}-${process.pid}.html`);
  writeFileSync(tempPage, html.slice(0, mainStart) + '\n' + html.slice(start, end) + '\n' + html.slice(mainEnd));
  target = tempPage;
}
const url = pathToFileURL(target).href;
const t0 = Date.now();
if (existsSync(out)) rmSync(out);
const child = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  `--user-data-dir=${profile}`, `--blink-settings=preferredColorScheme=${dark ? 0 : 1}`, `--window-size=${width},${height}`,
  '--virtual-time-budget=6000', `--screenshot=${out}`, url], { stdio: 'ignore' });

const finish = code => { try { rmSync(profile, { recursive: true, force: true }); if (tempPage) rmSync(tempPage, { force: true }); } catch {} process.exit(code); };
const poll = setInterval(() => {
  if (existsSync(out) && statSync(out).size > 0) {
    clearInterval(poll);
    setTimeout(() => { child.kill('SIGKILL'); console.log(`✓ ${out}（${((Date.now() - t0) / 1000).toFixed(1)}s）`); finish(0); }, 500);
  } else if (Date.now() - t0 > 90_000) { clearInterval(poll); child.kill('SIGKILL'); console.error('✗ 截图超时'); finish(1); }
}, 300);
child.on('exit', () => { if (!existsSync(out)) { clearInterval(poll); console.error('✗ Chrome 退出但没有生成截图'); finish(1); } });
