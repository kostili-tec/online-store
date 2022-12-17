import { navigate } from '../router';

export function Page404(container: HTMLElement) {
  const div = document.createElement('div');
  div.textContent = 'Page not found';

  const link = document.createElement('a');
  link.textContent = 'Go to home';
  link.href = '/';
  link.onclick = (e) => navigate(link.href, e);

  container.replaceChildren(div, link);
}
