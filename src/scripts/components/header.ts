export function createHeader(): HTMLElement {
  const header = document.createElement('header');
  header.classList.add('header');

  const logo = document.createElement('h1');
  logo.textContent = 'Online-Store';
  logo.classList.add('header-logo');

  const searchContainer = document.createElement('div');
  searchContainer.classList.add('header__search-container');

  const searchInput = document.createElement('input');
  searchInput.classList.add('search-container__input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search Products, categories ...';

  const searchButton = document.createElement('button');
  searchButton.classList.add('search-container__button');
  const searchButtonSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  searchButtonSvg.innerHTML = '<use xlink:href="../../assets/svg/sprite.svg#glass"></use>';
  searchButtonSvg.classList.add('icon-svg', 'glass-svg');
  searchButton.append(searchButtonSvg);
  searchContainer.append(searchInput, searchButton);

  const basketButton = document.createElement('button');
  basketButton.classList.add('header__basket-button');
  const basketButtonSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  basketButtonSvg.classList.add('icon-svg', 'basket-svg');
  basketButtonSvg.innerHTML = '<use xlink:href="./../assets/svg/sprite.svg##basket"></use>';
  basketButton.append(basketButtonSvg);

  header.append(logo, searchContainer, basketButton);

  return header;
}
