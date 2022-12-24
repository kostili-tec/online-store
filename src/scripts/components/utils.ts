export const createElement = (tagName: string, options?: Partial<HTMLElement>): HTMLElement => {
  const element = document.createElement(tagName);
  if (options) {
    Object.assign(element, options);
  }
  return element;
};

export const createImage = (options?: Partial<HTMLImageElement>) => createElement('img', options) as HTMLImageElement;

export class Timer {
  private timerId: number;
  constructor(private callback: () => void, private time: number) {
    this.timerId = window.setInterval(this.callback, this.time);
  }
  restart() {
    this.stop();
    this.timerId = window.setInterval(this.callback, this.time);
  }
  stop() {
    clearInterval(this.timerId);
  }
}
