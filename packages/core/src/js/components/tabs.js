// 标签页（WAI-ARIA APG Tabs）
// <div class="riko-tabs" data-riko="tabs"> .riko-tabs__list > .riko-tabs__tab … ; .riko-tabs__panel … </div>
// data-riko-activation="manual"：方向键只移动焦点，Enter/Space 才切换。
import { on, emit, ensureId, opt } from '../core/dom.js';

export default {
  name: 'tabs',
  init(el) {
    const list = el.querySelector(':scope > .riko-tabs__list') || el.querySelector('.riko-tabs__list');
    if (!list) return null;
    const tabs = Array.from(list.querySelectorAll('.riko-tabs__tab'));
    const ownPanels = Array.from(el.querySelectorAll(':scope > .riko-tabs__panel'));
    const vertical = el.classList.contains('riko-tabs--vertical');
    const manual = opt(el, 'activation', 'auto') === 'manual';

    list.setAttribute('role', 'tablist');
    if (vertical) list.setAttribute('aria-orientation', 'vertical');
    const panelFor = (tab, i) => {
      const id = tab.getAttribute('aria-controls');
      return (id && document.getElementById(id)) || ownPanels[i] || null;
    };
    tabs.forEach((tab, i) => {
      tab.setAttribute('role', 'tab');
      if (tab.tagName === 'BUTTON' && !tab.hasAttribute('type')) tab.setAttribute('type', 'button');
      const panel = panelFor(tab, i);
      ensureId(tab, 'riko-tab');
      if (panel) {
        tab.setAttribute('aria-controls', ensureId(panel, 'riko-tabpanel'));
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        if (!panel.hasAttribute('tabindex')) panel.setAttribute('tabindex', '0');
      }
    });

    const enabled = t => !t.disabled && t.getAttribute('aria-disabled') !== 'true';
    let index = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true' && enabled(t));
    if (index < 0) index = tabs.findIndex(enabled);

    const moveInk = () => {
      if (!el.classList.contains('riko-tabs--pills')) return;
      const t = tabs[index];
      if (!t) return;
      list.style.setProperty('--riko-tabs-x', t.offsetLeft + 'px');
      list.style.setProperty('--riko-tabs-w', t.offsetWidth + 'px');
      el.setAttribute('data-ready', '');
    };
    const keepVisible = t => {
      if (list.scrollWidth <= list.clientWidth) return;
      const l = t.offsetLeft, r = l + t.offsetWidth;
      if (l < list.scrollLeft) list.scrollLeft = l - 12;
      else if (r > list.scrollLeft + list.clientWidth) list.scrollLeft = r - list.clientWidth + 12;
    };

    const select = (i, { focus = false, silent = false } = {}) => {
      const tab = tabs[i];
      if (!tab || !enabled(tab)) return;
      const changed = i !== index;
      index = i;
      tabs.forEach((t, j) => {
        const on = j === i;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const p = panelFor(t, j);
        if (p) {
          p.hidden = !on;
          if (on && changed) { p.setAttribute('data-state', 'entering'); p.addEventListener('animationend', () => p.removeAttribute('data-state'), { once: true }); }
        }
      });
      if (focus) tab.focus();
      keepVisible(tab);
      moveInk();
      if (changed && !silent) emit(el, 'tabs:change', { index: i, tab, panel: panelFor(tab, i) });
    };

    const focusAt = i => { tabs[i].focus(); keepVisible(tabs[i]); if (!manual) select(i); };
    const step = (from, dir) => {
      for (let k = 1; k <= tabs.length; k++) {
        const j = (from + dir * k + tabs.length * k) % tabs.length;
        if (enabled(tabs[j])) return j;
      }
      return from;
    };

    const offs = [
      on(list, 'click', '.riko-tabs__tab', (e, t) => select(tabs.indexOf(t), { focus: true })),
      on(list, 'keydown', '.riko-tabs__tab', (e, t) => {
        const cur = tabs.indexOf(t);
        const prev = vertical ? 'ArrowUp' : 'ArrowLeft', next = vertical ? 'ArrowDown' : 'ArrowRight';
        let target = null;
        if (e.key === next) target = step(cur, 1);
        else if (e.key === prev) target = step(cur, -1);
        else if (e.key === 'Home') target = tabs.findIndex(enabled);
        else if (e.key === 'End') { for (let j = tabs.length - 1; j >= 0; j--) if (enabled(tabs[j])) { target = j; break; } }
        else if ((e.key === 'Enter' || e.key === ' ') && manual) { e.preventDefault(); select(cur); return; }
        if (target === null) return;
        e.preventDefault();
        focusAt(target);
      }),
    ];
    const ro = new ResizeObserver(moveInk);
    ro.observe(list);
    offs.push(() => ro.disconnect());
    if (document.fonts?.ready) document.fonts.ready.then(moveInk);
    select(index, { silent: true });
    el.__rikoTabsOff = () => offs.forEach(f => f());

    return {
      select: i => select(i),
      get index() { return index; },
      get tabs() { return tabs; },
    };
  },
  destroy(el) { el.__rikoTabsOff?.(); },
};
