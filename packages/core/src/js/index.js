// Riko UI 入口
import { register, init, destroy, observe, afterInit, registered } from './core/registry.js';
import { theme, themeInitSnippet } from './theme.js';
import { position, autoPosition } from './core/position.js';
import { trapFocus, lockScroll, focusables } from './core/focus.js';
import { uid, on, emit, escapeHtml } from './core/dom.js';
import { store } from './core/store.js';
import { components, api as componentApi } from './components/_registry.js';

export const version = '__RIKO_VERSION__';

components.forEach(register);

// 自动渲染 Lucide 图标（若页面已加载 lucide）
afterInit(scope => {
  const lucide = typeof window !== 'undefined' && window.lucide;
  if (!lucide || typeof lucide.createIcons !== 'function') return;
  if (!scope.querySelector || !scope.querySelector(':not(svg)[data-lucide]')) return;
  lucide.createIcons({ icons: lucide.icons, root: scope.nodeType === 9 ? scope.documentElement : scope });
});

// 日期类输入框默认上限：避免浏览器原生日期框允许输入 5–6 位年份（作者自己写了 max 时不覆盖）
const DATE_MAX = { date: '9999-12-31', 'datetime-local': '9999-12-31T23:59', month: '9999-12', week: '9999-W52' };
afterInit(scope => {
  if (!scope.querySelectorAll) return;
  scope.querySelectorAll('input.riko-input:not([max])').forEach(el => {
    const max = DATE_MAX[el.type];
    if (max) el.max = max;
  });
});

let started = false;
/** 启动：应用主题、初始化页面已有组件、监听之后插入的节点。自动调用，可重复调用。 */
export function start() {
  if (started) return;
  started = true;
  theme.start();
  init(document);
  observe();
}

const Riko = {
  version, start, init, destroy, register, registered, theme, themeInitSnippet,
  position, autoPosition, trapFocus, lockScroll, focusables, uid, on, emit, escapeHtml, store,
  ...componentApi,
};

export { init, destroy, register, theme, themeInitSnippet, position, autoPosition, trapFocus, lockScroll, uid, on, emit, store };
export const { toast, dialog, confirm, alert, highlight, copy, dismiss } = componentApi;
export default Riko;

if (typeof window !== 'undefined') {
  window.Riko = Object.assign(window.Riko || {}, Riko);
  if (!window.RikoManualStart) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
  }
}
