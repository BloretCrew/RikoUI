// 命令面板 / 全局搜索弹窗（原生 <dialog>，combobox + listbox 模式）
// <dialog class="riko-command" id="cmd" data-riko="command" data-riko-hotkey="k">…</dialog>
// 打开：任意元素 data-riko-open="cmd"，或 Ctrl/Cmd + 快捷键字母，或 el.riko.open()
import { on, emit, ensureId, opt, prefersReducedMotion } from '../core/dom.js';
import { lockScroll } from '../core/focus.js';

export default {
  name: 'command',
  init(el) {
    if (el.tagName !== 'DIALOG') { console.warn('[Riko] riko-command 需要使用 <dialog> 元素', el); return null; }
    const input = el.querySelector('.riko-command__input');
    const list = el.querySelector('.riko-command__list');
    const empty = el.querySelector('.riko-command__empty');
    if (!input || !list) return null;
    const id = ensureId(el, 'riko-command');
    const items = Array.from(el.querySelectorAll('.riko-command__item'));
    const groups = Array.from(el.querySelectorAll('.riko-command__group'));

    if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) el.setAttribute('aria-label', '快速搜索');
    list.setAttribute('role', 'listbox');
    ensureId(list, 'riko-command-list');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('spellcheck', 'false');
    groups.forEach(g => {
      g.setAttribute('role', 'group');
      const label = g.querySelector('.riko-command__group-label');
      if (label && !g.hasAttribute('aria-label')) g.setAttribute('aria-labelledby', ensureId(label, 'riko-command-group'));
      label?.setAttribute('role', 'presentation');
    });
    items.forEach(item => {
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', 'false');
      item.tabIndex = -1;
      ensureId(item, 'riko-command-item');
      const text = item.querySelector('.riko-command__text') || item;
      item.__rikoSearch = (item.textContent + ' ' + (item.getAttribute('data-riko-keywords') || '')).toLowerCase();
      item.__rikoTextEl = text;
      item.__rikoTextHtml = text.innerHTML;
    });
    if (empty) empty.setAttribute('role', 'status');

    let active = -1, release = null, previous = null, navigating = false;
    const visible = () => items.filter(i => !i.hidden);

    const setActive = idx => {
      const vis = visible();
      items.forEach(i => i.setAttribute('aria-selected', 'false'));
      if (!vis.length) { active = -1; input.removeAttribute('aria-activedescendant'); return; }
      active = (idx + vis.length) % vis.length;
      const cur = vis[active];
      cur.setAttribute('aria-selected', 'true');
      input.setAttribute('aria-activedescendant', cur.id);
      const lr = list.getBoundingClientRect(), cr = cur.getBoundingClientRect();
      if (cr.top < lr.top) list.scrollTop -= lr.top - cr.top + 8;
      else if (cr.bottom > lr.bottom) list.scrollTop += cr.bottom - lr.bottom + 8;
    };

    // 在文字节点中高亮首个匹配
    const mark = (item, q) => {
      const box = item.__rikoTextEl;
      box.innerHTML = item.__rikoTextHtml;
      if (!q) return;
      const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const i = n.data.toLowerCase().indexOf(q);
        if (i < 0) continue;
        const m = document.createElement('mark');
        const after = n.splitText(i);
        after.splitText(q.length);
        m.textContent = after.data;
        after.replaceWith(m);
        return;
      }
    };

    const filter = (query = input.value) => {
      const q = query.trim().toLowerCase();
      const terms = q.split(/\s+/).filter(Boolean);
      items.forEach(item => {
        item.hidden = !terms.every(t => item.__rikoSearch.includes(t));
        mark(item, item.hidden ? '' : terms[0] || '');
      });
      groups.forEach(g => { g.hidden = !g.querySelector('.riko-command__item:not([hidden])'); });
      const count = visible().length;
      if (empty) empty.hidden = count > 0;
      list.hidden = count === 0;
      setActive(0);
      emit(el, 'command:filter', { query, count });
    };

    const open = () => {
      if (el.open) return;
      previous = document.activeElement;
      el.removeAttribute('data-state');
      el.showModal();
      release = lockScroll();
      input.value = '';
      filter('');
      input.focus();
      emit(el, 'command:open');
    };
    const close = () => {
      if (!el.open || el.getAttribute('data-state') === 'closing') return;
      const done = () => {
        el.removeAttribute('data-state');
        el.close();
        release?.(); release = null;
        if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
        emit(el, 'command:close');
      };
      if (prefersReducedMotion()) return done();
      el.setAttribute('data-state', 'closing');
      setTimeout(done, 180);
    };
    const select = item => {
      if (!item) return;
      const ok = emit(el, 'command:select', { item, value: item.getAttribute('data-value') ?? item.textContent.trim(), query: input.value }, true);
      close();
      if (ok && item.tagName === 'A' && item.href) setTimeout(() => { navigating = true; item.click(); navigating = false; }, 0);
    };

    const hotkey = opt(el, 'hotkey', '').toLowerCase();
    const offs = [
      on(input, 'input', () => filter()),
      on(input, 'keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
        else if (e.key === 'Enter') { e.preventDefault(); select(visible()[active]); }
      }),
      on(list, 'click', '.riko-command__item', (e, item) => {
        if (navigating) return;
        e.preventDefault();
        select(item);
      }),
      on(list, 'pointermove', '.riko-command__item', (e, item) => {
        const i = visible().indexOf(item);
        if (i !== active) setActive(i);
      }),
      on(el, 'cancel', e => { e.preventDefault(); close(); }),
      on(el, 'click', e => {
        if (e.target !== el) return;
        const r = el.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
      }),
      on(document, 'click', `[data-riko-open="${CSS.escape(id)}"]`, e => { e.preventDefault(); open(); }),
    ];
    if (hotkey) offs.push(on(document, 'keydown', e => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === hotkey) { e.preventDefault(); el.open ? close() : open(); }
    }));
    el.__rikoCommandOff = () => { offs.forEach(f => f()); release?.(); };

    // 提供 open/close：dialog.js 的全局 [data-riko-open] / [data-riko-close] 委托会直接调用本实例
    return { __modal: true, open, close, toggle: () => (el.open ? close() : open()), filter: q => { input.value = q; filter(q); }, get isOpen() { return el.open; } };
  },
  destroy(el) { el.__rikoCommandOff?.(); },
};
