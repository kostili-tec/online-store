import { createNotFound } from './ProductDetails';

export function Page404(container: HTMLElement) {
  const container404 = createNotFound('Page not found (404)');
  container.replaceChildren(container404);
}
