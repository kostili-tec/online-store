import { createElement } from './utils';

class Toaster {
  private toast: HTMLElement = createElement('div');
  public show(textContent: string, level = 0, position?: { left: number; top: number }): void {
    this.toast.remove();
    const levelClass = level === 2 ? 'error' : level === 2 ? 'warning' : 'normal';
    const toast = createElement('div', { className: `toast ${levelClass}`, textContent });
    toast.style.left = `${position?.left}px` ?? '50%';
    toast.style.top = `${position?.top}px` ?? '20px';
    toast.animate([{ opacity: '0' }, { opacity: '0.9' }], 150);
    document.body.append(toast);
    setTimeout(() => {
      const anim = toast.animate([{ opacity: '0.9' }, { opacity: '0' }], 150);
      anim.onfinish = () => toast.remove();
    }, 1200);

    this.toast = toast;
  }
}

export const toaster = new Toaster();
