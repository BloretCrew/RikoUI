// 数字输入：<div class="riko-number" data-riko="number"><input class="riko-number__input" type="number" …></div>
// 自动加入减/加按钮；支持 min/max/step、长按连续增减、↑↓ PageUp/PageDown Home/End。
import { on, emit } from '../core/dom.js';

const decimals = n => (String(n).split('.')[1] || '').length;

export default {
  name: 'number',
  init(el) {
    const input = el.querySelector('.riko-number__input') || el.querySelector('input');
    if (!input) return;
    input.classList.add('riko-number__input');
    const label = input.getAttribute('aria-label') || '';
    let down = el.querySelector('.riko-number__btn[data-step="down"]');
    let up = el.querySelector('.riko-number__btn[data-step="up"]');
    if (!down) {
      down = document.createElement('button');
      down.type = 'button'; down.className = 'riko-number__btn'; down.dataset.step = 'down';
      down.setAttribute('aria-label', '减少' + label);
      el.insertBefore(down, input);
    }
    if (!up) {
      up = document.createElement('button');
      up.type = 'button'; up.className = 'riko-number__btn'; up.dataset.step = 'up';
      up.setAttribute('aria-label', '增加' + label);
      input.after(up);
    }
    // 按钮不进入 Tab 顺序：键盘用户直接在输入框里按 ↑↓
    down.tabIndex = -1; up.tabIndex = -1;

    const num = (attr, d) => { const v = parseFloat(input.getAttribute(attr)); return Number.isFinite(v) ? v : d; };
    const sync = () => {
      const v = parseFloat(input.value);
      down.disabled = input.disabled || (Number.isFinite(v) && v <= num('min', -Infinity));
      up.disabled = input.disabled || (Number.isFinite(v) && v >= num('max', Infinity));
    };
    const set = value => {
      const min = num('min', -Infinity), max = num('max', Infinity), step = num('step', 1);
      const d = Math.max(decimals(step), decimals(num('min', 0)));
      const next = Math.min(max, Math.max(min, value));
      const text = next.toFixed(d);
      if (input.value === text) return false;
      input.value = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      emit(el, 'number:change', { value: next });
      sync();
      return true;
    };
    const stepBy = n => {
      if (input.disabled || input.readOnly) return false;
      const step = num('step', 1);
      const cur = parseFloat(input.value);
      const base = Number.isFinite(cur) ? cur : Math.max(num('min', 0), Math.min(0, num('max', 0)));
      return set(Number.isFinite(cur) ? base + n * step : base);
    };

    let timer = null, repeat = null;
    const stop = () => { clearTimeout(timer); clearInterval(repeat); timer = repeat = null; };
    const start = (dir, e) => {
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      input.focus({ preventScroll: true });
      stepBy(dir);
      timer = setTimeout(() => { repeat = setInterval(() => { if (!stepBy(dir)) stop(); }, 70); }, 420);
    };
    const offs = [
      on(down, 'pointerdown', e => start(-1, e)),
      on(up, 'pointerdown', e => start(1, e)),
      on(down, 'click', e => { if (e.detail === 0) stepBy(-1); }), // 键盘/读屏触发
      on(up, 'click', e => { if (e.detail === 0) stepBy(1); }),
      on(window, 'pointerup', stop), on(window, 'pointercancel', stop), on(window, 'blur', stop),
      on(input, 'keydown', e => {
        const map = { ArrowUp: 1, ArrowDown: -1, PageUp: 10, PageDown: -10 };
        if (e.key in map) { e.preventDefault(); stepBy(map[e.key]); }
        else if (e.key === 'Home' && Number.isFinite(num('min', NaN))) { e.preventDefault(); set(num('min')); }
        else if (e.key === 'End' && Number.isFinite(num('max', NaN))) { e.preventDefault(); set(num('max')); }
      }),
      on(input, 'input', sync),
      on(input, 'change', () => { const v = parseFloat(input.value); if (Number.isFinite(v)) set(v); }),
      on(input, 'wheel', e => { if (document.activeElement === input) e.preventDefault(); }, { passive: false }),
    ];
    sync();
    el.__rikoNumberOff = () => { stop(); offs.forEach(f => f()); };
    return { input, stepUp: () => stepBy(1), stepDown: () => stepBy(-1), set, get value() { return parseFloat(input.value); } };
  },
  destroy(el) { el.__rikoNumberOff?.(); },
};
