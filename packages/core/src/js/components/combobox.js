// 可搜索选择框（WAI-ARIA APG：combobox + listbox，单选）
// 1) 内联列表：<div class="riko-combobox" data-riko="combobox" data-riko-name="role">
//      <input class="riko-combobox__input" aria-label="角色">
//      <ul class="riko-combobox__list riko-listbox"><li class="riko-listbox__option" data-value="riko">络可</li></ul></div>
// 2) 增强原生下拉：<div class="riko-combobox" data-riko="combobox"><select name="role">…</select></div>
// 选项：data-riko-empty="没有找到…"、data-riko-name（内联模式下生成隐藏 input 的 name）
import { on, emit, opt, ensureId, escapeHtml } from '../core/dom.js';
import { autoPosition } from '../core/position.js';

const labelOf = o => o.getAttribute('data-label') || (o.firstChild && o.firstChild.nodeType === 3 ? o.firstChild.nodeValue.trim() : '') || o.textContent.trim();
const valueOf = o => o.getAttribute('data-value') ?? labelOf(o);

export default {
  name: 'combobox',
  init(el) {
    const select = el.querySelector(':scope > select');
    let input = el.querySelector('.riko-combobox__input');
    let list = el.querySelector('.riko-combobox__list');

    if (select) {
      if (!input) {
        input = document.createElement('input');
        input.type = 'text';
        input.className = 'riko-combobox__input';
        input.placeholder = select.getAttribute('data-placeholder') || select.querySelector('option[value=""]')?.textContent || '请选择…';
        const lab = select.id && document.querySelector(`label[for="${select.id}"]`);
        if (lab) { input.id = select.id + '-combobox'; lab.htmlFor = input.id; }
        ['aria-label', 'aria-labelledby', 'aria-describedby', 'required'].forEach(a => select.hasAttribute(a) && input.setAttribute(a, select.getAttribute(a)));
        input.disabled = select.disabled;
        el.appendChild(input);
      }
      if (!list) {
        list = document.createElement('ul');
        list.className = 'riko-combobox__list riko-listbox';
        let html = '';
        for (const child of select.children) {
          const opts = child.tagName === 'OPTGROUP' ? Array.from(child.children) : [child];
          if (child.tagName === 'OPTGROUP') html += `<li class="riko-listbox__group" role="presentation">${escapeHtml(child.label)}</li>`;
          for (const o of opts) {
            if (o.value === '') continue; // 空值选项视为占位文字
            html += `<li class="riko-listbox__option" data-value="${escapeHtml(o.value)}"${o.disabled ? ' aria-disabled="true"' : ''}>${escapeHtml(o.textContent.trim())}</li>`;
          }
        }
        list.innerHTML = html;
        el.appendChild(list);
      }
      select.tabIndex = -1;
      select.setAttribute('aria-hidden', 'true');
    }
    if (!input || !list) { console.warn('[Riko] combobox 需要 .riko-combobox__input 与 .riko-combobox__list，或一个 <select>', el); return; }

    let hidden = el.querySelector('.riko-combobox__value');
    const name = opt(el, 'name', '');
    if (!hidden && name && !select) {
      hidden = document.createElement('input');
      hidden.type = 'hidden'; hidden.name = name; hidden.className = 'riko-combobox__value';
      el.appendChild(hidden);
    }

    // ---- ARIA ----
    ensureId(list, 'riko-listbox');
    list.setAttribute('role', 'listbox');
    list.tabIndex = -1;
    if (!list.hasAttribute('aria-label') && input.getAttribute('aria-label')) list.setAttribute('aria-label', input.getAttribute('aria-label'));
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', list.id);
    input.setAttribute('autocomplete', 'off');
    const usePopover = typeof list.showPopover === 'function';
    if (usePopover) list.setAttribute('popover', 'manual');

    let options = [];
    let empty = list.querySelector('.riko-listbox__empty');
    const refresh = () => {
      options = Array.from(list.querySelectorAll('.riko-listbox__option'));
      options.forEach(o => {
        ensureId(o, 'riko-option');
        o.setAttribute('role', 'option');
        if (!o.hasAttribute('aria-selected')) o.setAttribute('aria-selected', 'false');
      });
      if (!empty) {
        empty = document.createElement('li');
        empty.className = 'riko-listbox__empty';
        empty.setAttribute('role', 'presentation');
        empty.textContent = opt(el, 'empty', '没有找到呢……换个关键词试试吧 ✦');
        list.appendChild(empty);
      }
      empty.hidden = true;
    };
    refresh();

    let selected = options.find(o => o.getAttribute('aria-selected') === 'true')
      || (select && select.value !== '' ? options.find(o => valueOf(o) === select.value) : null)
      || (hidden && hidden.value ? options.find(o => valueOf(o) === hidden.value) : null) || null;
    let activeOpt = null;
    let stopPos = null;
    const isOpen = () => input.getAttribute('aria-expanded') === 'true';
    const visible = () => options.filter(o => !o.hidden && o.getAttribute('aria-disabled') !== 'true');

    const setActive = o => {
      if (activeOpt) activeOpt.removeAttribute('data-state');
      activeOpt = o || null;
      if (activeOpt) {
        activeOpt.setAttribute('data-state', 'active');
        input.setAttribute('aria-activedescendant', activeOpt.id);
        activeOpt.scrollIntoView({ block: 'nearest' });
      } else input.removeAttribute('aria-activedescendant');
    };
    const filter = q => {
      const needle = q.trim().toLowerCase();
      let n = 0;
      options.forEach(o => { const hit = !needle || o.textContent.toLowerCase().includes(needle); o.hidden = !hit; if (hit) n++; });
      list.querySelectorAll('.riko-listbox__group').forEach(g => {
        let sib = g.nextElementSibling, any = false;
        while (sib && !sib.classList.contains('riko-listbox__group')) { if (sib.classList.contains('riko-listbox__option') && !sib.hidden) any = true; sib = sib.nextElementSibling; }
        g.hidden = !any;
      });
      empty.hidden = n > 0;
      if (activeOpt && activeOpt.hidden) setActive(null);
    };
    const open = () => {
      if (isOpen() || input.disabled || input.readOnly) return;
      input.setAttribute('aria-expanded', 'true');
      list.setAttribute('data-open', '');
      if (usePopover) { try { list.showPopover(); } catch { /* 已打开 */ } }
      filter(selected && input.value === labelOf(selected) ? '' : input.value);
      stopPos = autoPosition(input, list, { placement: 'bottom-start', offset: 6, matchWidth: true });
      setActive(selected && !selected.hidden ? selected : visible()[0]);
      emit(el, 'combobox:open');
    };
    const close = () => {
      if (!isOpen()) return;
      input.setAttribute('aria-expanded', 'false');
      list.removeAttribute('data-open');
      if (usePopover) { try { list.hidePopover(); } catch { /* 已关闭 */ } }
      stopPos?.(); stopPos = null;
      setActive(null);
      emit(el, 'combobox:close');
    };
    const commit = (o, silent) => {
      options.forEach(x => x.setAttribute('aria-selected', String(x === o)));
      selected = o || null;
      const value = o ? valueOf(o) : '';
      input.value = o ? labelOf(o) : '';
      if (select && select.value !== value) { select.value = value; select.dispatchEvent(new Event('change', { bubbles: true })); }
      if (hidden && hidden.value !== value) { hidden.value = value; hidden.dispatchEvent(new Event('change', { bubbles: true })); }
      if (!silent) emit(el, 'combobox:change', { value, label: o ? labelOf(o) : '', option: o });
    };
    const move = d => {
      const v = visible();
      if (!v.length) return;
      const i = v.indexOf(activeOpt);
      setActive(v[i < 0 ? (d > 0 ? 0 : v.length - 1) : Math.min(v.length - 1, Math.max(0, i + d))]);
    };
    if (selected) commit(selected, true);

    const offs = [
      on(input, 'input', () => { open(); filter(input.value); setActive(visible()[0]); }),
      on(input, 'click', () => (isOpen() ? close() : open())),
      on(input, 'keydown', e => {
        switch (e.key) {
          case 'ArrowDown': e.preventDefault(); if (!isOpen()) open(); else if (!e.altKey) move(1); break;
          case 'ArrowUp': e.preventDefault(); if (!isOpen()) { open(); setActive(visible().at(-1)); } else move(-1); break;
          case 'Home': if (isOpen()) { e.preventDefault(); setActive(visible()[0]); } break;
          case 'End': if (isOpen()) { e.preventDefault(); setActive(visible().at(-1)); } break;
          case 'PageDown': if (isOpen()) { e.preventDefault(); move(5); } break;
          case 'PageUp': if (isOpen()) { e.preventDefault(); move(-5); } break;
          case 'Enter': if (isOpen() && activeOpt) { e.preventDefault(); commit(activeOpt); close(); } break;
          case 'Escape':
            if (isOpen()) { e.preventDefault(); e.stopPropagation(); close(); if (selected) input.value = labelOf(selected); }
            else if (input.value) { e.preventDefault(); commit(null); }
            break;
          case 'Tab': if (isOpen()) close(); break;
        }
      }),
      on(list, 'mousedown', e => e.preventDefault()),
      on(list, 'click', '.riko-listbox__option', (e, o) => {
        if (o.getAttribute('aria-disabled') === 'true') return;
        commit(o); close(); input.focus();
      }),
      on(list, 'mousemove', '.riko-listbox__option', (e, o) => { if (o !== activeOpt && o.getAttribute('aria-disabled') !== 'true') setActive(o); }),
      on(input, 'blur', () => {
        close();
        if (!document.hasFocus()) return; // 切换窗口时保留已输入的文字
        const text = input.value.trim();
        if (!text) { if (selected) commit(null); return; }
        const exact = options.find(o => labelOf(o).toLowerCase() === text.toLowerCase() && o.getAttribute('aria-disabled') !== 'true');
        if (exact && exact !== selected) commit(exact);
        else input.value = selected ? labelOf(selected) : '';
      }),
    ];
    el.__rikoComboOff = () => { close(); offs.forEach(f => f()); };
    return {
      input, list,
      open, close, refresh,
      get value() { return selected ? valueOf(selected) : ''; },
      setValue(v) { commit(options.find(o => valueOf(o) === String(v)) || null); },
    };
  },
  destroy(el) { el.__rikoComboOff?.(); },
};
