/*! Riko UI v0.1.0 | MIT License | 内置图标来自 Lucide (ISC) */
(() => {
  // packages/core/src/js/core/registry.js
  var defs = /* @__PURE__ */ new Map();
  var observer = null;
  function register(def) {
    if (!def || !def.name || typeof def.init !== "function") throw new Error("[Riko] \u7EC4\u4EF6\u5B9A\u4E49\u7F3A\u5C11 name/init");
    defs.set(def.name, def);
  }
  var registered = () => Array.from(defs.keys());
  function initEl(el) {
    const names = (el.getAttribute("data-riko") || "").split(/\s+/).filter(Boolean);
    el.__rikoInited ||= /* @__PURE__ */ new Set();
    for (const name of names) {
      if (el.__rikoInited.has(name)) continue;
      const def = defs.get(name);
      if (!def) {
        console.warn(`[Riko] \u672A\u77E5\u7EC4\u4EF6 data-riko="${name}"`, el);
        continue;
      }
      el.__rikoInited.add(name);
      try {
        const inst = def.init(el);
        if (inst) {
          if (names.length === 1) el.riko = inst;
          else (el.riko ||= {})[name] = inst;
        }
      } catch (err) {
        console.error(`[Riko] \u521D\u59CB\u5316 ${name} \u5931\u8D25`, err, el);
      }
    }
  }
  function destroyEl(el) {
    if (!el.__rikoInited) return;
    for (const name of el.__rikoInited) defs.get(name)?.destroy?.(el);
    el.__rikoInited = null;
    el.riko = void 0;
  }
  var hooks = [];
  var afterInit = (fn) => hooks.push(fn);
  function init(root = document) {
    const scope = root.nodeType === 1 || root.nodeType === 9 || root.nodeType === 11 ? root : document;
    if (scope.nodeType === 1 && scope.hasAttribute("data-riko")) initEl(scope);
    scope.querySelectorAll("[data-riko]").forEach(initEl);
    hooks.forEach((fn) => {
      try {
        fn(scope);
      } catch (e) {
        console.error(e);
      }
    });
    return scope;
  }
  function destroy(root) {
    if (root.nodeType === 1 && root.hasAttribute("data-riko")) destroyEl(root);
    root.querySelectorAll?.("[data-riko]").forEach(destroyEl);
  }
  function observe() {
    if (observer || typeof MutationObserver === "undefined") return;
    const pending = /* @__PURE__ */ new Set();
    let scheduled = false;
    observer = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach((n) => n.nodeType === 1 && pending.add(n));
        r.removedNodes.forEach((n) => {
          if (n.nodeType === 1 && !n.isConnected) destroy(n);
        });
        if (r.type === "attributes" && r.target.isConnected) pending.add(r.target);
      }
      if (!scheduled && pending.size) {
        scheduled = true;
        queueMicrotask(() => {
          scheduled = false;
          const nodes = Array.from(pending).filter((n) => n.isConnected);
          pending.clear();
          nodes.forEach((n) => init(n));
        });
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-riko"] });
  }

  // packages/core/src/js/core/store.js
  var store = {
    get(key, fallback = null) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : v;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, String(value));
      } catch {
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {
      }
    },
    getJSON(key, fallback = null) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : JSON.parse(v);
      } catch {
        return fallback;
      }
    },
    setJSON(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
      }
    }
  };

  // packages/core/src/js/theme.js
  var MODES = ["system", "time", "light", "dark"];
  var config = { storageKey: "riko-theme", dayStart: 8, dayEnd: 18, root: null };
  var listeners = /* @__PURE__ */ new Set();
  var mode = null;
  var timer = null;
  var mq = null;
  var rootEl = () => config.root || document.documentElement;
  function resolve(m = mode) {
    if (m === "light" || m === "dark") return m;
    if (m === "time") {
      const h = (/* @__PURE__ */ new Date()).getHours();
      return h >= config.dayStart && h < config.dayEnd ? "light" : "dark";
    }
    return mq && mq.matches ? "dark" : "light";
  }
  function apply() {
    const resolved = resolve();
    const el = rootEl();
    const changed = el.getAttribute("data-theme") !== resolved || el.getAttribute("data-theme-mode") !== mode;
    el.setAttribute("data-theme", resolved);
    el.setAttribute("data-theme-mode", mode);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", getComputedStyle(el).getPropertyValue("--riko-color-bg").trim() || meta.content);
    if (changed) listeners.forEach((fn) => fn({ mode, theme: resolved }));
    if (changed) document.dispatchEvent(new CustomEvent("riko:theme:change", { detail: { mode, theme: resolved } }));
  }
  function schedule() {
    clearInterval(timer);
    if (mode === "time") timer = setInterval(apply, 6e4);
  }
  var theme = {
    MODES,
    /** 配置（需在 start 之前调用）：{ storageKey, dayStart, dayEnd, root } */
    configure(options = {}) {
      Object.assign(config, options);
      if (mode) apply();
      return this;
    },
    /** 读取保存的模式并应用；由 Riko 自动调用 */
    start() {
      if (mode) return this;
      mq = window.matchMedia("(prefers-color-scheme: dark)");
      const saved = store.get(config.storageKey);
      mode = MODES.includes(saved) ? saved : rootEl().getAttribute("data-theme-mode") || "system";
      if (!MODES.includes(mode)) mode = "system";
      mq.addEventListener("change", () => {
        if (mode === "system") apply();
      });
      window.addEventListener("storage", (e) => {
        if (e.key === config.storageKey) {
          mode = MODES.includes(e.newValue) ? e.newValue : "system";
          schedule();
          apply();
        }
      });
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden && mode === "time") apply();
      });
      schedule();
      apply();
      return this;
    },
    /** 当前模式：system | time | light | dark */
    get mode() {
      return mode || "system";
    },
    /** 实际生效的主题：light | dark */
    get current() {
      return resolve(this.mode);
    },
    /** 设置模式并保存 */
    set(next) {
      if (!MODES.includes(next)) throw new Error(`[Riko] \u672A\u77E5\u4E3B\u9898\u6A21\u5F0F "${next}"\uFF0C\u53EF\u9009\uFF1A${MODES.join(" / ")}`);
      if (!mode) this.start();
      mode = next;
      store.set(config.storageKey, next);
      schedule();
      apply();
    },
    /** 在浅色与深色之间切换（结果保存为固定模式） */
    toggle() {
      this.set(this.current === "dark" ? "light" : "dark");
    },
    /** 订阅变化，返回取消函数 */
    onChange(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }
  };
  var themeInitSnippet = (key = "riko-theme") => `(function(){try{var m=localStorage.getItem('${key}')||'system',h=new Date().getHours(),d=m==='dark'||(m==='time'&&(h<8||h>=18))||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');document.documentElement.setAttribute('data-theme-mode',m)}catch(e){}})();`;

  // packages/core/src/js/core/position.js
  function position(anchor, floating, { placement = "bottom", offset = 8, padding = 8, matchWidth = false } = {}) {
    const a = anchor.getBoundingClientRect();
    if (matchWidth) floating.style.minWidth = a.width + "px";
    floating.style.position = "fixed";
    floating.style.left = "0px";
    floating.style.top = "0px";
    const f = { width: floating.offsetWidth, height: floating.offsetHeight };
    const vw = document.documentElement.clientWidth, vh = window.innerHeight;
    let [side, align = "center"] = placement.split("-");
    const fits = (s) => s === "top" ? a.top - offset - f.height >= padding : s === "bottom" ? a.bottom + offset + f.height <= vh - padding : s === "left" ? a.left - offset - f.width >= padding : a.right + offset + f.width <= vw - padding;
    const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" };
    if (!fits(side) && fits(opposite[side])) side = opposite[side];
    let x, y;
    if (side === "top" || side === "bottom") {
      y = side === "top" ? a.top - offset - f.height : a.bottom + offset;
      x = align === "start" ? a.left : align === "end" ? a.right - f.width : a.left + a.width / 2 - f.width / 2;
    } else {
      x = side === "left" ? a.left - offset - f.width : a.right + offset;
      y = align === "start" ? a.top : align === "end" ? a.bottom - f.height : a.top + a.height / 2 - f.height / 2;
    }
    x = Math.min(Math.max(x, padding), vw - f.width - padding);
    y = Math.min(Math.max(y, padding), vh - f.height - padding);
    floating.style.left = Math.round(x) + "px";
    floating.style.top = Math.round(y) + "px";
    floating.setAttribute("data-placement", side);
    const arrowX = a.left + a.width / 2 - x, arrowY = a.top + a.height / 2 - y;
    floating.style.setProperty("--riko-arrow-x", Math.round(Math.min(Math.max(arrowX, 12), f.width - 12)) + "px");
    floating.style.setProperty("--riko-arrow-y", Math.round(Math.min(Math.max(arrowY, 12), f.height - 12)) + "px");
    return side;
  }
  function autoPosition(anchor, floating, options) {
    const update = () => position(anchor, floating, options);
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    ro.observe(floating);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }

  // packages/core/src/js/core/focus.js
  var FOCUSABLE = [
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    'input:not([disabled]):not([type="hidden"])',
    "select:not([disabled])",
    "textarea:not([disabled])",
    "iframe",
    "audio[controls]",
    "video[controls]",
    '[contenteditable]:not([contenteditable="false"])',
    '[tabindex]:not([tabindex="-1"])',
    "summary"
  ].join(",");
  function focusables(root) {
    return Array.from(root.querySelectorAll(FOCUSABLE)).filter((el) => !el.hasAttribute("inert") && !el.closest("[inert],[hidden]") && el.getClientRects().length > 0);
  }
  function trapFocus(root, { initial, returnFocus = true } = {}) {
    const previous = document.activeElement;
    const onKey = (e) => {
      if (e.key !== "Tab") return;
      const list = focusables(root);
      if (!list.length) {
        e.preventDefault();
        root.focus();
        return;
      }
      const first = list[0], last = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    requestAnimationFrame(() => {
      const target = initial && root.querySelector(initial) || root.querySelector("[autofocus]") || focusables(root)[0] || root;
      if (target === root && !root.hasAttribute("tabindex")) root.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
    return () => {
      document.removeEventListener("keydown", onKey, true);
      if (returnFocus && previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }
  var lockCount = 0;
  var savedOverflow = "";
  var savedPadding = "";
  function lockScroll() {
    if (lockCount++ === 0) {
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      savedOverflow = document.body.style.overflow;
      savedPadding = document.body.style.paddingRight;
      document.body.style.overflow = "hidden";
      if (sbw > 0) document.body.style.paddingRight = sbw + "px";
    }
    let released = false;
    return () => {
      if (released) return;
      released = true;
      if (--lockCount === 0) {
        document.body.style.overflow = savedOverflow;
        document.body.style.paddingRight = savedPadding;
      }
    };
  }

  // packages/core/src/js/core/dom.js
  var uidCounter = 0;
  var uid = (prefix = "riko") => `${prefix}-${(++uidCounter).toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  function ensureId(el, prefix) {
    if (!el.id) el.id = uid(prefix);
    return el.id;
  }
  function on(target, type, selectorOrFn, maybeFn, options) {
    const delegated = typeof selectorOrFn === "string";
    const fn = delegated ? maybeFn : selectorOrFn;
    const opts = delegated ? options : maybeFn;
    const handler = delegated ? (e) => {
      const match = e.target instanceof Element && e.target.closest(selectorOrFn);
      if (match && target.contains(match)) fn.call(match, e, match);
    } : fn;
    target.addEventListener(type, handler, opts);
    return () => target.removeEventListener(type, handler, opts);
  }
  function emit(el, name, detail = {}, cancelable = false) {
    return el.dispatchEvent(new CustomEvent(`riko:${name}`, { bubbles: true, cancelable, detail }));
  }
  var prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function afterAnimation(el, fallbackMs = 400) {
    return new Promise((resolve2) => {
      if (prefersReducedMotion()) return resolve2();
      const names = getComputedStyle(el).animationName;
      const hasAnim = names && names !== "none";
      const dur = parseFloat(getComputedStyle(el).transitionDuration) || 0;
      if (!hasAnim && !dur) return resolve2();
      let done = false;
      const finish = () => {
        if (!done) {
          done = true;
          resolve2();
        }
      };
      el.addEventListener(hasAnim ? "animationend" : "transitionend", finish, { once: true });
      setTimeout(finish, fallbackMs);
    });
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }
  function opt(el, name, fallback) {
    const v = el.getAttribute(`data-riko-${name}`);
    if (v === null) return fallback;
    if (typeof fallback === "number") return Number(v);
    if (typeof fallback === "boolean") return v !== "false";
    return v;
  }
  function debounce(fn, ms = 150) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  // packages/core/src/js/components/accordion.js
  var DURATION = 260;
  function animate(item, open) {
    const content = item.querySelector(":scope > .riko-accordion__content");
    if (!content || prefersReducedMotion() || !content.animate) {
      item.open = open;
      return Promise.resolve();
    }
    item.__rikoAnim?.cancel();
    const cs = getComputedStyle(content);
    const full = { height: "", paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, opacity: 1 };
    const zero = { height: "0px", paddingTop: "0px", paddingBottom: "0px", opacity: 0 };
    if (open) item.open = true;
    const h = content.scrollHeight + "px";
    full.height = h;
    content.style.overflow = "hidden";
    const anim = content.animate(open ? [zero, full] : [full, zero], { duration: DURATION, easing: "cubic-bezier(.22,.8,.3,1)" });
    item.__rikoAnim = anim;
    const settled = Promise.race([anim.finished, new Promise((r) => setTimeout(r, DURATION + 120))]);
    return settled.then(() => {
      if (item.__rikoAnim !== anim) return;
      if (!open) item.open = false;
      content.style.overflow = "";
      item.__rikoAnim = null;
    }).catch(() => {
      content.style.overflow = "";
    });
  }
  var accordion_default = {
    name: "accordion",
    init(root) {
      const items = () => Array.from(root.querySelectorAll(":scope > .riko-accordion__item"));
      const exclusive = root.classList.contains("riko-accordion--exclusive") || items().some((i) => i.hasAttribute("name"));
      if (exclusive) items().forEach((i) => i.removeAttribute("name"));
      const toggle = (item, open = !item.open) => {
        if (open === item.open && !item.__rikoAnim) return;
        if (open && exclusive) items().forEach((other) => {
          if (other !== item && other.open) animate(other, false);
        });
        animate(item, open);
        emit(item, "accordion:toggle", { item, open });
      };
      const off = on(root, "click", ".riko-accordion__summary", (e, summary) => {
        const item = summary.parentElement;
        if (!item || item.parentElement !== root) return;
        e.preventDefault();
        toggle(item);
      });
      root.__rikoAccordionOff = off;
      if (exclusive && !root.id) root.id = uid("riko-acc");
      return {
        open: (i) => toggle(typeof i === "number" ? items()[i] : i, true),
        close: (i) => toggle(typeof i === "number" ? items()[i] : i, false),
        toggle: (i) => toggle(typeof i === "number" ? items()[i] : i)
      };
    },
    destroy(root) {
      root.__rikoAccordionOff?.();
    }
  };

  // packages/core/src/js/components/autosize.js
  function resize(el) {
    const cs = getComputedStyle(el);
    const line = parseFloat(cs.lineHeight) || 24;
    const extra = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const maxRows = opt(el, "max-rows", 0);
    el.style.height = "auto";
    let h = el.scrollHeight + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    if (maxRows > 0) {
      const max = maxRows * line + extra;
      el.style.overflowY = h > max ? "auto" : "hidden";
      h = Math.min(h, max);
    }
    el.style.height = h + "px";
  }
  var autosize_default = {
    name: "autosize",
    init(el) {
      const update = () => resize(el);
      const off = on(el, "input", update);
      const offReset = el.form ? on(el.form, "reset", () => setTimeout(update, 0)) : null;
      const ro = new ResizeObserver(() => {
        if (el.offsetWidth !== el.__rikoW) {
          el.__rikoW = el.offsetWidth;
          update();
        }
      });
      ro.observe(el);
      update();
      el.__rikoAutosizeOff = () => {
        off();
        offReset?.();
        ro.disconnect();
      };
      return { update };
    },
    destroy(el) {
      el.__rikoAutosizeOff?.();
      el.style.height = "";
    }
  };

  // packages/core/src/js/components/backtop.js
  var backtop_default = {
    name: "backtop",
    init(el) {
      if (!el.hasAttribute("aria-label") && !el.textContent.trim()) el.setAttribute("aria-label", "\u8FD4\u56DE\u9876\u90E8");
      if (el.tagName === "BUTTON" && !el.hasAttribute("type")) el.setAttribute("type", "button");
      const threshold = opt(el, "offset", 400);
      let ticking = false;
      const update = () => {
        ticking = false;
        el.setAttribute("data-state", window.scrollY > threshold ? "shown" : "hidden");
      };
      const offs = [
        on(window, "scroll", () => {
          if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
          }
        }, { passive: true }),
        on(el, "click", (e) => {
          window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
          if (e.detail === 0) focusables(document.body).find((n) => n !== el)?.focus({ preventScroll: true });
        })
      ];
      update();
      el.__rikoBacktopOff = () => offs.forEach((f) => f());
      return { update };
    },
    destroy(el) {
      el.__rikoBacktopOff?.();
    }
  };

  // packages/core/src/js/components/carousel.js
  var carousel_default = {
    name: "carousel",
    init(root) {
      const track = root.querySelector(".riko-carousel__track");
      if (!track) return;
      const slides = () => Array.from(track.querySelectorAll(":scope > .riko-carousel__slide"));
      const total = slides().length;
      if (!root.hasAttribute("role")) root.setAttribute("role", "region");
      root.setAttribute("aria-roledescription", "\u8F6E\u64AD");
      track.setAttribute("tabindex", "0");
      slides().forEach((s, i) => {
        s.setAttribute("role", "group");
        s.setAttribute("aria-roledescription", "\u5E7B\u706F\u7247");
        if (!s.hasAttribute("aria-label")) s.setAttribute("aria-label", `${i + 1} / ${total}`);
      });
      const mk = (cls, label) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = cls;
        b.setAttribute("aria-label", label);
        return b;
      };
      let prev = root.querySelector(".riko-carousel__prev");
      let next = root.querySelector(".riko-carousel__next");
      if (!prev) {
        prev = mk("riko-carousel__prev", "\u4E0A\u4E00\u5F20");
        root.appendChild(prev);
      }
      if (!next) {
        next = mk("riko-carousel__next", "\u4E0B\u4E00\u5F20");
        root.appendChild(next);
      }
      let dots = root.querySelector(".riko-carousel__dots");
      if (!dots) {
        dots = document.createElement("div");
        dots.className = "riko-carousel__dots";
        track.after(dots);
      }
      if (!dots.querySelector(".riko-carousel__dot")) {
        dots.innerHTML = slides().map((_, i) => `<button type="button" class="riko-carousel__dot" aria-label="\u7B2C ${i + 1} \u5F20"></button>`).join("");
      }
      const dotEls = () => Array.from(dots.querySelectorAll(".riko-carousel__dot"));
      const offsetOf = (s) => {
        const center = getComputedStyle(s).scrollSnapAlign.includes("center");
        const left = s.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
        return center ? left - (track.clientWidth - s.offsetWidth) / 2 : left - parseFloat(getComputedStyle(track).paddingLeft || 0);
      };
      let index = 0;
      let settleTimer = 0;
      const maxScroll = () => track.scrollWidth - track.clientWidth - 2;
      const current = () => {
        const list = slides();
        let best = 0, dist = Infinity;
        list.forEach((s, i) => {
          const d = Math.abs(offsetOf(s) - track.scrollLeft);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        if (track.scrollLeft >= maxScroll()) best = Math.max(best, list.length - 1 - Math.max(0, Math.round(track.clientWidth / (list[0]?.offsetWidth || 1)) - 1));
        return best;
      };
      const sync = () => {
        const i = current();
        if (i !== index) {
          index = i;
          emit(root, "carousel:change", { index });
        }
        dotEls().forEach((d, j) => d.setAttribute("aria-current", String(j === index)));
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= maxScroll();
      };
      const goTo = (i) => {
        const list = slides();
        const n = (i + list.length) % list.length;
        track.scrollTo({ left: Math.max(0, Math.min(offsetOf(list[n]), track.scrollWidth - track.clientWidth)), behavior: prefersReducedMotion() ? "auto" : "smooth" });
        clearTimeout(settleTimer);
        settleTimer = setTimeout(sync, prefersReducedMotion() ? 30 : 500);
      };
      let raf = 0;
      const offs = [
        on(prev, "click", () => goTo(index - 1)),
        on(next, "click", () => goTo(index + 1)),
        on(dots, "click", ".riko-carousel__dot", (e, d) => goTo(dotEls().indexOf(d))),
        on(track, "scroll", () => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(sync);
        }, { passive: true }),
        on(track, "scrollend", sync),
        on(track, "keydown", (e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            goTo(index + 1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            goTo(index - 1);
          } else if (e.key === "Home") {
            e.preventDefault();
            goTo(0);
          } else if (e.key === "End") {
            e.preventDefault();
            goTo(slides().length - 1);
          }
        }),
        on(window, "resize", sync)
      ];
      const autoAttr = root.getAttribute("data-riko-autoplay");
      const interval = autoAttr === null ? 0 : parseInt(autoAttr, 10) || 5e3;
      let timer2 = 0, playing = false, hovering = false;
      let playBtn = null;
      const tick = () => {
        if (!hovering) goTo(index >= slides().length - 1 || track.scrollLeft >= maxScroll() ? 0 : index + 1);
      };
      const play = () => {
        if (!interval) return;
        playing = true;
        clearInterval(timer2);
        timer2 = setInterval(tick, interval);
        track.setAttribute("aria-live", "off");
        playBtn?.setAttribute("aria-pressed", "true");
        playBtn?.setAttribute("aria-label", "\u6682\u505C\u81EA\u52A8\u64AD\u653E");
      };
      const pause = () => {
        playing = false;
        clearInterval(timer2);
        track.setAttribute("aria-live", "polite");
        playBtn?.setAttribute("aria-pressed", "false");
        playBtn?.setAttribute("aria-label", "\u5F00\u59CB\u81EA\u52A8\u64AD\u653E");
      };
      track.setAttribute("aria-live", "polite");
      if (interval) {
        playBtn = mk("riko-carousel__play", "\u6682\u505C\u81EA\u52A8\u64AD\u653E");
        dots.appendChild(playBtn);
        offs.push(on(playBtn, "click", () => playing ? pause() : play()));
        offs.push(on(root, "pointerenter", () => {
          hovering = true;
        }), on(root, "pointerleave", () => {
          hovering = false;
        }));
        offs.push(on(root, "focusin", () => {
          hovering = true;
        }), on(root, "focusout", () => {
          hovering = false;
        }));
        if (prefersReducedMotion()) pause();
        else play();
      }
      sync();
      setTimeout(sync, 60);
      root.__rikoCarousel = () => {
        offs.forEach((f) => f());
        clearInterval(timer2);
      };
      return { goTo, next: () => goTo(index + 1), prev: () => goTo(index - 1), play, pause, get index() {
        return index;
      } };
    },
    destroy(root) {
      root.__rikoCarousel?.();
    }
  };

  // packages/core/src/js/components/combobox.js
  var labelOf = (o) => o.getAttribute("data-label") || (o.firstChild && o.firstChild.nodeType === 3 ? o.firstChild.nodeValue.trim() : "") || o.textContent.trim();
  var valueOf = (o) => o.getAttribute("data-value") ?? labelOf(o);
  var combobox_default = {
    name: "combobox",
    init(el) {
      const select = el.querySelector(":scope > select");
      let input = el.querySelector(".riko-combobox__input");
      let list = el.querySelector(".riko-combobox__list");
      if (select) {
        if (!input) {
          input = document.createElement("input");
          input.type = "text";
          input.className = "riko-combobox__input";
          input.placeholder = select.getAttribute("data-placeholder") || select.querySelector('option[value=""]')?.textContent || "\u8BF7\u9009\u62E9\u2026";
          const lab = select.id && document.querySelector(`label[for="${select.id}"]`);
          if (lab) {
            input.id = select.id + "-combobox";
            lab.htmlFor = input.id;
          }
          ["aria-label", "aria-labelledby", "aria-describedby", "required"].forEach((a) => select.hasAttribute(a) && input.setAttribute(a, select.getAttribute(a)));
          input.disabled = select.disabled;
          el.appendChild(input);
        }
        if (!list) {
          list = document.createElement("ul");
          list.className = "riko-combobox__list riko-listbox";
          let html = "";
          for (const child of select.children) {
            const opts = child.tagName === "OPTGROUP" ? Array.from(child.children) : [child];
            if (child.tagName === "OPTGROUP") html += `<li class="riko-listbox__group" role="presentation">${escapeHtml(child.label)}</li>`;
            for (const o of opts) {
              if (o.value === "") continue;
              html += `<li class="riko-listbox__option" data-value="${escapeHtml(o.value)}"${o.disabled ? ' aria-disabled="true"' : ""}>${escapeHtml(o.textContent.trim())}</li>`;
            }
          }
          list.innerHTML = html;
          el.appendChild(list);
        }
        select.tabIndex = -1;
        select.setAttribute("aria-hidden", "true");
      }
      if (!input || !list) {
        console.warn("[Riko] combobox \u9700\u8981 .riko-combobox__input \u4E0E .riko-combobox__list\uFF0C\u6216\u4E00\u4E2A <select>", el);
        return;
      }
      let hidden = el.querySelector(".riko-combobox__value");
      const name = opt(el, "name", "");
      if (!hidden && name && !select) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = name;
        hidden.className = "riko-combobox__value";
        el.appendChild(hidden);
      }
      ensureId(list, "riko-listbox");
      list.setAttribute("role", "listbox");
      list.tabIndex = -1;
      if (!list.hasAttribute("aria-label") && input.getAttribute("aria-label")) list.setAttribute("aria-label", input.getAttribute("aria-label"));
      input.setAttribute("role", "combobox");
      input.setAttribute("aria-autocomplete", "list");
      input.setAttribute("aria-expanded", "false");
      input.setAttribute("aria-controls", list.id);
      input.setAttribute("autocomplete", "off");
      const usePopover = typeof list.showPopover === "function";
      if (usePopover) list.setAttribute("popover", "manual");
      let options = [];
      let empty = list.querySelector(".riko-listbox__empty");
      const refresh = () => {
        options = Array.from(list.querySelectorAll(".riko-listbox__option"));
        options.forEach((o) => {
          ensureId(o, "riko-option");
          o.setAttribute("role", "option");
          if (!o.hasAttribute("aria-selected")) o.setAttribute("aria-selected", "false");
        });
        if (!empty) {
          empty = document.createElement("li");
          empty.className = "riko-listbox__empty";
          empty.setAttribute("role", "presentation");
          empty.textContent = opt(el, "empty", "\u6CA1\u6709\u627E\u5230\u5462\u2026\u2026\u6362\u4E2A\u5173\u952E\u8BCD\u8BD5\u8BD5\u5427 \u2726");
          list.appendChild(empty);
        }
        empty.hidden = true;
      };
      refresh();
      let selected = options.find((o) => o.getAttribute("aria-selected") === "true") || (select && select.value !== "" ? options.find((o) => valueOf(o) === select.value) : null) || (hidden && hidden.value ? options.find((o) => valueOf(o) === hidden.value) : null) || null;
      let activeOpt = null;
      let stopPos = null;
      const isOpen = () => input.getAttribute("aria-expanded") === "true";
      const visible = () => options.filter((o) => !o.hidden && o.getAttribute("aria-disabled") !== "true");
      const setActive = (o) => {
        if (activeOpt) activeOpt.removeAttribute("data-state");
        activeOpt = o || null;
        if (activeOpt) {
          activeOpt.setAttribute("data-state", "active");
          input.setAttribute("aria-activedescendant", activeOpt.id);
          activeOpt.scrollIntoView({ block: "nearest" });
        } else input.removeAttribute("aria-activedescendant");
      };
      const filter = (q) => {
        const needle = q.trim().toLowerCase();
        let n = 0;
        options.forEach((o) => {
          const hit = !needle || o.textContent.toLowerCase().includes(needle);
          o.hidden = !hit;
          if (hit) n++;
        });
        list.querySelectorAll(".riko-listbox__group").forEach((g) => {
          let sib = g.nextElementSibling, any = false;
          while (sib && !sib.classList.contains("riko-listbox__group")) {
            if (sib.classList.contains("riko-listbox__option") && !sib.hidden) any = true;
            sib = sib.nextElementSibling;
          }
          g.hidden = !any;
        });
        empty.hidden = n > 0;
        if (activeOpt && activeOpt.hidden) setActive(null);
      };
      const open = () => {
        if (isOpen() || input.disabled || input.readOnly) return;
        input.setAttribute("aria-expanded", "true");
        list.setAttribute("data-open", "");
        if (usePopover) {
          try {
            list.showPopover();
          } catch {
          }
        }
        filter(selected && input.value === labelOf(selected) ? "" : input.value);
        stopPos = autoPosition(input, list, { placement: "bottom-start", offset: 6, matchWidth: true });
        setActive(selected && !selected.hidden ? selected : visible()[0]);
        emit(el, "combobox:open");
      };
      const close = () => {
        if (!isOpen()) return;
        input.setAttribute("aria-expanded", "false");
        list.removeAttribute("data-open");
        if (usePopover) {
          try {
            list.hidePopover();
          } catch {
          }
        }
        stopPos?.();
        stopPos = null;
        setActive(null);
        emit(el, "combobox:close");
      };
      const commit = (o, silent) => {
        options.forEach((x) => x.setAttribute("aria-selected", String(x === o)));
        selected = o || null;
        const value = o ? valueOf(o) : "";
        input.value = o ? labelOf(o) : "";
        if (select && select.value !== value) {
          select.value = value;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
        if (hidden && hidden.value !== value) {
          hidden.value = value;
          hidden.dispatchEvent(new Event("change", { bubbles: true }));
        }
        if (!silent) emit(el, "combobox:change", { value, label: o ? labelOf(o) : "", option: o });
      };
      const move = (d) => {
        const v = visible();
        if (!v.length) return;
        const i = v.indexOf(activeOpt);
        setActive(v[i < 0 ? d > 0 ? 0 : v.length - 1 : Math.min(v.length - 1, Math.max(0, i + d))]);
      };
      if (selected) commit(selected, true);
      const offs = [
        on(input, "input", () => {
          open();
          filter(input.value);
          setActive(visible()[0]);
        }),
        on(input, "click", () => isOpen() ? close() : open()),
        on(input, "keydown", (e) => {
          switch (e.key) {
            case "ArrowDown":
              e.preventDefault();
              if (!isOpen()) open();
              else if (!e.altKey) move(1);
              break;
            case "ArrowUp":
              e.preventDefault();
              if (!isOpen()) {
                open();
                setActive(visible().at(-1));
              } else move(-1);
              break;
            case "Home":
              if (isOpen()) {
                e.preventDefault();
                setActive(visible()[0]);
              }
              break;
            case "End":
              if (isOpen()) {
                e.preventDefault();
                setActive(visible().at(-1));
              }
              break;
            case "PageDown":
              if (isOpen()) {
                e.preventDefault();
                move(5);
              }
              break;
            case "PageUp":
              if (isOpen()) {
                e.preventDefault();
                move(-5);
              }
              break;
            case "Enter":
              if (isOpen() && activeOpt) {
                e.preventDefault();
                commit(activeOpt);
                close();
              }
              break;
            case "Escape":
              if (isOpen()) {
                e.preventDefault();
                e.stopPropagation();
                close();
                if (selected) input.value = labelOf(selected);
              } else if (input.value) {
                e.preventDefault();
                commit(null);
              }
              break;
            case "Tab":
              if (isOpen()) close();
              break;
          }
        }),
        on(list, "mousedown", (e) => e.preventDefault()),
        on(list, "click", ".riko-listbox__option", (e, o) => {
          if (o.getAttribute("aria-disabled") === "true") return;
          commit(o);
          close();
          input.focus();
        }),
        on(list, "mousemove", ".riko-listbox__option", (e, o) => {
          if (o !== activeOpt && o.getAttribute("aria-disabled") !== "true") setActive(o);
        }),
        on(input, "blur", () => {
          close();
          if (!document.hasFocus()) return;
          const text = input.value.trim();
          if (!text) {
            if (selected) commit(null);
            return;
          }
          const exact = options.find((o) => labelOf(o).toLowerCase() === text.toLowerCase() && o.getAttribute("aria-disabled") !== "true");
          if (exact && exact !== selected) commit(exact);
          else input.value = selected ? labelOf(selected) : "";
        })
      ];
      el.__rikoComboOff = () => {
        close();
        offs.forEach((f) => f());
      };
      return {
        input,
        list,
        open,
        close,
        refresh,
        get value() {
          return selected ? valueOf(selected) : "";
        },
        setValue(v) {
          commit(options.find((o) => valueOf(o) === String(v)) || null);
        }
      };
    },
    destroy(el) {
      el.__rikoComboOff?.();
    }
  };

  // packages/core/src/js/components/command.js
  var command_default = {
    name: "command",
    init(el) {
      if (el.tagName !== "DIALOG") {
        console.warn("[Riko] riko-command \u9700\u8981\u4F7F\u7528 <dialog> \u5143\u7D20", el);
        return null;
      }
      const input = el.querySelector(".riko-command__input");
      const list = el.querySelector(".riko-command__list");
      const empty = el.querySelector(".riko-command__empty");
      if (!input || !list) return null;
      const id = ensureId(el, "riko-command");
      const items = Array.from(el.querySelectorAll(".riko-command__item"));
      const groups = Array.from(el.querySelectorAll(".riko-command__group"));
      if (!el.hasAttribute("aria-label") && !el.hasAttribute("aria-labelledby")) el.setAttribute("aria-label", "\u5FEB\u901F\u641C\u7D22");
      list.setAttribute("role", "listbox");
      ensureId(list, "riko-command-list");
      input.setAttribute("role", "combobox");
      input.setAttribute("aria-expanded", "true");
      input.setAttribute("aria-controls", list.id);
      input.setAttribute("aria-autocomplete", "list");
      input.setAttribute("autocomplete", "off");
      input.setAttribute("spellcheck", "false");
      groups.forEach((g) => {
        g.setAttribute("role", "group");
        const label = g.querySelector(".riko-command__group-label");
        if (label && !g.hasAttribute("aria-label")) g.setAttribute("aria-labelledby", ensureId(label, "riko-command-group"));
        label?.setAttribute("role", "presentation");
      });
      items.forEach((item) => {
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", "false");
        item.tabIndex = -1;
        ensureId(item, "riko-command-item");
        const text = item.querySelector(".riko-command__text") || item;
        item.__rikoSearch = (item.textContent + " " + (item.getAttribute("data-riko-keywords") || "")).toLowerCase();
        item.__rikoTextEl = text;
        item.__rikoTextHtml = text.innerHTML;
      });
      if (empty) empty.setAttribute("role", "status");
      let active2 = -1, release = null, previous = null, navigating = false;
      const visible = () => items.filter((i) => !i.hidden);
      const setActive = (idx) => {
        const vis = visible();
        items.forEach((i) => i.setAttribute("aria-selected", "false"));
        if (!vis.length) {
          active2 = -1;
          input.removeAttribute("aria-activedescendant");
          return;
        }
        active2 = (idx + vis.length) % vis.length;
        const cur = vis[active2];
        cur.setAttribute("aria-selected", "true");
        input.setAttribute("aria-activedescendant", cur.id);
        const lr = list.getBoundingClientRect(), cr = cur.getBoundingClientRect();
        if (cr.top < lr.top) list.scrollTop -= lr.top - cr.top + 8;
        else if (cr.bottom > lr.bottom) list.scrollTop += cr.bottom - lr.bottom + 8;
      };
      const mark = (item, q) => {
        const box = item.__rikoTextEl;
        box.innerHTML = item.__rikoTextHtml;
        if (!q) return;
        const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const i = n.data.toLowerCase().indexOf(q);
          if (i < 0) continue;
          const m = document.createElement("mark");
          const after = n.splitText(i);
          after.splitText(q.length);
          m.textContent = after.data;
          after.replaceWith(m);
          return;
        }
      };
      const filter = (query = input.value) => {
        const q = query.trim().toLowerCase();
        const terms = q.split(/\s+/).filter(Boolean);
        items.forEach((item) => {
          item.hidden = !terms.every((t) => item.__rikoSearch.includes(t));
          mark(item, item.hidden ? "" : terms[0] || "");
        });
        groups.forEach((g) => {
          g.hidden = !g.querySelector(".riko-command__item:not([hidden])");
        });
        const count = visible().length;
        if (empty) empty.hidden = count > 0;
        list.hidden = count === 0;
        setActive(0);
        emit(el, "command:filter", { query, count });
      };
      const open = () => {
        if (el.open) return;
        previous = document.activeElement;
        el.removeAttribute("data-state");
        el.showModal();
        release = lockScroll();
        input.value = "";
        filter("");
        input.focus();
        emit(el, "command:open");
      };
      const close = () => {
        if (!el.open || el.getAttribute("data-state") === "closing") return;
        const done = () => {
          el.removeAttribute("data-state");
          el.close();
          release?.();
          release = null;
          if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
          emit(el, "command:close");
        };
        if (prefersReducedMotion()) return done();
        el.setAttribute("data-state", "closing");
        setTimeout(done, 180);
      };
      const select = (item) => {
        if (!item) return;
        const ok = emit(el, "command:select", { item, value: item.getAttribute("data-value") ?? item.textContent.trim(), query: input.value }, true);
        close();
        if (ok && item.tagName === "A" && item.href) setTimeout(() => {
          navigating = true;
          item.click();
          navigating = false;
        }, 0);
      };
      const hotkey = opt(el, "hotkey", "").toLowerCase();
      const offs = [
        on(input, "input", () => filter()),
        on(input, "keydown", (e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive(active2 + 1);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive(active2 - 1);
          } else if (e.key === "Enter") {
            e.preventDefault();
            select(visible()[active2]);
          }
        }),
        on(list, "click", ".riko-command__item", (e, item) => {
          if (navigating) return;
          e.preventDefault();
          select(item);
        }),
        on(list, "pointermove", ".riko-command__item", (e, item) => {
          const i = visible().indexOf(item);
          if (i !== active2) setActive(i);
        }),
        on(el, "cancel", (e) => {
          e.preventDefault();
          close();
        }),
        on(el, "click", (e) => {
          if (e.target !== el) return;
          const r = el.getBoundingClientRect();
          if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
        }),
        on(document, "click", `[data-riko-open="${CSS.escape(id)}"]`, (e) => {
          e.preventDefault();
          open();
        })
      ];
      if (hotkey) offs.push(on(document, "keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === hotkey) {
          e.preventDefault();
          el.open ? close() : open();
        }
      }));
      el.__rikoCommandOff = () => {
        offs.forEach((f) => f());
        release?.();
      };
      return { __modal: true, open, close, toggle: () => el.open ? close() : open(), filter: (q) => {
        input.value = q;
        filter(q);
      }, get isOpen() {
        return el.open;
      } };
    },
    destroy(el) {
      el.__rikoCommandOff?.();
    }
  };

  // packages/core/src/js/components/copy.js
  var live = null;
  function announce(msg) {
    if (!live) {
      live = document.createElement("div");
      live.className = "riko-u-sr-only";
      live.setAttribute("aria-live", "polite");
      document.body.appendChild(live);
    }
    live.textContent = "";
    setTimeout(() => {
      live.textContent = msg;
    }, 30);
  }
  async function copyText(text) {
    try {
      if (!navigator.clipboard) throw new Error("no clipboard");
      await Promise.race([navigator.clipboard.writeText(text), new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 1500))]);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      ta.remove();
      return ok;
    }
  }
  function sourceText(el) {
    const direct = el.getAttribute("data-riko-copy");
    if (direct !== null) return direct;
    const sel = opt(el, "target", "");
    const target = sel && document.querySelector(sel);
    if (!target) return "";
    return "value" in target && typeof target.value === "string" ? target.value : target.textContent;
  }
  var copy_default = {
    name: "copy",
    init(el) {
      if (!el.innerHTML.trim()) el.innerHTML = '<span class="riko-copy__icon" aria-hidden="true"></span>';
      if (!el.textContent.trim() && !el.hasAttribute("aria-label") && !el.hasAttribute("aria-labelledby")) el.setAttribute("aria-label", "\u590D\u5236");
      if (el.tagName === "BUTTON" && !el.hasAttribute("type")) el.setAttribute("type", "button");
      let timer2;
      const copy2 = async () => {
        const text = sourceText(el);
        const ok = await copyText(text);
        clearTimeout(timer2);
        if (ok) {
          el.setAttribute("data-state", "copied");
          announce(opt(el, "copied-text", "\u5DF2\u590D\u5236"));
          emit(el, "copy:success", { text });
          timer2 = setTimeout(() => el.removeAttribute("data-state"), 1800);
        } else {
          announce("\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u590D\u5236");
          emit(el, "copy:error", { text });
        }
        return ok;
      };
      el.__rikoCopyOff = on(el, "click", copy2);
      return { copy: copy2 };
    },
    destroy(el) {
      el.__rikoCopyOff?.();
    }
  };
  var api = { copy: copyText };

  // packages/core/src/js/components/dialog.js
  var MODAL_SELECTOR = "dialog.riko-dialog, dialog.riko-drawer";
  function setupModal(el, kind) {
    if (el.riko && typeof el.riko.open === "function") return el.riko;
    if (el.tagName !== "DIALOG") {
      console.warn(`[Riko] riko-${kind} \u5FC5\u987B\u662F <dialog> \u5143\u7D20`, el);
      return null;
    }
    let releaseScroll = null, releaseFocus = null, closing = false;
    const isStatic = () => opt(el, "backdrop", "") === "static";
    const triggers = () => el.id ? document.querySelectorAll(`[data-riko-open="${CSS.escape(el.id)}"]`) : [];
    const syncTriggers = (open) => triggers().forEach((t) => {
      t.setAttribute("aria-haspopup", "dialog");
      t.setAttribute("aria-controls", el.id);
      t.setAttribute("aria-expanded", String(open));
    });
    function cleanup() {
      releaseFocus?.();
      releaseFocus = null;
      releaseScroll?.();
      releaseScroll = null;
      el.removeAttribute("data-state");
      closing = false;
      syncTriggers(false);
    }
    const inst = {
      __modal: true,
      get isOpen() {
        return el.open;
      },
      open() {
        if (el.open) return inst;
        if (!el.isConnected) document.body.appendChild(el);
        if (!emit(el, `${kind}:open`, { id: el.id }, true)) return inst;
        el.removeAttribute("data-state");
        el.showModal();
        releaseScroll = lockScroll();
        releaseFocus = trapFocus(el);
        syncTriggers(true);
        emit(el, `${kind}:opened`, { id: el.id });
        return inst;
      },
      async close(returnValue) {
        if (!el.open || closing) return inst;
        closing = true;
        el.setAttribute("data-state", "closing");
        await afterAnimation(el, 320);
        el.close(returnValue === void 0 ? void 0 : String(returnValue));
        return inst;
      },
      toggle() {
        return el.open ? inst.close() : inst.open();
      }
    };
    const offs = [
      on(el, "close", () => {
        cleanup();
        emit(el, `${kind}:close`, { id: el.id, returnValue: el.returnValue });
      }),
      on(el, "cancel", (e) => {
        e.preventDefault();
        if (!isStatic()) inst.close();
      }),
      // 点击遮罩（dialog 自身、且在内容框之外）
      on(el, "click", (e) => {
        if (e.target !== el || isStatic()) return;
        const r = el.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) inst.close();
      }),
      // <form method="dialog"> 提交时也走动画关闭，并把提交按钮的 value 作为 returnValue
      on(el, "submit", (e) => {
        const form = e.target;
        if (form.getAttribute("method") !== "dialog") return;
        e.preventDefault();
        inst.close(e.submitter?.value ?? "");
      })
    ];
    el.__rikoOff = () => offs.forEach((f) => f());
    syncTriggers(el.open);
    return inst;
  }
  function destroyModal(el) {
    if (el.open) el.close();
    el.__rikoOff?.();
  }
  var resolveEl = (target) => typeof target === "string" ? document.getElementById(target) : target;
  function instanceOf(target) {
    const el = resolveEl(target);
    if (!el) return null;
    if (el.riko && typeof el.riko.open === "function") return el.riko;
    const kind = el.classList.contains("riko-drawer") ? "drawer" : "dialog";
    const inst = setupModal(el, kind);
    if (inst) el.riko = inst;
    return inst;
  }
  if (typeof document !== "undefined" && !document.__rikoModalDelegation) {
    document.__rikoModalDelegation = true;
    document.addEventListener("click", (e) => {
      if (!(e.target instanceof Element)) return;
      const opener = e.target.closest("[data-riko-open]");
      if (opener) {
        const inst = instanceOf(opener.getAttribute("data-riko-open"));
        if (inst) {
          e.preventDefault();
          inst.open();
        } else console.warn(`[Riko] \u627E\u4E0D\u5230 id \u4E3A "${opener.getAttribute("data-riko-open")}" \u7684 <dialog>`);
        return;
      }
      const closer = e.target.closest("[data-riko-close]");
      if (!closer) return;
      const modal = closer.closest(MODAL_SELECTOR);
      if (!modal) return;
      e.preventDefault();
      const value = closer.getAttribute("data-riko-close");
      instanceOf(modal)?.close(value || void 0);
    });
  }
  var TONE_ICON = { danger: "danger", warning: "warning", info: "info", success: "success" };
  function buildDialog({ title, message, tone, buttons }) {
    const id = uid("riko-confirm");
    const el = document.createElement("dialog");
    el.className = "riko-dialog riko-dialog--sm riko-dialog--confirm" + (TONE_ICON[tone] ? " riko-dialog--" + TONE_ICON[tone] : "");
    el.id = id;
    el.setAttribute("aria-labelledby", id + "-title");
    if (message) el.setAttribute("aria-describedby", id + "-desc");
    if (tone === "danger" || tone === "warning") el.setAttribute("role", "alertdialog");
    el.innerHTML = `<header class="riko-dialog__header"><span class="riko-dialog__icon" aria-hidden="true"></span><h2 class="riko-dialog__title" id="${id}-title">${escapeHtml(title)}</h2></header>` + (message ? `<div class="riko-dialog__body"><p class="riko-dialog__desc" id="${id}-desc">${escapeHtml(message)}</p></div>` : "") + `<footer class="riko-dialog__footer">${buttons.map((b) => `<button type="button" class="riko-btn ${b.className}" data-riko-close="${b.value}"${b.autofocus ? " autofocus" : ""}>${escapeHtml(b.label)}</button>`).join("")}</footer>`;
    document.body.appendChild(el);
    return el;
  }
  function run(el, resolveWith) {
    return new Promise((resolve2) => {
      const inst = setupModal(el, "dialog");
      el.riko = inst;
      el.addEventListener("close", () => {
        resolve2(resolveWith(el.returnValue));
        el.__rikoOff?.();
        setTimeout(() => el.remove(), 0);
      }, { once: true });
      inst.open();
    });
  }
  function confirm(options = {}) {
    const o = typeof options === "string" ? { message: options } : options;
    const tone = o.tone || "accent";
    const el = buildDialog({
      title: o.title || "\u786E\u5B9A\u8981\u8FD9\u6837\u505A\u5417\uFF1F",
      message: o.message || "",
      tone,
      buttons: [
        { label: o.cancelText || "\u53D6\u6D88", value: "cancel", className: "riko-btn--ghost", autofocus: tone === "danger" },
        { label: o.confirmText || "\u786E\u5B9A", value: "confirm", className: tone === "danger" ? "riko-btn--danger" : "riko-btn--primary", autofocus: tone !== "danger" }
      ]
    });
    return run(el, (v) => v === "confirm");
  }
  function alert(options = {}) {
    const o = typeof options === "string" ? { message: options } : options;
    const el = buildDialog({
      title: o.title || "\u63D0\u793A",
      message: o.message || "",
      tone: o.tone || "info",
      buttons: [{ label: o.okText || "\u597D\u7684", value: "ok", className: "riko-btn--primary", autofocus: true }]
    });
    return run(el, () => void 0);
  }
  var api2 = {
    dialog: {
      open: (target) => instanceOf(target)?.open(),
      close: (target, value) => instanceOf(target)?.close(value),
      toggle: (target) => instanceOf(target)?.toggle(),
      get: (target) => instanceOf(target)
    },
    confirm,
    alert
  };
  var dialog_default = {
    name: "dialog",
    init(el) {
      ensureId(el, "riko-dialog");
      return setupModal(el, "dialog");
    },
    destroy: destroyModal
  };

  // packages/core/src/js/components/drawer.js
  var drawer_default = {
    name: "drawer",
    init(el) {
      ensureId(el, "riko-drawer");
      return setupModal(el, "drawer");
    },
    destroy: destroyModal
  };

  // packages/core/src/js/components/dropdown.js
  var ITEM = ".riko-menu__item";
  var enabled = (n) => !n.disabled && n.getAttribute("aria-disabled") !== "true" && n.getClientRects().length > 0;
  var dropdown_default = {
    name: "dropdown",
    init(el) {
      const trigger = el.querySelector(":scope > [aria-haspopup]") || el.querySelector(":scope > button, :scope > a");
      const menu = el.querySelector(":scope > .riko-menu");
      if (!trigger || !menu) return null;
      trigger.setAttribute("aria-haspopup", "menu");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-controls", ensureId(menu, "riko-menu"));
      menu.setAttribute("role", "menu");
      menu.setAttribute("aria-labelledby", ensureId(trigger, "riko-menu-trigger"));
      menu.hidden = true;
      menu.querySelectorAll(ITEM).forEach((n) => {
        if (!n.hasAttribute("role")) n.setAttribute("role", "menuitem");
        n.tabIndex = -1;
        if (n.tagName === "BUTTON" && !n.hasAttribute("type")) n.setAttribute("type", "button");
      });
      menu.querySelectorAll(".riko-menu__separator").forEach((n) => n.setAttribute("role", "separator"));
      menu.querySelectorAll(".riko-menu__label").forEach((n) => n.setAttribute("role", "presentation"));
      const items = () => Array.from(menu.querySelectorAll(ITEM)).filter(enabled);
      let stop = null, typed = "", typedTimer;
      const isOpen = () => !menu.hidden;
      const open = (focus = "first") => {
        if (!isOpen()) {
          menu.hidden = false;
          menu.setAttribute("data-state", "open");
          trigger.setAttribute("aria-expanded", "true");
          stop = autoPosition(trigger, menu, { placement: opt(el, "placement", "bottom-start"), offset: 8 });
          emit(el, "dropdown:open");
        }
        const list = items();
        if (focus === "first") list[0]?.focus();
        else if (focus === "last") list[list.length - 1]?.focus();
      };
      const close = ({ focusTrigger = false } = {}) => {
        if (!isOpen()) return;
        menu.hidden = true;
        menu.removeAttribute("data-state");
        trigger.setAttribute("aria-expanded", "false");
        stop?.();
        stop = null;
        if (focusTrigger) trigger.focus();
        emit(el, "dropdown:close");
      };
      const activate = (item) => {
        const role = item.getAttribute("role");
        if (role === "menuitemcheckbox") item.setAttribute("aria-checked", String(item.getAttribute("aria-checked") !== "true"));
        if (role === "menuitemradio") {
          const scope = item.closest('[role="group"]') || menu;
          scope.querySelectorAll('[role="menuitemradio"]').forEach((r) => r.setAttribute("aria-checked", String(r === item)));
        }
        emit(el, "dropdown:select", { item, value: item.getAttribute("data-value") ?? item.textContent.trim(), checked: item.getAttribute("aria-checked") === "true" });
        if (!item.hasAttribute("data-riko-keep-open")) close({ focusTrigger: true });
      };
      const offs = [
        on(trigger, "click", (e) => {
          e.preventDefault();
          isOpen() ? close() : open(e.detail === 0 ? "first" : "none");
        }),
        on(trigger, "keydown", (e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            open("first");
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            open("last");
          }
        }),
        on(menu, "click", ITEM, (e, item) => {
          if (enabled(item)) activate(item);
        }),
        on(menu, "keydown", (e) => {
          const list = items();
          const i = list.indexOf(document.activeElement);
          switch (e.key) {
            case "ArrowDown":
              e.preventDefault();
              list[(i + 1) % list.length]?.focus();
              break;
            case "ArrowUp":
              e.preventDefault();
              list[(i - 1 + list.length) % list.length]?.focus();
              break;
            case "Home":
              e.preventDefault();
              list[0]?.focus();
              break;
            case "End":
              e.preventDefault();
              list[list.length - 1]?.focus();
              break;
            case "Escape":
              e.preventDefault();
              close({ focusTrigger: true });
              break;
            case "Tab":
              close();
              break;
            case "Enter":
            case " ":
              if (i >= 0 && list[i].tagName !== "A") {
                e.preventDefault();
                activate(list[i]);
              } else if (i >= 0 && e.key === "Enter") close();
              break;
            default:
              if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                clearTimeout(typedTimer);
                typed += e.key.toLowerCase();
                typedTimer = setTimeout(() => typed = "", 600);
                const order = list.slice(i + 1).concat(list.slice(0, i + 1));
                order.find((n) => n.textContent.trim().toLowerCase().startsWith(typed))?.focus();
              }
          }
        }),
        on(document, "pointerdown", (e) => {
          if (isOpen() && !el.contains(e.target)) close();
        }),
        on(el, "focusout", (e) => {
          if (isOpen() && e.relatedTarget && !el.contains(e.relatedTarget)) close();
        })
      ];
      el.__rikoDropdownOff = () => {
        offs.forEach((f) => f());
        stop?.();
      };
      return { open: () => open("first"), close: () => close(), toggle: () => isOpen() ? close() : open("first"), get isOpen() {
        return isOpen();
      } };
    },
    destroy(el) {
      el.__rikoDropdownOff?.();
    }
  };

  // packages/core/src/js/components/dropzone.js
  var parseSize = (s) => {
    if (!s) return Infinity;
    const m = String(s).trim().match(/^([\d.]+)\s*(b|kb|mb|gb)?$/i);
    if (!m) return Infinity;
    return parseFloat(m[1]) * { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3 }[(m[2] || "b").toLowerCase()];
  };
  var formatSize = (n) => n < 1024 ? `${n} B` : n < 1024 ** 2 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 ** 2).toFixed(1)} MB`;
  function accepts(file, accept) {
    if (!accept) return true;
    return accept.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean).some((rule) => rule.startsWith(".") ? file.name.toLowerCase().endsWith(rule) : rule.endsWith("/*") ? file.type.toLowerCase().startsWith(rule.slice(0, -1)) : file.type.toLowerCase() === rule);
  }
  var dropzone_default = {
    name: "dropzone",
    init(el) {
      const input = el.querySelector(".riko-dropzone__input") || el.querySelector('input[type="file"]');
      const area = el.querySelector(".riko-dropzone__area") || el;
      if (!input) return;
      let list = el.querySelector(".riko-dropzone__list");
      if (!list) {
        list = document.createElement("ul");
        list.className = "riko-dropzone__list";
        list.setAttribute("aria-live", "polite");
        el.appendChild(list);
      }
      const maxSize = parseSize(opt(el, "max-size", ""));
      const maxFiles = opt(el, "max-files", input.multiple ? Infinity : 1);
      let files = [];
      let rejected = [];
      const urls = /* @__PURE__ */ new Map();
      const syncInput = () => {
        try {
          const dt = new DataTransfer();
          files.forEach((f) => dt.items.add(f));
          input.files = dt.files;
        } catch {
        }
      };
      const thumb = (f) => {
        if (!f.type.startsWith("image/")) return "";
        if (!urls.has(f)) urls.set(f, URL.createObjectURL(f));
        return `<img src="${urls.get(f)}" alt="">`;
      };
      const render = () => {
        list.innerHTML = files.map((f, i) => `<li class="riko-dropzone__file"><span class="riko-dropzone__thumb">${thumb(f)}</span><span class="riko-dropzone__meta"><span class="riko-dropzone__name">${escapeHtml(f.name)}</span><span class="riko-dropzone__size">${formatSize(f.size)}</span></span><button type="button" class="riko-dropzone__remove" data-index="${i}" aria-label="\u79FB\u9664 ${escapeHtml(f.name)}"></button></li>`).join("") + rejected.map((r) => `<li class="riko-dropzone__file" aria-invalid="true"><span class="riko-dropzone__thumb"></span><span class="riko-dropzone__meta"><span class="riko-dropzone__name">${escapeHtml(r.file.name)}</span><span class="riko-dropzone__size">${escapeHtml(r.reason)}</span></span><button type="button" class="riko-dropzone__remove" data-rejected="${escapeHtml(r.file.name)}" aria-label="\u5FFD\u7565 ${escapeHtml(r.file.name)}"></button></li>`).join("");
      };
      const changed = () => {
        syncInput();
        render();
        emit(el, "dropzone:change", { files: files.slice() });
      };
      const addFiles = (incoming) => {
        rejected = [];
        const next = input.multiple ? files.slice() : [];
        for (const f of incoming) {
          let reason = "";
          if (!accepts(f, input.accept)) reason = "\u6587\u4EF6\u7C7B\u578B\u4E0D\u652F\u6301";
          else if (f.size > maxSize) reason = `\u8D85\u8FC7 ${formatSize(maxSize)} \u7684\u5927\u5C0F\u9650\u5236`;
          else if (next.length >= maxFiles) reason = `\u6700\u591A\u53EA\u80FD\u9009\u62E9 ${maxFiles} \u4E2A\u6587\u4EF6`;
          else if (next.some((x) => x.name === f.name && x.size === f.size)) continue;
          if (reason) {
            rejected.push({ file: f, reason });
            emit(el, "dropzone:reject", { file: f, reason });
          } else next.push(f);
        }
        files.filter((f) => !next.includes(f)).forEach((f) => {
          URL.revokeObjectURL(urls.get(f));
          urls.delete(f);
        });
        files = next;
        changed();
      };
      let depth = 0;
      const setDrag = (v) => v ? el.setAttribute("data-state", "dragover") : el.removeAttribute("data-state");
      const offs = [
        on(input, "change", () => {
          const picked = Array.from(input.files);
          if (!picked.length) {
            syncInput();
            return;
          }
          addFiles(picked);
        }),
        on(area, "dragenter", (e) => {
          if (input.disabled) return;
          e.preventDefault();
          depth++;
          setDrag(true);
        }),
        on(area, "dragover", (e) => {
          if (input.disabled) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }),
        on(area, "dragleave", () => {
          if (--depth <= 0) {
            depth = 0;
            setDrag(false);
          }
        }),
        on(area, "drop", (e) => {
          if (input.disabled) return;
          e.preventDefault();
          depth = 0;
          setDrag(false);
          addFiles(Array.from(e.dataTransfer.files));
        }),
        on(list, "click", ".riko-dropzone__remove", (e, b) => {
          if (b.dataset.rejected !== void 0) rejected = rejected.filter((r) => r.file.name !== b.dataset.rejected);
          else {
            const [f] = files.splice(+b.dataset.index, 1);
            if (f) {
              URL.revokeObjectURL(urls.get(f));
              urls.delete(f);
            }
          }
          changed();
          input.focus();
        })
      ];
      el.__rikoDropOff = () => {
        offs.forEach((f) => f());
        urls.forEach((u) => URL.revokeObjectURL(u));
      };
      return {
        get files() {
          return files.slice();
        },
        add: (list2) => addFiles(Array.from(list2)),
        remove(i) {
          files.splice(i, 1);
          changed();
        },
        clear() {
          files = [];
          rejected = [];
          changed();
        }
      };
    },
    destroy(el) {
      el.__rikoDropOff?.();
    }
  };

  // packages/core/src/js/components/field.js
  var CONTROL = 'input:not([type="hidden"]), textarea, select';
  var field_default = {
    name: "field",
    init(el) {
      const control = el.querySelector(CONTROL);
      if (!control) return;
      const id = ensureId(control, "riko-field");
      const label = el.querySelector(".riko-field__label");
      if (label && label.tagName === "LABEL" && !label.htmlFor) label.htmlFor = id;
      const hint = el.querySelector(".riko-field__hint");
      const error = el.querySelector(".riko-field__error");
      const counter = el.querySelector(".riko-field__counter");
      let invalidByUs = false;
      const describe = () => {
        const own = (control.getAttribute("aria-describedby") || "").split(/\s+/).filter((x) => x && ![hint, error, counter].some((n) => n && n.id === x));
        const ids = [hint, error && !error.hidden ? error : null, counter].filter(Boolean).map((n) => ensureId(n, "riko-field"));
        const all = [...own, ...ids];
        if (all.length) control.setAttribute("aria-describedby", all.join(" "));
        else control.removeAttribute("aria-describedby");
        if (error) {
          if (!error.hidden && error.textContent.trim()) {
            control.setAttribute("aria-invalid", "true");
            invalidByUs = true;
          } else if (invalidByUs) {
            control.removeAttribute("aria-invalid");
            invalidByUs = false;
          }
        }
      };
      if (error) error.setAttribute("aria-live", "polite");
      let offInput = null;
      const count = () => {
        const max = Number(control.getAttribute("maxlength")) || Number(counter.getAttribute("data-riko-max")) || 0;
        const len = [...control.value].length;
        counter.textContent = max ? `${len} / ${max}` : String(len);
        counter.setAttribute("data-state", max && len > max ? "over" : "ok");
      };
      if (counter) {
        offInput = on(control, "input", count);
        count();
      }
      const form = control.form;
      const offReset = counter && form ? on(form, "reset", () => setTimeout(count, 0)) : null;
      const mo = error ? new MutationObserver(describe) : null;
      mo?.observe(error, { attributes: true, attributeFilter: ["hidden"], childList: true, characterData: true, subtree: true });
      describe();
      el.__rikoFieldOff = () => {
        offInput?.();
        offReset?.();
        mo?.disconnect();
      };
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
          control.removeAttribute("aria-invalid");
        },
        update() {
          describe();
          if (counter) count();
        }
      };
    },
    destroy(el) {
      el.__rikoFieldOff?.();
    }
  };

  // packages/core/src/js/components/form-validate.js
  var CONTROLS = 'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, select';
  function labelText(control) {
    const field = control.closest(".riko-field");
    const lab = field?.querySelector(".riko-field__label") || control.id && document.querySelector(`label[for="${CSS.escape(control.id)}"]`);
    if (lab) {
      const clone = lab.cloneNode(true);
      clone.querySelectorAll(".riko-field__required, .riko-field__optional").forEach((n) => n.remove());
      return clone.textContent.trim();
    }
    return control.getAttribute("aria-label") || "";
  }
  function messageFor(control, form) {
    const v = control.validity;
    const custom = (k) => control.getAttribute(`data-riko-message-${k}`);
    const label = labelText(control);
    const len = [...control.value].length;
    if (v.valueMissing) {
      return custom("required") || (control.type === "checkbox" ? "\u8BF7\u5148\u52FE\u9009\u8FD9\u4E00\u9879\u54E6" : control.type === "radio" || control.tagName === "SELECT" ? `\u8BF7\u9009\u62E9${label || "\u4E00\u9879"}` : control.type === "file" ? "\u8BF7\u9009\u62E9\u8981\u4E0A\u4F20\u7684\u6587\u4EF6" : `${label || "\u8FD9\u91CC"}\u8FD8\u7A7A\u7740\u54E6\uFF0C\u8BF7\u586B\u5199\u4E00\u4E0B`);
    }
    if (v.typeMismatch || v.badInput) {
      return custom("type") || ({
        email: "\u90AE\u7BB1\u683C\u5F0F\u597D\u50CF\u4E0D\u592A\u5BF9\uFF0C\u4F8B\u5982 riko@riko.land",
        url: "\u8BF7\u8F93\u5165\u5B8C\u6574\u7684\u7F51\u5740\uFF0C\u4F8B\u5982 https://riko.land",
        number: "\u8BF7\u8F93\u5165\u6709\u6548\u7684\u6570\u5B57",
        tel: "\u8BF7\u8F93\u5165\u6709\u6548\u7684\u7535\u8BDD\u53F7\u7801"
      }[control.type] || "\u683C\u5F0F\u597D\u50CF\u4E0D\u592A\u5BF9");
    }
    if (v.tooShort) return custom("minlength") || `\u81F3\u5C11\u9700\u8981 ${control.minLength} \u4E2A\u5B57\u7B26\uFF08\u73B0\u5728 ${len} \u4E2A\uFF09`;
    if (v.tooLong) return custom("maxlength") || `\u6700\u591A ${control.maxLength} \u4E2A\u5B57\u7B26\uFF08\u73B0\u5728 ${len} \u4E2A\uFF09`;
    if (v.rangeUnderflow) return custom("min") || `\u4E0D\u80FD\u5C0F\u4E8E ${control.min}`;
    if (v.rangeOverflow) return custom("max") || `\u4E0D\u80FD\u5927\u4E8E ${control.max}`;
    if (v.stepMismatch) return custom("step") || `\u8BF7\u8F93\u5165 ${control.step} \u7684\u6574\u6570\u500D`;
    if (v.patternMismatch) return custom("pattern") || control.title || "\u683C\u5F0F\u597D\u50CF\u4E0D\u592A\u5BF9";
    if (v.customError) return control.validationMessage;
    const match = control.getAttribute("data-riko-match");
    if (match && control.value) {
      const other = form.querySelector(match) || document.querySelector(match);
      if (other && other.value !== control.value) return custom("match") || "\u4E24\u6B21\u8F93\u5165\u4E0D\u4E00\u81F4\u54E6";
    }
    return "";
  }
  function errorEl(control, create) {
    const field = control.closest(".riko-field, .riko-fieldset");
    if (!field) return null;
    let err = field.querySelector(".riko-field__error");
    if (!err && create) {
      err = document.createElement("p");
      err.className = "riko-field__error";
      err.hidden = true;
      const anchor = field.querySelector(".riko-field__footer") || field.querySelector(".riko-field__hint");
      if (anchor && anchor.parentNode === field) anchor.after(err);
      else field.appendChild(err);
    }
    if (err) {
      ensureId(err, "riko-error");
      err.setAttribute("aria-live", "polite");
    }
    return err;
  }
  var groupOf = (control, form) => control.type === "radio" && control.name ? Array.from(form.querySelectorAll(`input[type="radio"][name="${CSS.escape(control.name)}"]`)) : [control];
  function show(control, form, message) {
    const group = groupOf(control, form);
    const err = errorEl(control, !!message);
    group.forEach((c) => {
      if (message) c.setAttribute("aria-invalid", "true");
      else c.removeAttribute("aria-invalid");
      if (err) {
        const ids = (c.getAttribute("aria-describedby") || "").split(/\s+/).filter((x) => x && x !== err.id);
        if (message) ids.push(err.id);
        if (ids.length) c.setAttribute("aria-describedby", ids.join(" "));
        else c.removeAttribute("aria-describedby");
      }
    });
    const wrap = control.closest(".riko-number, .riko-combobox, .riko-tags-input, .riko-otp, .riko-input-group");
    if (wrap) {
      if (message) wrap.setAttribute("aria-invalid", "true");
      else wrap.removeAttribute("aria-invalid");
    }
    if (err) {
      if (message) {
        err.textContent = message;
        err.hidden = false;
      } else {
        err.hidden = true;
        err.textContent = "";
      }
    }
  }
  var form_validate_default = {
    name: "form-validate",
    init(form) {
      form.noValidate = true;
      const touched = /* @__PURE__ */ new WeakSet();
      const controls = () => Array.from(form.querySelectorAll(CONTROLS)).filter((c) => !c.disabled && !c.closest("fieldset:disabled") && !c.closest(".riko-otp, .riko-tags-input"));
      const check = (control) => {
        const match = control.getAttribute("data-riko-match");
        if (match) {
          const other = form.querySelector(match) || document.querySelector(match);
          control.setCustomValidity(other && control.value && other.value !== control.value ? control.getAttribute("data-riko-message-match") || "\u4E24\u6B21\u8F93\u5165\u4E0D\u4E00\u81F4\u54E6" : "");
        }
        const message = control.checkValidity() ? "" : messageFor(control, form);
        show(control, form, message);
        return message;
      };
      const composites = () => Array.from(form.querySelectorAll(".riko-otp[data-riko-required], .riko-tags-input[data-riko-required]"));
      const showComposite = (wrap, message) => {
        const hidden = wrap.querySelector('input[type="hidden"]');
        const err = errorEl(wrap, !!message);
        if (message) wrap.setAttribute("aria-invalid", "true");
        else wrap.removeAttribute("aria-invalid");
        if (err) {
          const ids = (wrap.getAttribute("aria-describedby") || "").split(/\s+/).filter((x) => x && x !== err.id);
          if (message) ids.push(err.id);
          if (ids.length) wrap.setAttribute("aria-describedby", ids.join(" "));
          else wrap.removeAttribute("aria-describedby");
          if (message) {
            err.textContent = message;
            err.hidden = false;
          } else {
            err.hidden = true;
            err.textContent = "";
          }
        }
        return hidden;
      };
      const checkComposite = (wrap) => {
        const hidden = wrap.querySelector('input[type="hidden"]');
        const value = hidden ? hidden.value : "";
        let message = "";
        if (wrap.classList.contains("riko-otp")) {
          const len = wrap.querySelectorAll(".riko-otp__cell").length;
          if (!value) message = wrap.getAttribute("data-riko-message-required") || "\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801";
          else if (value.length < len) message = wrap.getAttribute("data-riko-message-incomplete") || `\u8BF7\u8F93\u5165\u5B8C\u6574\u7684 ${len} \u4F4D\u9A8C\u8BC1\u7801`;
        } else if (!value) message = wrap.getAttribute("data-riko-message-required") || "\u81F3\u5C11\u6DFB\u52A0\u4E00\u4E2A\u6807\u7B7E\u5427";
        showComposite(wrap, message);
        return message;
      };
      const validate = () => {
        const errors = [];
        for (const w of composites()) {
          const message = checkComposite(w);
          if (message) errors.push({ control: w.querySelector(".riko-otp__cell, .riko-tags-input__input") || w, message });
        }
        const seen = /* @__PURE__ */ new Set();
        for (const c of controls()) {
          const key = c.type === "radio" && c.name ? "radio:" + c.name : c;
          if (seen.has(key)) continue;
          seen.add(key);
          touched.add(c);
          const message = check(c);
          if (message) errors.push({ control: c, message });
        }
        return errors.sort((a, b) => a.control.compareDocumentPosition(b.control) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
      };
      const offs = [
        on(form, "focusout", (e) => {
          const c = e.target;
          if (!c.matches?.(CONTROLS) || c.closest(".riko-otp, .riko-tags-input")) return;
          if (c.value !== "" || c.required) {
            touched.add(c);
            check(c);
          }
        }),
        on(form, "riko:otp:change", (e) => {
          if (e.target.getAttribute("aria-invalid") === "true") checkComposite(e.target);
        }),
        on(form, "riko:tags-input:change", (e) => {
          if (e.target.hasAttribute("data-riko-required")) checkComposite(e.target);
        }),
        on(form, "input", (e) => {
          const c = e.target;
          if (c.closest(".riko-otp, .riko-tags-input")) return;
          if (c.matches?.(CONTROLS) && (touched.has(c) || c.getAttribute("aria-invalid") === "true")) check(c);
        }),
        on(form, "change", (e) => {
          const c = e.target;
          if (!c.matches?.(CONTROLS) || c.closest(".riko-otp, .riko-tags-input")) return;
          touched.add(c);
          check(c);
          form.querySelectorAll("[data-riko-match]").forEach((m) => {
            if (touched.has(m) && form.querySelector(m.getAttribute("data-riko-match")) === c) check(m);
          });
        }),
        on(form, "submit", (e) => {
          const errors = validate();
          if (errors.length) {
            e.preventDefault();
            e.stopImmediatePropagation();
            const first = errors[0].control;
            const target = first.type === "hidden" ? first.closest(".riko-field")?.querySelector("input, textarea, select, [tabindex]") : first;
            (target || first).focus({ preventScroll: true });
            (target || first).scrollIntoView({ behavior: "smooth", block: "center" });
            emit(form, "form:invalid", { errors });
            return;
          }
          if (!emit(form, "form:submit", { data: new FormData(form) }, true)) e.preventDefault();
        }),
        on(form, "reset", () => setTimeout(() => {
          controls().forEach((c) => show(c, form, ""));
          composites().forEach((w) => showComposite(w, ""));
        }, 0))
      ];
      form.__rikoValidateOff = () => offs.forEach((f) => f());
      return {
        validate() {
          return validate();
        },
        get valid() {
          return validate().length === 0;
        },
        setError(control, message) {
          show(typeof control === "string" ? form.querySelector(control) : control, form, message);
        },
        clear() {
          controls().forEach((c) => show(c, form, ""));
        }
      };
    },
    destroy(form) {
      form.__rikoValidateOff?.();
    }
  };

  // packages/core/src/js/components/navbar.js
  var MQ = "(max-width: 768px)";
  var navbar_default = {
    name: "navbar",
    init(el) {
      const nav = el.querySelector(".riko-navbar__nav");
      const toggle = el.querySelector(".riko-navbar__toggle");
      if (!nav || !toggle) return null;
      const mq2 = window.matchMedia(MQ);
      toggle.setAttribute("aria-controls", ensureId(nav, "riko-navbar-nav"));
      if (!toggle.hasAttribute("aria-label")) toggle.setAttribute("aria-label", "\u6253\u5F00\u83DC\u5355");
      if (!toggle.hasAttribute("type")) toggle.setAttribute("type", "button");
      let isOpen = false;
      const render = () => {
        toggle.setAttribute("aria-expanded", String(isOpen));
        if (mq2.matches) nav.setAttribute("data-state", isOpen ? "open" : "closed");
        else nav.removeAttribute("data-state");
      };
      const set = (next, { focusToggle = false } = {}) => {
        if (next === isOpen) return;
        isOpen = next;
        render();
        emit(el, isOpen ? "navbar:open" : "navbar:close");
        if (focusToggle) toggle.focus();
      };
      const offs = [
        on(toggle, "click", () => set(!isOpen)),
        on(nav, "click", "a", () => mq2.matches && set(false)),
        on(document, "keydown", (e) => {
          if (e.key === "Escape" && isOpen) set(false, { focusToggle: nav.contains(document.activeElement) });
        }),
        on(document, "pointerdown", (e) => {
          if (isOpen && !el.contains(e.target)) set(false);
        })
      ];
      const onMq = () => {
        isOpen = false;
        render();
      };
      mq2.addEventListener("change", onMq);
      offs.push(() => mq2.removeEventListener("change", onMq));
      render();
      el.__rikoNavbarOff = () => offs.forEach((f) => f());
      return { open: () => set(true), close: () => set(false), toggle: () => set(!isOpen), get isOpen() {
        return isOpen;
      } };
    },
    destroy(el) {
      el.__rikoNavbarOff?.();
    }
  };

  // packages/core/src/js/components/number.js
  var decimals = (n) => (String(n).split(".")[1] || "").length;
  var number_default = {
    name: "number",
    init(el) {
      const input = el.querySelector(".riko-number__input") || el.querySelector("input");
      if (!input) return;
      input.classList.add("riko-number__input");
      const label = input.getAttribute("aria-label") || "";
      let down = el.querySelector('.riko-number__btn[data-step="down"]');
      let up = el.querySelector('.riko-number__btn[data-step="up"]');
      if (!down) {
        down = document.createElement("button");
        down.type = "button";
        down.className = "riko-number__btn";
        down.dataset.step = "down";
        down.setAttribute("aria-label", "\u51CF\u5C11" + label);
        el.insertBefore(down, input);
      }
      if (!up) {
        up = document.createElement("button");
        up.type = "button";
        up.className = "riko-number__btn";
        up.dataset.step = "up";
        up.setAttribute("aria-label", "\u589E\u52A0" + label);
        input.after(up);
      }
      down.tabIndex = -1;
      up.tabIndex = -1;
      const num2 = (attr, d) => {
        const v = parseFloat(input.getAttribute(attr));
        return Number.isFinite(v) ? v : d;
      };
      const sync = () => {
        const v = parseFloat(input.value);
        down.disabled = input.disabled || Number.isFinite(v) && v <= num2("min", -Infinity);
        up.disabled = input.disabled || Number.isFinite(v) && v >= num2("max", Infinity);
      };
      const set = (value) => {
        const min = num2("min", -Infinity), max = num2("max", Infinity), step = num2("step", 1);
        const d = Math.max(decimals(step), decimals(num2("min", 0)));
        const next = Math.min(max, Math.max(min, value));
        const text = next.toFixed(d);
        if (input.value === text) return false;
        input.value = text;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        emit(el, "number:change", { value: next });
        sync();
        return true;
      };
      const stepBy = (n) => {
        if (input.disabled || input.readOnly) return false;
        const step = num2("step", 1);
        const cur = parseFloat(input.value);
        const base = Number.isFinite(cur) ? cur : Math.max(num2("min", 0), Math.min(0, num2("max", 0)));
        return set(Number.isFinite(cur) ? base + n * step : base);
      };
      let timer2 = null, repeat = null;
      const stop = () => {
        clearTimeout(timer2);
        clearInterval(repeat);
        timer2 = repeat = null;
      };
      const start2 = (dir, e) => {
        if (e.button !== void 0 && e.button !== 0) return;
        e.preventDefault();
        input.focus({ preventScroll: true });
        stepBy(dir);
        timer2 = setTimeout(() => {
          repeat = setInterval(() => {
            if (!stepBy(dir)) stop();
          }, 70);
        }, 420);
      };
      const offs = [
        on(down, "pointerdown", (e) => start2(-1, e)),
        on(up, "pointerdown", (e) => start2(1, e)),
        on(down, "click", (e) => {
          if (e.detail === 0) stepBy(-1);
        }),
        // 键盘/读屏触发
        on(up, "click", (e) => {
          if (e.detail === 0) stepBy(1);
        }),
        on(window, "pointerup", stop),
        on(window, "pointercancel", stop),
        on(window, "blur", stop),
        on(input, "keydown", (e) => {
          const map = { ArrowUp: 1, ArrowDown: -1, PageUp: 10, PageDown: -10 };
          if (e.key in map) {
            e.preventDefault();
            stepBy(map[e.key]);
          } else if (e.key === "Home" && Number.isFinite(num2("min", NaN))) {
            e.preventDefault();
            set(num2("min"));
          } else if (e.key === "End" && Number.isFinite(num2("max", NaN))) {
            e.preventDefault();
            set(num2("max"));
          }
        }),
        on(input, "input", sync),
        on(input, "change", () => {
          const v = parseFloat(input.value);
          if (Number.isFinite(v)) set(v);
        }),
        on(input, "wheel", (e) => {
          if (document.activeElement === input) e.preventDefault();
        }, { passive: false })
      ];
      sync();
      el.__rikoNumberOff = () => {
        stop();
        offs.forEach((f) => f());
      };
      return { input, stepUp: () => stepBy(1), stepDown: () => stepBy(-1), set, get value() {
        return parseFloat(input.value);
      } };
    },
    destroy(el) {
      el.__rikoNumberOff?.();
    }
  };

  // packages/core/src/js/components/otp.js
  var otp_default = {
    name: "otp",
    init(el) {
      const length = Math.max(1, opt(el, "length", 6));
      const numeric = opt(el, "type", "numeric") !== "alphanumeric";
      const split = opt(el, "split", 0);
      let hidden = el.querySelector(".riko-otp__value") || el.querySelector('input[type="hidden"]');
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.className = "riko-otp__value";
        el.appendChild(hidden);
      }
      if (!el.hasAttribute("role")) el.setAttribute("role", "group");
      if (!el.hasAttribute("aria-label") && !el.hasAttribute("aria-labelledby")) el.setAttribute("aria-label", "\u9A8C\u8BC1\u7801");
      el.querySelectorAll(".riko-otp__cell, .riko-otp__sep").forEach((n) => n.remove());
      const cells = [];
      for (let i = 0; i < length; i++) {
        if (split && i === split) {
          const sep = document.createElement("span");
          sep.className = "riko-otp__sep";
          sep.setAttribute("aria-hidden", "true");
          el.insertBefore(sep, hidden);
        }
        const c = document.createElement("input");
        c.className = "riko-otp__cell";
        c.type = "text";
        c.maxLength = 1;
        c.inputMode = numeric ? "numeric" : "text";
        c.autocomplete = i === 0 ? "one-time-code" : "off";
        c.setAttribute("aria-label", `\u7B2C ${i + 1} \u4F4D\uFF0C\u5171 ${length} \u4F4D`);
        if (numeric) c.pattern = "[0-9]*";
        el.insertBefore(c, hidden);
        cells.push(c);
      }
      const valid = (ch) => (numeric ? /^\d$/ : /^[a-z0-9]$/i).test(ch);
      const value = () => cells.map((c) => c.value).join("");
      const sync = () => {
        cells.forEach((c) => c.setAttribute("data-state", c.value ? "filled" : "empty"));
        const v = value();
        hidden.value = v;
        emit(el, "otp:change", { value: v });
        if (v.length === length) {
          el.setAttribute("data-state", "complete");
          emit(el, "otp:complete", { value: v });
        } else el.removeAttribute("data-state");
      };
      const fill = (start2, text, focus = true) => {
        const chars = Array.from(text).filter(valid);
        let i = start2;
        for (const ch of chars) {
          if (i >= length) break;
          cells[i++].value = numeric ? ch : ch.toUpperCase();
        }
        if (focus) cells[Math.min(i, length - 1)].focus();
        sync();
      };
      const set = (v) => {
        cells.forEach((c) => c.value = "");
        fill(0, String(v ?? ""), false);
      };
      if (hidden.value) set(hidden.value);
      const offs = [];
      cells.forEach((c, i) => {
        offs.push(
          on(c, "focus", () => c.select()),
          on(c, "input", () => {
            const v = c.value;
            if (!v) {
              sync();
              return;
            }
            if (v.length > 1) {
              c.value = "";
              fill(i, v);
              return;
            }
            if (!valid(v)) {
              c.value = "";
              return;
            }
            if (!numeric) c.value = v.toUpperCase();
            sync();
            if (i < length - 1) cells[i + 1].focus();
          }),
          on(c, "keydown", (e) => {
            if (e.key === "Backspace" && !c.value && i > 0) {
              e.preventDefault();
              cells[i - 1].value = "";
              cells[i - 1].focus();
              sync();
            } else if (e.key === "ArrowLeft" && i > 0) {
              e.preventDefault();
              cells[i - 1].focus();
            } else if (e.key === "ArrowRight" && i < length - 1) {
              e.preventDefault();
              cells[i + 1].focus();
            } else if (e.key === "Home") {
              e.preventDefault();
              cells[0].focus();
            } else if (e.key === "End") {
              e.preventDefault();
              cells[length - 1].focus();
            } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && c.value && valid(e.key)) {
              e.preventDefault();
              c.value = numeric ? e.key : e.key.toUpperCase();
              sync();
              if (i < length - 1) cells[i + 1].focus();
            }
          }),
          on(c, "paste", (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData("text");
            fill(i, text);
          })
        );
      });
      el.__rikoOtpOff = () => offs.forEach((f) => f());
      return {
        cells,
        get value() {
          return value();
        },
        set,
        clear() {
          set("");
          cells[0].focus();
        },
        focus() {
          (cells.find((c) => !c.value) || cells[length - 1]).focus();
        }
      };
    },
    destroy(el) {
      el.__rikoOtpOff?.();
    }
  };

  // packages/core/src/js/components/pagination.js
  function pageRange(current, total, siblings = 1) {
    const pages = [];
    const start2 = Math.max(2, current - siblings), end = Math.min(total - 1, current + siblings);
    pages.push(1);
    if (start2 > 2) pages.push(start2 === 3 ? 2 : "\u2026");
    for (let p = start2; p <= end; p++) pages.push(p);
    if (end < total - 1) pages.push(end === total - 2 ? total - 1 : "\u2026");
    if (total > 1) pages.push(total);
    return pages;
  }
  var pagination_default = {
    name: "pagination",
    init(el) {
      let total = Math.max(1, opt(el, "total", 1));
      let current = Math.min(Math.max(1, opt(el, "current", 1)), total);
      const siblings = opt(el, "siblings", 1);
      const href = opt(el, "href", "");
      if (el.tagName === "NAV" && !el.hasAttribute("aria-label")) el.setAttribute("aria-label", "\u5206\u9875");
      const item = (page, label, cls = "", disabled = false) => {
        const extra = cls ? " " + cls : "";
        const aria = label ? ` aria-label="${escapeHtml(label)}"` : "";
        if (disabled) return `<span class="riko-pagination__item${extra}" aria-disabled="true"${aria}></span>`;
        if (page === current && !cls) return `<span class="riko-pagination__item" aria-current="page">${page}</span>`;
        return href ? `<a class="riko-pagination__item${extra}" href="${escapeHtml(href.replace("{page}", page))}"${aria}>${cls ? "" : page}</a>` : `<button type="button" class="riko-pagination__item${extra}" data-page="${page}"${aria}>${cls ? "" : page}</button>`;
      };
      const render = () => {
        el.innerHTML = item(current - 1, "\u4E0A\u4E00\u9875", "riko-pagination__prev", current <= 1) + pageRange(current, total, siblings).map((p) => p === "\u2026" ? '<span class="riko-pagination__ellipsis" aria-hidden="true">\u2026</span>' : item(p)).join("") + item(current + 1, "\u4E0B\u4E00\u9875", "riko-pagination__next", current >= total);
      };
      const set = (page, { silent = false } = {}) => {
        page = Math.min(Math.max(1, page), total);
        if (page === current) return;
        current = page;
        el.setAttribute("data-riko-current", page);
        render();
        if (!silent) emit(el, "pagination:change", { page, total });
      };
      const off = on(el, "click", "button[data-page]", (e, b) => {
        const target = +b.getAttribute("data-page");
        set(target);
        (el.querySelector(`[data-page="${target}"]`) || el.querySelector('[aria-current="page"]'))?.focus();
      });
      render();
      el.__rikoPagOff = off;
      return {
        set: (page) => set(page),
        setTotal(n) {
          total = Math.max(1, n);
          current = Math.min(current, total);
          render();
        },
        get page() {
          return current;
        },
        get total() {
          return total;
        }
      };
    },
    destroy(el) {
      el.__rikoPagOff?.();
    }
  };

  // packages/core/src/js/components/password-toggle.js
  var password_toggle_default = {
    name: "password-toggle",
    init(el) {
      const sel = el.getAttribute("data-riko-target");
      const input = sel ? document.querySelector(sel) : el.closest(".riko-input-group")?.querySelector("input");
      if (!input) return;
      if (!el.innerHTML.trim()) {
        el.innerHTML = '<span class="riko-icon riko-icon--eye riko-password-toggle__show" aria-hidden="true"></span><span class="riko-icon riko-icon--eye-off riko-password-toggle__hide" aria-hidden="true"></span>';
      }
      if (!el.hasAttribute("type")) el.setAttribute("type", "button");
      if (input.id) el.setAttribute("aria-controls", input.id);
      const showLabel = el.getAttribute("aria-label") || "\u663E\u793A\u5BC6\u7801";
      const sync = () => {
        const shown = input.type === "text";
        el.setAttribute("aria-pressed", String(shown));
        el.setAttribute("aria-label", shown ? "\u9690\u85CF\u5BC6\u7801" : showLabel);
      };
      const off = on(el, "click", () => {
        input.type = input.type === "password" ? "text" : "password";
        sync();
        input.focus({ preventScroll: true });
      });
      sync();
      el.__rikoPwOff = off;
      return { toggle: () => el.click() };
    },
    destroy(el) {
      el.__rikoPwOff?.();
    }
  };

  // packages/core/src/js/components/popover.js
  var isPopover = (el) => el && el.classList && el.classList.contains("riko-popover");
  var triggersOf = (pop) => Array.from(document.querySelectorAll(`[data-riko-toggle="${CSS.escape(pop.id)}"]`));
  function wire(trigger, pop) {
    trigger.setAttribute("aria-controls", pop.id);
    if (!trigger.hasAttribute("aria-haspopup")) trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", String(pop.matches(":popover-open")));
    if ("popoverTargetElement" in trigger && trigger.popoverTargetElement !== pop) {
      trigger.popoverTargetElement = pop;
      trigger.popoverTargetAction = "toggle";
      return true;
    }
    return false;
  }
  if (typeof document !== "undefined") {
    document.addEventListener("click", (e) => {
      const trigger = e.target instanceof Element && e.target.closest("[data-riko-toggle]");
      if (trigger) {
        const pop2 = document.getElementById(trigger.getAttribute("data-riko-toggle"));
        if (!isPopover(pop2)) return;
        pop2.__rikoAnchor = trigger;
        const native = "popoverTargetElement" in trigger && trigger.popoverTargetElement === pop2;
        if (!native) {
          wire(trigger, pop2);
          e.preventDefault();
          pop2.togglePopover();
        }
        return;
      }
      const close = e.target instanceof Element && e.target.closest("[data-riko-close]");
      const pop = close && close.closest(".riko-popover");
      if (pop && pop.matches(":popover-open")) pop.hidePopover();
    }, true);
  }
  var popover_default = {
    name: "popover",
    init(pop) {
      ensureId(pop, "riko-pop");
      if (!pop.hasAttribute("popover")) pop.setAttribute("popover", "auto");
      if (!pop.hasAttribute("role")) pop.setAttribute("role", "dialog");
      if (!pop.hasAttribute("tabindex")) pop.setAttribute("tabindex", "-1");
      triggersOf(pop).forEach((t) => wire(t, pop));
      let stop = null;
      let hadFocus = false;
      const onBefore = (e) => {
        if (e.newState === "closed") hadFocus = pop.contains(document.activeElement);
      };
      pop.addEventListener("beforetoggle", onBefore);
      const onToggle = (e) => {
        const anchor = pop.__rikoAnchor && pop.__rikoAnchor.isConnected ? pop.__rikoAnchor : triggersOf(pop)[0];
        triggersOf(pop).forEach((t) => t.setAttribute("aria-expanded", String(e.newState === "open" && t === anchor)));
        if (e.newState === "open") {
          if (anchor) stop = autoPosition(anchor, pop, { placement: opt(pop, "placement", "bottom"), offset: 10 });
          const first = focusables(pop)[0];
          (first || pop).focus({ preventScroll: true });
          emit(pop, "popover:open", { anchor });
        } else {
          stop?.();
          stop = null;
          const active2 = document.activeElement;
          if (anchor && (hadFocus || !active2 || active2 === document.body || pop.contains(active2))) anchor.focus({ preventScroll: true });
          hadFocus = false;
          emit(pop, "popover:close", { anchor });
        }
      };
      pop.addEventListener("toggle", onToggle);
      pop.__rikoPopover = { onToggle, onBefore, stop: () => stop?.() };
      return {
        open(anchor) {
          if (anchor) pop.__rikoAnchor = anchor;
          if (!pop.matches(":popover-open")) pop.showPopover();
        },
        close() {
          if (pop.matches(":popover-open")) pop.hidePopover();
        },
        toggle(anchor) {
          if (anchor) pop.__rikoAnchor = anchor;
          pop.togglePopover();
        }
      };
    },
    destroy(pop) {
      const s = pop.__rikoPopover;
      if (!s) return;
      s.stop();
      pop.removeEventListener("toggle", s.onToggle);
      pop.removeEventListener("beforetoggle", s.onBefore);
      pop.__rikoPopover = null;
    }
  };

  // packages/core/src/js/components/range.js
  var range_default = {
    name: "range",
    init(el) {
      const outSel = el.getAttribute("data-riko-output");
      const outputs = [
        ...outSel ? document.querySelectorAll(outSel) : [],
        ...el.id ? document.querySelectorAll(`output[for~="${CSS.escape(el.id)}"]`) : []
      ];
      const suffix = opt(el, "suffix", "");
      const update = () => {
        const min = Number(el.min || 0), max = Number(el.max || 100), v = Number(el.value);
        const pct = max > min ? (v - min) / (max - min) * 100 : 0;
        el.style.setProperty("--riko-range-fill", pct + "%");
        outputs.forEach((o) => {
          o.value = el.value + suffix;
          o.textContent = el.value + suffix;
        });
      };
      const off = on(el, "input", update);
      update();
      el.__rikoRangeOff = off;
      return { update };
    },
    destroy(el) {
      el.__rikoRangeOff?.();
    }
  };

  // packages/core/src/js/components/reading-progress.js
  var reading_progress_default = {
    name: "reading-progress",
    init(el) {
      const sel = opt(el, "target", "");
      const labelled = el.hasAttribute("aria-label") || el.hasAttribute("aria-labelledby");
      if (labelled) {
        el.setAttribute("role", "progressbar");
        el.setAttribute("aria-valuemin", "0");
        el.setAttribute("aria-valuemax", "100");
      } else el.setAttribute("aria-hidden", "true");
      let ticking = false, last = -1;
      const compute = () => {
        const target = sel && document.querySelector(sel);
        if (target) {
          const r = target.getBoundingClientRect();
          const range = r.height - window.innerHeight;
          return range <= 0 ? r.top <= 0 ? 1 : 0 : -r.top / range;
        }
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        return max > 0 ? h.scrollTop / max : 0;
      };
      const update = () => {
        ticking = false;
        const p = Math.min(1, Math.max(0, compute()));
        if (Math.abs(p - last) < 1e-3) return;
        last = p;
        el.style.setProperty("--riko-progress", p.toFixed(4));
        if (labelled) el.setAttribute("aria-valuenow", String(Math.round(p * 100)));
        emit(el, "reading-progress:change", { progress: p });
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      };
      const offs = [on(window, "scroll", onScroll, { passive: true }), on(window, "resize", onScroll)];
      update();
      el.__rikoProgOff = () => offs.forEach((f) => f());
      return { update, get progress() {
        return Math.max(0, last);
      } };
    },
    destroy(el) {
      el.__rikoProgOff?.();
    }
  };

  // packages/core/src/js/components/reveal.js
  var io = null;
  var getObserver = () => io ||= new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.transitionDelay = opt(el, "delay", 0) + "ms";
      el.setAttribute("data-state", "shown");
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  var reveal_default = {
    name: "reveal",
    init(el) {
      el.classList.add("riko-u-reveal");
      if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
        el.setAttribute("data-state", "shown");
        return;
      }
      el.setAttribute("data-state", "hidden");
      getObserver().observe(el);
    },
    destroy(el) {
      io?.unobserve(el);
    }
  };

  // packages/core/src/js/components/search.js
  var hotkeyOwner = null;
  var search_default = {
    name: "search",
    init(el) {
      const input = el.querySelector(".riko-search__input") || el.querySelector("input");
      if (!input) return;
      let clear = el.querySelector(".riko-search__clear");
      if (!clear) {
        clear = document.createElement("button");
        clear.type = "button";
        clear.className = "riko-search__clear";
        clear.setAttribute("aria-label", "\u6E05\u9664\u641C\u7D22");
        el.appendChild(clear);
      }
      clear.hidden = true;
      const count = el.querySelector(".riko-search__count");
      const nav = el.querySelector(".riko-search__nav");
      if (count && !count.hasAttribute("aria-live")) count.setAttribute("aria-live", "polite");
      if (nav) nav.hidden = true;
      const query = () => input.value.trim().toLowerCase();
      const syncState = () => {
        const filled = input.value.length > 0;
        clear.hidden = !filled;
        el.setAttribute("data-state", filled ? "filled" : "empty");
      };
      const fire = debounce(() => emit(el, "search:input", { value: input.value, query: query() }), opt(el, "debounce", 160));
      const step = (dir) => emit(el, "search:step", { dir, query: query() });
      const offs = [
        on(input, "input", () => {
          syncState();
          fire();
        }),
        on(input, "keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            step(e.shiftKey ? -1 : 1);
          } else if (e.key === "Escape" && input.value) {
            e.preventDefault();
            e.stopPropagation();
            inst.clear();
          } else if (e.key === "Escape") input.blur();
        }),
        on(clear, "click", () => {
          inst.clear();
          input.focus();
        })
      ];
      if (nav) offs.push(on(nav, "click", "[data-step]", (e, b) => step(b.getAttribute("data-step") === "prev" ? -1 : 1)));
      const hotkey = opt(el, "hotkey", "/");
      if (hotkey !== "none" && !hotkeyOwner) {
        hotkeyOwner = el;
        const onKey = (e) => {
          const t = e.target;
          const typing = t instanceof Element && t.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]');
          const modK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
          if (modK || !typing && !e.metaKey && !e.ctrlKey && !e.altKey && e.key === hotkey) {
            if (document.querySelector("dialog[open]") && !el.closest("dialog[open]")) return;
            e.preventDefault();
            input.focus();
            input.select();
          }
        };
        document.addEventListener("keydown", onKey);
        offs.push(() => {
          document.removeEventListener("keydown", onKey);
          if (hotkeyOwner === el) hotkeyOwner = null;
        });
      }
      const inst = {
        input,
        get value() {
          return input.value;
        },
        get query() {
          return query();
        },
        focus() {
          input.focus();
        },
        clear() {
          if (!input.value) return;
          input.value = "";
          syncState();
          inst.setResult(null);
          input.dispatchEvent(new Event("input", { bubbles: true }));
          emit(el, "search:input", { value: "", query: "" });
          emit(el, "search:clear");
        },
        /** 显示结果计数：setResult({ current, total, label }) ；传 null 清除 */
        setResult(r) {
          if (count) count.textContent = !r ? "" : r.label ?? (r.total ? `${r.current ?? 1} / ${r.total}` : "0 \u5904");
          if (nav) {
            nav.hidden = !r;
            nav.querySelectorAll("[data-step]").forEach((b) => {
              b.disabled = !r || !r.total;
            });
          }
        }
      };
      syncState();
      el.__rikoSearchOff = () => offs.forEach((f) => f());
      return inst;
    },
    destroy(el) {
      el.__rikoSearchOff?.();
    }
  };
  var active = /* @__PURE__ */ new WeakMap();
  function unwrap(marks) {
    const parents = /* @__PURE__ */ new Set();
    marks.forEach((m) => {
      const p = m.parentNode;
      if (!p) return;
      p.replaceChild(document.createTextNode(m.textContent), m);
      parents.add(p);
    });
    parents.forEach((p) => p.normalize());
  }
  function highlight(root, query, options = {}) {
    const o = {
      caseSensitive: false,
      className: "riko-mark",
      currentClass: "riko-mark--current",
      exclude: "script,style,textarea,input,select,[data-riko-nohighlight]",
      scroll: true,
      ...options
    };
    if (typeof root === "string") root = document.querySelector(root);
    if (!root) throw new Error("[Riko] highlight: \u627E\u4E0D\u5230\u5BB9\u5668");
    if (active.has(root)) {
      unwrap(active.get(root));
      active.delete(root);
    }
    const q = String(query ?? "");
    const marks = [];
    if (q.trim()) {
      const needle = o.caseSensitive ? q : q.toLowerCase();
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (n) => !n.nodeValue.trim() || n.parentElement?.closest(o.exclude) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
      });
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        const text = node.nodeValue;
        const hay = o.caseSensitive ? text : text.toLowerCase();
        let i = hay.indexOf(needle);
        if (i < 0) continue;
        const frag = document.createDocumentFragment();
        let last = 0;
        while (i > -1) {
          if (i > last) frag.appendChild(document.createTextNode(text.slice(last, i)));
          const mark = document.createElement("mark");
          mark.className = o.className;
          mark.textContent = text.slice(i, i + q.length);
          frag.appendChild(mark);
          marks.push(mark);
          last = i + q.length;
          i = hay.indexOf(needle, last);
        }
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag, node);
      }
    }
    active.set(root, marks);
    const ctl = {
      count: marks.length,
      marks,
      index: -1,
      go(i) {
        if (!marks.length) return -1;
        ctl.index = (i % marks.length + marks.length) % marks.length;
        marks.forEach((m, j) => m.classList.toggle(o.currentClass, j === ctl.index));
        if (o.scroll) marks[ctl.index].scrollIntoView({ behavior: "smooth", block: "center" });
        return ctl.index;
      },
      next() {
        return ctl.go(ctl.index + 1);
      },
      prev() {
        return ctl.go(ctl.index < 0 ? -1 : ctl.index - 1);
      },
      clear() {
        unwrap(marks);
        marks.length = 0;
        ctl.count = 0;
        ctl.index = -1;
        active.delete(root);
      }
    };
    return ctl;
  }
  var api3 = { highlight };

  // packages/core/src/js/components/sidenav.js
  var CURRENT = '.riko-sidenav__item[aria-current="page"], .riko-sidenav__item[aria-current="true"]';
  var sidenav_default = {
    name: "sidenav",
    init(el) {
      const groups = () => Array.from(el.querySelectorAll(".riko-sidenav__group"));
      const toggleOf = (g) => g.querySelector(":scope > .riko-sidenav__group-toggle");
      const panelOf = (g) => g.querySelector(":scope > .riko-sidenav__panel");
      groups().forEach((g) => {
        const t = toggleOf(g), p = panelOf(g);
        if (!t || !p) return;
        if (!t.hasAttribute("type") && t.tagName === "BUTTON") t.setAttribute("type", "button");
        t.setAttribute("aria-controls", ensureId(p, "riko-sidenav-panel"));
        if (!t.hasAttribute("aria-expanded")) t.setAttribute("aria-expanded", String(!!p.querySelector(CURRENT)));
      });
      const setExpanded = (g, open) => {
        const t = toggleOf(g);
        if (!t || t.getAttribute("aria-expanded") === String(open)) return;
        t.setAttribute("aria-expanded", String(open));
        emit(el, "sidenav:toggle", { group: g, expanded: open });
      };
      const reveal = (item = el.querySelector(CURRENT)) => {
        if (!item) return;
        const g = item.closest(".riko-sidenav__group");
        if (g) setExpanded(g, true);
        let box = el;
        while (box && box !== document.body && !(box.scrollHeight > box.clientHeight && /(auto|scroll)/.test(getComputedStyle(box).overflowY))) box = box.parentElement;
        if (!box || box === document.body) return;
        requestAnimationFrame(() => {
          const br = box.getBoundingClientRect(), ir = item.getBoundingClientRect();
          if (ir.top < br.top || ir.bottom > br.bottom) box.scrollTop += ir.top - br.top - br.height / 3;
        });
      };
      const visibleFocusables = () => Array.from(el.querySelectorAll(".riko-sidenav__group-toggle, .riko-sidenav__item")).filter((n) => {
        const panel = n.closest(".riko-sidenav__panel");
        return !(panel && panel.previousElementSibling?.getAttribute("aria-expanded") === "false") && n.getClientRects().length;
      });
      const offs = [
        on(el, "click", ".riko-sidenav__group-toggle", (e, t) => {
          const g = t.closest(".riko-sidenav__group");
          setExpanded(g, t.getAttribute("aria-expanded") !== "true");
        }),
        on(el, "keydown", (e) => {
          if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
          const list = visibleFocusables();
          const i = list.indexOf(document.activeElement);
          if (i < 0) return;
          e.preventDefault();
          const next = e.key === "Home" ? 0 : e.key === "End" ? list.length - 1 : (i + (e.key === "ArrowDown" ? 1 : -1) + list.length) % list.length;
          list[next].focus();
        })
      ];
      reveal();
      el.__rikoSidenavOff = () => offs.forEach((f) => f());
      return {
        expand: (g) => setExpanded(typeof g === "number" ? groups()[g] : g, true),
        collapse: (g) => setExpanded(typeof g === "number" ? groups()[g] : g, false),
        expandAll: () => groups().forEach((g) => setExpanded(g, true)),
        collapseAll: () => groups().forEach((g) => setExpanded(g, false)),
        /** 设置当前项（元素或 href），并展开、滚动到可见 */
        setCurrent(target) {
          const item = typeof target === "string" ? el.querySelector(`.riko-sidenav__item[href="${CSS.escape(target)}"]`) : target;
          if (!item) return;
          el.querySelectorAll(CURRENT).forEach((n) => n.removeAttribute("aria-current"));
          item.setAttribute("aria-current", "page");
          reveal(item);
        },
        reveal
      };
    },
    destroy(el) {
      el.__rikoSidenavOff?.();
    }
  };

  // packages/core/src/js/components/table-sort.js
  var collator = new Intl.Collator("zh-CN", { numeric: true, sensitivity: "base" });
  var num = (s) => {
    const t = String(s).replace(/[,\s%¥$￥]/g, "");
    return t !== "" && !isNaN(t) ? Number(t) : null;
  };
  var table_sort_default = {
    name: "table-sort",
    init(table) {
      const head = table.tHead && table.tHead.rows[table.tHead.rows.length - 1];
      const body = table.tBodies[0];
      if (!head || !body) return;
      const ths = Array.from(head.cells).filter((th) => th.tagName === "TH" && th.getAttribute("data-riko-sort") !== "false");
      ths.forEach((th) => {
        if (th.querySelector(".riko-table__sort")) return;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "riko-table__sort";
        while (th.firstChild) btn.appendChild(th.firstChild);
        th.appendChild(btn);
      });
      const sort = (th, direction) => {
        const index = th.cellIndex;
        const rows = Array.from(body.rows);
        const value = (r) => {
          const c = r.cells[index];
          return c ? c.getAttribute("data-riko-value") ?? c.textContent.trim() : "";
        };
        rows.sort((a, b) => {
          const x = value(a), y = value(b), nx = num(x), ny = num(y);
          const r = nx !== null && ny !== null ? nx - ny : collator.compare(x, y);
          return direction === "ascending" ? r : -r;
        });
        rows.forEach((r) => body.appendChild(r));
        head.querySelectorAll("th[aria-sort]").forEach((h) => h.removeAttribute("aria-sort"));
        th.setAttribute("aria-sort", direction);
        emit(table, "table:sort", { column: index, direction });
      };
      const off = on(head, "click", ".riko-table__sort", (e, btn) => {
        const th = btn.closest("th");
        sort(th, th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending");
      });
      table.__rikoSortOff = off;
      return { sort: (col, direction = "ascending") => sort(typeof col === "number" ? head.cells[col] : col, direction) };
    },
    destroy(table) {
      table.__rikoSortOff?.();
    }
  };

  // packages/core/src/js/components/tabs.js
  var tabs_default = {
    name: "tabs",
    init(el) {
      const list = el.querySelector(":scope > .riko-tabs__list") || el.querySelector(".riko-tabs__list");
      if (!list) return null;
      const tabs = Array.from(list.querySelectorAll(".riko-tabs__tab"));
      const ownPanels = Array.from(el.querySelectorAll(":scope > .riko-tabs__panel"));
      const vertical = el.classList.contains("riko-tabs--vertical");
      const manual = opt(el, "activation", "auto") === "manual";
      list.setAttribute("role", "tablist");
      if (vertical) list.setAttribute("aria-orientation", "vertical");
      const panelFor = (tab, i) => {
        const id = tab.getAttribute("aria-controls");
        return id && document.getElementById(id) || ownPanels[i] || null;
      };
      tabs.forEach((tab, i) => {
        tab.setAttribute("role", "tab");
        if (tab.tagName === "BUTTON" && !tab.hasAttribute("type")) tab.setAttribute("type", "button");
        const panel = panelFor(tab, i);
        ensureId(tab, "riko-tab");
        if (panel) {
          tab.setAttribute("aria-controls", ensureId(panel, "riko-tabpanel"));
          panel.setAttribute("role", "tabpanel");
          panel.setAttribute("aria-labelledby", tab.id);
          if (!panel.hasAttribute("tabindex")) panel.setAttribute("tabindex", "0");
        }
      });
      const enabled2 = (t) => !t.disabled && t.getAttribute("aria-disabled") !== "true";
      let index = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true" && enabled2(t));
      if (index < 0) index = tabs.findIndex(enabled2);
      const moveInk = () => {
        if (!el.classList.contains("riko-tabs--pills")) return;
        const t = tabs[index];
        if (!t) return;
        list.style.setProperty("--riko-tabs-x", t.offsetLeft + "px");
        list.style.setProperty("--riko-tabs-w", t.offsetWidth + "px");
        el.setAttribute("data-ready", "");
      };
      const keepVisible = (t) => {
        if (list.scrollWidth <= list.clientWidth) return;
        const l = t.offsetLeft, r = l + t.offsetWidth;
        if (l < list.scrollLeft) list.scrollLeft = l - 12;
        else if (r > list.scrollLeft + list.clientWidth) list.scrollLeft = r - list.clientWidth + 12;
      };
      const select = (i, { focus = false, silent = false } = {}) => {
        const tab = tabs[i];
        if (!tab || !enabled2(tab)) return;
        const changed = i !== index;
        index = i;
        tabs.forEach((t, j) => {
          const on2 = j === i;
          t.setAttribute("aria-selected", String(on2));
          t.tabIndex = on2 ? 0 : -1;
          const p = panelFor(t, j);
          if (p) {
            p.hidden = !on2;
            if (on2 && changed) {
              p.setAttribute("data-state", "entering");
              p.addEventListener("animationend", () => p.removeAttribute("data-state"), { once: true });
            }
          }
        });
        if (focus) tab.focus();
        keepVisible(tab);
        moveInk();
        if (changed && !silent) emit(el, "tabs:change", { index: i, tab, panel: panelFor(tab, i) });
      };
      const focusAt = (i) => {
        tabs[i].focus();
        keepVisible(tabs[i]);
        if (!manual) select(i);
      };
      const step = (from, dir) => {
        for (let k = 1; k <= tabs.length; k++) {
          const j = (from + dir * k + tabs.length * k) % tabs.length;
          if (enabled2(tabs[j])) return j;
        }
        return from;
      };
      const offs = [
        on(list, "click", ".riko-tabs__tab", (e, t) => select(tabs.indexOf(t), { focus: true })),
        on(list, "keydown", ".riko-tabs__tab", (e, t) => {
          const cur = tabs.indexOf(t);
          const prev = vertical ? "ArrowUp" : "ArrowLeft", next = vertical ? "ArrowDown" : "ArrowRight";
          let target = null;
          if (e.key === next) target = step(cur, 1);
          else if (e.key === prev) target = step(cur, -1);
          else if (e.key === "Home") target = tabs.findIndex(enabled2);
          else if (e.key === "End") {
            for (let j = tabs.length - 1; j >= 0; j--) if (enabled2(tabs[j])) {
              target = j;
              break;
            }
          } else if ((e.key === "Enter" || e.key === " ") && manual) {
            e.preventDefault();
            select(cur);
            return;
          }
          if (target === null) return;
          e.preventDefault();
          focusAt(target);
        })
      ];
      const ro = new ResizeObserver(moveInk);
      ro.observe(list);
      offs.push(() => ro.disconnect());
      if (document.fonts?.ready) document.fonts.ready.then(moveInk);
      select(index, { silent: true });
      el.__rikoTabsOff = () => offs.forEach((f) => f());
      return {
        select: (i) => select(i),
        get index() {
          return index;
        },
        get tabs() {
          return tabs;
        }
      };
    },
    destroy(el) {
      el.__rikoTabsOff?.();
    }
  };

  // packages/core/src/js/components/tag.js
  var LAYOUT = /^riko-(stack|cluster|grid|container|section|split|page|center|spacer|u-|list$|table-wrap$|avatar-group$)/;
  function findTarget(trigger) {
    const v = trigger.getAttribute("data-riko-dismiss");
    if (v) return v.startsWith("#") ? document.querySelector(v) : trigger.closest(v);
    for (let p = trigger.parentElement; p && p !== document.body; p = p.parentElement) {
      if (Array.from(p.classList).some((c) => /^riko-[a-z0-9-]+$/.test(c) && !LAYOUT.test(c))) return p;
    }
    return trigger.parentElement;
  }
  function dismiss(target, { trigger = null } = {}) {
    if (!target || !target.isConnected) return false;
    if (!emit(target, "dismiss", { target, trigger }, true)) return false;
    let nextFocus = null;
    if (trigger && target.contains(document.activeElement)) {
      const sib = target.nextElementSibling && target.nextElementSibling.querySelector("[data-riko-dismiss]") || target.previousElementSibling && target.previousElementSibling.querySelector("[data-riko-dismiss]");
      nextFocus = sib || null;
    }
    const parent = target.parentElement;
    const done = () => {
      target.remove();
      emit(parent || document, "dismissed", { target });
      if (nextFocus && nextFocus.isConnected) nextFocus.focus();
    };
    if (prefersReducedMotion()) done();
    else {
      target.setAttribute("data-riko-dismissing", "");
      setTimeout(done, 200);
    }
    return true;
  }
  if (typeof document !== "undefined") {
    document.addEventListener("click", (e) => {
      const trigger = e.target instanceof Element && e.target.closest("[data-riko-dismiss]");
      if (!trigger || trigger.closest('[aria-disabled="true"],:disabled')) return;
      e.preventDefault();
      dismiss(findTarget(trigger), { trigger });
    });
  }
  var tag_default = {
    name: "dismiss",
    init(el) {
      if (!el.hasAttribute("data-riko-dismiss")) el.setAttribute("data-riko-dismiss", "");
      if (el.tagName === "BUTTON" && !el.hasAttribute("type")) el.setAttribute("type", "button");
    }
  };
  var api4 = { dismiss };

  // packages/core/src/js/components/tags-input.js
  var SPLIT = /[,，、\n]/;
  var tags_input_default = {
    name: "tags-input",
    init(el) {
      const input = el.querySelector(".riko-tags-input__input") || el.querySelector('input:not([type="hidden"])');
      if (!input) return;
      let hidden = el.querySelector('input[type="hidden"]');
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        el.appendChild(hidden);
      }
      const name = opt(el, "name", "");
      if (name) hidden.name = name;
      const max = opt(el, "max", Infinity);
      const unique = opt(el, "unique", true);
      const label = input.getAttribute("aria-label") || "\u6807\u7B7E";
      if (!el.hasAttribute("role")) el.setAttribute("role", "group");
      if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", label);
      const live3 = document.createElement("span");
      live3.className = "riko-u-sr-only";
      live3.setAttribute("aria-live", "polite");
      el.appendChild(live3);
      let tags = [];
      const initial = el.querySelectorAll(".riko-tags-input__tag");
      if (initial.length) tags = Array.from(initial, (t) => (t.querySelector(".riko-tags-input__label") || t).textContent.trim());
      else tags = String(opt(el, "value", "") || hidden.value || "").split(SPLIT).map((s) => s.trim()).filter(Boolean);
      initial.forEach((t) => t.remove());
      const render = () => {
        el.querySelectorAll(".riko-tags-input__tag").forEach((t) => t.remove());
        const frag = document.createDocumentFragment();
        tags.forEach((t, i) => {
          const span = document.createElement("span");
          span.className = "riko-tags-input__tag";
          span.innerHTML = `<span class="riko-tags-input__label">${escapeHtml(t)}</span><button type="button" class="riko-tags-input__remove" data-index="${i}" aria-label="\u79FB\u9664\u6807\u7B7E ${escapeHtml(t)}"></button>`;
          frag.appendChild(span);
        });
        el.insertBefore(frag, input);
        hidden.value = tags.join(",");
        if (tags.length >= max) input.placeholder = "";
        else if (input.dataset.placeholder) input.placeholder = input.dataset.placeholder;
      };
      input.dataset.placeholder = input.placeholder;
      const changed = () => {
        render();
        hidden.dispatchEvent(new Event("change", { bubbles: true }));
        emit(el, "tags-input:change", { tags: tags.slice(), value: hidden.value });
      };
      const add = (raw) => {
        const items = String(raw).split(SPLIT).map((s) => s.trim()).filter(Boolean);
        let added = 0;
        for (const t of items) {
          if (tags.length >= max) {
            live3.textContent = `\u6700\u591A\u53EA\u80FD\u6DFB\u52A0 ${max} \u4E2A\u6807\u7B7E`;
            break;
          }
          if (unique && tags.some((x) => x.toLowerCase() === t.toLowerCase())) {
            live3.textContent = `\u300C${t}\u300D\u5DF2\u7ECF\u6DFB\u52A0\u8FC7\u5566`;
            continue;
          }
          tags.push(t);
          added++;
          live3.textContent = `\u5DF2\u6DFB\u52A0 ${t}`;
        }
        if (added) changed();
        return added;
      };
      const remove = (i) => {
        if (i < 0 || i >= tags.length) return;
        const [t] = tags.splice(i, 1);
        live3.textContent = `\u5DF2\u79FB\u9664 ${t}`;
        changed();
      };
      const disarm = () => el.querySelector('.riko-tags-input__tag[data-state="armed"]')?.removeAttribute("data-state");
      const offs = [
        on(input, "keydown", (e) => {
          if ((e.key === "Enter" || e.key === "," || e.key === "\uFF0C") && !e.isComposing) {
            if (input.value.trim()) {
              e.preventDefault();
              if (add(input.value)) input.value = "";
            } else if (e.key !== "Enter") e.preventDefault();
          } else if (e.key === "Backspace" && !input.value && tags.length) {
            const last = el.querySelectorAll(".riko-tags-input__tag");
            const armed = last[last.length - 1];
            if (armed.getAttribute("data-state") === "armed") remove(tags.length - 1);
            else {
              armed.setAttribute("data-state", "armed");
              live3.textContent = `\u518D\u6309\u4E00\u6B21\u9000\u683C\u5220\u9664 ${tags.at(-1)}`;
            }
          } else disarm();
        }),
        on(input, "input", () => {
          if (SPLIT.test(input.value)) {
            const parts = input.value.split(SPLIT);
            const rest = parts.pop();
            add(parts.join(","));
            input.value = rest;
          }
        }),
        on(input, "blur", () => {
          disarm();
          if (input.value.trim() && opt(el, "add-on-blur", true)) {
            if (add(input.value)) input.value = "";
          }
        }),
        on(el, "click", ".riko-tags-input__remove", (e, b) => {
          e.stopPropagation();
          remove(+b.dataset.index);
          input.focus();
        }),
        on(el, "click", (e) => {
          if (e.target === el) input.focus();
        })
      ];
      render();
      el.__rikoTagsOff = () => offs.forEach((f) => f());
      return {
        get tags() {
          return tags.slice();
        },
        add,
        remove,
        clear() {
          tags = [];
          changed();
        },
        set(list) {
          tags = [];
          add(Array.isArray(list) ? list.join(",") : list);
          if (!tags.length) changed();
        }
      };
    },
    destroy(el) {
      el.__rikoTagsOff?.();
    }
  };

  // packages/core/src/js/components/theme-picker.js
  var OPTIONS = [
    ["system", "monitor", "\u6309\u7CFB\u7EDF\u8BBE\u7F6E", "\u81EA\u52A8\u8DDF\u968F\u7CFB\u7EDF\u7684\u6DF1\u6D45\u8272\u6A21\u5F0F"],
    ["time", "clock", "\u6309\u65F6\u95F4\u8BBE\u7F6E", "\u672C\u5730\u65F6\u95F4 8:00\u201318:00 \u4E3A\u6D45\u8272\uFF0C\u5176\u4F59\u4E3A\u6DF1\u8272"],
    ["light", "sun", "\u6D45\u8272\u6A21\u5F0F", "\u7C73\u8272\u7EB8\u5F20\u822C\u7684\u767D\u5929"],
    ["dark", "moon", "\u6DF1\u8272\u6A21\u5F0F", "\u53EF\u53EF\u8272\u7684\u5B89\u9759\u591C\u665A"]
  ];
  var theme_picker_default = {
    name: "theme-picker",
    init(el) {
      if (!el.querySelector("[data-theme-mode]")) {
        el.innerHTML = OPTIONS.map(([mode2, icon, label, desc]) => `<button type="button" class="riko-theme-picker__option" data-theme-mode="${mode2}" aria-pressed="false"><span class="riko-theme-picker__icon"><span class="riko-icon riko-icon--${icon}" aria-hidden="true"></span></span><span class="riko-theme-picker__text"><span class="riko-theme-picker__label">${label}</span><span class="riko-theme-picker__desc">${desc}</span></span></button>`).join("");
      }
      if (!el.hasAttribute("role")) el.setAttribute("role", "group");
      if (!el.hasAttribute("aria-label") && !el.hasAttribute("aria-labelledby")) el.setAttribute("aria-label", "\u6DF1\u6D45\u8272\u6A21\u5F0F");
      const sync = () => el.querySelectorAll("[data-theme-mode]").forEach((b) => b.setAttribute("aria-pressed", String(b.getAttribute("data-theme-mode") === theme.mode)));
      const offClick = on(el, "click", "[data-theme-mode]", (e, b) => theme.set(b.getAttribute("data-theme-mode")));
      const offChange = on(document, "riko:theme:change", sync);
      sync();
      el.__rikoOff = () => {
        offClick();
        offChange();
      };
      return { sync };
    },
    destroy(el) {
      el.__rikoOff?.();
    }
  };

  // packages/core/src/js/components/theme-toggle.js
  var theme_toggle_default = {
    name: "theme-toggle",
    init(el) {
      if (!el.innerHTML.trim()) {
        el.innerHTML = '<span class="riko-icon riko-icon--sun riko-theme-toggle__sun" aria-hidden="true"></span><span class="riko-icon riko-icon--moon riko-theme-toggle__moon" aria-hidden="true"></span>';
      }
      el.classList.add("riko-theme-toggle");
      if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", "\u5207\u6362\u6DF1\u6D45\u8272");
      const sync = () => el.setAttribute("aria-pressed", String(theme.current === "dark"));
      const offClick = on(el, "click", () => theme.toggle());
      const offChange = on(document, "riko:theme:change", sync);
      sync();
      el.__rikoOff = () => {
        offClick();
        offChange();
      };
    },
    destroy(el) {
      el.__rikoOff?.();
    }
  };

  // packages/core/src/js/components/toast.js
  var config2 = { position: "bottom-right", max: 4, duration: 4e3 };
  var POSITIONS = ["top-right", "top-center", "top-left", "bottom-right", "bottom-center", "bottom-left"];
  var live2 = /* @__PURE__ */ new Set();
  function toaster(position2) {
    const pos = POSITIONS.includes(position2) ? position2 : "bottom-right";
    let box = document.querySelector(`.riko-toaster[data-position="${pos}"]`);
    if (!box) {
      box = document.createElement("section");
      box.className = "riko-toaster";
      box.setAttribute("data-position", pos);
      box.setAttribute("aria-label", "\u901A\u77E5");
      box.setAttribute("aria-live", "polite");
      box.setAttribute("aria-relevant", "additions");
      document.body.appendChild(box);
    }
    return box;
  }
  function toast(input = {}) {
    const o = typeof input === "string" ? { message: input } : { ...input };
    const tone = ["success", "warning", "danger", "accent", "info"].includes(o.tone) ? o.tone : "info";
    const duration = o.duration ?? config2.duration;
    const box = toaster(o.position || config2.position);
    const el = document.createElement("div");
    el.className = `riko-toast${tone === "info" ? "" : " riko-toast--" + tone}`;
    el.setAttribute("role", tone === "danger" ? "alert" : "status");
    el.style.setProperty("--riko-toast-duration", duration + "ms");
    el.innerHTML = `<span class="riko-toast__icon" aria-hidden="true">${o.icon ? `<i data-lucide="${escapeHtml(o.icon)}"></i>` : ""}</span><div class="riko-toast__content">` + (o.title ? `<p class="riko-toast__title">${escapeHtml(o.title)}</p>` : "") + (o.message ? `<p class="riko-toast__message">${escapeHtml(o.message)}</p>` : "") + `</div>` + (o.action ? `<button type="button" class="riko-toast__action">${escapeHtml(o.action.label)}</button>` : "") + `<button type="button" class="riko-toast__close" aria-label="\u5173\u95ED\u901A\u77E5"></button>` + (duration > 0 ? '<span class="riko-toast__timer" aria-hidden="true"></span>' : "");
    let timer2 = null, remaining = duration, startedAt = 0, closed = false;
    const pause = () => {
      if (timer2) {
        clearTimeout(timer2);
        timer2 = null;
        remaining -= Date.now() - startedAt;
      }
    };
    const resume = () => {
      if (duration > 0 && !timer2 && !closed) {
        startedAt = Date.now();
        timer2 = setTimeout(close, Math.max(remaining, 0));
      }
    };
    function close() {
      if (closed) return;
      closed = true;
      clearTimeout(timer2);
      live2.delete(handle);
      el.setAttribute("data-state", "closing");
      const done = () => {
        el.remove();
        if (!box.children.length) box.remove();
      };
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) done();
      else {
        el.addEventListener("animationend", (e) => {
          if (e.target === el) done();
        });
        setTimeout(done, 400);
      }
      o.onClose?.();
    }
    const handle = { el, close };
    el.querySelector(".riko-toast__close").addEventListener("click", close);
    el.querySelector(".riko-toast__action")?.addEventListener("click", () => {
      o.action.onClick?.(close);
      if (o.action.close !== false) close();
    });
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", (e) => {
      if (!el.contains(e.relatedTarget)) resume();
    });
    if (box.getAttribute("data-position").startsWith("top")) box.prepend(el);
    else box.appendChild(el);
    live2.add(handle);
    const overflow = live2.size - config2.max;
    if (overflow > 0) Array.from(live2).slice(0, overflow).forEach((h) => h.close());
    if (o.icon && window.Riko && typeof window.Riko.init === "function") window.Riko.init(el);
    resume();
    return handle;
  }
  ["success", "warning", "danger", "info", "accent"].forEach((tone) => {
    toast[tone] = (message, opts = {}) => toast({ ...typeof message === "string" ? { message } : message, ...opts, tone });
  });
  toast.configure = (opts = {}) => {
    Object.assign(config2, opts);
    return { ...config2 };
  };
  toast.clear = () => Array.from(live2).forEach((h) => h.close());
  if (typeof document !== "undefined" && !document.__rikoToastDelegation) {
    document.__rikoToastDelegation = true;
    document.addEventListener("click", (e) => {
      const t = e.target instanceof Element && e.target.closest("[data-riko-toast]");
      if (!t) return;
      toast({
        message: t.getAttribute("data-riko-toast"),
        title: t.getAttribute("data-riko-toast-title") || void 0,
        tone: t.getAttribute("data-riko-toast-tone") || void 0
      });
    });
  }
  var api5 = { toast };

  // packages/core/src/js/components/toc.js
  var toc_default = {
    name: "toc",
    init(el) {
      let list = el.querySelector(".riko-toc__list");
      const source = opt(el, "source", "");
      if (source && (!list || !list.children.length)) {
        const root = document.querySelector(source);
        const levels = opt(el, "levels", "h2,h3").split(",").map((s) => s.trim().toLowerCase());
        const heads = root ? Array.from(root.querySelectorAll(levels.map((l) => `${l}[id]`).join(","))) : [];
        if (!list) {
          list = document.createElement("ul");
          list.className = "riko-toc__list";
          el.appendChild(list);
        }
        let html = "", openSub = false;
        heads.forEach((h) => {
          const sub = h.tagName.toLowerCase() !== levels[0];
          const text = escapeHtml((h.getAttribute("data-toc-title") || h.textContent).trim());
          const link = `<a class="riko-toc__link" href="#${encodeURIComponent(h.id)}">${text}</a>`;
          if (sub) {
            html += (openSub ? "" : '<ul class="riko-toc__sublist">') + `<li>${link}</li>`;
            openSub = true;
          } else {
            html += (openSub ? "</ul></li>" : html ? "</li>" : "") + `<li>${link}`;
            openSub = false;
          }
        });
        if (html) html += openSub ? "</ul></li>" : "</li>";
        list.innerHTML = html;
      }
      if (el.tagName === "NAV" && !el.hasAttribute("aria-label") && !el.hasAttribute("aria-labelledby")) el.setAttribute("aria-label", "\u672C\u9875\u76EE\u5F55");
      const links = Array.from(el.querySelectorAll('.riko-toc__link[href^="#"]'));
      const targets = links.map((a) => document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1))));
      let current = -1, ticking = false;
      const threshold = (t) => {
        const o = opt(el, "offset", -1);
        if (o >= 0) return o;
        const root = getComputedStyle(document.documentElement);
        const header = (parseFloat(root.getPropertyValue("--riko-header-h")) || 72) + 24;
        const pad = parseFloat(root.scrollPaddingTop) || 0;
        return Math.max(header, pad + (parseFloat(getComputedStyle(t).scrollMarginTop) || 0) + 8);
      };
      const update = () => {
        ticking = false;
        let idx = -1;
        targets.forEach((t, i) => {
          if (t && t.getBoundingClientRect().top <= threshold(t)) idx = i;
        });
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
          for (let i = targets.length - 1; i >= 0; i--) if (targets[i]) {
            idx = i;
            break;
          }
        }
        if (idx === -1 && targets[0]) idx = 0;
        if (idx === current) return;
        current = idx;
        links.forEach((a, i) => i === idx ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current"));
        emit(el, "toc:change", { index: idx, link: links[idx], target: targets[idx] });
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      };
      const offs = [on(window, "scroll", onScroll, { passive: true }), on(window, "resize", onScroll)];
      update();
      el.__rikoTocOff = () => offs.forEach((f) => f());
      return { update, get index() {
        return current;
      } };
    },
    destroy(el) {
      el.__rikoTocOff?.();
    }
  };

  // packages/core/src/js/components/tooltip.js
  var supportsPopover = typeof HTMLElement !== "undefined" && "showPopover" in HTMLElement.prototype;
  var tooltip_default = {
    name: "tooltip",
    init(el) {
      let text = el.getAttribute("data-riko-tooltip");
      if (text === null && el.hasAttribute("title")) {
        text = el.getAttribute("title");
        el.setAttribute("data-riko-tooltip", text);
        el.removeAttribute("title");
      }
      const tip = document.createElement("div");
      tip.className = "riko-tooltip";
      tip.id = uid("riko-tip");
      tip.setAttribute("role", "tooltip");
      tip.textContent = text || "";
      if (supportsPopover) tip.setAttribute("popover", "manual");
      else tip.hidden = true;
      document.body.appendChild(tip);
      const describedBy = (el.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
      el.setAttribute("aria-describedby", describedBy.concat(tip.id).join(" "));
      let showTimer, hideTimer, open = false;
      const place = () => position(el, tip, { placement: opt(el, "placement", "top"), offset: 10 });
      const show2 = () => {
        clearTimeout(hideTimer);
        if (open || !tip.textContent.trim()) return;
        open = true;
        if (supportsPopover) {
          try {
            tip.showPopover();
          } catch {
          }
        } else tip.hidden = false;
        place();
        tip.getBoundingClientRect();
        tip.setAttribute("data-state", "open");
        document.addEventListener("keydown", onKey, true);
        window.addEventListener("scroll", place, true);
      };
      const hide = () => {
        clearTimeout(showTimer);
        if (!open) return;
        open = false;
        tip.removeAttribute("data-state");
        document.removeEventListener("keydown", onKey, true);
        window.removeEventListener("scroll", place, true);
        hideTimer = setTimeout(() => {
          if (open) return;
          if (supportsPopover) {
            try {
              tip.hidePopover();
            } catch {
            }
          } else tip.hidden = true;
        }, 160);
      };
      const onKey = (e) => {
        if (e.key === "Escape") {
          hide();
        }
      };
      const enter = () => {
        clearTimeout(hideTimer);
        showTimer = setTimeout(show2, opt(el, "delay", 150));
      };
      const leave = () => {
        clearTimeout(showTimer);
        hideTimer = setTimeout(hide, 80);
      };
      const handlers = [["pointerenter", enter], ["pointerleave", leave], ["focusin", show2], ["focusout", hide], ["click", hide]];
      handlers.forEach(([t, f]) => el.addEventListener(t, f));
      const mo = new MutationObserver(() => {
        const t = el.getAttribute("data-riko-tooltip");
        if (t !== null) {
          tip.textContent = t;
          if (open) place();
        }
      });
      mo.observe(el, { attributes: true, attributeFilter: ["data-riko-tooltip"] });
      el.__rikoTooltip = { tip, handlers, mo, hide };
      return {
        show: show2,
        hide,
        setText(t) {
          el.setAttribute("data-riko-tooltip", t);
        },
        get element() {
          return tip;
        }
      };
    },
    destroy(el) {
      const s = el.__rikoTooltip;
      if (!s) return;
      s.hide();
      s.handlers.forEach(([t, f]) => el.removeEventListener(t, f));
      s.mo.disconnect();
      s.tip.remove();
      const ids = (el.getAttribute("aria-describedby") || "").split(/\s+/).filter((id) => id && id !== s.tip.id);
      if (ids.length) el.setAttribute("aria-describedby", ids.join(" "));
      else el.removeAttribute("aria-describedby");
      el.__rikoTooltip = null;
    }
  };

  // packages/core/src/js/components/_registry.js
  var components = [accordion_default, autosize_default, backtop_default, carousel_default, combobox_default, command_default, copy_default, dialog_default, drawer_default, dropdown_default, dropzone_default, field_default, form_validate_default, navbar_default, number_default, otp_default, pagination_default, password_toggle_default, popover_default, range_default, reading_progress_default, reveal_default, search_default, sidenav_default, table_sort_default, tabs_default, tag_default, tags_input_default, theme_picker_default, theme_toggle_default, toc_default, tooltip_default];
  var api6 = Object.assign({}, api, api2, api3, api4, api5);

  // packages/core/src/js/index.js
  var version = "0.1.0";
  components.forEach(register);
  afterInit((scope) => {
    const lucide = typeof window !== "undefined" && window.lucide;
    if (!lucide || typeof lucide.createIcons !== "function") return;
    if (!scope.querySelector || !scope.querySelector(":not(svg)[data-lucide]")) return;
    lucide.createIcons({ icons: lucide.icons, root: scope.nodeType === 9 ? scope.documentElement : scope });
  });
  var DATE_MAX = { date: "9999-12-31", "datetime-local": "9999-12-31T23:59", month: "9999-12", week: "9999-W52" };
  afterInit((scope) => {
    if (!scope.querySelectorAll) return;
    scope.querySelectorAll("input.riko-input:not([max])").forEach((el) => {
      const max = DATE_MAX[el.type];
      if (max) el.max = max;
    });
  });
  var started = false;
  function start() {
    if (started) return;
    started = true;
    theme.start();
    init(document);
    observe();
  }
  var Riko = {
    version,
    start,
    init,
    destroy,
    register,
    registered,
    theme,
    themeInitSnippet,
    position,
    autoPosition,
    trapFocus,
    lockScroll,
    focusables,
    uid,
    on,
    emit,
    escapeHtml,
    store,
    ...api6
  };
  var { toast: toast2, dialog, confirm: confirm2, alert: alert2, highlight: highlight2, copy, dismiss: dismiss2 } = api6;
  var index_default = Riko;
  if (typeof window !== "undefined") {
    window.Riko = Object.assign(window.Riko || {}, Riko);
    if (!window.RikoManualStart) {
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
      else start();
    }
  }
})();
