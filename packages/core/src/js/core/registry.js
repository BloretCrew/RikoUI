// 组件注册与自动初始化
// 组件模块：export default { name, selector?, init(el, api) → instance?, destroy?(el) }
// 页面中写 data-riko="<name>" 即自动初始化；实例挂在 el.riko 上。
const defs = new Map();
let observer = null;

export function register(def) {
  if (!def || !def.name || typeof def.init !== 'function') throw new Error('[Riko] 组件定义缺少 name/init');
  defs.set(def.name, def);
}
export const registered = () => Array.from(defs.keys());

function initEl(el) {
  const names = (el.getAttribute('data-riko') || '').split(/\s+/).filter(Boolean);
  el.__rikoInited ||= new Set();
  for (const name of names) {
    if (el.__rikoInited.has(name)) continue;
    const def = defs.get(name);
    if (!def) { console.warn(`[Riko] 未知组件 data-riko="${name}"`, el); continue; }
    el.__rikoInited.add(name);
    try {
      const inst = def.init(el);
      if (inst) {
        // 单组件：el.riko 即实例；多组件时 el.riko[name]
        if (names.length === 1) el.riko = inst;
        else (el.riko ||= {})[name] = inst;
      }
    } catch (err) { console.error(`[Riko] 初始化 ${name} 失败`, err, el); }
  }
}

function destroyEl(el) {
  if (!el.__rikoInited) return;
  for (const name of el.__rikoInited) defs.get(name)?.destroy?.(el);
  el.__rikoInited = null;
  el.riko = undefined;
}

const hooks = [];
/** 每次 init(root) 之后执行的钩子（如渲染 Lucide 图标） */
export const afterInit = fn => hooks.push(fn);

export function init(root = document) {
  const scope = root.nodeType === 1 || root.nodeType === 9 || root.nodeType === 11 ? root : document;
  if (scope.nodeType === 1 && scope.hasAttribute('data-riko')) initEl(scope);
  scope.querySelectorAll('[data-riko]').forEach(initEl);
  hooks.forEach(fn => { try { fn(scope); } catch (e) { console.error(e); } });
  return scope;
}

export function destroy(root) {
  if (root.nodeType === 1 && root.hasAttribute('data-riko')) destroyEl(root);
  root.querySelectorAll?.('[data-riko]').forEach(destroyEl);
}

/** 监听 DOM 变化，自动初始化新插入的组件、销毁被移除的组件 */
export function observe() {
  if (observer || typeof MutationObserver === 'undefined') return;
  const pending = new Set();
  let scheduled = false;
  observer = new MutationObserver(records => {
    for (const r of records) {
      r.addedNodes.forEach(n => n.nodeType === 1 && pending.add(n));
      r.removedNodes.forEach(n => { if (n.nodeType === 1 && !n.isConnected) destroy(n); });
      if (r.type === 'attributes' && r.target.isConnected) pending.add(r.target);
    }
    if (!scheduled && pending.size) {
      scheduled = true;
      queueMicrotask(() => {
        scheduled = false;
        const nodes = Array.from(pending).filter(n => n.isConnected);
        pending.clear();
        nodes.forEach(n => init(n));
      });
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-riko'] });
}
