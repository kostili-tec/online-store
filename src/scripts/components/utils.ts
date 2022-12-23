export const createElement = (tagName: string, options?: Partial<HTMLElement>): HTMLElement => {
  const element = document.createElement(tagName);
  if (options) {
    Object.assign(element, options);
  }
  return element;
};

export const createImage = (options?: Partial<HTMLImageElement>) => createElement('img', options) as HTMLImageElement;
