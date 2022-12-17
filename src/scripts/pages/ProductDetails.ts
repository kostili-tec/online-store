import { IQueryParameters } from '../router';

export function ProductDetails(container: HTMLElement, product: IQueryParameters) {
  const div = document.createElement('div');
  div.textContent = `This is product info for ${product.id}`;

  container.replaceChildren(div);
}
