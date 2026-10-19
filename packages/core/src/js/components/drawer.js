// 抽屉：<dialog class="riko-drawer" id="x" data-riko="drawer" aria-labelledby="x-title">…</dialog>
// 打开/关闭方式与 dialog 完全相同（data-riko-open / data-riko-close / el.riko.open()），事件为 riko:drawer:*
import { setupModal, destroyModal } from './dialog.js';
import { ensureId } from '../core/dom.js';

export default {
  name: 'drawer',
  init(el) {
    ensureId(el, 'riko-drawer');
    return setupModal(el, 'drawer');
  },
  destroy: destroyModal,
};
