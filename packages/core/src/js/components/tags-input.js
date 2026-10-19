// 标签输入：<div class="riko-tags-input" data-riko="tags-input" data-riko-name="tags" data-riko-value="络可,Star">
//   <input class="riko-tags-input__input" aria-label="标签"></div>
// 回车 / 逗号（含中文逗号、顿号）生成标签；退格两次删除最后一个；粘贴多个自动拆分。
// 选项：data-riko-max（最多几个）、data-riko-unique="false"（允许重复）、data-riko-name、data-riko-value（初始值）
import { on, emit, opt, escapeHtml } from '../core/dom.js';

const SPLIT = /[,，、\n]/;

export default {
  name: 'tags-input',
  init(el) {
    const input = el.querySelector('.riko-tags-input__input') || el.querySelector('input:not([type="hidden"])');
    if (!input) return;
    let hidden = el.querySelector('input[type="hidden"]');
    if (!hidden) {
      hidden = document.createElement('input');
      hidden.type = 'hidden';
      el.appendChild(hidden);
    }
    const name = opt(el, 'name', '');
    if (name) hidden.name = name;
    const max = opt(el, 'max', Infinity);
    const unique = opt(el, 'unique', true);
    const label = input.getAttribute('aria-label') || '标签';
    if (!el.hasAttribute('role')) el.setAttribute('role', 'group');
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', label);

    // 读屏播报
    const live = document.createElement('span');
    live.className = 'riko-u-sr-only';
    live.setAttribute('aria-live', 'polite');
    el.appendChild(live);

    let tags = [];
    const initial = el.querySelectorAll('.riko-tags-input__tag');
    if (initial.length) tags = Array.from(initial, t => (t.querySelector('.riko-tags-input__label') || t).textContent.trim());
    else tags = String(opt(el, 'value', '') || hidden.value || '').split(SPLIT).map(s => s.trim()).filter(Boolean);
    initial.forEach(t => t.remove());

    const render = () => {
      el.querySelectorAll('.riko-tags-input__tag').forEach(t => t.remove());
      const frag = document.createDocumentFragment();
      tags.forEach((t, i) => {
        const span = document.createElement('span');
        span.className = 'riko-tags-input__tag';
        span.innerHTML = `<span class="riko-tags-input__label">${escapeHtml(t)}</span>` +
          `<button type="button" class="riko-tags-input__remove" data-index="${i}" aria-label="移除标签 ${escapeHtml(t)}"></button>`;
        frag.appendChild(span);
      });
      el.insertBefore(frag, input);
      hidden.value = tags.join(',');
      if (tags.length >= max) input.placeholder = ''; else if (input.dataset.placeholder) input.placeholder = input.dataset.placeholder;
    };
    input.dataset.placeholder = input.placeholder;
    const changed = () => {
      render();
      hidden.dispatchEvent(new Event('change', { bubbles: true }));
      emit(el, 'tags-input:change', { tags: tags.slice(), value: hidden.value });
    };
    const add = raw => {
      const items = String(raw).split(SPLIT).map(s => s.trim()).filter(Boolean);
      let added = 0;
      for (const t of items) {
        if (tags.length >= max) { live.textContent = `最多只能添加 ${max} 个标签`; break; }
        if (unique && tags.some(x => x.toLowerCase() === t.toLowerCase())) { live.textContent = `「${t}」已经添加过啦`; continue; }
        tags.push(t); added++;
        live.textContent = `已添加 ${t}`;
      }
      if (added) changed();
      return added;
    };
    const remove = i => {
      if (i < 0 || i >= tags.length) return;
      const [t] = tags.splice(i, 1);
      live.textContent = `已移除 ${t}`;
      changed();
    };
    const disarm = () => el.querySelector('.riko-tags-input__tag[data-state="armed"]')?.removeAttribute('data-state');

    const offs = [
      on(input, 'keydown', e => {
        if ((e.key === 'Enter' || e.key === ',' || e.key === '，') && !e.isComposing) {
          if (input.value.trim()) { e.preventDefault(); if (add(input.value)) input.value = ''; }
          else if (e.key !== 'Enter') e.preventDefault();
        } else if (e.key === 'Backspace' && !input.value && tags.length) {
          const last = el.querySelectorAll('.riko-tags-input__tag');
          const armed = last[last.length - 1];
          if (armed.getAttribute('data-state') === 'armed') remove(tags.length - 1);
          else { armed.setAttribute('data-state', 'armed'); live.textContent = `再按一次退格删除 ${tags.at(-1)}`; }
        } else disarm();
      }),
      on(input, 'input', () => { if (SPLIT.test(input.value)) { const parts = input.value.split(SPLIT); const rest = parts.pop(); add(parts.join(',')); input.value = rest; } }),
      on(input, 'blur', () => { disarm(); if (input.value.trim() && opt(el, 'add-on-blur', true)) { if (add(input.value)) input.value = ''; } }),
      on(el, 'click', '.riko-tags-input__remove', (e, b) => { e.stopPropagation(); remove(+b.dataset.index); input.focus(); }),
      on(el, 'click', e => { if (e.target === el) input.focus(); }),
    ];
    render();
    el.__rikoTagsOff = () => offs.forEach(f => f());
    return {
      get tags() { return tags.slice(); },
      add, remove,
      clear() { tags = []; changed(); },
      set(list) { tags = []; add(Array.isArray(list) ? list.join(',') : list); if (!tags.length) changed(); },
    };
  },
  destroy(el) { el.__rikoTagsOff?.(); },
};
