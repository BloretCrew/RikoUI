// 多行文本自动增高：<textarea class="riko-textarea" data-riko="autosize" rows="2"></textarea>
// data-riko-max-rows="10" 限制最大行数（超出后出现滚动条）
import { on, opt } from '../core/dom.js';

function resize(el) {
  const cs = getComputedStyle(el);
  const line = parseFloat(cs.lineHeight) || 24;
  const extra = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
  const maxRows = opt(el, 'max-rows', 0);
  el.style.height = 'auto';
  let h = el.scrollHeight + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
  if (maxRows > 0) {
    const max = maxRows * line + extra;
    el.style.overflowY = h > max ? 'auto' : 'hidden';
    h = Math.min(h, max);
  }
  el.style.height = h + 'px';
}

export default {
  name: 'autosize',
  init(el) {
    const update = () => resize(el);
    const off = on(el, 'input', update);
    const offReset = el.form ? on(el.form, 'reset', () => setTimeout(update, 0)) : null;
    const ro = new ResizeObserver(() => { if (el.offsetWidth !== el.__rikoW) { el.__rikoW = el.offsetWidth; update(); } });
    ro.observe(el);
    update();
    el.__rikoAutosizeOff = () => { off(); offReset?.(); ro.disconnect(); };
    return { update };
  },
  destroy(el) { el.__rikoAutosizeOff?.(); el.style.height = ''; },
};
