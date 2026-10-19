// 主题选择器：<div class="riko-theme-picker" data-riko="theme-picker"></div>
// 内容为空时自动生成四个选项；也可自己写 <button data-theme-mode="system|time|light|dark">。
import { theme } from '../theme.js';
import { on } from '../core/dom.js';

const OPTIONS = [
  ['system', 'monitor', '按系统设置', '自动跟随系统的深浅色模式'],
  ['time', 'clock', '按时间设置', '本地时间 8:00–18:00 为浅色，其余为深色'],
  ['light', 'sun', '浅色模式', '米色纸张般的白天'],
  ['dark', 'moon', '深色模式', '可可色的安静夜晚'],
];

export default {
  name: 'theme-picker',
  init(el) {
    if (!el.querySelector('[data-theme-mode]')) {
      el.innerHTML = OPTIONS.map(([mode, icon, label, desc]) =>
        `<button type="button" class="riko-theme-picker__option" data-theme-mode="${mode}" aria-pressed="false">` +
        `<span class="riko-theme-picker__icon"><span class="riko-icon riko-icon--${icon}" aria-hidden="true"></span></span>` +
        `<span class="riko-theme-picker__text"><span class="riko-theme-picker__label">${label}</span>` +
        `<span class="riko-theme-picker__desc">${desc}</span></span></button>`).join('');
    }
    if (!el.hasAttribute('role')) el.setAttribute('role', 'group');
    if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) el.setAttribute('aria-label', '深浅色模式');
    const sync = () => el.querySelectorAll('[data-theme-mode]').forEach(b =>
      b.setAttribute('aria-pressed', String(b.getAttribute('data-theme-mode') === theme.mode)));
    const offClick = on(el, 'click', '[data-theme-mode]', (e, b) => theme.set(b.getAttribute('data-theme-mode')));
    const offChange = on(document, 'riko:theme:change', sync);
    sync();
    el.__rikoOff = () => { offClick(); offChange(); };
    return { sync };
  },
  destroy(el) { el.__rikoOff?.(); },
};
