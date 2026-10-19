// 深浅色切换按钮：<button class="riko-btn riko-btn--icon" data-riko="theme-toggle" aria-label="切换深浅色"></button>
// 按钮为空时自动放入太阳/月亮图标。
import { theme } from '../theme.js';
import { on } from '../core/dom.js';

export default {
  name: 'theme-toggle',
  init(el) {
    if (!el.innerHTML.trim()) {
      el.innerHTML = '<span class="riko-icon riko-icon--sun riko-theme-toggle__sun" aria-hidden="true"></span>' +
        '<span class="riko-icon riko-icon--moon riko-theme-toggle__moon" aria-hidden="true"></span>';
    }
    el.classList.add('riko-theme-toggle');
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', '切换深浅色');
    const sync = () => el.setAttribute('aria-pressed', String(theme.current === 'dark'));
    const offClick = on(el, 'click', () => theme.toggle());
    const offChange = on(document, 'riko:theme:change', sync);
    sync();
    el.__rikoOff = () => { offClick(); offChange(); };
  },
  destroy(el) { el.__rikoOff?.(); },
};
