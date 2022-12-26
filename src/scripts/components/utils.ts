import sprite from '../../assets/svg/sprite.svg';

export const createElement = (tagName: string, options?: Partial<HTMLElement>): HTMLElement => {
  const element = document.createElement(tagName);
  if (options) {
    Object.assign(element, options);
  }
  return element;
};

export const createSvg = (classSvg: string, idSvg: string) => {
  const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgEl.classList.add('icon-svg', ...classSvg.split(' '));
  const useEl = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `${sprite}#${idSvg}`);
  svgEl.appendChild(useEl);
  return svgEl;
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
