// 轮播：<div class="riko-carousel" data-riko="carousel" aria-label="画册">
//         <div class="riko-carousel__track"><div class="riko-carousel__slide">…</div>…</div>
//       </div>
// 自动生成上一张/下一张按钮与圆点；方向键切换；data-riko-autoplay="5000" 自动播放（悬停/聚焦暂停，减少动效时关闭）。
import { on, emit, opt, prefersReducedMotion } from '../core/dom.js';

export default {
  name: 'carousel',
  init(root) {
    const track = root.querySelector('.riko-carousel__track');
    if (!track) return;
    const slides = () => Array.from(track.querySelectorAll(':scope > .riko-carousel__slide'));
    const total = slides().length;
    if (!root.hasAttribute('role')) root.setAttribute('role', 'region');
    root.setAttribute('aria-roledescription', '轮播');
    track.setAttribute('tabindex', '0');
    slides().forEach((s, i) => {
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', '幻灯片');
      if (!s.hasAttribute('aria-label')) s.setAttribute('aria-label', `${i + 1} / ${total}`);
    });

    const mk = (cls, label) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = cls; b.setAttribute('aria-label', label);
      return b;
    };
    let prev = root.querySelector('.riko-carousel__prev');
    let next = root.querySelector('.riko-carousel__next');
    if (!prev) { prev = mk('riko-carousel__prev', '上一张'); root.appendChild(prev); }
    if (!next) { next = mk('riko-carousel__next', '下一张'); root.appendChild(next); }
    let dots = root.querySelector('.riko-carousel__dots');
    if (!dots) { dots = document.createElement('div'); dots.className = 'riko-carousel__dots'; track.after(dots); }
    if (!dots.querySelector('.riko-carousel__dot')) {
      dots.innerHTML = slides().map((_, i) => `<button type="button" class="riko-carousel__dot" aria-label="第 ${i + 1} 张"></button>`).join('');
    }
    const dotEls = () => Array.from(dots.querySelectorAll('.riko-carousel__dot'));

    const offsetOf = s => {
      const center = getComputedStyle(s).scrollSnapAlign.includes('center');
      const left = s.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
      return center ? left - (track.clientWidth - s.offsetWidth) / 2 : left - parseFloat(getComputedStyle(track).paddingLeft || 0);
    };
    let index = 0;
    let settleTimer = 0;
    const maxScroll = () => track.scrollWidth - track.clientWidth - 2;
    const current = () => {
      const list = slides();
      let best = 0, dist = Infinity;
      list.forEach((s, i) => { const d = Math.abs(offsetOf(s) - track.scrollLeft); if (d < dist) { dist = d; best = i; } });
      if (track.scrollLeft >= maxScroll()) best = Math.max(best, list.length - 1 - Math.max(0, Math.round(track.clientWidth / (list[0]?.offsetWidth || 1)) - 1));
      return best;
    };
    const sync = () => {
      const i = current();
      if (i !== index) { index = i; emit(root, 'carousel:change', { index }); }
      dotEls().forEach((d, j) => d.setAttribute('aria-current', String(j === index)));
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= maxScroll();
    };
    const goTo = i => {
      const list = slides();
      const n = (i + list.length) % list.length;
      track.scrollTo({ left: Math.max(0, Math.min(offsetOf(list[n]), track.scrollWidth - track.clientWidth)), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      // 兜底：某些环境不派发 scroll 事件时也能更新状态
      clearTimeout(settleTimer); settleTimer = setTimeout(sync, prefersReducedMotion() ? 30 : 500);
    };
    let raf = 0;
    const offs = [
      on(prev, 'click', () => goTo(index - 1)),
      on(next, 'click', () => goTo(index + 1)),
      on(dots, 'click', '.riko-carousel__dot', (e, d) => goTo(dotEls().indexOf(d))),
      on(track, 'scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); }, { passive: true }),
      on(track, 'scrollend', sync),
      on(track, 'keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
        else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
        else if (e.key === 'End') { e.preventDefault(); goTo(slides().length - 1); }
      }),
      on(window, 'resize', sync),
    ];

    // 自动播放
    const autoAttr = root.getAttribute('data-riko-autoplay');
    const interval = autoAttr === null ? 0 : (parseInt(autoAttr, 10) || 5000);
    let timer = 0, playing = false, hovering = false;
    let playBtn = null;
    const tick = () => { if (!hovering) goTo(index >= slides().length - 1 || track.scrollLeft >= maxScroll() ? 0 : index + 1); };
    const play = () => {
      if (!interval) return;
      playing = true; clearInterval(timer); timer = setInterval(tick, interval);
      track.setAttribute('aria-live', 'off');
      playBtn?.setAttribute('aria-pressed', 'true'); playBtn?.setAttribute('aria-label', '暂停自动播放');
    };
    const pause = () => {
      playing = false; clearInterval(timer);
      track.setAttribute('aria-live', 'polite');
      playBtn?.setAttribute('aria-pressed', 'false'); playBtn?.setAttribute('aria-label', '开始自动播放');
    };
    track.setAttribute('aria-live', 'polite');
    if (interval) {
      playBtn = mk('riko-carousel__play', '暂停自动播放');
      dots.appendChild(playBtn);
      offs.push(on(playBtn, 'click', () => (playing ? pause() : play())));
      offs.push(on(root, 'pointerenter', () => { hovering = true; }), on(root, 'pointerleave', () => { hovering = false; }));
      offs.push(on(root, 'focusin', () => { hovering = true; }), on(root, 'focusout', () => { hovering = false; }));
      if (prefersReducedMotion()) pause(); else play();
    }
    sync();
    setTimeout(sync, 60);
    root.__rikoCarousel = () => { offs.forEach(f => f()); clearInterval(timer); };
    return { goTo, next: () => goTo(index + 1), prev: () => goTo(index - 1), play, pause, get index() { return index; } };
  },
  destroy(root) { root.__rikoCarousel?.(); },
};
