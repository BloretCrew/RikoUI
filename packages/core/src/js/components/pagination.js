// 分页：data-riko="pagination" 时根据 data-riko-total / data-riko-current 自动渲染。
// data-riko-href="?page={page}"：渲染为链接；不写则渲染为按钮并派发 riko:pagination:change。
// data-riko-siblings="1"：当前页两侧显示的页码数。
import { on, emit, opt, escapeHtml } from '../core/dom.js';

/** 计算要显示的页码序列（数字或 '…'） */
export function pageRange(current, total, siblings = 1) {
  const pages = [];
  const start = Math.max(2, current - siblings), end = Math.min(total - 1, current + siblings);
  pages.push(1);
  if (start > 2) pages.push(start === 3 ? 2 : '…');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push(end === total - 2 ? total - 1 : '…');
  if (total > 1) pages.push(total);
  return pages;
}

export default {
  name: 'pagination',
  init(el) {
    let total = Math.max(1, opt(el, 'total', 1));
    let current = Math.min(Math.max(1, opt(el, 'current', 1)), total);
    const siblings = opt(el, 'siblings', 1);
    const href = opt(el, 'href', '');
    if (el.tagName === 'NAV' && !el.hasAttribute('aria-label')) el.setAttribute('aria-label', '分页');

    const item = (page, label, cls = '', disabled = false) => {
      const extra = cls ? ' ' + cls : '';
      const aria = label ? ` aria-label="${escapeHtml(label)}"` : '';
      if (disabled) return `<span class="riko-pagination__item${extra}" aria-disabled="true"${aria}></span>`;
      if (page === current && !cls) return `<span class="riko-pagination__item" aria-current="page">${page}</span>`;
      return href
        ? `<a class="riko-pagination__item${extra}" href="${escapeHtml(href.replace('{page}', page))}"${aria}>${cls ? '' : page}</a>`
        : `<button type="button" class="riko-pagination__item${extra}" data-page="${page}"${aria}>${cls ? '' : page}</button>`;
    };
    const render = () => {
      el.innerHTML = item(current - 1, '上一页', 'riko-pagination__prev', current <= 1) +
        pageRange(current, total, siblings).map(p => p === '…' ? '<span class="riko-pagination__ellipsis" aria-hidden="true">…</span>' : item(p)).join('') +
        item(current + 1, '下一页', 'riko-pagination__next', current >= total);
    };
    const set = (page, { silent = false } = {}) => {
      page = Math.min(Math.max(1, page), total);
      if (page === current) return;
      current = page;
      el.setAttribute('data-riko-current', page);
      render();
      if (!silent) emit(el, 'pagination:change', { page, total });
    };
    const off = on(el, 'click', 'button[data-page]', (e, b) => {
      const target = +b.getAttribute('data-page');
      set(target);
      // 保持焦点在分页内
      (el.querySelector(`[data-page="${target}"]`) || el.querySelector('[aria-current="page"]'))?.focus();
    });
    render();
    el.__rikoPagOff = off;
    return {
      set: page => set(page),
      setTotal(n) { total = Math.max(1, n); current = Math.min(current, total); render(); },
      get page() { return current; },
      get total() { return total; },
    };
  },
  destroy(el) { el.__rikoPagOff?.(); },
};
