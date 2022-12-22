import { Spinner } from '../components/Spinner';
import { showError } from '../components/errors';
import { store } from '../store';
import { getProducts } from '../testApi';
import { IProduct } from '../testApi';
import { navigate } from '../router';
import { createProductSpec } from './ProductDetails';
import { createElement } from '../components/utils';
import sprite from '../../assets/svg/sprite.svg';

export async function Cart(container: HTMLElement) {
  const cartItems = store.cart.getItemsAll();
  if (cartItems.length === 0) return container.replaceChildren(showError('Your cart is empty', true));

  container.replaceChildren(Spinner());
  const data = await getProducts();
  if (!data) {
    return container.replaceChildren(showError('Cannot get data', true));
  }
  const products = data.products;

  const div = document.createElement('div');
  div.style.display = 'grid';
  div.style.gap = '20px';
  cartItems.forEach((item) => {
    const product = findProduct(products, item.id);
    if (product) div.append(cartProductCard(product));
  });

  const button = document.createElement('button');
  button.className = 'secondary-button';
  button.textContent = 'Test checkout';

  const promoSection = createPromo();

  container.replaceChildren(button, div, promoSection);
}

function cartProductCard(product: IProduct): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('product-card', 'cart-product__card');

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

  const crossSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  crossSvg.classList.add('icon-svg', 'cross-svg');
  const useSvg = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `${sprite}#cross`);
  crossSvg.appendChild(useSvg);
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
  productInfo.append(title, brand, category, rating);

  const buyOptions = document.createElement('div');
  buyOptions.className = 'product-card__options';

  const priceContainer = document.createElement('div');
  priceContainer.className = 'card-pricing';
  const discountedPrice = document.createElement('p');
  discountedPrice.classList.add('card-pricing__discounted', 'prices-container__discount');
  discountedPrice.textContent = `${(product.price * ((100 - product.discountPercentage) / 100)).toFixed(2)} USD`;
  priceContainer.append(discountedPrice);
  if (discountPercentage) {
    const originalPrice = document.createElement('p');
    originalPrice.classList.add('card-pricing__original', 'prices-container__original');
    originalPrice.textContent = product.price.toFixed(2) + ' USD';
    priceContainer.append(originalPrice);
  }
  const plusMinus = createPlusMinusButtons(product, container);
  buyOptions.append(removeButton, priceContainer, plusMinus);

  container.append(leftContainer, productInfo, buyOptions);
  return container;
}

function createPlusMinusButtons(product: IProduct, productCardEl: HTMLDivElement) {
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
    store.cart.add(product.id, product.price, product.discountPercentage);
    countSpan.textContent = String(store.cart.getCountById(product.id));
  });
  minusButton.addEventListener('click', () => {
    store.cart.deleteOne(product.id);
    if (store.cart.getCountById(product.id)) {
      countSpan.textContent = String(store.cart.getCountById(product.id));
    } else {
      productCardEl.remove();
    }
  });
  buttonsContainer.append(minusButton, countSpan, plusButton);
  return buttonsContainer;
}

function createPromo() {
  const promoContainer = createElement('div', { className: 'promo-container' });
  const products = createElement('p', { className: 'promo-container__producs', textContent: 'Products: ' });
  const productsCount = createElement('span', { textContent: `${store.cart.getCountAll()}` });
  products.append(productsCount);

  const totalFull = createElement('p', { textContent: 'Total: ' });
  const priceNoDiscont = store.cart.getItemsAll();
  console.log(priceNoDiscont);
  const totalFullSum = createElement('span', { textContent: `${store.cart.getPriceAll}` });
  promoContainer.append(products);
  return promoContainer;
}

function findProduct(products: IProduct[], id: number): undefined | IProduct {
  return products.find((item) => item.id === id);
}
