// 表单项增强：<div class="riko-field" data-riko="field">…</div>
// - 自动把 __hint / __error / __counter 用 aria-describedby 关联到控件，并为 label 补 for
// - __error 显示时自动给控件加 aria-invalid="true"，隐藏时移除
// - __counter：根据控件的 maxlength 显示「已输入 / 上限」
// 实例：el.riko.setError('提示文字') / el.riko.clearError()
import { ensureId, on } from '../core/dom.js';

const CONTROL = 'input:not([type="hidden"]), textarea, select';

export default {
  name: 'field',
  init(el) {
    const control = el.querySelector(CONTROL);
    if (!control) return;
    const id = ensureId(control, 'riko-field');
    const label = el.querySelector('.riko-field__label');
    if (label && label.tagName === 'LABEL' && !label.htmlFor) label.htmlFor = id;
    const hint = el.querySelector('.riko-field__hint');
    const error = el.querySelector('.riko-field__error');
    const counter = el.querySelector('.riko-field__counter');

    let invalidByUs = false;
    const describe = () => {
      const own = (control.getAttribute('aria-describedby') || '').split(/\s+/)
        .filter(x => x && ![hint, error, counter].some(n => n && n.id === x));
      const ids = [hint, error && !error.hidden ? error : null, counter].filter(Boolean).map(n => ensureId(n, 'riko-field'));
      const all = [...own, ...ids];
      if (all.length) control.setAttribute('aria-describedby', all.join(' '));
      else control.removeAttribute('aria-describedby');
      if (error) {
        if (!error.hidden && error.textContent.trim()) { control.setAttribute('aria-invalid', 'true'); invalidByUs = true; }
        else if (invalidByUs) { control.removeAttribute('aria-invalid'); invalidByUs = false; }
      }
    };
    if (error) error.setAttribute('aria-live', 'polite');

    let offInput = null;
    const count = () => {
      const max = Number(control.getAttribute('maxlength')) || Number(counter.getAttribute('data-riko-max')) || 0;
      const len = [...control.value].length;
      counter.textContent = max ? `${len} / ${max}` : String(len);
      counter.setAttribute('data-state', max && len > max ? 'over' : 'ok');
    };
    if (counter) { offInput = on(control, 'input', count); count(); }
    // 表单 reset 后（值在事件之后才恢复）同步计数
    const form = control.form;
    const offReset = counter && form ? on(form, 'reset', () => setTimeout(count, 0)) : null;

    const mo = error ? new MutationObserver(describe) : null;
    mo?.observe(error, { attributes: true, attributeFilter: ['hidden'], childList: true, characterData: true, subtree: true });
    describe();

    el.__rikoFieldOff = () => { offInput?.(); offReset?.(); mo?.disconnect(); };
    return {
      control,
      setError(message) {
        if (!error) return;
        error.textContent = message;
        error.hidden = false;
      },
      clearError() {
        if (!error) return;
        error.hidden = true;
        control.removeAttribute('aria-invalid');
      },
      update() { describe(); if (counter) count(); },
    };
  },
  destroy(el) { el.__rikoFieldOff?.(); },
};
