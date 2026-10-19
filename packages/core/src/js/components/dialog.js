// 对话框：<dialog class="riko-dialog" id="x" data-riko="dialog" aria-labelledby="x-title">…</dialog>
// 触发：<button data-riko-open="x">；关闭：dialog 内任意 [data-riko-close]（可带值：data-riko-close="confirm"）
// 选项：data-riko-backdrop="static" 时点击遮罩与 Esc 都不关闭
// 本模块还提供：
//   - document 级委托：[data-riko-open] 打开 dialog/drawer；[data-riko-close] 关闭所在弹层
//     （移除 alert/banner/tag 等组件请用 data-riko-dismiss，见 tag.js）
//   - 全局 API：Riko.dialog.open/close/toggle、Riko.confirm()、Riko.alert()
import { on, emit, opt, afterAnimation, escapeHtml, uid, ensureId } from '../core/dom.js';
import { trapFocus, lockScroll } from '../core/focus.js';

const MODAL_SELECTOR = 'dialog.riko-dialog, dialog.riko-drawer';

/** 为 <dialog> 建立弹层实例（dialog 与 drawer 共用）。kind: 'dialog' | 'drawer' */
export function setupModal(el, kind) {
  // 已有其他组件实例（如 command）且提供 open()：直接复用，不接管
  if (el.riko && typeof el.riko.open === 'function') return el.riko;
  if (el.tagName !== 'DIALOG') {
    console.warn(`[Riko] riko-${kind} 必须是 <dialog> 元素`, el);
    return null;
  }
  let releaseScroll = null, releaseFocus = null, closing = false;
  const isStatic = () => opt(el, 'backdrop', '') === 'static';
  const triggers = () => el.id ? document.querySelectorAll(`[data-riko-open="${CSS.escape(el.id)}"]`) : [];
  const syncTriggers = open => triggers().forEach(t => {
    t.setAttribute('aria-haspopup', 'dialog');
    t.setAttribute('aria-controls', el.id);
    t.setAttribute('aria-expanded', String(open));
  });

  function cleanup() {
    releaseFocus?.(); releaseFocus = null;
    releaseScroll?.(); releaseScroll = null;
    el.removeAttribute('data-state');
    closing = false;
    syncTriggers(false);
  }

  const inst = {
    __modal: true,
    get isOpen() { return el.open; },
    open() {
      if (el.open) return inst;
      if (!el.isConnected) document.body.appendChild(el);
      if (!emit(el, `${kind}:open`, { id: el.id }, true)) return inst;
      el.removeAttribute('data-state');
      el.showModal();
      releaseScroll = lockScroll();
      releaseFocus = trapFocus(el);
      syncTriggers(true);
      emit(el, `${kind}:opened`, { id: el.id });
      return inst;
    },
    async close(returnValue) {
      if (!el.open || closing) return inst;
      closing = true;
      el.setAttribute('data-state', 'closing');
      await afterAnimation(el, 320);
      // close 事件里统一清理
      el.close(returnValue === undefined ? undefined : String(returnValue));
      return inst;
    },
    toggle() { return el.open ? inst.close() : inst.open(); },
  };

  const offs = [
    on(el, 'close', () => { cleanup(); emit(el, `${kind}:close`, { id: el.id, returnValue: el.returnValue }); }),
    on(el, 'cancel', e => { e.preventDefault(); if (!isStatic()) inst.close(); }),
    // 点击遮罩（dialog 自身、且在内容框之外）
    on(el, 'click', e => {
      if (e.target !== el || isStatic()) return;
      const r = el.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) inst.close();
    }),
    // <form method="dialog"> 提交时也走动画关闭，并把提交按钮的 value 作为 returnValue
    on(el, 'submit', e => {
      const form = e.target;
      if (form.getAttribute('method') !== 'dialog') return;
      e.preventDefault();
      inst.close(e.submitter?.value ?? '');
    }),
  ];
  el.__rikoOff = () => offs.forEach(f => f());
  syncTriggers(el.open);
  return inst;
}

function destroyModal(el) {
  if (el.open) el.close();
  el.__rikoOff?.();
}

const resolveEl = target => typeof target === 'string' ? document.getElementById(target) : target;
function instanceOf(target) {
  const el = resolveEl(target);
  if (!el) return null;
  if (el.riko && typeof el.riko.open === 'function') return el.riko;
  const kind = el.classList.contains('riko-drawer') ? 'drawer' : 'dialog';
  const inst = setupModal(el, kind);
  if (inst) el.riko = inst;
  return inst;
}

// ---------- 全局委托（只安装一次） ----------
if (typeof document !== 'undefined' && !document.__rikoModalDelegation) {
  document.__rikoModalDelegation = true;
  document.addEventListener('click', e => {
    if (!(e.target instanceof Element)) return;
    const opener = e.target.closest('[data-riko-open]');
    if (opener) {
      const inst = instanceOf(opener.getAttribute('data-riko-open'));
      if (inst) { e.preventDefault(); inst.open(); }
      else console.warn(`[Riko] 找不到 id 为 "${opener.getAttribute('data-riko-open')}" 的 <dialog>`);
      return;
    }
    const closer = e.target.closest('[data-riko-close]');
    if (!closer) return;
    const modal = closer.closest(MODAL_SELECTOR);
    if (!modal) return;
    e.preventDefault();
    const value = closer.getAttribute('data-riko-close');
    instanceOf(modal)?.close(value || undefined);
  });
}

// ---------- confirm / alert ----------
const TONE_ICON = { danger: 'danger', warning: 'warning', info: 'info', success: 'success' };

function buildDialog({ title, message, tone, buttons }) {
  const id = uid('riko-confirm');
  const el = document.createElement('dialog');
  el.className = 'riko-dialog riko-dialog--sm riko-dialog--confirm' + (TONE_ICON[tone] ? ' riko-dialog--' + TONE_ICON[tone] : '');
  el.id = id;
  el.setAttribute('aria-labelledby', id + '-title');
  if (message) el.setAttribute('aria-describedby', id + '-desc');
  if (tone === 'danger' || tone === 'warning') el.setAttribute('role', 'alertdialog');
  el.innerHTML =
    `<header class="riko-dialog__header"><span class="riko-dialog__icon" aria-hidden="true"></span>` +
    `<h2 class="riko-dialog__title" id="${id}-title">${escapeHtml(title)}</h2></header>` +
    (message ? `<div class="riko-dialog__body"><p class="riko-dialog__desc" id="${id}-desc">${escapeHtml(message)}</p></div>` : '') +
    `<footer class="riko-dialog__footer">${buttons.map(b =>
      `<button type="button" class="riko-btn ${b.className}" data-riko-close="${b.value}"${b.autofocus ? ' autofocus' : ''}>${escapeHtml(b.label)}</button>`).join('')}</footer>`;
  document.body.appendChild(el);
  return el;
}

function run(el, resolveWith) {
  return new Promise(resolve => {
    const inst = setupModal(el, 'dialog');
    el.riko = inst;
    el.addEventListener('close', () => {
      resolve(resolveWith(el.returnValue));
      el.__rikoOff?.();
      setTimeout(() => el.remove(), 0);
    }, { once: true });
    inst.open();
  });
}

/** 确认框：resolve(true) 表示用户点了确认 */
export function confirm(options = {}) {
  const o = typeof options === 'string' ? { message: options } : options;
  const tone = o.tone || 'accent';
  const el = buildDialog({
    title: o.title || '确定要这样做吗？',
    message: o.message || '',
    tone,
    buttons: [
      { label: o.cancelText || '取消', value: 'cancel', className: 'riko-btn--ghost', autofocus: tone === 'danger' },
      { label: o.confirmText || '确定', value: 'confirm', className: tone === 'danger' ? 'riko-btn--danger' : 'riko-btn--primary', autofocus: tone !== 'danger' },
    ],
  });
  return run(el, v => v === 'confirm');
}

/** 提示框：只有一个「好的」按钮 */
export function alert(options = {}) {
  const o = typeof options === 'string' ? { message: options } : options;
  const el = buildDialog({
    title: o.title || '提示',
    message: o.message || '',
    tone: o.tone || 'info',
    buttons: [{ label: o.okText || '好的', value: 'ok', className: 'riko-btn--primary', autofocus: true }],
  });
  return run(el, () => undefined);
}

export const api = {
  dialog: {
    open: target => instanceOf(target)?.open(),
    close: (target, value) => instanceOf(target)?.close(value),
    toggle: target => instanceOf(target)?.toggle(),
    get: target => instanceOf(target),
  },
  confirm,
  alert,
};

export default {
  name: 'dialog',
  init(el) {
    ensureId(el, 'riko-dialog');
    return setupModal(el, 'dialog');
  },
  destroy: destroyModal,
};

export { destroyModal };
