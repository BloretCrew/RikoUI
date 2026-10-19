// 返回顶部：<button class="riko-backtop" data-riko="backtop" aria-label="返回顶部"></button>
// data-riko-offset="400"：滚动超过该距离后出现。
import { on, opt, prefersReducedMotion } from '../core/dom.js';
import { focusables } from '../core/focus.js';

export default {
  name: 'backtop',
  init(el) {
    if (!el.hasAttribute('aria-label') && !el.textContent.trim()) el.setAttribute('aria-label', '返回顶部');
    if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.setAttribute('type', 'button');
    const threshold = opt(el, 'offset', 400);
    let ticking = false;
    const update = () => {
      ticking = false;
      el.setAttribute('data-state', window.scrollY > threshold ? 'shown' : 'hidden');
    };
    const offs = [
      on(window, 'scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true }),
      on(el, 'click', e => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        // 键盘触发时，把焦点移到页面第一个可聚焦元素，避免焦点留在页底
        if (e.detail === 0) focusables(document.body).find(n => n !== el)?.focus({ preventScroll: true });
      }),
    ];
    update();
    el.__rikoBacktopOff = () => offs.forEach(f => f());
    return { update };
  },
  destroy(el) { el.__rikoBacktopOff?.(); },
};
