// 搜索框：<div class="riko-search" data-riko="search"><input class="riko-search__input" type="search" …></div>
// - 自动加入清除按钮；输入防抖派发 riko:search:input { value, query }
// - Enter / Shift+Enter / 上下按钮派发 riko:search:step { dir: 1 | -1, query }
// - Esc 清空；`/` 或 Ctrl/Cmd+K 聚焦（data-riko-hotkey="none" 关闭，或指定其他单键）
// 全局工具 Riko.highlight(root, query, options)：在容器内高亮所有匹配。
import { on, emit, opt, debounce } from '../core/dom.js';

let hotkeyOwner = null;

export default {
  name: 'search',
  init(el) {
    const input = el.querySelector('.riko-search__input') || el.querySelector('input');
    if (!input) return;
    let clear = el.querySelector('.riko-search__clear');
    if (!clear) {
      clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'riko-search__clear';
      clear.setAttribute('aria-label', '清除搜索');
      el.appendChild(clear);
    }
    clear.hidden = true;
    const count = el.querySelector('.riko-search__count');
    const nav = el.querySelector('.riko-search__nav');
    if (count && !count.hasAttribute('aria-live')) count.setAttribute('aria-live', 'polite');
    if (nav) nav.hidden = true;

    const query = () => input.value.trim().toLowerCase();
    const syncState = () => {
      const filled = input.value.length > 0;
      clear.hidden = !filled;
      el.setAttribute('data-state', filled ? 'filled' : 'empty');
    };
    const fire = debounce(() => emit(el, 'search:input', { value: input.value, query: query() }), opt(el, 'debounce', 160));
    const step = dir => emit(el, 'search:step', { dir, query: query() });

    const offs = [
      on(input, 'input', () => { syncState(); fire(); }),
      on(input, 'keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); step(e.shiftKey ? -1 : 1); }
        else if (e.key === 'Escape' && input.value) { e.preventDefault(); e.stopPropagation(); inst.clear(); }
        else if (e.key === 'Escape') input.blur();
      }),
      on(clear, 'click', () => { inst.clear(); input.focus(); }),
    ];
    if (nav) offs.push(on(nav, 'click', '[data-step]', (e, b) => step(b.getAttribute('data-step') === 'prev' ? -1 : 1)));

    // 快捷键：页面上第一个启用快捷键的搜索框生效
    const hotkey = opt(el, 'hotkey', '/');
    if (hotkey !== 'none' && !hotkeyOwner) {
      hotkeyOwner = el;
      const onKey = e => {
        const t = e.target;
        const typing = t instanceof Element && (t.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]'));
        const modK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
        if (modK || (!typing && !e.metaKey && !e.ctrlKey && !e.altKey && e.key === hotkey)) {
          if (document.querySelector('dialog[open]') && !el.closest('dialog[open]')) return;
          e.preventDefault();
          input.focus();
          input.select();
        }
      };
      document.addEventListener('keydown', onKey);
      offs.push(() => { document.removeEventListener('keydown', onKey); if (hotkeyOwner === el) hotkeyOwner = null; });
    }

    const inst = {
      input,
      get value() { return input.value; },
      get query() { return query(); },
      focus() { input.focus(); },
      clear() {
        if (!input.value) return;
        input.value = '';
        syncState();
        inst.setResult(null);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        emit(el, 'search:input', { value: '', query: '' });
        emit(el, 'search:clear');
      },
      /** 显示结果计数：setResult({ current, total, label }) ；传 null 清除 */
      setResult(r) {
        if (count) count.textContent = !r ? '' : r.label ?? (r.total ? `${r.current ?? 1} / ${r.total}` : '0 处');
        if (nav) {
          nav.hidden = !r;
          nav.querySelectorAll('[data-step]').forEach(b => { b.disabled = !r || !r.total; });
        }
      },
    };
    syncState();
    el.__rikoSearchOff = () => offs.forEach(f => f());
    return inst;
  },
  destroy(el) { el.__rikoSearchOff?.(); },
};

// ---------------- 高亮 ----------------
const active = new WeakMap();

function unwrap(marks) {
  const parents = new Set();
  marks.forEach(m => {
    const p = m.parentNode;
    if (!p) return;
    p.replaceChild(document.createTextNode(m.textContent), m);
    parents.add(p);
  });
  parents.forEach(p => p.normalize());
}

/**
 * 在 root 内高亮 query 的所有匹配。
 * options: { caseSensitive=false, className='riko-mark', currentClass='riko-mark--current',
 *            exclude='script,style,textarea,input,select,[data-riko-nohighlight]', scroll=true }
 * 返回 { count, marks, index, next(), prev(), go(i), clear() }
 */
export function highlight(root, query, options = {}) {
  const o = { caseSensitive: false, className: 'riko-mark', currentClass: 'riko-mark--current',
    exclude: 'script,style,textarea,input,select,[data-riko-nohighlight]', scroll: true, ...options };
  if (typeof root === 'string') root = document.querySelector(root);
  if (!root) throw new Error('[Riko] highlight: 找不到容器');
  if (active.has(root)) { unwrap(active.get(root)); active.delete(root); }
  const q = String(query ?? '');
  const marks = [];
  if (q.trim()) {
    const needle = o.caseSensitive ? q : q.toLowerCase();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => !n.nodeValue.trim() || n.parentElement?.closest(o.exclude) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const text = node.nodeValue;
      const hay = o.caseSensitive ? text : text.toLowerCase();
      let i = hay.indexOf(needle);
      if (i < 0) continue;
      const frag = document.createDocumentFragment();
      let last = 0;
      while (i > -1) {
        if (i > last) frag.appendChild(document.createTextNode(text.slice(last, i)));
        const mark = document.createElement('mark');
        mark.className = o.className;
        mark.textContent = text.slice(i, i + q.length);
        frag.appendChild(mark);
        marks.push(mark);
        last = i + q.length;
        i = hay.indexOf(needle, last);
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    }
  }
  active.set(root, marks);
  const ctl = {
    count: marks.length,
    marks,
    index: -1,
    go(i) {
      if (!marks.length) return -1;
      ctl.index = ((i % marks.length) + marks.length) % marks.length;
      marks.forEach((m, j) => m.classList.toggle(o.currentClass, j === ctl.index));
      if (o.scroll) marks[ctl.index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return ctl.index;
    },
    next() { return ctl.go(ctl.index + 1); },
    prev() { return ctl.go(ctl.index < 0 ? -1 : ctl.index - 1); },
    clear() { unwrap(marks); marks.length = 0; ctl.count = 0; ctl.index = -1; active.delete(root); },
  };
  return ctl;
}

export const api = { highlight };
