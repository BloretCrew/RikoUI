// 校验 tokens.css 中关键颜色组合在浅色/深色下的 WCAG 对比度
import { readFileSync } from 'node:fs';
const css = readFileSync(new URL('../packages/core/src/css/tokens.css', import.meta.url), 'utf8');

function block(sel) {
  const i = css.indexOf(sel + ' {');
  const body = css.slice(i, css.indexOf('\n  }', i));
  const vars = {};
  for (const m of body.matchAll(/(--riko-[\w-]+):\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
  return vars;
}
const light = block('  [data-theme]');
const dark = { ...light, ...block('  [data-theme="dark"]') };

function resolve(vars, v, depth = 0) {
  const m = v.match(/^var\((--[\w-]+)\)$/);
  return m && depth < 10 ? resolve(vars, vars[m[1]], depth + 1) : v;
}
function rgba(s) {
  if (s.startsWith('#')) {
    const h = s.slice(1);
    return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).concat(1);
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  const p = m[1].split(',').map(Number);
  return [p[0], p[1], p[2], p[3] ?? 1];
}
const over = (fg, bg) => fg.slice(0, 3).map((c, i) => c * fg[3] + bg[i] * (1 - fg[3])).concat(1);
const lum = c => c.slice(0, 3).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; })
  .reduce((a, v, i) => a + v * [.2126, .7152, .0722][i], 0);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };

// [前景, 背景, 最低要求, 说明]
const pairs = [
  ['fg', 'bg', 4.5, '正文/页面'], ['fg', 'surface', 4.5, '正文/卡片'], ['fg', 'surface-muted', 4.5, '正文/米色块'],
  ['fg-strong', 'surface', 4.5, '标题/卡片'], ['fg-muted', 'surface', 4.5, '次要文字/卡片'], ['fg-muted', 'bg', 4.5, '次要文字/页面'],
  ['fg-muted', 'surface-muted', 4.5, '次要文字/米色块'], ['fg-subtle', 'surface', 3, '占位/弱化（大字或图形）'],
  ['primary-fg', 'primary', 4.5, '主按钮'], ['accent-fg', 'accent', 4.5, '橙色按钮'],
  ['accent-ink', 'surface', 4.5, '橙色文字/卡片'], ['accent-ink', 'accent-soft', 4.5, '橙色文字/浅橙底'],
  ['fg', 'accent-soft', 4.5, '正文/浅橙底'], ['ice-ink', 'ice-soft', 4.5, '冰蓝文字/冰蓝底'], ['ice-ink', 'surface', 4.5, '冰蓝文字/卡片'],
  ['success-ink', 'success-soft', 4.5, '成功'], ['warning-ink', 'warning-soft', 4.5, '警告'], ['danger-ink', 'danger-soft', 4.5, '危险'],
  ['success-ink', 'surface', 4.5, '成功文字/卡片'], ['danger-ink', 'surface', 4.5, '危险文字/卡片'], ['warning-ink', 'surface', 4.5, '警告文字/卡片'],
  ['border-strong', 'surface', 1.4, '强边框（装饰）'], ['accent', 'surface', 2, '星星（纯装饰）'], ['focus', 'bg', 3, '焦点环/页面'], ['focus', 'surface', 3, '焦点环/卡片'], ['focus', 'surface-muted', 3, '焦点环/米色块'],
];
let fail = 0;
for (const [name, vars] of [['浅色', light], ['深色', dark]]) {
  console.log(`\n== ${name}`);
  for (const [f, b, min, label] of pairs) {
    const bg = rgba(resolve(vars, vars['--riko-color-' + b]));
    const fg = over(rgba(resolve(vars, vars['--riko-color-' + f])), bg);
    const r = ratio(fg, bg);
    const ok = r >= min;
    if (!ok) fail++;
    console.log(`${ok ? '✓' : '✗'} ${r.toFixed(2).padStart(5)}  (≥${min})  ${f} / ${b}  ${label}`);
  }
}
console.log(fail ? `\n${fail} 项未达标` : '\n全部达标');
process.exit(fail ? 1 : 0);
