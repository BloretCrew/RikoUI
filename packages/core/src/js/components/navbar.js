// 导航栏：窄屏（≤768px）时把 .riko-navbar__nav 折叠为下拉面板，由 .riko-navbar__toggle 控制。
// <header class="riko-navbar" data-riko="navbar">…</header>
import { on, emit, ensureId } from '../core/dom.js';

const MQ = '(max-width: 768px)';

export default {
  name: 'navbar',
  init(el) {
    const nav = el.querySelector('.riko-navbar__nav');
    const toggle = el.querySelector('.riko-navbar__toggle');
    if (!nav || !toggle) return null;
    const mq = window.matchMedia(MQ);
    toggle.setAttribute('aria-controls', ensureId(nav, 'riko-navbar-nav'));
    if (!toggle.hasAttribute('aria-label')) toggle.setAttribute('aria-label', '打开菜单');
    if (!toggle.hasAttribute('type')) toggle.setAttribute('type', 'button');

    let isOpen = false;
    const render = () => {
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (mq.matches) nav.setAttribute('data-state', isOpen ? 'open' : 'closed');
      else nav.removeAttribute('data-state');
    };
    const set = (next, { focusToggle = false } = {}) => {
      if (next === isOpen) return;
      isOpen = next;
      render();
      emit(el, isOpen ? 'navbar:open' : 'navbar:close');
      if (focusToggle) toggle.focus();
    };
    const offs = [
      on(toggle, 'click', () => set(!isOpen)),
      on(nav, 'click', 'a', () => mq.matches && set(false)),
      on(document, 'keydown', e => { if (e.key === 'Escape' && isOpen) set(false, { focusToggle: nav.contains(document.activeElement) }); }),
      on(document, 'pointerdown', e => { if (isOpen && !el.contains(e.target)) set(false); }),
    ];
    const onMq = () => { isOpen = false; render(); };
    mq.addEventListener('change', onMq);
    offs.push(() => mq.removeEventListener('change', onMq));
    render();
    el.__rikoNavbarOff = () => offs.forEach(f => f());
    return { open: () => set(true), close: () => set(false), toggle: () => set(!isOpen), get isOpen() { return isOpen; } };
  },
  destroy(el) { el.__rikoNavbarOff?.(); },
};
