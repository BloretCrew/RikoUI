// Riko UI 类型声明
// 用法：import Riko from '@bloret-crew/riko-ui'；或全局 window.Riko（IIFE 版本）

export type ThemeMode = 'system' | 'time' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';
export type Placement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';
export type Tone = 'info' | 'success' | 'warning' | 'danger';

export interface ThemeChangeDetail { mode: ThemeMode; theme: ResolvedTheme; }

export interface ThemeAPI {
  readonly MODES: ThemeMode[];
  /** 当前模式 */
  readonly mode: ThemeMode;
  /** 实际生效的主题 */
  readonly current: ResolvedTheme;
  /** 配置存储键与「按时间」的白天范围（默认 'riko-theme'、8、18） */
  configure(options: { storageKey?: string; dayStart?: number; dayEnd?: number; root?: HTMLElement }): ThemeAPI;
  /** 读取保存的模式并应用（Riko 启动时自动调用） */
  start(): ThemeAPI;
  /** 设置模式并保存 */
  set(mode: ThemeMode): void;
  /** 浅色 ↔ 深色 */
  toggle(): void;
  /** 订阅变化，返回取消函数 */
  onChange(fn: (detail: ThemeChangeDetail) => void): () => void;
}

/** 组件定义（自定义组件也可注册） */
export interface ComponentDefinition<T = unknown> {
  name: string;
  init(el: HTMLElement): T | void;
  destroy?(el: HTMLElement): void;
}

export interface PositionOptions { placement?: Placement; offset?: number; padding?: number; matchWidth?: boolean; }

export interface RikoCore {
  readonly version: string;
  /** 启动（自动调用）：应用主题、初始化页面组件、监听 DOM 变化 */
  start(): void;
  /** 初始化 root（默认 document）内所有 [data-riko] 组件，并渲染 Lucide 图标 */
  init<T extends ParentNode = Document>(root?: T): T;
  /** 销毁 root 内组件实例 */
  destroy(root: Element): void;
  /** 注册自定义组件：<div data-riko="name"> */
  register<T>(def: ComponentDefinition<T>): void;
  /** 已注册的组件名 */
  registered(): string[];
  theme: ThemeAPI;
  /** 返回放进 <head> 的防闪烁脚本源码（SSR 内联用） */
  themeInitSnippet(storageKey?: string): string;
  /** 把浮层定位到锚点旁（fixed 定位，自动翻转与贴边），返回实际方向 */
  position(anchor: Element, floating: HTMLElement, options?: PositionOptions): 'top' | 'bottom' | 'left' | 'right';
  /** 持续跟随定位，返回停止函数 */
  autoPosition(anchor: Element, floating: HTMLElement, options?: PositionOptions): () => void;
  /** 焦点陷阱，返回释放函数（释放时焦点回到原元素） */
  trapFocus(root: HTMLElement, options?: { initial?: string; returnFocus?: boolean }): () => void;
  /** 锁定页面滚动，返回解锁函数 */
  lockScroll(): () => void;
  focusables(root: Element): HTMLElement[];
  uid(prefix?: string): string;
  on(target: EventTarget, type: string, listener: (e: Event) => void, options?: AddEventListenerOptions): () => void;
  on(target: Element | Document, type: string, selector: string, listener: (e: Event, matched: Element) => void, options?: AddEventListenerOptions): () => void;
  emit(el: Element, name: string, detail?: unknown, cancelable?: boolean): boolean;
  escapeHtml(s: string): string;
  store: {
    get(key: string, fallback?: string | null): string | null;
    set(key: string, value: unknown): void;
    remove(key: string): void;
    getJSON<T = unknown>(key: string, fallback?: T | null): T | null;
    setJSON(key: string, value: unknown): void;
  };
}

export type ToastTone = Tone | 'accent';
export type ToastPosition = 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
export interface ToastOptions {
  title?: string;
  message?: string;
  tone?: ToastTone;
  /** 毫秒，默认 4000；0 表示不自动关闭 */
  duration?: number;
  action?: { label: string; onClick?: (close: () => void) => void };
  /** Lucide 图标名 */
  icon?: string;
  position?: ToastPosition;
  onClose?: () => void;
}
export interface ToastHandle { el: HTMLElement; close(): void; }
export interface ToastFn {
  (messageOrOptions: string | ToastOptions): ToastHandle;
  success(message: string | ToastOptions, options?: ToastOptions): ToastHandle;
  warning(message: string | ToastOptions, options?: ToastOptions): ToastHandle;
  danger(message: string | ToastOptions, options?: ToastOptions): ToastHandle;
  info(message: string | ToastOptions, options?: ToastOptions): ToastHandle;
  accent(message: string | ToastOptions, options?: ToastOptions): ToastHandle;
  configure(options: { position?: ToastPosition; max?: number; duration?: number }): { position: ToastPosition; max: number; duration: number };
  clear(): void;
}

/** dialog / drawer / command 等弹层实例（el.riko） */
export interface ModalInstance {
  readonly isOpen: boolean;
  open(): ModalInstance | void;
  close(returnValue?: string): void;
  toggle(): void;
}
export type DialogTarget = string | HTMLElement;
export interface DialogAPI {
  open(target: DialogTarget): void;
  close(target: DialogTarget, returnValue?: string): void;
  toggle(target: DialogTarget): void;
  get(target: DialogTarget): ModalInstance | null;
}
export interface ConfirmOptions { title?: string; message?: string; confirmText?: string; cancelText?: string; tone?: ToastTone; }
export interface AlertOptions { title?: string; message?: string; okText?: string; tone?: ToastTone; }

export interface HighlightOptions {
  caseSensitive?: boolean;
  /** 高亮元素类名，默认 riko-mark */
  className?: string;
  /** 当前项类名，默认 riko-mark--current */
  currentClass?: string;
  /** 不参与高亮的元素选择器 */
  exclude?: string;
  /** 跳转时是否滚动到可见，默认 true */
  scroll?: boolean;
}
export interface HighlightController {
  readonly count: number;
  /** 当前项下标，无则 -1 */
  readonly index: number;
  readonly marks: HTMLElement[];
  go(index: number): number;
  next(): number;
  prev(): number;
  clear(): void;
}

export interface RikoComponents {
  /** 轻提示 */
  toast: ToastFn;
  /** 打开/关闭页面中的 <dialog class="riko-dialog|riko-drawer"> */
  dialog: DialogAPI;
  /** 确认对话框，确定返回 true */
  confirm(options?: ConfirmOptions | string): Promise<boolean>;
  /** 提示对话框 */
  alert(options?: AlertOptions | string): Promise<void>;
  /** 在容器内高亮所有匹配文字 */
  highlight(root: Element | string, query: string, options?: HighlightOptions): HighlightController;
  /** 复制文本到剪贴板，返回是否成功 */
  copy(text: string): Promise<boolean>;
  /** 淡出并移除元素（与 data-riko-dismiss 相同），返回是否执行 */
  dismiss(target: Element, options?: { trigger?: Element | null }): boolean;
}

export interface Riko extends RikoCore, RikoComponents {}

declare const Riko: Riko;
export default Riko;
export declare const theme: ThemeAPI;
export declare function init<T extends ParentNode = Document>(root?: T): T;
export declare function destroy(root: Element): void;
export declare function register<T>(def: ComponentDefinition<T>): void;
export declare const toast: ToastFn;
export declare function confirm(options?: ConfirmOptions | string): Promise<boolean>;
export declare function highlight(root: Element | string, query: string, options?: HighlightOptions): HighlightController;

declare global {
  interface Window {
    Riko: Riko;
    /** 设为 true 可阻止自动启动（之后手动 Riko.start()） */
    RikoManualStart?: boolean;
  }
  interface HTMLElement {
    /** data-riko 组件实例 */
    riko?: any;
  }
  interface DocumentEventMap {
    'riko:theme:change': CustomEvent<ThemeChangeDetail>;
  }
}
