import { onCartChange, onPageReload, onQueryChange } from '../events';
import { navigate, queryParams } from '../router';
import { store } from '../store';

export function createHeader(): HTMLElement {
  const header = document.createElement('header');
  header.classList.add('header');

  const logo = document.createElement('h1');
  logo.textContent = 'Online-Store';
  logo.classList.add('header-logo');
  logo.onclick = (e) => navigate('/', e);

  const searchContainer = document.createElement('div');
  searchContainer.classList.add('header__search-container');

  const searchInput = document.createElement('input');
  searchInput.classList.add('search-container__input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search Products, categories ...';
  searchInput.onchange = () => {
    if (window.location.pathname === '/') queryParams.set('search', searchInput.value);
    else navigate('/?search=' + searchInput.value);
  };
  onPageReload.subscribe(() => (searchInput.value = queryParams.get('search')));
  onQueryChange.subscribe((query) => (searchInput.value = query.search ?? ''));

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
  spanTotal.textContent = 'Cart total:';

  const spanSum = document.createElement('span');
  spanSum.classList.add('span-container__span', 'span-sum');
  spanSum.textContent = `${store.cart.getPriceAll().toFixed(2)} USD`;
  onCartChange.subscribe(() => (spanSum.textContent = `${store.cart.getPriceAll().toFixed(2)} USD`));

  const basketContainer = document.createElement('div');
  basketContainer.classList.add('header__basket-container');

  const totalCount = document.createElement('div');
  totalCount.classList.add('basket-container__total');
  totalCount.textContent = store.cart.getCountAll().toString();
  onCartChange.subscribe(() => (totalCount.textContent = store.cart.getCountAll().toString()));
  const basketButton = document.createElement('button');
  basketButton.classList.add('basket-container__basket-button');
  basketButton.onclick = (e) => navigate('/cart', e);

  basketContainer.append(totalCount, basketButton);
  cashSpanContainer.append(spanTotal, spanSum);

  cashContainer.append(cashSpanContainer, basketContainer);

  header.append(logo, searchContainer, cashContainer);

  return header;
}
