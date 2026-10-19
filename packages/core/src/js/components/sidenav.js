// 侧边目录：可折叠分组；自动展开当前项所在分组并滚动到可见；↑↓ 在可见项间移动焦点。
// <nav class="riko-sidenav" data-riko="sidenav">…</nav>
import { on, emit, ensureId } from '../core/dom.js';

const CURRENT = '.riko-sidenav__item[aria-current="page"], .riko-sidenav__item[aria-current="true"]';

export default {
  name: 'sidenav',
  init(el) {
    const groups = () => Array.from(el.querySelectorAll('.riko-sidenav__group'));
    const toggleOf = g => g.querySelector(':scope > .riko-sidenav__group-toggle');
    const panelOf = g => g.querySelector(':scope > .riko-sidenav__panel');

    groups().forEach(g => {
      const t = toggleOf(g), p = panelOf(g);
      if (!t || !p) return;
      if (!t.hasAttribute('type') && t.tagName === 'BUTTON') t.setAttribute('type', 'button');
      t.setAttribute('aria-controls', ensureId(p, 'riko-sidenav-panel'));
      if (!t.hasAttribute('aria-expanded')) t.setAttribute('aria-expanded', String(!!p.querySelector(CURRENT)));
    });

    const setExpanded = (g, open) => {
      const t = toggleOf(g);
      if (!t || t.getAttribute('aria-expanded') === String(open)) return;
      t.setAttribute('aria-expanded', String(open));
      emit(el, 'sidenav:toggle', { group: g, expanded: open });
    };

    const reveal = (item = el.querySelector(CURRENT)) => {
      if (!item) return;
      const g = item.closest('.riko-sidenav__group');
      if (g) setExpanded(g, true);
      // 只滚动侧栏自身的滚动容器，不滚动整页
      let box = el;
      while (box && box !== document.body && !(box.scrollHeight > box.clientHeight && /(auto|scroll)/.test(getComputedStyle(box).overflowY))) box = box.parentElement;
      if (!box || box === document.body) return;
      requestAnimationFrame(() => {
        const br = box.getBoundingClientRect(), ir = item.getBoundingClientRect();
        if (ir.top < br.top || ir.bottom > br.bottom) box.scrollTop += ir.top - br.top - br.height / 3;
      });
    };

    const visibleFocusables = () => Array.from(el.querySelectorAll('.riko-sidenav__group-toggle, .riko-sidenav__item')).filter(n => {
      const panel = n.closest('.riko-sidenav__panel');
      return !(panel && panel.previousElementSibling?.getAttribute('aria-expanded') === 'false') && n.getClientRects().length;
    });

    const offs = [
      on(el, 'click', '.riko-sidenav__group-toggle', (e, t) => {
        const g = t.closest('.riko-sidenav__group');
        setExpanded(g, t.getAttribute('aria-expanded') !== 'true');
      }),
      on(el, 'keydown', e => {
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
        const list = visibleFocusables();
        const i = list.indexOf(document.activeElement);
        if (i < 0) return;
        e.preventDefault();
        const next = e.key === 'Home' ? 0 : e.key === 'End' ? list.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length;
        list[next].focus();
      }),
    ];
    reveal();
    el.__rikoSidenavOff = () => offs.forEach(f => f());

    return {
      expand: g => setExpanded(typeof g === 'number' ? groups()[g] : g, true),
      collapse: g => setExpanded(typeof g === 'number' ? groups()[g] : g, false),
      expandAll: () => groups().forEach(g => setExpanded(g, true)),
      collapseAll: () => groups().forEach(g => setExpanded(g, false)),
      /** 设置当前项（元素或 href），并展开、滚动到可见 */
      setCurrent(target) {
        const item = typeof target === 'string' ? el.querySelector(`.riko-sidenav__item[href="${CSS.escape(target)}"]`) : target;
        if (!item) return;
        el.querySelectorAll(CURRENT).forEach(n => n.removeAttribute('aria-current'));
        item.setAttribute('aria-current', 'page');
        reveal(item);
      },
      reveal,
    };
  },
  destroy(el) { el.__rikoSidenavOff?.(); },
};
