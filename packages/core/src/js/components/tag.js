// 通用「移除」机制：任意元素加 data-riko-dismiss，点击后移除它所属的组件。
//   data-riko-dismiss              → 移除最近的组件根元素（如 .riko-tag / .riko-alert / .riko-card）
//   data-riko-dismiss=".riko-card" → 移除最近的匹配祖先
//   data-riko-dismiss="#id"        → 移除指定元素
// 移除前派发可取消事件 riko:dismiss（detail.target），移除后焦点移到相邻的移除按钮。
// JS：Riko.dismiss(element)
import { emit, prefersReducedMotion } from '../core/dom.js';

const LAYOUT = /^riko-(stack|cluster|grid|container|section|split|page|center|spacer|u-|list$|table-wrap$|avatar-group$)/;

function findTarget(trigger) {
  const v = trigger.getAttribute('data-riko-dismiss');
  if (v) return v.startsWith('#') ? document.querySelector(v) : trigger.closest(v);
  for (let p = trigger.parentElement; p && p !== document.body; p = p.parentElement) {
    if (Array.from(p.classList).some(c => /^riko-[a-z0-9-]+$/.test(c) && !LAYOUT.test(c))) return p;
  }
  return trigger.parentElement;
}

/** 移除元素（带淡出），返回是否执行 */
export function dismiss(target, { trigger = null } = {}) {
  if (!target || !target.isConnected) return false;
  if (!emit(target, 'dismiss', { target, trigger }, true)) return false;
  // 计算之后的焦点去处：同级下一个/上一个的移除按钮
  let nextFocus = null;
  if (trigger && target.contains(document.activeElement)) {
    const sib = (target.nextElementSibling && target.nextElementSibling.querySelector('[data-riko-dismiss]')) ||
      (target.previousElementSibling && target.previousElementSibling.querySelector('[data-riko-dismiss]'));
    nextFocus = sib || null;
  }
  const parent = target.parentElement;
  const done = () => {
    target.remove();
    emit(parent || document, 'dismissed', { target });
    if (nextFocus && nextFocus.isConnected) nextFocus.focus();
  };
  if (prefersReducedMotion()) done();
  else { target.setAttribute('data-riko-dismissing', ''); setTimeout(done, 200); }
  return true;
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', e => {
    const trigger = e.target instanceof Element && e.target.closest('[data-riko-dismiss]');
    if (!trigger || trigger.closest('[aria-disabled="true"],:disabled')) return;
    e.preventDefault();
    dismiss(findTarget(trigger), { trigger });
  });
}

// data-riko="dismiss" 与 data-riko-dismiss 等价（为了与其他组件写法统一）
export default {
  name: 'dismiss',
  init(el) {
    if (!el.hasAttribute('data-riko-dismiss')) el.setAttribute('data-riko-dismiss', '');
    if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.setAttribute('type', 'button');
  },
};

export const api = { dismiss };
