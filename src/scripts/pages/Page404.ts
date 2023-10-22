import { showError } from '../components/errors';

export function Page404(container: HTMLElement) {
  const container404 = showError('Page not found (404)', true);
  container.replaceChildren(container404);
}
