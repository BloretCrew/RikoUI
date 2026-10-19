// 阅读进度条：<div class="riko-reading-progress" data-riko="reading-progress"></div>
// data-riko-target="#article"：只计算某个元素的阅读进度；否则为整页。进度写入 CSS 变量 --riko-progress（0–1）。
import { on, emit, opt } from '../core/dom.js';

export default {
  name: 'reading-progress',
  init(el) {
    const sel = opt(el, 'target', '');
    const labelled = el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby');
    if (labelled) { el.setAttribute('role', 'progressbar'); el.setAttribute('aria-valuemin', '0'); el.setAttribute('aria-valuemax', '100'); }
    else el.setAttribute('aria-hidden', 'true');
    let ticking = false, last = -1;
    const compute = () => {
      const target = sel && document.querySelector(sel);
      if (target) {
        const r = target.getBoundingClientRect();
        const range = r.height - window.innerHeight;
        return range <= 0 ? (r.top <= 0 ? 1 : 0) : -r.top / range;
      }
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      return max > 0 ? h.scrollTop / max : 0;
    };
    const update = () => {
      ticking = false;
      const p = Math.min(1, Math.max(0, compute()));
      if (Math.abs(p - last) < .001) return;
      last = p;
      el.style.setProperty('--riko-progress', p.toFixed(4));
      if (labelled) el.setAttribute('aria-valuenow', String(Math.round(p * 100)));
      emit(el, 'reading-progress:change', { progress: p });
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    const offs = [on(window, 'scroll', onScroll, { passive: true }), on(window, 'resize', onScroll)];
    update();
    el.__rikoProgOff = () => offs.forEach(f => f());
    return { update, get progress() { return Math.max(0, last); } };
  },
  destroy(el) { el.__rikoProgOff?.(); },
};
