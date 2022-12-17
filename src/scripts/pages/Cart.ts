export function Cart(container: HTMLElement) {
  const div = document.createElement('div');
  div.textContent = `This is cart`;

  container.replaceChildren(div);
}
