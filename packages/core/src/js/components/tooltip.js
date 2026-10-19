// 文字提示：<button data-riko="tooltip" data-riko-tooltip="提示文字" data-riko-placement="top">…</button>
// 没有 data-riko-tooltip 时使用 title（并移除 title 以免出现原生提示）。
// 悬停/聚焦显示，移开/失焦/Esc 隐藏；自动建立 aria-describedby。
import { uid, opt } from '../core/dom.js';
import { position } from '../core/position.js';

const supportsPopover = typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;

export default {
  name: 'tooltip',
  init(el) {
    let text = el.getAttribute('data-riko-tooltip');
    if (text === null && el.hasAttribute('title')) {
      text = el.getAttribute('title');
      el.setAttribute('data-riko-tooltip', text);
      el.removeAttribute('title');
    }
    const tip = document.createElement('div');
    tip.className = 'riko-tooltip';
    tip.id = uid('riko-tip');
    tip.setAttribute('role', 'tooltip');
    tip.textContent = text || '';
    if (supportsPopover) tip.setAttribute('popover', 'manual'); else tip.hidden = true;
    document.body.appendChild(tip);
    const describedBy = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    el.setAttribute('aria-describedby', describedBy.concat(tip.id).join(' '));

    let showTimer, hideTimer, open = false;
    const place = () => position(el, tip, { placement: opt(el, 'placement', 'top'), offset: 10 });
    const show = () => {
      clearTimeout(hideTimer);
      if (open || !tip.textContent.trim()) return;
      open = true;
      if (supportsPopover) { try { tip.showPopover(); } catch { /* 已打开 */ } } else tip.hidden = false;
      place();
      tip.getBoundingClientRect();
      tip.setAttribute('data-state', 'open');
      document.addEventListener('keydown', onKey, true);
      window.addEventListener('scroll', place, true);
    };
    const hide = () => {
      clearTimeout(showTimer);
      if (!open) return;
      open = false;
      tip.removeAttribute('data-state');
      document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('scroll', place, true);
      hideTimer = setTimeout(() => {
        if (open) return;
        if (supportsPopover) { try { tip.hidePopover(); } catch { /* 已关闭 */ } } else tip.hidden = true;
      }, 160);
    };
    const onKey = e => { if (e.key === 'Escape') { hide(); } };
    const enter = () => { clearTimeout(hideTimer); showTimer = setTimeout(show, opt(el, 'delay', 150)); };
    const leave = () => { clearTimeout(showTimer); hideTimer = setTimeout(hide, 80); };
    const handlers = [['pointerenter', enter], ['pointerleave', leave], ['focusin', show], ['focusout', hide], ['click', hide]];
    handlers.forEach(([t, f]) => el.addEventListener(t, f));
    const mo = new MutationObserver(() => {
      const t = el.getAttribute('data-riko-tooltip');
      if (t !== null) { tip.textContent = t; if (open) place(); }
    });
    mo.observe(el, { attributes: true, attributeFilter: ['data-riko-tooltip'] });

    el.__rikoTooltip = { tip, handlers, mo, hide };
    return {
      show, hide,
      setText(t) { el.setAttribute('data-riko-tooltip', t); },
      get element() { return tip; },
    };
  },
  destroy(el) {
    const s = el.__rikoTooltip;
    if (!s) return;
    s.hide();
    s.handlers.forEach(([t, f]) => el.removeEventListener(t, f));
    s.mo.disconnect();
    s.tip.remove();
    const ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(id => id && id !== s.tip.id);
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' ')); else el.removeAttribute('aria-describedby');
    el.__rikoTooltip = null;
  },
};
