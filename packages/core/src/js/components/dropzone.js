// 拖拽上传：<div class="riko-dropzone" data-riko="dropzone"><label class="riko-dropzone__area"><input class="riko-dropzone__input" type="file" multiple>…</label></div>
// 选项：data-riko-max-size="5MB"（单个文件上限）、data-riko-max-files="3"
// 事件：riko:dropzone:change { files }、riko:dropzone:reject { file, reason }
import { on, emit, opt, escapeHtml } from '../core/dom.js';

const parseSize = s => {
  if (!s) return Infinity;
  const m = String(s).trim().match(/^([\d.]+)\s*(b|kb|mb|gb)?$/i);
  if (!m) return Infinity;
  return parseFloat(m[1]) * ({ b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3 }[(m[2] || 'b').toLowerCase()]);
};
export const formatSize = n => n < 1024 ? `${n} B` : n < 1024 ** 2 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 ** 2).toFixed(1)} MB`;

function accepts(file, accept) {
  if (!accept) return true;
  return accept.split(',').map(s => s.trim().toLowerCase()).filter(Boolean).some(rule =>
    rule.startsWith('.') ? file.name.toLowerCase().endsWith(rule)
      : rule.endsWith('/*') ? file.type.toLowerCase().startsWith(rule.slice(0, -1))
      : file.type.toLowerCase() === rule);
}

export default {
  name: 'dropzone',
  init(el) {
    const input = el.querySelector('.riko-dropzone__input') || el.querySelector('input[type="file"]');
    const area = el.querySelector('.riko-dropzone__area') || el;
    if (!input) return;
    let list = el.querySelector('.riko-dropzone__list');
    if (!list) {
      list = document.createElement('ul');
      list.className = 'riko-dropzone__list';
      list.setAttribute('aria-live', 'polite');
      el.appendChild(list);
    }
    const maxSize = parseSize(opt(el, 'max-size', ''));
    const maxFiles = opt(el, 'max-files', input.multiple ? Infinity : 1);
    let files = [];
    let rejected = [];
    const urls = new Map();

    const syncInput = () => {
      try {
        const dt = new DataTransfer();
        files.forEach(f => dt.items.add(f));
        input.files = dt.files;
      } catch { /* 旧浏览器不支持写入 files，保持原值 */ }
    };
    const thumb = f => {
      if (!f.type.startsWith('image/')) return '';
      if (!urls.has(f)) urls.set(f, URL.createObjectURL(f));
      return `<img src="${urls.get(f)}" alt="">`;
    };
    const render = () => {
      list.innerHTML = files.map((f, i) =>
        `<li class="riko-dropzone__file"><span class="riko-dropzone__thumb">${thumb(f)}</span>` +
        `<span class="riko-dropzone__meta"><span class="riko-dropzone__name">${escapeHtml(f.name)}</span>` +
        `<span class="riko-dropzone__size">${formatSize(f.size)}</span></span>` +
        `<button type="button" class="riko-dropzone__remove" data-index="${i}" aria-label="移除 ${escapeHtml(f.name)}"></button></li>`).join('') +
        rejected.map(r =>
        `<li class="riko-dropzone__file" aria-invalid="true"><span class="riko-dropzone__thumb"></span>` +
        `<span class="riko-dropzone__meta"><span class="riko-dropzone__name">${escapeHtml(r.file.name)}</span>` +
        `<span class="riko-dropzone__size">${escapeHtml(r.reason)}</span></span>` +
        `<button type="button" class="riko-dropzone__remove" data-rejected="${escapeHtml(r.file.name)}" aria-label="忽略 ${escapeHtml(r.file.name)}"></button></li>`).join('');
    };
    const changed = () => {
      syncInput();
      render();
      emit(el, 'dropzone:change', { files: files.slice() });
    };
    const addFiles = incoming => {
      rejected = [];
      const next = input.multiple ? files.slice() : [];
      for (const f of incoming) {
        let reason = '';
        if (!accepts(f, input.accept)) reason = '文件类型不支持';
        else if (f.size > maxSize) reason = `超过 ${formatSize(maxSize)} 的大小限制`;
        else if (next.length >= maxFiles) reason = `最多只能选择 ${maxFiles} 个文件`;
        else if (next.some(x => x.name === f.name && x.size === f.size)) continue;
        if (reason) { rejected.push({ file: f, reason }); emit(el, 'dropzone:reject', { file: f, reason }); }
        else next.push(f);
      }
      files.filter(f => !next.includes(f)).forEach(f => { URL.revokeObjectURL(urls.get(f)); urls.delete(f); });
      files = next;
      changed();
    };

    let depth = 0;
    const setDrag = v => (v ? el.setAttribute('data-state', 'dragover') : el.removeAttribute('data-state'));
    const offs = [
      on(input, 'change', () => {
        const picked = Array.from(input.files);
        if (!picked.length) { syncInput(); return; } // 取消选择时恢复已选文件
        addFiles(picked);
      }),
      on(area, 'dragenter', e => { if (input.disabled) return; e.preventDefault(); depth++; setDrag(true); }),
      on(area, 'dragover', e => { if (input.disabled) return; e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }),
      on(area, 'dragleave', () => { if (--depth <= 0) { depth = 0; setDrag(false); } }),
      on(area, 'drop', e => {
        if (input.disabled) return;
        e.preventDefault(); depth = 0; setDrag(false);
        addFiles(Array.from(e.dataTransfer.files));
      }),
      on(list, 'click', '.riko-dropzone__remove', (e, b) => {
        if (b.dataset.rejected !== undefined) rejected = rejected.filter(r => r.file.name !== b.dataset.rejected);
        else {
          const [f] = files.splice(+b.dataset.index, 1);
          if (f) { URL.revokeObjectURL(urls.get(f)); urls.delete(f); }
        }
        changed();
        input.focus();
      }),
    ];
    el.__rikoDropOff = () => { offs.forEach(f => f()); urls.forEach(u => URL.revokeObjectURL(u)); };
    return {
      get files() { return files.slice(); },
      add: list => addFiles(Array.from(list)),
      remove(i) { files.splice(i, 1); changed(); },
      clear() { files = []; rejected = []; changed(); },
    };
  },
  destroy(el) { el.__rikoDropOff?.(); },
};
