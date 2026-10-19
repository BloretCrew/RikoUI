// 表格排序：<table class="riko-table" data-riko="table-sort">
// 表头 th 自动变为排序按钮；th 加 data-riko-sort="false" 禁止排序；
// 单元格可用 data-riko-value 指定排序值（如日期时间戳）。
import { on, emit } from '../core/dom.js';

const collator = new Intl.Collator('zh-CN', { numeric: true, sensitivity: 'base' });
const num = s => { const t = String(s).replace(/[,\s%¥$￥]/g, ''); return t !== '' && !isNaN(t) ? Number(t) : null; };

export default {
  name: 'table-sort',
  init(table) {
    const head = table.tHead && table.tHead.rows[table.tHead.rows.length - 1];
    const body = table.tBodies[0];
    if (!head || !body) return;
    const ths = Array.from(head.cells).filter(th => th.tagName === 'TH' && th.getAttribute('data-riko-sort') !== 'false');
    ths.forEach(th => {
      if (th.querySelector('.riko-table__sort')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'riko-table__sort';
      while (th.firstChild) btn.appendChild(th.firstChild);
      th.appendChild(btn);
    });
    const sort = (th, direction) => {
      const index = th.cellIndex;
      const rows = Array.from(body.rows);
      const value = r => { const c = r.cells[index]; return c ? (c.getAttribute('data-riko-value') ?? c.textContent.trim()) : ''; };
      rows.sort((a, b) => {
        const x = value(a), y = value(b), nx = num(x), ny = num(y);
        const r = nx !== null && ny !== null ? nx - ny : collator.compare(x, y);
        return direction === 'ascending' ? r : -r;
      });
      rows.forEach(r => body.appendChild(r));
      head.querySelectorAll('th[aria-sort]').forEach(h => h.removeAttribute('aria-sort'));
      th.setAttribute('aria-sort', direction);
      emit(table, 'table:sort', { column: index, direction });
    };
    const off = on(head, 'click', '.riko-table__sort', (e, btn) => {
      const th = btn.closest('th');
      sort(th, th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending');
    });
    table.__rikoSortOff = off;
    return { sort: (col, direction = 'ascending') => sort(typeof col === 'number' ? head.cells[col] : col, direction) };
  },
  destroy(table) { table.__rikoSortOff?.(); },
};
