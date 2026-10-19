// 折叠面板增强：<div class="riko-accordion" data-riko="accordion">（不加 JS 也能用原生 <details>）
// 提供平滑的高度动画；riko-accordion--exclusive 时同一时间只展开一项。
import { on, emit, uid, prefersReducedMotion } from '../core/dom.js';

const DURATION = 260;

function animate(item, open) {
  const content = item.querySelector(':scope > .riko-accordion__content');
  if (!content || prefersReducedMotion() || !content.animate) {
    item.open = open;
    return Promise.resolve();
  }
  item.__rikoAnim?.cancel();
  const cs = getComputedStyle(content);
  const full = { height: '', paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, opacity: 1 };
  const zero = { height: '0px', paddingTop: '0px', paddingBottom: '0px', opacity: 0 };
  if (open) item.open = true;
  const h = content.scrollHeight + 'px';
  full.height = h;
  content.style.overflow = 'hidden';
  const anim = content.animate(open ? [zero, full] : [full, zero], { duration: DURATION, easing: 'cubic-bezier(.22,.8,.3,1)' });
  item.__rikoAnim = anim;
  const settled = Promise.race([anim.finished, new Promise(r => setTimeout(r, DURATION + 120))]);
  return settled.then(() => {
    if (item.__rikoAnim !== anim) return;
    if (!open) item.open = false;
    content.style.overflow = '';
    item.__rikoAnim = null;
  }).catch(() => { content.style.overflow = ''; });
}

export default {
  name: 'accordion',
  init(root) {
    const items = () => Array.from(root.querySelectorAll(':scope > .riko-accordion__item'));
    const exclusive = root.classList.contains('riko-accordion--exclusive') || items().some(i => i.hasAttribute('name'));
    // 由 JS 接管「互斥」，以便关闭动画不被浏览器打断
    if (exclusive) items().forEach(i => i.removeAttribute('name'));
    const toggle = (item, open = !item.open) => {
      if (open === item.open && !item.__rikoAnim) return;
      if (open && exclusive) items().forEach(other => { if (other !== item && other.open) animate(other, false); });
      animate(item, open);
      emit(item, 'accordion:toggle', { item, open });
    };
    const off = on(root, 'click', '.riko-accordion__summary', (e, summary) => {
      const item = summary.parentElement;
      if (!item || item.parentElement !== root) return;
      e.preventDefault();
      toggle(item);
    });
    root.__rikoAccordionOff = off;
    if (exclusive && !root.id) root.id = uid('riko-acc');
    return {
      open: i => toggle(typeof i === 'number' ? items()[i] : i, true),
      close: i => toggle(typeof i === 'number' ? items()[i] : i, false),
      toggle: i => toggle(typeof i === 'number' ? items()[i] : i),
    };
  },
  destroy(root) { root.__rikoAccordionOff?.(); },
};
