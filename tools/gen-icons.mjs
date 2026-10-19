// 从 lucide 包生成框架内置图标（CSS mask 变量），输出到 packages/core/src/css/icons.css
import { writeFileSync } from 'node:fs';
import { icons } from 'lucide';

// 框架内部用到的图标：变量名 → Lucide 图标名
const USED = {
  check: 'Check', x: 'X', minus: 'Minus', plus: 'Plus',
  'chevron-down': 'ChevronDown', 'chevron-up': 'ChevronUp', 'chevron-left': 'ChevronLeft', 'chevron-right': 'ChevronRight',
  'chevrons-up-down': 'ChevronsUpDown', 'arrow-up': 'ArrowUp', 'arrow-right': 'ArrowRight', 'arrow-left': 'ArrowLeft',
  search: 'Search', info: 'Info', success: 'CircleCheck', warning: 'TriangleAlert', danger: 'CircleX', help: 'CircleQuestionMark',
  loader: 'LoaderCircle', upload: 'Upload', file: 'File', calendar: 'Calendar', clock: 'Clock',
  eye: 'Eye', 'eye-off': 'EyeOff', copy: 'Copy', menu: 'Menu', 'more-horizontal': 'Ellipsis', 'external-link': 'ExternalLink',
  sun: 'Sun', moon: 'Moon', monitor: 'Monitor', settings: 'Settings', inbox: 'Inbox', image: 'Image', user: 'User', bell: 'Bell',
  'grip-vertical': 'GripVertical', pencil: 'Pencil', feather: 'Feather', lock: 'Lock', send: 'Send', 'folder': 'Folder', 'folder-open': 'FolderOpen', 'circle': 'Circle', 'dot': 'Dot',
};
const attr = o => Object.entries(o).map(([k, v]) => `${k}='${v}'`).join(' ');
const svg = nodes =>
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>` +
  nodes.map(([tag, a]) => `<${tag} ${attr(a)}/>`).join('') + `</svg>`;
const uri = s => `url("data:image/svg+xml,${s.replace(/</g, '%3C').replace(/>/g, '%3E').replace(/#/g, '%23').replace(/"/g, "'")}")`;

// 品牌星星（实心圆润五角星，与 Lucide 无关）
const STAR = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2.8l2.75 5.6 6.15.9-4.45 4.35 1.05 6.12L12 16.9l-5.5 2.87 1.05-6.12L3.1 9.3l6.15-.9z' fill='black' stroke='black' stroke-width='1.6' stroke-linejoin='round'/></svg>`;

let vars = '';
for (const [name, key] of Object.entries(USED)) {
  if (!icons[key]) throw new Error('lucide 中没有图标 ' + key);
  vars += `    --riko-icon-${name}: ${uri(svg(icons[key]))};\n`;
}
vars += `    --riko-icon-star: ${uri(STAR)};\n`;

const css = `/* ==========================================================================
   Riko UI · 图标
   本文件由 tools/gen-icons.mjs 生成，请勿手改。内置图标取自 Lucide（ISC License）。
   - 组件内部图标：mask-image: var(--riko-icon-<名>)，颜色取 currentColor
   - 页面图标：推荐 Lucide —— <i data-lucide="star"></i>（Riko.init() 会自动渲染）
   - 品牌星星：<span class="riko-star"></span>
   ========================================================================== */
@layer riko.tokens {
  :root {
${vars}  }
}

@layer riko.base {
  /* 通用图标尺寸：Lucide 生成的 svg 与任意 .riko-icon */
  .riko-icon,
  svg.lucide {
    display: inline-block;
    flex: none;
    width: var(--riko-icon-size, 1.15em);
    height: var(--riko-icon-size, 1.15em);
    vertical-align: -.2em;
    stroke-width: var(--riko-icon-stroke, 2);
  }
  /* 以 mask 方式渲染内置图标：<span class="riko-icon riko-icon--check"></span> */
  .riko-icon[class*="riko-icon--"] {
    background: currentColor;
    -webkit-mask: var(--riko-icon) center / contain no-repeat;
    mask: var(--riko-icon) center / contain no-repeat;
  }
${Object.keys(USED).map(n => `  .riko-icon--${n} { --riko-icon: var(--riko-icon-${n}); }`).join('\n')}
  .riko-icon--spin { animation: riko-spin 1s linear infinite; }
  .riko-icon--sm { --riko-icon-size: .9em; }
  .riko-icon--lg { --riko-icon-size: 1.5em; }
  .riko-icon--xl { --riko-icon-size: 2em; }

  /* 品牌星星 */
  .riko-star {
    display: inline-block; flex: none;
    width: var(--riko-star-size, 1em); height: var(--riko-star-size, 1em);
    vertical-align: -.12em;
    background: var(--riko-star-color, var(--riko-color-accent));
    -webkit-mask: var(--riko-icon-star) center / contain no-repeat;
    mask: var(--riko-icon-star) center / contain no-repeat;
  }
  .riko-star--xs { --riko-star-size: .6em; }
  .riko-star--sm { --riko-star-size: .8em; }
  .riko-star--lg { --riko-star-size: 1.5em; }
  .riko-star--xl { --riko-star-size: 2.4em; }
  .riko-star--ice { --riko-star-color: var(--riko-color-ice-strong); }
  .riko-star--muted { --riko-star-color: var(--riko-color-tan); }
  .riko-star--twinkle { animation: riko-twinkle 4s ease-in-out infinite; }
  .riko-star--bob { animation: riko-bob 5s ease-in-out infinite; }

  @keyframes riko-spin { to { transform: rotate(360deg); } }
  @keyframes riko-twinkle {
    0%, 100% { transform: scale(1) rotate(0); opacity: 1; }
    50% { transform: scale(.72) rotate(18deg); opacity: .45; }
  }
  @keyframes riko-bob {
    0%, 100% { transform: translateY(0) rotate(0); }
    50% { transform: translateY(-8px) rotate(12deg); }
  }
}
`;
writeFileSync(new URL('../packages/core/src/css/icons.css', import.meta.url), css);
console.log('icons.css: ' + (Object.keys(USED).length + 1) + ' 个内置图标');
