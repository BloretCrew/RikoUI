// 滑块增强：<input class="riko-range" type="range" data-riko="range">
// - 维护已选段 --riko-range-fill（WebKit 内核需要）
// - 同步 <output for="该 input 的 id"> 或 data-riko-output="#选择器" 的显示值
// - data-riko-suffix="%" 给显示值加后缀
import { on, opt } from '../core/dom.js';

export default {
  name: 'range',
  init(el) {
    const outSel = el.getAttribute('data-riko-output');
    const outputs = [
      ...(outSel ? document.querySelectorAll(outSel) : []),
      ...(el.id ? document.querySelectorAll(`output[for~="${CSS.escape(el.id)}"]`) : []),
    ];
    const suffix = opt(el, 'suffix', '');
    const update = () => {
      const min = Number(el.min || 0), max = Number(el.max || 100), v = Number(el.value);
      const pct = max > min ? ((v - min) / (max - min)) * 100 : 0;
      el.style.setProperty('--riko-range-fill', pct + '%');
      outputs.forEach(o => { o.value = el.value + suffix; o.textContent = el.value + suffix; });
    };
    const off = on(el, 'input', update);
    update();
    el.__rikoRangeOff = off;
    return { update };
  },
  destroy(el) { el.__rikoRangeOff?.(); },
};
