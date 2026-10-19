// DOM 小工具
let uidCounter = 0;
export const uid = (prefix = 'riko') => `${prefix}-${(++uidCounter).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** 给元素确保一个 id 并返回 */
export function ensureId(el, prefix) {
  if (!el.id) el.id = uid(prefix);
  return el.id;
}

/** addEventListener 并返回解绑函数；支持事件委托：on(root, 'click', '.sel', fn) */
export function on(target, type, selectorOrFn, maybeFn, options) {
  const delegated = typeof selectorOrFn === 'string';
  const fn = delegated ? maybeFn : selectorOrFn;
  const opts = delegated ? options : maybeFn;
  const handler = delegated
    ? e => {
        const match = e.target instanceof Element && e.target.closest(selectorOrFn);
        if (match && target.contains(match)) fn.call(match, e, match);
      }
    : fn;
  target.addEventListener(type, handler, opts);
  return () => target.removeEventListener(type, handler, opts);
}

/** 派发 riko:<组件>:<动作> 事件，返回是否未被 preventDefault */
export function emit(el, name, detail = {}, cancelable = false) {
  return el.dispatchEvent(new CustomEvent(`riko:${name}`, { bubbles: true, cancelable, detail }));
}

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** 等待元素上的 CSS 动画/过渡结束（无动画或减少动效时立即完成） */
export function afterAnimation(el, fallbackMs = 400) {
  return new Promise(resolve => {
    if (prefersReducedMotion()) return resolve();
    const names = getComputedStyle(el).animationName;
    const hasAnim = names && names !== 'none';
    const dur = parseFloat(getComputedStyle(el).transitionDuration) || 0;
    if (!hasAnim && !dur) return resolve();
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    el.addEventListener(hasAnim ? 'animationend' : 'transitionend', finish, { once: true });
    setTimeout(finish, fallbackMs);
  });
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** 读取 data-riko-* 选项：opt(el, 'placement', 'top') */
export function opt(el, name, fallback) {
  const v = el.getAttribute(`data-riko-${name}`);
  if (v === null) return fallback;
  if (typeof fallback === 'number') return Number(v);
  if (typeof fallback === 'boolean') return v !== 'false';
  return v;
}

export function debounce(fn, ms = 150) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
