// 滚动进场：<section data-riko="reveal">…</section>
// 元素进入视口时淡入上移；data-riko-delay="120" 可设置延迟（毫秒）。无 JS 时内容正常显示。
import { opt, prefersReducedMotion } from '../core/dom.js';

let io = null;
const getObserver = () => io ||= new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.style.transitionDelay = opt(el, 'delay', 0) + 'ms';
    el.setAttribute('data-state', 'shown');
    io.unobserve(el);
  });
}, { threshold: .12, rootMargin: '0px 0px -40px 0px' });

export default {
  name: 'reveal',
  init(el) {
    el.classList.add('riko-u-reveal');
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) { el.setAttribute('data-state', 'shown'); return; }
    el.setAttribute('data-state', 'hidden');
    getObserver().observe(el);
  },
  destroy(el) { io?.unobserve(el); },
};
