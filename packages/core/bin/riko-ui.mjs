#!/usr/bin/env node
// Riko UI 命令行
//   riko-ui check [路径…] [--json] [--quiet]   检查 HTML/Vue/JSX 等文件中的 Riko UI 用法
//   riko-ui guide                              打印 AI 使用指南路径
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXTS = new Set(['.html', '.htm', '.vue', '.jsx', '.tsx', '.svelte', '.astro', '.php', '.njk', '.hbs', '.ejs', '.liquid', '.md', '.mdx']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW = new Set(['script', 'style', 'textarea', 'pre', 'code']);

// ---------- 知识：类名来自 CSS 产物，结构规则来自组件清单 ----------
function loadKnowledge() {
  const cssFile = join(PKG, 'dist/riko-ui.css');
  if (!existsSync(cssFile)) throw new Error('找不到 dist/riko-ui.css，请先构建（npm run build）');
  const css = readFileSync(cssFile, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/url\([^)]*\)/g, '');
  const classes = new Set(Array.from(css.matchAll(/\.(riko-[a-z0-9_-]+)/g), m => m[1]));
  const manifest = existsSync(join(PKG, 'ai/components.json'))
    ? JSON.parse(readFileSync(join(PKG, 'ai/components.json'), 'utf8')).components : [];
  const dataRiko = new Set();
  const groups = new Map(); // 修饰类 → `${root}:${group}`
  for (const c of manifest) {
    for (const m of [c.js?.attr || '', ...(c.examples || []).map(e => e.html)].join(' ').matchAll(/data-riko="([^"]+)"/g))
      m[1].split(/\s+/).forEach(n => dataRiko.add(n));
    for (const m of c.modifiers || []) if (m.group) groups.set(m.class, `${c.root}:${m.group}`);
    for (const p of c.parts || []) classes.add(p.class);
    if (c.root) classes.add(c.root);
  }
  // 由 JS 注入、CSS 中未直接出现的类也允许
  return { classes, manifest, dataRiko, groups };
}

// ---------- 极简 HTML 解析：得到元素树（含行列号） ----------
function parse(src) {
  const root = { tag: '#root', attrs: {}, children: [], parent: null, text: '' };
  let cur = root;
  const re = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<!DOCTYPE[^>]*>|<\/([a-zA-Z][\w:.-]*)\s*>|<([a-zA-Z][\w:.-]*)((?:\s+(?:[^\s"'>\/=]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|\{(?:[^{}]|\{[^{}]*\})*\}|[^\s"'=<>`]+))?)*)\s*(\/?)>/g;
  let m, last = 0;
  const addText = (t) => { if (t.trim()) { for (let n = cur; n; n = n.parent) n.text += t; } };
  while ((m = re.exec(src))) {
    addText(src.slice(last, m.index).replace(/\{[^}]*\}/g, 'x'));
    last = re.lastIndex;
    if (m[0].startsWith('<!')) continue;
    if (m[1]) { // 闭合标签
      const tag = m[1].toLowerCase();
      for (let n = cur; n && n !== root; n = n.parent) if (n.tag === tag) { cur = n.parent; break; }
      continue;
    }
    const tag = m[2].toLowerCase();
    const attrs = {};
    for (const a of m[3].matchAll(/([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\{(?:[^{}]|\{[^{}]*\})*\})|([^\s"'=<>`]+)))?/g)) {
      const v = a[2] ?? a[3] ?? a[5] ?? (a[4] ? (a[4].match(/^\{\s*["'`]([^"'`]*)["'`]\s*\}$/)?.[1] ?? null) : '');
      attrs[a[1]] = v;
    }
    const el = { tag, attrs, children: [], parent: cur, index: m.index, text: '' };
    cur.children.push(el);
    if (RAW.has(tag) && !m[4] && tag !== 'code' && tag !== 'pre') {
      const end = src.toLowerCase().indexOf(`</${tag}`, re.lastIndex);
      if (tag === 'textarea') addText('x');
      re.lastIndex = last = end < 0 ? src.length : end;
      continue;
    }
    if (!m[4] && !VOID.has(tag)) cur = el;
  }
  return root;
}

const classOf = el => {
  const v = el.attrs.class ?? el.attrs.className ?? el.attrs[':class'] ?? '';
  return typeof v === 'string' ? v.split(/\s+/).filter(Boolean) : [];
};
function* walk(el) { for (const c of el.children) { yield c; yield* walk(c); } }

// ---------- 简单选择器匹配（复合选择器：标签、.类、[属性]、[属性="值"]、:not(...)） ----------
function matches(el, sel) {
  return sel.split(',').some(part => matchCompound(el, part.trim()));
}
function matchCompound(el, sel) {
  let rest = sel;
  const nots = [];
  rest = rest.replace(/:not\(([^)]*)\)/g, (_, s) => { nots.push(s); return ''; });
  const tag = rest.match(/^[a-zA-Z][\w-]*/)?.[0];
  if (tag && el.tag !== tag.toLowerCase()) return false;
  const cls = classOf(el);
  for (const c of rest.matchAll(/\.([\w-]+)/g)) if (!cls.includes(c[1])) return false;
  for (const a of rest.matchAll(/\[([\w:-]+)(?:([~|^$*]?=)"?([^"\]]*)"?)?\]/g)) {
    const v = el.attrs[a[1]];
    if (v === undefined) return false;
    if (a[2] === '=' && v !== a[3]) return false;
    if (a[2] === '~=' && !String(v).split(/\s+/).includes(a[3])) return false;
    if (a[2] === '*=' && !String(v).includes(a[3])) return false;
  }
  return nots.every(n => !matchCompound(el, n));
}

// ---------- 规则 ----------
function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
function suggest(name, known) {
  let best = null, score = Infinity;
  for (const k of known) { const s = lev(name, k); if (s < score) { score = s; best = k; } }
  return score <= Math.max(3, name.length / 3) ? best : null;
}

function checkFile(file, src, K) {
  const issues = [];
  const pos = idx => { const before = src.slice(0, idx); const line = before.split('\n').length; return { line, col: idx - before.lastIndexOf('\n') }; };
  // data-riko-ignore="规则名 …"（空值 = 全部规则）可在该元素及其子树内跳过检查
  const ignored = (el, rule) => {
    for (let n = el; n; n = n.parent) {
      const v = n.attrs?.['data-riko-ignore'];
      if (v === undefined) continue;
      if (!v.trim() || v.split(/\s+/).some(r => rule === r || rule.startsWith(r + ':'))) return true;
    }
    return false;
  };
  const report = (el, level, rule, message) => { if (!ignored(el, rule)) issues.push({ file, ...pos(el.index ?? 0), level, rule, message }); };
  const tree = parse(src);
  const STATE_CLASSES = new Set(['active', 'is-active', 'open', 'is-open', 'selected', 'is-selected', 'disabled', 'is-disabled', 'show', 'dark', 'is-dark']);

  for (const el of walk(tree)) {
    const cls = classOf(el);
    const rikoCls = cls.filter(c => c.startsWith('riko-'));
    for (const c of rikoCls) {
      if (/__[a-z0-9-]+--/.test(c)) { report(el, 'error', 'part-modifier', `不允许在部件上加修饰（"${c}"），请把修饰放在组件根上或改用属性`); continue; }
      if (!K.classes.has(c)) {
        const s = suggest(c, K.classes);
        report(el, 'error', 'unknown-class', `未知类名 "${c}"${s ? `，是不是 "${s}"？` : ''}`);
        continue;
      }
      const mod = c.match(/^(riko-[a-z0-9-]+?)--[a-z0-9-]+$/);
      if (mod && !cls.includes(mod[1]) && K.classes.has(mod[1]))
        report(el, 'error', 'modifier-without-root', `修饰类 "${c}" 必须与根类 "${mod[1]}" 写在同一元素上`);
      const part = c.match(/^(riko-[a-z0-9-]+?)__[a-z0-9-]+$/);
      if (part && K.classes.has(part[1])) {
        let ok = false;
        for (let p = el.parent; p; p = p.parent) if (classOf(p).some(x => x === part[1] || x.startsWith(part[1] + '--'))) { ok = true; break; }
        if (!ok) report(el, 'warning', 'part-outside-root', `部件 "${c}" 应位于 "${part[1]}" 之内`);
      }
    }
    // 同组互斥修饰
    const seen = new Map();
    for (const c of rikoCls) {
      const g = K.groups.get(c);
      if (!g) continue;
      if (seen.has(g)) report(el, 'warning', 'conflicting-modifiers', `"${seen.get(g)}" 与 "${c}" 属于同一组（${g.split(':')[1]}），只能选一个`);
      else seen.set(g, c);
    }
    if (rikoCls.length) {
      for (const c of cls) if (STATE_CLASSES.has(c))
        report(el, 'warning', 'state-class', `不要用状态类 "${c}"，请改用 aria-* / disabled / hidden 等属性（见 SPEC 第 3 节）`);
    }
    // data-riko
    if (el.attrs['data-riko'] && K.dataRiko.size) {
      for (const n of el.attrs['data-riko'].split(/\s+/).filter(Boolean))
        if (!K.dataRiko.has(n)) {
          const s = suggest(n, K.dataRiko);
          report(el, 'error', 'unknown-data-riko', `未知组件 data-riko="${n}"${s ? `，是不是 "${s}"？` : ''}`);
        }
    }
    // 仅图标的按钮/链接需要可访问名称
    const interactive = el.tag === 'button' || (el.tag === 'a' && 'href' in el.attrs) || el.attrs.role === 'button';
    if (interactive && rikoCls.length && !el.text.trim() && !['aria-label', 'aria-labelledby', 'title'].some(a => a in el.attrs)
      && !(el.attrs['data-riko'] || '').match(/theme-toggle/)) {
      report(el, 'error', 'icon-button-label', `仅含图标的 <${el.tag}> 需要 aria-label`);
    }
    if (el.tag === 'img' && !('alt' in el.attrs)) report(el, 'error', 'img-alt', '<img> 需要 alt（装饰图用 alt=""）');
    // 写死颜色
    // 覆盖设计变量（--riko-*: #xxx）是推荐的定制方式，不算写死颜色
    const style = typeof el.attrs.style === 'string' ? el.attrs.style.replace(/--[\w-]+\s*:[^;]*;?/g, '') : null;
    if (style && /(^|[\s:;,(])(#[0-9a-f]{3,8}\b|rgba?\(|hsla?\()/i.test(style))
      report(el, 'warning', 'hardcoded-color', `内联样式中写死了颜色，请改用设计变量（如 var(--riko-color-accent)）`);
  }

  // 语义：整页只应有一个 h1（仅检查完整页面）
  const all = Array.from(walk(tree));
  if (all.some(e => e.tag === 'body')) {
    const h1s = all.filter(e => e.tag === 'h1');
    h1s.slice(1).forEach(e => report(e, 'warning', 'multiple-h1', `页面中有 ${h1s.length} 个 <h1>，一个页面只应有一个（页面标题用 riko-hero__title，版块标题用 h2）`));
  }
  // 语义：同一组里最多一个主按钮
  for (const el of all) {
    const prim = el.children.filter(c => classOf(c).includes('riko-btn--primary'));
    prim.slice(1).forEach(c => report(c, 'warning', 'multiple-primary', `同一组中有 ${prim.length} 个 riko-btn--primary，主要操作每组只保留一个，其余用默认/soft/ghost`));
  }

  // 清单中的结构规则
  for (const c of K.manifest) for (const r of c.requires || []) {
    for (const el of walk(tree)) {
      if (!matches(el, r.selector)) continue;
      if (r.has && !Array.from(walk(el)).some(d => matches(d, r.has))) report(el, 'error', 'structure:' + c.name, r.message);
      // aria-hidden 要求：祖先已 aria-hidden="true" 时视为满足
      const hiddenByAncestor = () => { for (let p = el.parent; p; p = p.parent) if (p.attrs?.['aria-hidden'] === 'true') return true; return false; };
      if (r.attr && !r.attr.split('|').some(a => a in el.attrs) && !(r.attr.includes('aria-hidden') && hiddenByAncestor()))
        report(el, 'error', 'attribute:' + c.name, r.message);
      if (r.tag && !r.tag.split('|').includes(el.tag)) report(el, 'error', 'element:' + c.name, r.message);
      if (r.parent) { let ok = false; for (let p = el.parent; p; p = p.parent) if (p.tag !== '#root' && matches(p, r.parent)) { ok = true; break; } if (!ok) report(el, 'error', 'placement:' + c.name, r.message); }
    }
  }
  return issues;
}

function collect(paths) {
  const files = [];
  const visit = p => {
    const st = statSync(p);
    if (st.isDirectory()) {
      if (/(^|\/)(node_modules|\.git|dist|vendor)$/.test(p)) return;
      readdirSync(p).forEach(f => visit(join(p, f)));
    } else if (EXTS.has(extname(p)) && !/(^|\/)\._shot-/.test(p)) files.push(p);
  };
  paths.forEach(p => visit(resolve(p)));
  return files;
}

function main(argv) {
  const [cmd, ...rest] = argv;
  if (cmd === 'guide') { console.log(join(PKG, 'ai/AI_GUIDE.md')); return 0; }
  if (cmd !== 'check') {
    console.log('用法：\n  riko-ui check [路径…] [--json] [--quiet]   检查 Riko UI 用法\n  riko-ui guide                              打印 AI 使用指南的路径');
    return cmd ? 1 : 0;
  }
  const json = rest.includes('--json');
  const quiet = rest.includes('--quiet');
  const paths = rest.filter(a => !a.startsWith('--'));
  const K = loadKnowledge();
  const files = collect(paths.length ? paths : ['.']);
  const issues = files.flatMap(f => checkFile(relative(process.cwd(), f), readFileSync(f, 'utf8'), K));
  const errors = issues.filter(i => i.level === 'error').length;
  const warnings = issues.length - errors;
  if (json) console.log(JSON.stringify({ files: files.length, errors, warnings, issues }, null, 2));
  else {
    for (const i of issues) if (!(quiet && i.level === 'warning'))
      console.log(`${i.file}:${i.line}:${i.col}  ${i.level === 'error' ? '✗ 错误' : '⚠ 警告'}  ${i.message}  [${i.rule}]`);
    console.log(`\n检查了 ${files.length} 个文件：${errors} 个错误，${warnings} 个警告`);
  }
  return errors ? 1 : 0;
}

process.exitCode = main(process.argv.slice(2));
