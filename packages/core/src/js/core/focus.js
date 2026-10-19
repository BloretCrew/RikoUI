// 焦点管理：可聚焦元素、焦点陷阱、返回焦点
const FOCUSABLE = [
  'a[href]', 'area[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])', 'textarea:not([disabled])', 'iframe', 'audio[controls]', 'video[controls]',
  '[contenteditable]:not([contenteditable="false"])', '[tabindex]:not([tabindex="-1"])', 'summary',
].join(',');

export function focusables(root) {
  return Array.from(root.querySelectorAll(FOCUSABLE)).filter(el =>
    !el.hasAttribute('inert') && !el.closest('[inert],[hidden]') && el.getClientRects().length > 0);
}

/** 在 root 内循环 Tab；返回释放函数（会把焦点还给打开前的元素） */
export function trapFocus(root, { initial, returnFocus = true } = {}) {
  const previous = document.activeElement;
  const onKey = e => {
    if (e.key !== 'Tab') return;
    const list = focusables(root);
    if (!list.length) { e.preventDefault(); root.focus(); return; }
    const first = list[0], last = list[list.length - 1];
    if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  document.addEventListener('keydown', onKey, true);
  requestAnimationFrame(() => {
    const target = (initial && root.querySelector(initial)) || root.querySelector('[autofocus]') || focusables(root)[0] || root;
    if (target === root && !root.hasAttribute('tabindex')) root.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
  return () => {
    document.removeEventListener('keydown', onKey, true);
    if (returnFocus && previous && document.contains(previous)) previous.focus({ preventScroll: true });
  };
}

/** 锁定页面滚动（可嵌套） */
let lockCount = 0, savedOverflow = '', savedPadding = '';
export function lockScroll() {
  if (lockCount++ === 0) {
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    savedOverflow = document.body.style.overflow;
    savedPadding = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (sbw > 0) document.body.style.paddingRight = sbw + 'px';
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--lockCount === 0) {
      document.body.style.overflow = savedOverflow;
      document.body.style.paddingRight = savedPadding;
    }
  };
}
