export function Spinner(): HTMLElement {
  const spinnerContainer = document.createElement('div');
  spinnerContainer.className = 'spinner-loader';
  spinnerContainer.innerHTML = `<svg class="spinner-loader__svg" viewBox="0 0 50 50">
  <circle class="spinner-loader__path" cx="25" cy="25" r="20" fill="none" stroke-width="3"></circle>
</svg>`;

  return spinnerContainer;
}
