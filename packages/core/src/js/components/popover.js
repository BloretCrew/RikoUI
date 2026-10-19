// 气泡卡片：
//   <button data-riko-toggle="pop-1">打开</button>
//   <div class="riko-popover" id="pop-1" data-riko="popover" popover>…</div>
// 使用原生 popover（顶层渲染、点外部/Esc 关闭），JS 负责定位、aria-expanded 与焦点。
// 选项：data-riko-placement="bottom|top|left|right[-start|-end]"（写在 popover 上）
// 内部 [data-riko-close] 按钮会关闭它。
import { on, emit, ensureId, opt } from '../core/dom.js';
import { autoPosition } from '../core/position.js';
import { focusables } from '../core/focus.js';

const isPopover = el => el && el.classList && el.classList.contains('riko-popover');
const triggersOf = pop => Array.from(document.querySelectorAll(`[data-riko-toggle="${CSS.escape(pop.id)}"]`));

function wire(trigger, pop) {
  trigger.setAttribute('aria-controls', pop.id);
  if (!trigger.hasAttribute('aria-haspopup')) trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-expanded', String(pop.matches(':popover-open')));
  // 作为原生 invoker：点击由浏览器切换，且不会被「点外部关闭」误关
  if ('popoverTargetElement' in trigger && trigger.popoverTargetElement !== pop) {
    trigger.popoverTargetElement = pop;
    trigger.popoverTargetAction = 'toggle';
    return true;
  }
  return false;
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', e => {
    const trigger = e.target instanceof Element && e.target.closest('[data-riko-toggle]');
    if (trigger) {
      const pop = document.getElementById(trigger.getAttribute('data-riko-toggle'));
      if (!isPopover(pop)) return;
      pop.__rikoAnchor = trigger;
      const native = 'popoverTargetElement' in trigger && trigger.popoverTargetElement === pop;
      if (!native) {
        // 首次（或非按钮触发器）：手动切换，并接上原生 invoker 供下次使用
        wire(trigger, pop);
        e.preventDefault();
        pop.togglePopover();
      }
      return;
    }
    const close = e.target instanceof Element && e.target.closest('[data-riko-close]');
    const pop = close && close.closest('.riko-popover');
    if (pop && pop.matches(':popover-open')) pop.hidePopover();
  }, true);
}

export default {
  name: 'popover',
  init(pop) {
    ensureId(pop, 'riko-pop');
    if (!pop.hasAttribute('popover')) pop.setAttribute('popover', 'auto');
    if (!pop.hasAttribute('role')) pop.setAttribute('role', 'dialog');
    if (!pop.hasAttribute('tabindex')) pop.setAttribute('tabindex', '-1');
    triggersOf(pop).forEach(t => wire(t, pop));
    let stop = null;
    let hadFocus = false;
    // beforetoggle 同步触发：记录关闭前焦点是否在卡片内（浏览器随后可能把焦点还给别处）
    const onBefore = e => { if (e.newState === 'closed') hadFocus = pop.contains(document.activeElement); };
    pop.addEventListener('beforetoggle', onBefore);
    const onToggle = e => {
      const anchor = pop.__rikoAnchor && pop.__rikoAnchor.isConnected ? pop.__rikoAnchor : triggersOf(pop)[0];
      triggersOf(pop).forEach(t => t.setAttribute('aria-expanded', String(e.newState === 'open' && t === anchor)));
      if (e.newState === 'open') {
        if (anchor) stop = autoPosition(anchor, pop, { placement: opt(pop, 'placement', 'bottom'), offset: 10 });
        const first = focusables(pop)[0];
        (first || pop).focus({ preventScroll: true });
        emit(pop, 'popover:open', { anchor });
      } else {
        stop?.(); stop = null;
        const active = document.activeElement;
        if (anchor && (hadFocus || !active || active === document.body || pop.contains(active))) anchor.focus({ preventScroll: true });
        hadFocus = false;
        emit(pop, 'popover:close', { anchor });
      }
    };
    pop.addEventListener('toggle', onToggle);
    pop.__rikoPopover = { onToggle, onBefore, stop: () => stop?.() };
    return {
      open(anchor) { if (anchor) pop.__rikoAnchor = anchor; if (!pop.matches(':popover-open')) pop.showPopover(); },
      close() { if (pop.matches(':popover-open')) pop.hidePopover(); },
      toggle(anchor) { if (anchor) pop.__rikoAnchor = anchor; pop.togglePopover(); },
    };
  },
  destroy(pop) {
    const s = pop.__rikoPopover;
    if (!s) return;
    s.stop();
    pop.removeEventListener('toggle', s.onToggle);
    pop.removeEventListener('beforetoggle', s.onBefore);
    pop.__rikoPopover = null;
  },
};
