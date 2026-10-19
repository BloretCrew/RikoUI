// 验证码输入：<div class="riko-otp" data-riko="otp" data-riko-length="6" aria-label="验证码">
//   <input class="riko-otp__value" type="hidden" name="code"></div>
// 选项：data-riko-length（默认 6）、data-riko-type="numeric|alphanumeric"、data-riko-split（在中间加分隔，如 3）
// 事件：riko:otp:change { value }、riko:otp:complete { value }
import { on, emit, opt } from '../core/dom.js';

export default {
  name: 'otp',
  init(el) {
    const length = Math.max(1, opt(el, 'length', 6));
    const numeric = opt(el, 'type', 'numeric') !== 'alphanumeric';
    const split = opt(el, 'split', 0);
    let hidden = el.querySelector('.riko-otp__value') || el.querySelector('input[type="hidden"]');
    if (!hidden) {
      hidden = document.createElement('input');
      hidden.type = 'hidden'; hidden.className = 'riko-otp__value';
      el.appendChild(hidden);
    }
    if (!el.hasAttribute('role')) el.setAttribute('role', 'group');
    if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) el.setAttribute('aria-label', '验证码');

    el.querySelectorAll('.riko-otp__cell, .riko-otp__sep').forEach(n => n.remove());
    const cells = [];
    for (let i = 0; i < length; i++) {
      if (split && i === split) {
        const sep = document.createElement('span');
        sep.className = 'riko-otp__sep';
        sep.setAttribute('aria-hidden', 'true');
        el.insertBefore(sep, hidden);
      }
      const c = document.createElement('input');
      c.className = 'riko-otp__cell';
      c.type = 'text';
      c.maxLength = 1;
      c.inputMode = numeric ? 'numeric' : 'text';
      c.autocomplete = i === 0 ? 'one-time-code' : 'off';
      c.setAttribute('aria-label', `第 ${i + 1} 位，共 ${length} 位`);
      if (numeric) c.pattern = '[0-9]*';
      el.insertBefore(c, hidden);
      cells.push(c);
    }
    const valid = ch => (numeric ? /^\d$/ : /^[a-z0-9]$/i).test(ch);
    const value = () => cells.map(c => c.value).join('');
    const sync = () => {
      cells.forEach(c => c.setAttribute('data-state', c.value ? 'filled' : 'empty'));
      const v = value();
      hidden.value = v;
      emit(el, 'otp:change', { value: v });
      if (v.length === length) { el.setAttribute('data-state', 'complete'); emit(el, 'otp:complete', { value: v }); }
      else el.removeAttribute('data-state');
    };
    const fill = (start, text, focus = true) => {
      const chars = Array.from(text).filter(valid);
      let i = start;
      for (const ch of chars) { if (i >= length) break; cells[i++].value = numeric ? ch : ch.toUpperCase(); }
      if (focus) cells[Math.min(i, length - 1)].focus();
      sync();
    };
    const set = v => { cells.forEach(c => (c.value = '')); fill(0, String(v ?? ''), false); };
    if (hidden.value) set(hidden.value);

    const offs = [];
    cells.forEach((c, i) => {
      offs.push(
        on(c, 'focus', () => c.select()),
        on(c, 'input', () => {
          const v = c.value;
          if (!v) { sync(); return; }
          if (v.length > 1) { c.value = ''; fill(i, v); return; } // 自动填充 / 输入法一次输入多个字符
          if (!valid(v)) { c.value = ''; return; }
          if (!numeric) c.value = v.toUpperCase();
          sync();
          if (i < length - 1) cells[i + 1].focus();
        }),
        on(c, 'keydown', e => {
          if (e.key === 'Backspace' && !c.value && i > 0) { e.preventDefault(); cells[i - 1].value = ''; cells[i - 1].focus(); sync(); }
          else if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); cells[i - 1].focus(); }
          else if (e.key === 'ArrowRight' && i < length - 1) { e.preventDefault(); cells[i + 1].focus(); }
          else if (e.key === 'Home') { e.preventDefault(); cells[0].focus(); }
          else if (e.key === 'End') { e.preventDefault(); cells[length - 1].focus(); }
          else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && c.value && valid(e.key)) {
            // 已有内容时直接覆盖
            e.preventDefault(); c.value = numeric ? e.key : e.key.toUpperCase(); sync(); if (i < length - 1) cells[i + 1].focus();
          }
        }),
        on(c, 'paste', e => {
          e.preventDefault();
          const text = (e.clipboardData || window.clipboardData).getData('text');
          fill(i, text);
        }),
      );
    });
    el.__rikoOtpOff = () => offs.forEach(f => f());
    return {
      cells,
      get value() { return value(); },
      set,
      clear() { set(''); cells[0].focus(); },
      focus() { (cells.find(c => !c.value) || cells[length - 1]).focus(); },
    };
  },
  destroy(el) { el.__rikoOtpOff?.(); },
};
