import { createElement } from './utils';

export function showToast(textContent: string, level = 0, position?: { left: number; top: number }): void {
  const levelClass = level === 2 ? 'error' : level === 2 ? 'warning' : 'normal';
  const toast = createElement('div', { className: `toast ${levelClass}`, textContent });
  toast.style.left = `${position?.left}px` ?? '0';
  toast.style.top = `${position?.top}px` ?? '0';
  toast.animate([{ opacity: '0' }, { opacity: '1' }], 150);
  document.body.append(toast);
  setTimeout(() => {
    const anim = toast.animate([{ opacity: '1' }, { opacity: '0' }], 150);
    anim.onfinish = () => toast.remove();
  }, 1500);
}
