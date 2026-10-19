// 浮层定位：把 floating 元素（position: fixed）放到 anchor 旁边，自动翻转与贴边
// placement: top | bottom | left | right，可带 -start / -end
export function position(anchor, floating, { placement = 'bottom', offset = 8, padding = 8, matchWidth = false } = {}) {
  const a = anchor.getBoundingClientRect();
  if (matchWidth) floating.style.minWidth = a.width + 'px';
  floating.style.position = 'fixed';
  floating.style.left = '0px';
  floating.style.top = '0px';
  // 用布局尺寸而非 getBoundingClientRect：浮层带缩放进场动画时也能定位准确
  const f = { width: floating.offsetWidth, height: floating.offsetHeight };
  const vw = document.documentElement.clientWidth, vh = window.innerHeight;
  let [side, align = 'center'] = placement.split('-');

  const fits = s => s === 'top' ? a.top - offset - f.height >= padding
    : s === 'bottom' ? a.bottom + offset + f.height <= vh - padding
    : s === 'left' ? a.left - offset - f.width >= padding
    : a.right + offset + f.width <= vw - padding;
  const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
  if (!fits(side) && fits(opposite[side])) side = opposite[side];

  let x, y;
  if (side === 'top' || side === 'bottom') {
    y = side === 'top' ? a.top - offset - f.height : a.bottom + offset;
    x = align === 'start' ? a.left : align === 'end' ? a.right - f.width : a.left + a.width / 2 - f.width / 2;
  } else {
    x = side === 'left' ? a.left - offset - f.width : a.right + offset;
    y = align === 'start' ? a.top : align === 'end' ? a.bottom - f.height : a.top + a.height / 2 - f.height / 2;
  }
  x = Math.min(Math.max(x, padding), vw - f.width - padding);
  y = Math.min(Math.max(y, padding), vh - f.height - padding);
  floating.style.left = Math.round(x) + 'px';
  floating.style.top = Math.round(y) + 'px';
  floating.setAttribute('data-placement', side);
  // 箭头位置（如有）：相对浮层的锚点中心
  const arrowX = a.left + a.width / 2 - x, arrowY = a.top + a.height / 2 - y;
  floating.style.setProperty('--riko-arrow-x', Math.round(Math.min(Math.max(arrowX, 12), f.width - 12)) + 'px');
  floating.style.setProperty('--riko-arrow-y', Math.round(Math.min(Math.max(arrowY, 12), f.height - 12)) + 'px');
  return side;
}

/** 持续跟随（滚动/缩放时重新定位），返回停止函数 */
export function autoPosition(anchor, floating, options) {
  const update = () => position(anchor, floating, options);
  update();
  window.addEventListener('scroll', update, true);
  window.addEventListener('resize', update);
  const ro = new ResizeObserver(update);
  ro.observe(floating);
  return () => {
    window.removeEventListener('scroll', update, true);
    window.removeEventListener('resize', update);
    ro.disconnect();
  };
}
