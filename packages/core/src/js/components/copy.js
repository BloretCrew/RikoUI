// 复制：<button data-riko="copy" data-riko-copy="文本">…</button>
//       或 data-riko-target="#id"（复制该元素的 value / textContent）
// 按钮为空时自动放入复制图标；成功后 data-state="copied"，并通过读屏播报「已复制」。
import { on, emit, opt } from '../core/dom.js';

let live = null;
function announce(msg) {
  if (!live) {
    live = document.createElement('div');
    live.className = 'riko-u-sr-only';
    live.setAttribute('aria-live', 'polite');
    document.body.appendChild(live);
  }
  live.textContent = '';
  setTimeout(() => { live.textContent = msg; }, 30);
}

/** 复制文本到剪贴板，返回是否成功 */
export async function copyText(text) {
  try {
    if (!navigator.clipboard) throw new Error('no clipboard');
    // 某些环境（无用户激活、权限弹窗）下 writeText 可能一直不返回，设置超时后改用后备方案
    await Promise.race([navigator.clipboard.writeText(text), new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500))]);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}

function sourceText(el) {
  const direct = el.getAttribute('data-riko-copy');
  if (direct !== null) return direct;
  const sel = opt(el, 'target', '');
  const target = sel && document.querySelector(sel);
  if (!target) return '';
  return 'value' in target && typeof target.value === 'string' ? target.value : target.textContent;
}

export default {
  name: 'copy',
  init(el) {
    if (!el.innerHTML.trim()) el.innerHTML = '<span class="riko-copy__icon" aria-hidden="true"></span>';
    if (!el.textContent.trim() && !el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) el.setAttribute('aria-label', '复制');
    if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.setAttribute('type', 'button');
    let timer;
    const copy = async () => {
      const text = sourceText(el);
      const ok = await copyText(text);
      clearTimeout(timer);
      if (ok) {
        el.setAttribute('data-state', 'copied');
        announce(opt(el, 'copied-text', '已复制'));
        emit(el, 'copy:success', { text });
        timer = setTimeout(() => el.removeAttribute('data-state'), 1800);
      } else {
        announce('复制失败，请手动复制');
        emit(el, 'copy:error', { text });
      }
      return ok;
    };
    el.__rikoCopyOff = on(el, 'click', copy);
    return { copy };
  },
  destroy(el) { el.__rikoCopyOff?.(); },
};

export const api = { copy: copyText };
