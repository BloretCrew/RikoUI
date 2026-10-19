// 轻提示：Riko.toast('已保存') 或 Riko.toast({ title, message, tone, duration, action, icon, position })
//   tone: info（默认）| success | warning | danger | accent
//   duration: 毫秒，默认 4000；0 表示不自动关闭
//   action: { label, onClick(close) }
//   返回 { el, close() }
// 快捷：Riko.toast.success(msg, opts) / .warning / .danger / .info；Riko.toast.configure({ position, max, duration })；Riko.toast.clear()
// 声明式：<button data-riko-toast="已复制！" data-riko-toast-tone="success">
import { escapeHtml } from '../core/dom.js';

const config = { position: 'bottom-right', max: 4, duration: 4000 };
const POSITIONS = ['top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left'];
const live = new Set();

function toaster(position) {
  const pos = POSITIONS.includes(position) ? position : 'bottom-right';
  let box = document.querySelector(`.riko-toaster[data-position="${pos}"]`);
  if (!box) {
    box = document.createElement('section');
    box.className = 'riko-toaster';
    box.setAttribute('data-position', pos);
    box.setAttribute('aria-label', '通知');
    box.setAttribute('aria-live', 'polite');
    box.setAttribute('aria-relevant', 'additions');
    document.body.appendChild(box);
  }
  return box;
}

export function toast(input = {}) {
  const o = typeof input === 'string' ? { message: input } : { ...input };
  const tone = ['success', 'warning', 'danger', 'accent', 'info'].includes(o.tone) ? o.tone : 'info';
  const duration = o.duration ?? config.duration;
  const box = toaster(o.position || config.position);

  const el = document.createElement('div');
  el.className = `riko-toast${tone === 'info' ? '' : ' riko-toast--' + tone}`;
  el.setAttribute('role', tone === 'danger' ? 'alert' : 'status');
  el.style.setProperty('--riko-toast-duration', duration + 'ms');
  el.innerHTML =
    `<span class="riko-toast__icon" aria-hidden="true">${o.icon ? `<i data-lucide="${escapeHtml(o.icon)}"></i>` : ''}</span>` +
    `<div class="riko-toast__content">` +
    (o.title ? `<p class="riko-toast__title">${escapeHtml(o.title)}</p>` : '') +
    (o.message ? `<p class="riko-toast__message">${escapeHtml(o.message)}</p>` : '') + `</div>` +
    (o.action ? `<button type="button" class="riko-toast__action">${escapeHtml(o.action.label)}</button>` : '') +
    `<button type="button" class="riko-toast__close" aria-label="关闭通知"></button>` +
    (duration > 0 ? '<span class="riko-toast__timer" aria-hidden="true"></span>' : '');

  let timer = null, remaining = duration, startedAt = 0, closed = false;
  const pause = () => { if (timer) { clearTimeout(timer); timer = null; remaining -= Date.now() - startedAt; } };
  const resume = () => { if (duration > 0 && !timer && !closed) { startedAt = Date.now(); timer = setTimeout(close, Math.max(remaining, 0)); } };

  function close() {
    if (closed) return;
    closed = true;
    clearTimeout(timer);
    live.delete(handle);
    el.setAttribute('data-state', 'closing');
    const done = () => { el.remove(); if (!box.children.length) box.remove(); };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) done();
    else { el.addEventListener('animationend', e => { if (e.target === el) done(); }); setTimeout(done, 400); }
    o.onClose?.();
  }
  const handle = { el, close };

  el.querySelector('.riko-toast__close').addEventListener('click', close);
  el.querySelector('.riko-toast__action')?.addEventListener('click', () => { o.action.onClick?.(close); if (o.action.close !== false) close(); });
  el.addEventListener('mouseenter', pause);
  el.addEventListener('mouseleave', resume);
  el.addEventListener('focusin', pause);
  el.addEventListener('focusout', e => { if (!el.contains(e.relatedTarget)) resume(); });

  if (box.getAttribute('data-position').startsWith('top')) box.prepend(el); else box.appendChild(el);
  live.add(handle);
  // 超过上限时关闭最早的
  const overflow = live.size - config.max;
  if (overflow > 0) Array.from(live).slice(0, overflow).forEach(h => h.close());
  if (o.icon && window.Riko && typeof window.Riko.init === 'function') window.Riko.init(el);
  resume();
  return handle;
}

['success', 'warning', 'danger', 'info', 'accent'].forEach(tone => {
  toast[tone] = (message, opts = {}) => toast({ ...(typeof message === 'string' ? { message } : message), ...opts, tone });
});
toast.configure = (opts = {}) => { Object.assign(config, opts); return { ...config }; };
toast.clear = () => Array.from(live).forEach(h => h.close());

// 声明式触发
if (typeof document !== 'undefined' && !document.__rikoToastDelegation) {
  document.__rikoToastDelegation = true;
  document.addEventListener('click', e => {
    const t = e.target instanceof Element && e.target.closest('[data-riko-toast]');
    if (!t) return;
    toast({
      message: t.getAttribute('data-riko-toast'),
      title: t.getAttribute('data-riko-toast-title') || undefined,
      tone: t.getAttribute('data-riko-toast-tone') || undefined,
    });
  });
}

export const api = { toast };

