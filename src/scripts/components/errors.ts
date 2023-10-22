import { navigate } from '../router';

export function showError(messageText: string, withBack?: boolean, id?: number): HTMLDivElement {
  const errorContainer = document.createElement('div');
  errorContainer.classList.add('main-error');
  const message = document.createElement('p');
  message.textContent = messageText;
  errorContainer.append(message);

  if (withBack) {
    const backHomeLink = document.createElement('a');
    backHomeLink.href = '/';
    backHomeLink.textContent = 'Back to home page?';
    backHomeLink.addEventListener('click', (e) => navigate('/?', e));
    errorContainer.append(backHomeLink);
  }
  if (id) console.error('id', id, 'not found');
  return errorContainer;
}
