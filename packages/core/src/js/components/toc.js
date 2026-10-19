// 页内目录：滚动时高亮当前所在小节（aria-current="true"）。
// data-riko-source="main"：列表为空时，从该容器内带 id 的标题自动生成（data-riko-levels="h2,h3"）。
// data-riko-offset="96"：判定"当前"时顶部预留的距离（默认取导航栏高度 + 24）。
import { on, emit, opt, escapeHtml } from '../core/dom.js';

export default {
  name: 'toc',
  init(el) {
    let list = el.querySelector('.riko-toc__list');
    const source = opt(el, 'source', '');
    if (source && (!list || !list.children.length)) {
      const root = document.querySelector(source);
      const levels = opt(el, 'levels', 'h2,h3').split(',').map(s => s.trim().toLowerCase());
      const heads = root ? Array.from(root.querySelectorAll(levels.map(l => `${l}[id]`).join(','))) : [];
      if (!list) { list = document.createElement('ul'); list.className = 'riko-toc__list'; el.appendChild(list); }
      let html = '', openSub = false;
      heads.forEach(h => {
        const sub = h.tagName.toLowerCase() !== levels[0];
        const text = escapeHtml((h.getAttribute('data-toc-title') || h.textContent).trim());
        const link = `<a class="riko-toc__link" href="#${encodeURIComponent(h.id)}">${text}</a>`;
        if (sub) { html += (openSub ? '' : '<ul class="riko-toc__sublist">') + `<li>${link}</li>`; openSub = true; }
        else { html += (openSub ? '</ul></li>' : html ? '</li>' : '') + `<li>${link}`; openSub = false; }
      });
      if (html) html += openSub ? '</ul></li>' : '</li>';
      list.innerHTML = html;
    }
    if (el.tagName === 'NAV' && !el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) el.setAttribute('aria-label', '本页目录');

    const links = Array.from(el.querySelectorAll('.riko-toc__link[href^="#"]'));
    const targets = links.map(a => document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))));
    let current = -1, ticking = false;
    // 判定线：显式 data-riko-offset，否则 = 页面 scroll-padding-top + 目标 scroll-margin-top（与点击锚点后的落点一致）
    const threshold = t => {
      const o = opt(el, 'offset', -1);
      if (o >= 0) return o;
      const root = getComputedStyle(document.documentElement);
      const header = (parseFloat(root.getPropertyValue('--riko-header-h')) || 72) + 24;
      const pad = parseFloat(root.scrollPaddingTop) || 0;
      return Math.max(header, pad + (parseFloat(getComputedStyle(t).scrollMarginTop) || 0) + 8);
    };
    const update = () => {
      ticking = false;
      let idx = -1;
      targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= threshold(t)) idx = i; });
      // 滚到底部时高亮最后一项
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        for (let i = targets.length - 1; i >= 0; i--) if (targets[i]) { idx = i; break; }
      }
      if (idx === -1 && targets[0]) idx = 0;
      if (idx === current) return;
      current = idx;
      links.forEach((a, i) => i === idx ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
      emit(el, 'toc:change', { index: idx, link: links[idx], target: targets[idx] });
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    const offs = [on(window, 'scroll', onScroll, { passive: true }), on(window, 'resize', onScroll)];
    update();
    el.__rikoTocOff = () => offs.forEach(f => f());
    return { update, get index() { return current; } };
  },
  destroy(el) { el.__rikoTocOff?.(); },
};
