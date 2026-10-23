// Riko UI 文档站脚本：代码展示、复制、页内导航、API 表（来自 manifest.js）
(function () {
  'use strict';
  const PAGES = [
    ['index.html', '开始使用'], ['foundation.html', '设计基础'], ['layout.html', '布局与装饰'],
    ['general.html', '通用'], ['form.html', '表单'], ['form-advanced.html', '表单进阶'], ['navigation.html', '导航'],
    ['data.html', '数据展示'], ['feedback.html', '反馈'], ['templates.html', '页面模板'],
  ];
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ---- 侧边导航 ----
  const here = location.pathname.split('/').pop() || 'index.html';
  const side = document.querySelector('.docs-sidebar');
  if (side) {
    const sections = Array.from(document.querySelectorAll('.docs-section[id] > h2'));
    side.innerHTML = '<div class="docs-nav-group"><p class="docs-nav-title"><span class="riko-star riko-star--sm"></span>文档</p><ul class="docs-nav">' +
      PAGES.map(([href, name]) => `<li><a href="${href}"${href === here ? ' aria-current="page"' : ''}>${name}</a></li>` +
        (href === here && sections.length ? '<ul class="docs-nav docs-nav--sub">' + sections.map(h =>
          `<li><a href="#${h.parentNode.id}">${esc(h.childNodes[0].textContent.trim())}</a></li>`).join('') + '</ul>' : '')).join('') +
      '</ul></div>';
    const subLinks = Array.from(side.querySelectorAll('.docs-nav--sub a'));
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      subLinks.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + e.target.id)));
    }), { rootMargin: '-20% 0px -70% 0px' });
    sections.forEach(h => io.observe(h.parentNode));
    document.querySelector('.docs-menu-btn')?.addEventListener('click', () => document.body.classList.toggle('docs-nav-open'));
    side.addEventListener('click', e => { if (e.target.closest('a')) document.body.classList.remove('docs-nav-open'); });
  }

  // ---- 标题锚点 ----
  document.querySelectorAll('.docs-section[id] > h2').forEach(h => {
    h.insertAdjacentHTML('beforeend', `<a class="docs-anchor" href="#${h.parentNode.id}" aria-label="链接到本节">#</a>`);
  });

  // ---- 代码高亮（HTML） ----
  function highlight(code) {
    return esc(code)
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="tok-cmt">$1</span>')
      .replace(/(&lt;\/?)([a-z][\w-]*)/gi, '$1<span class="tok-tag">$2</span>')
      .replace(/\s([\w:-]+)(=)(&quot;|")(.*?)\3/g, (m, a, eq, q, v) => ` <span class="tok-attr">${a}</span>${eq}<span class="tok-str">"${v}"</span>`);
  }
  function dedent(html) {
    const lines = html.replace(/^\n+|\s+$/g, '').split('\n');
    const indent = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^\s*/)[0].length));
    return lines.map(l => l.slice(indent)).join('\n');
  }

  // 演示：在 Riko 初始化之前记录原始 HTML（显示的是手写的标准写法，而非 JS 生成后的 DOM）
  document.querySelectorAll('.docs-demo').forEach(demo => {
    if (demo.hasAttribute('data-docs-nocode')) return;
    const source = demo.querySelector('template[data-docs-code]')?.innerHTML ?? demo.innerHTML;
    const code = dedent(source);
    const wrap = document.createElement('div');
    wrap.className = 'docs-example';
    demo.parentNode.insertBefore(wrap, demo);
    wrap.appendChild(demo);
    const details = document.createElement('details');
    details.className = 'docs-code';
    details.innerHTML = '<summary>查看代码</summary><button type="button" class="docs-copy">复制</button><pre><code></code></pre>';
    details.querySelector('code').innerHTML = highlight(code);
    details.querySelector('.docs-copy').addEventListener('click', async e => {
      try { await navigator.clipboard.writeText(code); e.target.textContent = '已复制 ✓'; }
      catch { e.target.textContent = '复制失败'; }
      setTimeout(() => (e.target.textContent = '复制'), 1600);
    });
    wrap.appendChild(details);
  });

  // ---- API 表 ----
  const M = (window.RIKO_MANIFEST && window.RIKO_MANIFEST.components) || [];
  const byName = Object.fromEntries(M.map(c => [c.name, c]));
  const code = s => `<code>${esc(s)}</code>`;
  const table = (head, rows) => rows && rows.length ? `<table><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>` +
    rows.map(r => `<tr>${r.map(c => `<td>${c ?? ''}</td>`).join('')}</tr>`).join('') + '</tbody></table>' : '';
  document.querySelectorAll('.docs-section[id]').forEach(sec => {
    const c = byName[sec.id];
    if (!c || sec.hasAttribute('data-docs-noapi')) return;
    let html = `<div class="docs-api"><h4>API · ${esc(c.titleEn)}</h4>`;
    if (c.root) html += `<h5>根类</h5><p>${code(c.root)}${c.element ? ' · 推荐元素 ' + code('<' + c.element + '>') : ''}</p>`;
    if (c.parts?.length) html += '<h5>部件</h5>' + table(['类名', '说明'], c.parts.map(p => [code(p.class), esc(p.desc) + (p.required ? ' <b>（必需）</b>' : '')]));
    if (c.modifiers?.length) html += '<h5>修饰</h5>' + table(['类名', '分组', '说明'], c.modifiers.map(m => [code(m.class), m.group || '', esc(m.desc)]));
    if (c.states?.length) html += '<h5>状态</h5>' + table(['属性', '位置', '说明'], c.states.map(s => [code(s.attr), s.on ? code(s.on) : '根', esc(s.desc)]));
    if (c.js) {
      if (c.js.attr) html += `<h5>JS 启用</h5><p>${code(c.js.attr)}</p>`;
      if (c.js.options?.length) html += '<h5>选项</h5>' + table(['属性', '取值', '默认', '说明'], c.js.options.map(o => [code(o.attr), esc(o.values || ''), esc(o.default || ''), esc(o.desc)]));
      if (c.js.methods?.length) html += '<h5>方法</h5>' + table(['签名', '说明'], c.js.methods.map(m => [code(m.signature), esc(m.desc)]));
      if (c.js.events?.length) html += '<h5>事件</h5>' + table(['事件', 'detail', '说明'], c.js.events.map(e => [code(e.name), esc(e.detail || ''), esc(e.desc)]));
    }
    if (c.a11y?.length) html += '<h5>无障碍</h5><ul>' + c.a11y.map(s => `<li>${esc(s)}</li>`).join('') + '</ul>';
    if (c.rules?.length) html += '<h5>用法要点</h5><ul class="docs-rules">' + c.rules.map(s => `<li>${esc(s)}</li>`).join('') + '</ul>';
    if (c.avoid?.length) html += '<h5>避免</h5><ul class="docs-avoid">' + c.avoid.map(s => `<li>${esc(s)}</li>`).join('') + '</ul>';
    sec.insertAdjacentHTML('beforeend', html + '</div>');
  });
})();
