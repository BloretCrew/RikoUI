// 生成 @bloret-crew/riko-ui-fonts：从 @fontsource 复制所需字重的 woff2 分片，输出相对路径的 riko-fonts.css
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'packages/fonts');
const FONTS = [
  // [fontsource 包名, 字重, 用途]
  ['zcool-xiaowei', [400], '标题 --riko-font-title'],
  ['noto-sans-sc', [400, 500, 700], '正文 --riko-font-body'],
  ['noto-serif-sc', [400, 600], '长文阅读 --riko-font-read'],
  ['caveat', [500, 600, 700], '手写点缀 --riko-font-hand'],
];

rmSync(join(OUT, 'files'), { recursive: true, force: true });
mkdirSync(join(OUT, 'files'), { recursive: true });
mkdirSync(join(OUT, 'LICENSES'), { recursive: true });

let css = `/*! Riko UI Fonts | 字体均为 SIL Open Font License 1.1，见 LICENSES/ | 由 tools/build-fonts.mjs 生成 */\n`;
let files = 0, bytes = 0;
for (const [name, weights, use] of FONTS) {
  const dir = join(ROOT, 'node_modules/@fontsource', name);
  if (!existsSync(dir)) throw new Error(`缺少 @fontsource/${name}，请先 npm install`);
  css += `\n/* ===== ${name} · ${use} ===== */\n`;
  for (const w of weights) {
    const src = readFileSync(join(dir, `${w}.css`), 'utf8');
    for (const block of src.match(/@font-face\s*{[^}]*}/g) || []) {
      const woff2 = block.match(/url\(\.\/files\/([^)]+\.woff2)\)/)?.[1];
      if (!woff2) continue;
      const from = join(dir, 'files', woff2);
      if (!existsSync(from)) throw new Error(`缺少字体文件 ${from}（npm install 是否完成？）`);
      copyFileSync(from, join(OUT, 'files', woff2));
      files++; bytes += statSync(from).size;
      css += block.replace(/src:[^;]+;/, `src: url(./files/${woff2}) format('woff2');`) + '\n';
    }
  }
  const lic = join(dir, 'LICENSE');
  if (existsSync(lic)) copyFileSync(lic, join(OUT, 'LICENSES', `${name}.txt`));
}
writeFileSync(join(OUT, 'riko-fonts.css'), css);

// 修复 ZCOOL XiaoWei 的轮廓方向缺陷（"回""圄"等字被填成实心块），需要 Python + fonttools + brotli
const PY = process.env.RIKO_PYTHON || 'python3';
const zcool = readdirSync(join(OUT, 'files')).filter(f => f.startsWith('zcool-xiaowei-')).map(f => join(OUT, 'files', f));
try {
  execFileSync(PY, [join(ROOT, 'tools/fonts/fix_contours.py'), ...zcool], { stdio: 'inherit' });
} catch {
  console.error('✗ 无法修复 ZCOOL XiaoWei 轮廓：请安装 `pip install fonttools brotli`，或用 RIKO_PYTHON 指定已安装的 Python。未修复的字体会把"回""圄"等字显示为实心块，不要发布。');
  process.exit(1);
}
writeFileSync(join(OUT, 'LICENSES', 'MODIFICATIONS.txt'),
  'ZCOOL XiaoWei：由 Riko UI 修正了部分字形的轮廓方向（嵌套轮廓按奇偶层交替方向），使"回""圄""圃"等字在浏览器中正确显示空洞。\n' +
  '未改动字形设计与字体名称。原字体版权与许可见 zcool-xiaowei.txt（SIL Open Font License 1.1）。修复脚本：tools/fonts/fix_contours.py\n');
console.log(`✓ riko-ui-fonts：${files} 个 woff2 分片，共 ${(bytes / 1048576).toFixed(1)}MB（浏览器只按需下载页面用到的分片）`);
