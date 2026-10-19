// 主题管理：四种模式
//   system 跟随系统 · time 按时间（白天浅色）· light 浅色 · dark 深色
// 结果写到 <html data-theme="light|dark">，模式写到 data-theme-mode，并保存到 localStorage。
import { store } from './core/store.js';

const MODES = ['system', 'time', 'light', 'dark'];
const config = { storageKey: 'riko-theme', dayStart: 8, dayEnd: 18, root: null };
const listeners = new Set();
let mode = null;
let timer = null;
let mq = null;

const rootEl = () => config.root || document.documentElement;

function resolve(m = mode) {
  if (m === 'light' || m === 'dark') return m;
  if (m === 'time') {
    const h = new Date().getHours();
    return h >= config.dayStart && h < config.dayEnd ? 'light' : 'dark';
  }
  return mq && mq.matches ? 'dark' : 'light';
}

function apply() {
  const resolved = resolve();
  const el = rootEl();
  const changed = el.getAttribute('data-theme') !== resolved || el.getAttribute('data-theme-mode') !== mode;
  el.setAttribute('data-theme', resolved);
  el.setAttribute('data-theme-mode', mode);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', getComputedStyle(el).getPropertyValue('--riko-color-bg').trim() || meta.content);
  if (changed) listeners.forEach(fn => fn({ mode, theme: resolved }));
  // 广播给 [data-riko="theme-picker"] 等组件
  if (changed) document.dispatchEvent(new CustomEvent('riko:theme:change', { detail: { mode, theme: resolved } }));
}

function schedule() {
  clearInterval(timer);
  if (mode === 'time') timer = setInterval(apply, 60_000);
}

export const theme = {
  MODES,
  /** 配置（需在 start 之前调用）：{ storageKey, dayStart, dayEnd, root } */
  configure(options = {}) { Object.assign(config, options); if (mode) apply(); return this; },
  /** 读取保存的模式并应用；由 Riko 自动调用 */
  start() {
    if (mode) return this;
    mq = window.matchMedia('(prefers-color-scheme: dark)');
    const saved = store.get(config.storageKey);
    mode = MODES.includes(saved) ? saved : (rootEl().getAttribute('data-theme-mode') || 'system');
    if (!MODES.includes(mode)) mode = 'system';
    mq.addEventListener('change', () => { if (mode === 'system') apply(); });
    window.addEventListener('storage', e => {
      if (e.key === config.storageKey) { mode = MODES.includes(e.newValue) ? e.newValue : 'system'; schedule(); apply(); }
    });
    document.addEventListener('visibilitychange', () => { if (!document.hidden && mode === 'time') apply(); });
    schedule();
    apply();
    return this;
  },
  /** 当前模式：system | time | light | dark */
  get mode() { return mode || 'system'; },
  /** 实际生效的主题：light | dark */
  get current() { return resolve(this.mode); },
  /** 设置模式并保存 */
  set(next) {
    if (!MODES.includes(next)) throw new Error(`[Riko] 未知主题模式 "${next}"，可选：${MODES.join(' / ')}`);
    if (!mode) this.start();
    mode = next;
    store.set(config.storageKey, next);
    schedule();
    apply();
  },
  /** 在浅色与深色之间切换（结果保存为固定模式） */
  toggle() { this.set(this.current === 'dark' ? 'light' : 'dark'); },
  /** 订阅变化，返回取消函数 */
  onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); },
};

/** 放进 <head> 的防闪烁脚本源码（与 theme 逻辑一致） */
export const themeInitSnippet = (key = 'riko-theme') =>
  `(function(){try{var m=localStorage.getItem('${key}')||'system',h=new Date().getHours(),d=m==='dark'||(m==='time'&&(h<8||h>=18))||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');document.documentElement.setAttribute('data-theme-mode',m)}catch(e){}})();`;
