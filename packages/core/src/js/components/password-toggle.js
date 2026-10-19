// 密码显示/隐藏：放在输入组中的按钮上
// <div class="riko-input-group">
//   <input class="riko-input" type="password" id="pwd">
//   <button type="button" class="riko-btn riko-btn--ghost riko-btn--icon" data-riko="password-toggle" aria-label="显示密码"></button>
// </div>
// 默认控制同一 .riko-input-group 中的密码框；也可用 data-riko-target="#id" 指定。
import { on } from '../core/dom.js';

export default {
  name: 'password-toggle',
  init(el) {
    const sel = el.getAttribute('data-riko-target');
    const input = sel ? document.querySelector(sel) : el.closest('.riko-input-group')?.querySelector('input');
    if (!input) return;
    if (!el.innerHTML.trim()) {
      el.innerHTML = '<span class="riko-icon riko-icon--eye riko-password-toggle__show" aria-hidden="true"></span>' +
        '<span class="riko-icon riko-icon--eye-off riko-password-toggle__hide" aria-hidden="true"></span>';
    }
    if (!el.hasAttribute('type')) el.setAttribute('type', 'button');
    if (input.id) el.setAttribute('aria-controls', input.id);
    const showLabel = el.getAttribute('aria-label') || '显示密码';
    const sync = () => {
      const shown = input.type === 'text';
      el.setAttribute('aria-pressed', String(shown));
      el.setAttribute('aria-label', shown ? '隐藏密码' : showLabel);
    };
    const off = on(el, 'click', () => {
      input.type = input.type === 'password' ? 'text' : 'password';
      sync();
      input.focus({ preventScroll: true });
    });
    sync();
    el.__rikoPwOff = off;
    return { toggle: () => el.click() };
  },
  destroy(el) { el.__rikoPwOff?.(); },
};
