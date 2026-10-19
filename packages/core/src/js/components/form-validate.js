// 表单校验：<form class="riko-form" data-riko="form-validate" novalidate>…</form>
// 基于浏览器约束校验（required / type / pattern / minlength / maxlength / min / max / step），
// 失焦与提交时校验；错误写入同一 .riko-field 内的 .riko-field__error（没有则自动创建），控件加 aria-invalid。
// 自定义文案：在控件上写 data-riko-message-required / -type / -pattern / -minlength / -maxlength / -min / -max / -step / -match
// 两次输入一致：data-riko-match="#password"
// 事件：riko:form:invalid { errors: [{ control, message }] }、riko:form:submit（可 preventDefault 阻止提交，适合 AJAX）
import { on, emit, ensureId } from '../core/dom.js';

const CONTROLS = 'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, select';

function labelText(control) {
  const field = control.closest('.riko-field');
  const lab = field?.querySelector('.riko-field__label') || (control.id && document.querySelector(`label[for="${CSS.escape(control.id)}"]`));
  if (lab) {
    const clone = lab.cloneNode(true);
    clone.querySelectorAll('.riko-field__required, .riko-field__optional').forEach(n => n.remove());
    return clone.textContent.trim();
  }
  return control.getAttribute('aria-label') || '';
}

function messageFor(control, form) {
  const v = control.validity;
  const custom = k => control.getAttribute(`data-riko-message-${k}`);
  const label = labelText(control);
  const len = [...control.value].length;
  if (v.valueMissing) {
    return custom('required') || (control.type === 'checkbox' ? '请先勾选这一项哦'
      : control.type === 'radio' || control.tagName === 'SELECT' ? `请选择${label || '一项'}`
      : control.type === 'file' ? '请选择要上传的文件' : `${label || '这里'}还空着哦，请填写一下`);
  }
  if (v.typeMismatch || v.badInput) {
    return custom('type') || ({ email: '邮箱格式好像不太对，例如 riko@riko.land', url: '请输入完整的网址，例如 https://riko.land',
      number: '请输入有效的数字', tel: '请输入有效的电话号码' }[control.type] || '格式好像不太对');
  }
  if (v.tooShort) return custom('minlength') || `至少需要 ${control.minLength} 个字符（现在 ${len} 个）`;
  if (v.tooLong) return custom('maxlength') || `最多 ${control.maxLength} 个字符（现在 ${len} 个）`;
  if (v.rangeUnderflow) return custom('min') || `不能小于 ${control.min}`;
  if (v.rangeOverflow) return custom('max') || `不能大于 ${control.max}`;
  if (v.stepMismatch) return custom('step') || `请输入 ${control.step} 的整数倍`;
  if (v.patternMismatch) return custom('pattern') || control.title || '格式好像不太对';
  if (v.customError) return control.validationMessage;
  const match = control.getAttribute('data-riko-match');
  if (match && control.value) {
    const other = form.querySelector(match) || document.querySelector(match);
    if (other && other.value !== control.value) return custom('match') || '两次输入不一致哦';
  }
  return '';
}

function errorEl(control, create) {
  const field = control.closest('.riko-field, .riko-fieldset');
  if (!field) return null;
  let err = field.querySelector('.riko-field__error');
  if (!err && create) {
    err = document.createElement('p');
    err.className = 'riko-field__error';
    err.hidden = true;
    const anchor = field.querySelector('.riko-field__footer') || field.querySelector('.riko-field__hint');
    if (anchor && anchor.parentNode === field) anchor.after(err); else field.appendChild(err);
  }
  if (err) { ensureId(err, 'riko-error'); err.setAttribute('aria-live', 'polite'); }
  return err;
}

// 同组 radio / checkbox 视为一个控件
const groupOf = (control, form) => control.type === 'radio' && control.name
  ? Array.from(form.querySelectorAll(`input[type="radio"][name="${CSS.escape(control.name)}"]`)) : [control];

function show(control, form, message) {
  const group = groupOf(control, form);
  const err = errorEl(control, !!message);
  group.forEach(c => {
    if (message) c.setAttribute('aria-invalid', 'true'); else c.removeAttribute('aria-invalid');
    if (err) {
      const ids = (c.getAttribute('aria-describedby') || '').split(/\s+/).filter(x => x && x !== err.id);
      if (message) ids.push(err.id);
      if (ids.length) c.setAttribute('aria-describedby', ids.join(' ')); else c.removeAttribute('aria-describedby');
    }
  });
  // 带容器的控件（number / combobox / tags / otp）同步外框状态
  const wrap = control.closest('.riko-number, .riko-combobox, .riko-tags-input, .riko-otp, .riko-input-group');
  if (wrap) { if (message) wrap.setAttribute('aria-invalid', 'true'); else wrap.removeAttribute('aria-invalid'); }
  if (err) {
    if (message) { err.textContent = message; err.hidden = false; }
    else { err.hidden = true; err.textContent = ''; }
  }
}

export default {
  name: 'form-validate',
  init(form) {
    form.noValidate = true;
    const touched = new WeakSet();
    const controls = () => Array.from(form.querySelectorAll(CONTROLS)).filter(c => !c.disabled && !c.closest('fieldset:disabled') && !c.closest('.riko-otp, .riko-tags-input'));

    const check = control => {
      // 自定义「一致」校验放进 customValidity，让 :invalid 等原生状态也一致
      const match = control.getAttribute('data-riko-match');
      if (match) {
        const other = form.querySelector(match) || document.querySelector(match);
        control.setCustomValidity(other && control.value && other.value !== control.value
          ? control.getAttribute('data-riko-message-match') || '两次输入不一致哦' : '');
      }
      const message = control.checkValidity() ? '' : messageFor(control, form);
      show(control, form, message);
      return message;
    };
    // 组合控件（otp / tags-input）：在外框上写 data-riko-required
    const composites = () => Array.from(form.querySelectorAll('.riko-otp[data-riko-required], .riko-tags-input[data-riko-required]'));
    const showComposite = (wrap, message) => {
      const hidden = wrap.querySelector('input[type="hidden"]');
      const err = errorEl(wrap, !!message);
      if (message) wrap.setAttribute('aria-invalid', 'true'); else wrap.removeAttribute('aria-invalid');
      if (err) {
        const ids = (wrap.getAttribute('aria-describedby') || '').split(/\s+/).filter(x => x && x !== err.id);
        if (message) ids.push(err.id);
        if (ids.length) wrap.setAttribute('aria-describedby', ids.join(' ')); else wrap.removeAttribute('aria-describedby');
        if (message) { err.textContent = message; err.hidden = false; } else { err.hidden = true; err.textContent = ''; }
      }
      return hidden;
    };
    const checkComposite = wrap => {
      const hidden = wrap.querySelector('input[type="hidden"]');
      const value = hidden ? hidden.value : '';
      let message = '';
      if (wrap.classList.contains('riko-otp')) {
        const len = wrap.querySelectorAll('.riko-otp__cell').length;
        if (!value) message = wrap.getAttribute('data-riko-message-required') || '请输入验证码';
        else if (value.length < len) message = wrap.getAttribute('data-riko-message-incomplete') || `请输入完整的 ${len} 位验证码`;
      } else if (!value) message = wrap.getAttribute('data-riko-message-required') || '至少添加一个标签吧';
      showComposite(wrap, message);
      return message;
    };
    const validate = () => {
      const errors = [];
      for (const w of composites()) {
        const message = checkComposite(w);
        if (message) errors.push({ control: w.querySelector('.riko-otp__cell, .riko-tags-input__input') || w, message });
      }
      const seen = new Set();
      for (const c of controls()) {
        const key = c.type === 'radio' && c.name ? 'radio:' + c.name : c;
        if (seen.has(key)) continue;
        seen.add(key);
        touched.add(c);
        const message = check(c);
        if (message) errors.push({ control: c, message });
      }
      // 按文档顺序排列，保证聚焦的是页面上第一个错误
      return errors.sort((a, b) => (a.control.compareDocumentPosition(b.control) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    };

    const offs = [
      on(form, 'focusout', e => {
        const c = e.target;
        if (!c.matches?.(CONTROLS) || c.closest('.riko-otp, .riko-tags-input')) return;
        // 组件内部的输入（otp 格子等）在离开整个组件后再校验
        if (c.value !== '' || c.required) { touched.add(c); check(c); }
      }),
      on(form, 'riko:otp:change', e => { if (e.target.getAttribute('aria-invalid') === 'true') checkComposite(e.target); }),
      on(form, 'riko:tags-input:change', e => { if (e.target.hasAttribute('data-riko-required')) checkComposite(e.target); }),
      on(form, 'input', e => { const c = e.target; if (c.closest('.riko-otp, .riko-tags-input')) return; if (c.matches?.(CONTROLS) && (touched.has(c) || c.getAttribute('aria-invalid') === 'true')) check(c); }),
      on(form, 'change', e => {
        const c = e.target;
        if (!c.matches?.(CONTROLS) || c.closest('.riko-otp, .riko-tags-input')) return;
        touched.add(c); check(c);
        // 被 data-riko-match 引用的控件改变时，重新校验引用方
        form.querySelectorAll('[data-riko-match]').forEach(m => { if (touched.has(m) && (form.querySelector(m.getAttribute('data-riko-match')) === c)) check(m); });
      }),
      on(form, 'submit', e => {
        const errors = validate();
        if (errors.length) {
          e.preventDefault();
          e.stopImmediatePropagation();
          const first = errors[0].control;
          const target = first.type === 'hidden' ? first.closest('.riko-field')?.querySelector('input, textarea, select, [tabindex]') : first;
          (target || first).focus({ preventScroll: true });
          (target || first).scrollIntoView({ behavior: 'smooth', block: 'center' });
          emit(form, 'form:invalid', { errors });
          return;
        }
        if (!emit(form, 'form:submit', { data: new FormData(form) }, true)) e.preventDefault();
      }),
      on(form, 'reset', () => setTimeout(() => { controls().forEach(c => show(c, form, '')); composites().forEach(w => showComposite(w, '')); }, 0)),
    ];
    form.__rikoValidateOff = () => offs.forEach(f => f());
    return {
      validate() { return validate(); },
      get valid() { return validate().length === 0; },
      setError(control, message) { show(typeof control === 'string' ? form.querySelector(control) : control, form, message); },
      clear() { controls().forEach(c => show(c, form, '')); },
    };
  },
  destroy(form) { form.__rikoValidateOff?.(); },
};
