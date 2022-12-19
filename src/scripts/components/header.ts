import { queryParams } from '../router';

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
  searchInput.onchange = () => {
    queryParams.set('search', searchInput.value);
  };

  const searchButton = document.createElement('button');
  searchButton.classList.add('search-container__button');
  searchButton.onclick = searchInput.onchange;

  searchContainer.append(searchInput, searchButton);

  const cashContainer = document.createElement('div');
  cashContainer.classList.add('header__cash-container');
  const cashSpanContainer = document.createElement('div');
  cashSpanContainer.classList.add('cash-container__span-container');

  const spanTotal = document.createElement('span');
  spanTotal.classList.add('span-container__span', 'span-total');
  spanTotal.textContent = 'Card total:';

  const spanSum = document.createElement('span');
  spanSum.classList.add('span-container__span', 'span-sum');
  spanSum.textContent = '€300.00';

  const basketContainer = document.createElement('div');
  basketContainer.classList.add('header__basket-container');

  const totalCount = document.createElement('div');
  totalCount.classList.add('basket-container__total');
  totalCount.textContent = '0';
  const basketButton = document.createElement('button');
  basketButton.classList.add('basket-container__basket-button');

  basketContainer.append(totalCount, basketButton);
  cashSpanContainer.append(spanTotal, spanSum);

  cashContainer.append(cashSpanContainer, basketContainer);

  header.append(logo, searchContainer, cashContainer);

  return header;
}
