import { Spinner } from '../components/Spinner';
import { showError } from '../components/errors';
import { store } from '../store';
import { getProducts } from '../testApi';
import { IProduct } from '../testApi';
import { navigate, queryParams } from '../router';
import { createProductSpec } from './ProductDetails';
import { createElement, createSvg } from '../components/utils';
import { createPromo } from '../components/totalPromo';
import { onCartChange, untilReload } from '../events';

export async function Cart(container: HTMLElement): Promise<void> {
  const cartItems = store.cart.getItemsAll();
  if (cartItems.length === 0) return container.replaceChildren(showError('Your cart is empty', true));
  untilReload(
    onCartChange.subscribe(
      (status) => status === 'cleared' && container.replaceChildren(showError('Your cart is empty', true)),
    ),
  );

  container.replaceChildren(Spinner());
  const data = await getProducts();
  if (!data) {
    return container.replaceChildren(showError('Cannot connect to server', true));
  }
  const products = data.products;

  const cartContainer = createElement('div', { className: 'cart-container' });
  const productsContainer = createElement('div', { className: 'cart-container__products' });
  const cardsContainer = createElement('div', { className: 'cart-container__products-container' });

  const showPage = (pageNumber: number, perPage: number) => {
    const slice = store.cart.getItemsAll().slice(pageNumber * perPage, pageNumber * perPage + perPage);
    cardsContainer.replaceChildren(
      ...slice.map((item, index) => {
        const product = findProduct(products, item.id);
        const productNumber: number = index + perPage * pageNumber + 1;
        return (product && cartProductCard(product, item.count, productNumber)) ?? '';
      }),
    );
  };

  let perPage = Number(queryParams.get('limit')) || 3;
  if (![3, 5, 10, 20].includes(perPage)) {
    perPage = 3;
    queryParams.set('limit', '3');
  }
  const maxPage = Math.ceil(store.cart.getItemsAll().length / perPage);
  let currentPage = Number(queryParams.get('page')) || 0;
  if (currentPage >= maxPage) {
    currentPage = maxPage - 1;
    queryParams.set('page', String(currentPage));
  }

  const state = { currentPage, perPage, maxPage };

  showPage(state.currentPage, state.perPage);

  const controllPagination = topBar(showPage, state);
  productsContainer.append(controllPagination, cardsContainer);

  const promo = createPromo();
  cartContainer.append(productsContainer, promo);

  container.replaceChildren(cartContainer);
}

function topBar(
  showPage: (pageNumber: number, perPage: number) => void,
  state: { currentPage: number; perPage: number; maxPage: number },
): HTMLElement {
  const topBarContainer = createElement('div', { className: 'products__top-container' });
  const topTitle = createElement('h2', { textContent: 'Cart' });

  const controlContainer = createElement('div', { className: 'top-container__control' });
  const labelSelect = document.createElement('label');
  labelSelect.textContent = 'Items per page:';
  labelSelect.setAttribute('for', 'count-products');
  const customSelect = createElement('div', { className: 'custom-select' });
  const itemsSelect = createElement('select', { id: 'count-products' }) as HTMLSelectElement;
  itemsSelect.classList.add('top-container__control-select');
  const optionsValues = [3, 5, 10, 20];
  optionsValues.forEach((el) => {
    const selectOption = document.createElement('option');
    selectOption.value = String(el);
    selectOption.textContent = String(el);
    if (state.perPage === el) selectOption.selected = true;
    itemsSelect.append(selectOption);
  });
  customSelect.append(itemsSelect);
  const paginationContainer = createElement('div', {
    className: 'top-container__pagination-container count-container',
  });
  const leftButton = createElement('button', { className: 'pagination-container__left' });
  leftButton.append(createSvg('chevron-left', 'chevron-left'));
  const rightButton = createElement('button', { className: 'pagination-container__right' });
  rightButton.append(createSvg('chevron-right', 'chevron-left'));
  const numberPageSpan = createElement('span', { textContent: String(state.currentPage + 1) });

  rightButton.onclick = () => {
    if (state.currentPage < state.maxPage - 1) {
      state.currentPage += 1;
      queryParams.set('page', String(state.currentPage));
      numberPageSpan.textContent = String(state.currentPage + 1);
      showPage(state.currentPage, state.perPage);
    }
  };
  leftButton.onclick = () => {
    if (state.currentPage > 0) {
      state.currentPage -= 1;
      queryParams.set('page', String(state.currentPage));
      numberPageSpan.textContent = String(state.currentPage + 1);
      showPage(state.currentPage, state.perPage);
    }
  };

  itemsSelect.oninput = () => {
    state.perPage = Number(itemsSelect.value);
    queryParams.set('limit', itemsSelect.value);
    state.maxPage = Math.ceil(store.cart.getItemsAll().length / state.perPage);
    if (state.currentPage >= state.maxPage) {
      state.currentPage = state.maxPage - 1;
      queryParams.set('page', String(state.currentPage));
      numberPageSpan.textContent = String(state.currentPage + 1);
    }
    showPage(state.currentPage, state.perPage);
  };

  untilReload(
    onCartChange.subscribe((status) => {
      if (status !== 'deleted') return;
      state.maxPage = Math.ceil(store.cart.getItemsAll().length / state.perPage);
      if (state.currentPage >= state.maxPage) {
        state.currentPage = state.maxPage - 1;
        numberPageSpan.textContent = String(state.currentPage + 1);
      }
      showPage(state.currentPage, state.perPage);
    }),
  );

  paginationContainer.append(leftButton, numberPageSpan, rightButton);
  controlContainer.append(labelSelect, customSelect, paginationContainer);
  topBarContainer.append(topTitle, controlContainer);
  return topBarContainer;
}

function cartProductCard(product: IProduct, count: number, index: number): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('product-card', 'cart-product__card');

  const numberProduct = createElement('span', { className: 'product-card__number', textContent: `${index}` });
  container.append(numberProduct);
  const discountPercentage = Math.round(product.discountPercentage);
  if (discountPercentage) {
    const discount = document.createElement('span');
    discount.className = 'product-card__discount count-tag';
    discount.textContent = ` - ${Math.round(discountPercentage)} %`;
    container.append(discount);
  }

  const leftContainer = document.createElement('div');
  leftContainer.classList.add('prodcur-card__left-container');

  const productImage = document.createElement('img');
  productImage.className = 'product-card__image';
  productImage.src = product.thumbnail;
  productImage.alt = product.title;
  productImage.onclick = (e) => navigate('/product?=' + product.id, e);

  const crossSvg = createSvg('cross-svg', 'cross');
  const removeButton = document.createElement('button');
  removeButton.classList.add('prodcut-card__remove-button');
  removeButton.appendChild(crossSvg);

  leftContainer.append(productImage);

  removeButton.addEventListener('click', () => {
    store.cart.delete(product.id);
    container.remove();
  });

  const productInfo = document.createElement('div');
  productInfo.className = 'product-card__info';
  const title = document.createElement('h4');
  title.className = 'card-info__title';
  title.classList.add('card-info__title', 'product-card__title');
  title.textContent = product.title;
  title.onclick = (e) => navigate('/product?=' + product.id, e);

  const rating = document.createElement('div');
  rating.className = 'card-info__rating ';
  const ratingPercent = product.rating ? (product.rating * 100) / 5 : 0;
  rating.style.backgroundImage = `linear-gradient(to right, #151515 0%, #151515 ${ratingPercent}%, #ccc ${ratingPercent}%)`;
  rating.title = product.rating.toString();
  const brand = createProductSpec('Brand', product.brand);
  const category = createProductSpec('Category', product.category);
  const inStock = createProductSpec('Stock', product.stock);
  productInfo.append(title, brand, category, inStock, rating);

  const buyOptions = document.createElement('div');
  buyOptions.className = 'product-card__options';

  const priceContainer = document.createElement('div');
  priceContainer.className = 'card-pricing';
  const discountedPrice = document.createElement('p');
  discountedPrice.classList.add('card-pricing__discounted', 'prices-container__discount');
  priceContainer.append(discountedPrice);

  const originalPrice = document.createElement('p');
  originalPrice.classList.add('card-pricing__original', 'prices-container__original');
  if (discountPercentage) priceContainer.append(originalPrice);

  const setPrice = (count: number): void => {
    discountedPrice.textContent = `${(count * product.price * ((100 - product.discountPercentage) / 100)).toFixed(
      2,
    )} USD`;
    originalPrice.textContent = (product.price * count).toFixed(2) + ' USD';
  };
  setPrice(count);

  const plusMinus = createPlusMinusButtons(product, container, setPrice);
  buyOptions.append(removeButton, priceContainer, plusMinus);

  container.append(leftContainer, productInfo, buyOptions);
  return container;
}

function createPlusMinusButtons(
  product: IProduct,
  productCardEl: HTMLDivElement,
  setPrice: (count: number) => void,
): HTMLElement {
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('count-container');
  const minusButton = document.createElement('button');
  minusButton.classList.add('count-container__minus', 'count-container__button');
  minusButton.textContent = '−';
  const countSpan = document.createElement('span');
  countSpan.textContent = String(store.cart.getCountById(product.id));
  const plusButton = document.createElement('button');
  plusButton.classList.add('count-container__plus', 'count-container__button');
  plusButton.textContent = '+';

  plusButton.addEventListener('click', () => {
    const count = store.cart.getCountById(product.id);
    if (count) {
      if (count === product.stock) return;
      store.cart.add(product.id, product.price);
      countSpan.textContent = String(count + 1);
      setPrice(count + 1);
    }
  });
  minusButton.addEventListener('click', () => {
    store.cart.deleteOne(product.id);
    const count = store.cart.getCountById(product.id);
    if (count) {
      countSpan.textContent = count.toString();
      setPrice(count);
    } else {
      productCardEl.remove();
    }
  });
  buttonsContainer.append(minusButton, countSpan, plusButton);
  return buttonsContainer;
}

function findProduct(products: IProduct[], id: number): undefined | IProduct {
  return products.find((item) => item.id === id);
}
