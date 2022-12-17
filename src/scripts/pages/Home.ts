export async function Home(container: HTMLElement) {
  const div = document.createElement('div');
  div.textContent = 'This is homepage!';
  container.replaceChildren(div);
}
