export const createElement = (tagName: string, options?: Partial<HTMLElement>): HTMLElement => {
  const element = document.createElement(tagName);
  if (options) {
    Object.assign(element, options);
  }
  return element;
};
