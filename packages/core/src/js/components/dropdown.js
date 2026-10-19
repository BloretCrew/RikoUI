// 下拉菜单（WAI-ARIA APG Menu Button）
// <div class="riko-dropdown" data-riko="dropdown"><button aria-haspopup="menu">…</button><div class="riko-menu" role="menu" hidden>…</div></div>
// data-riko-placement：bottom-start（默认）| bottom-end | top-start | top-end | right-start …
import { on, emit, ensureId, opt } from '../core/dom.js';
import { autoPosition } from '../core/position.js';

const ITEM = '.riko-menu__item';
const enabled = n => !n.disabled && n.getAttribute('aria-disabled') !== 'true' && n.getClientRects().length > 0;

export default {
  name: 'dropdown',
  init(el) {
    const trigger = el.querySelector(':scope > [aria-haspopup]') || el.querySelector(':scope > button, :scope > a');
    const menu = el.querySelector(':scope > .riko-menu');
    if (!trigger || !menu) return null;
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', ensureId(menu, 'riko-menu'));
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-labelledby', ensureId(trigger, 'riko-menu-trigger'));
    menu.hidden = true;
    menu.querySelectorAll(ITEM).forEach(n => {
      if (!n.hasAttribute('role')) n.setAttribute('role', 'menuitem');
      n.tabIndex = -1;
      if (n.tagName === 'BUTTON' && !n.hasAttribute('type')) n.setAttribute('type', 'button');
    });
    menu.querySelectorAll('.riko-menu__separator').forEach(n => n.setAttribute('role', 'separator'));
    menu.querySelectorAll('.riko-menu__label').forEach(n => n.setAttribute('role', 'presentation'));

    const items = () => Array.from(menu.querySelectorAll(ITEM)).filter(enabled);
    let stop = null, typed = '', typedTimer;
    const isOpen = () => !menu.hidden;

    const open = (focus = 'first') => {
      if (!isOpen()) {
        menu.hidden = false;
        menu.setAttribute('data-state', 'open');
        trigger.setAttribute('aria-expanded', 'true');
        stop = autoPosition(trigger, menu, { placement: opt(el, 'placement', 'bottom-start'), offset: 8 });
        emit(el, 'dropdown:open');
      }
      const list = items();
      if (focus === 'first') list[0]?.focus();
      else if (focus === 'last') list[list.length - 1]?.focus();
    };
    const close = ({ focusTrigger = false } = {}) => {
      if (!isOpen()) return;
      menu.hidden = true;
      menu.removeAttribute('data-state');
      trigger.setAttribute('aria-expanded', 'false');
      stop?.(); stop = null;
      if (focusTrigger) trigger.focus();
      emit(el, 'dropdown:close');
    };

    const activate = item => {
      const role = item.getAttribute('role');
      if (role === 'menuitemcheckbox') item.setAttribute('aria-checked', String(item.getAttribute('aria-checked') !== 'true'));
      if (role === 'menuitemradio') {
        const scope = item.closest('[role="group"]') || menu;
        scope.querySelectorAll('[role="menuitemradio"]').forEach(r => r.setAttribute('aria-checked', String(r === item)));
      }
      emit(el, 'dropdown:select', { item, value: item.getAttribute('data-value') ?? item.textContent.trim(), checked: item.getAttribute('aria-checked') === 'true' });
      if (!item.hasAttribute('data-riko-keep-open')) close({ focusTrigger: true });
    };

    const offs = [
      on(trigger, 'click', e => { e.preventDefault(); isOpen() ? close() : open(e.detail === 0 ? 'first' : 'none'); }),
      on(trigger, 'keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); open('first'); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); open('last'); }
      }),
      on(menu, 'click', ITEM, (e, item) => { if (enabled(item)) activate(item); }),
      on(menu, 'keydown', e => {
        const list = items();
        const i = list.indexOf(document.activeElement);
        switch (e.key) {
          case 'ArrowDown': e.preventDefault(); list[(i + 1) % list.length]?.focus(); break;
          case 'ArrowUp': e.preventDefault(); list[(i - 1 + list.length) % list.length]?.focus(); break;
          case 'Home': e.preventDefault(); list[0]?.focus(); break;
          case 'End': e.preventDefault(); list[list.length - 1]?.focus(); break;
          case 'Escape': e.preventDefault(); close({ focusTrigger: true }); break;
          case 'Tab': close(); break;
          case 'Enter': case ' ':
            if (i >= 0 && list[i].tagName !== 'A') { e.preventDefault(); activate(list[i]); }
            else if (i >= 0 && e.key === 'Enter') close();
            break;
          default:
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
              clearTimeout(typedTimer);
              typed += e.key.toLowerCase();
              typedTimer = setTimeout(() => (typed = ''), 600);
              const order = list.slice(i + 1).concat(list.slice(0, i + 1));
              order.find(n => n.textContent.trim().toLowerCase().startsWith(typed))?.focus();
            }
        }
      }),
      on(document, 'pointerdown', e => { if (isOpen() && !el.contains(e.target)) close(); }),
      on(el, 'focusout', e => { if (isOpen() && e.relatedTarget && !el.contains(e.relatedTarget)) close(); }),
    ];
    el.__rikoDropdownOff = () => { offs.forEach(f => f()); stop?.(); };
    return { open: () => open('first'), close: () => close(), toggle: () => (isOpen() ? close() : open('first')), get isOpen() { return isOpen(); } };
  },
  destroy(el) { el.__rikoDropdownOff?.(); },
};
