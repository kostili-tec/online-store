import { Spinner } from '../components/Spinner';
import { showError } from '../components/errors';
import { store } from '../store';
import { getProducts } from '../testApi';
import { IProduct } from '../testApi';
import { navigate } from '../router';
import { createProductSpec } from './ProductDetails';
import { createElement } from '../components/utils';
import sprite from '../../assets/svg/sprite.svg';

export async function Cart(container: HTMLElement): Promise<void> {
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
  const cartContainer = createElement('div', { className: 'cart-container' });
  const productsContainer = createElement('div', { className: 'cart-container__products' });

  cartItems.forEach((item) => {
    const product = findProduct(products, item.id);
    if (product) productsContainer.append(cartProductCard(product));
  });

  const button = document.createElement('button');
  button.className = 'secondary-button';
  button.textContent = 'Test checkout';

  const promo = createPromo();
  cartContainer.append(productsContainer, promo);

  container.replaceChildren(cartContainer);
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

function createPlusMinusButtons(product: IProduct, productCardEl: HTMLDivElement): HTMLElement {
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
    store.cart.add(product.id, product.price);
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

function createPromo(): HTMLElement {
  const totalContainer = createElement('div', { className: 'total-container' });

  const titleOrder = createElement('h4', { className: 'total-container__title', textContent: 'Order Summary' });
  const products = createElement('p', { className: 'total-container__producs', textContent: 'Products: ' });
  const productsCount = createElement('span', { textContent: `${store.cart.getCountAll()}` });
  products.append(productsCount);

  const priceToFixed = store.cart.getPriceAll().toFixed(2);
  const totalFull = createElement('p', { textContent: 'Full price: ', className: 'total-container__price-full' });
  const totalFullSum = createElement('span', { textContent: `${priceToFixed} USD` }); // цена без скидок
  totalFull.append(totalFullSum);
  const totalDiscount = createElement('p', { textContent: 'Discount: ', className: 'total-container__price-disc' });
  const totalDiscountSum = createElement('span', { textContent: `sum of discount USD` }); // только сумма скидки
  totalDiscount.append(totalDiscountSum);

  const promoInputContainer = createElement('div', { className: 'total-container__promo-container' });
  const aplliedPromos = createElement('div', { className: 'total-container__promo-applied' });

  const promoInput = document.createElement('input');
  promoInput.placeholder = 'Apply promo code';
  promoInput.type = 'text';
  promoInput.classList.add('total-container__promo-input', 'search-container__input');
  const promoButton = createElement('button', { textContent: 'Apply now', className: 'total-container__promo-button' });
  promoButton.addEventListener('click', (e) => applyEvent(e, promoInput, aplliedPromos));
  promoInputContainer.append(promoInput, promoButton);

  const totalOrderContainer = createElement('div', { className: 'total-container__total-order' });
  const orderInfoContainer = createElement('div', { className: 'total-order__info' });
  const orderInfoTitle = createElement('p', { className: 'total-order__info-title', textContent: 'Total Order' });
  const orderInfoDate = createElement('p', {
    className: 'total-order__info-day',
    textContent: `Guaranteed delivery day: ${createDeliveryDate()}`,
  });
  orderInfoContainer.append(orderInfoTitle, orderInfoDate);
  totalOrderContainer.append(orderInfoContainer);

  const buyContainer = createElement('div', { className: 'total-container__buy-container' });
  const confirmButton = createElement('button', {
    className: 'buy-container__button primary-button',
    textContent: 'Checkout',
  });
  const finishSum = createElement('h3', {
    className: 'card-pricing__discounted prices-container__discount',
    textContent: `${priceToFixed} USD`, // итоговая цена со всеми скидками
  });
  buyContainer.append(confirmButton, finishSum);

  totalContainer.append(
    titleOrder,
    products,
    totalFull,
    totalDiscount,
    promoInputContainer,
    aplliedPromos,
    totalOrderContainer,
    buyContainer,
  );
  return totalContainer;
}

/* вместо енума, какой нибудь объект чтоли, например 
promoCodes = {
  promo1: {
    code: 'ts',
    discount: 10,
  }
} */

enum PromoCodes {
  promo1 = 'rs',
  promo2 = 'ts',
}

let countOfCodes = 0; // самый надежный счетчик

/* надо куда-нибудь сохранить введенный промокод и добавить проверку, был ли он использован */

const applyEvent = (e: MouseEvent, inputEl: HTMLInputElement, codesContaner: HTMLElement): void => {
  if (e.target instanceof HTMLElement) {
    const { target } = e;
    const inputText = inputEl.value.toLowerCase().trim();
    if (inputText === PromoCodes.promo1 || inputText === PromoCodes.promo2) {
      target.textContent = 'Success';
      if (countOfCodes === 0) {
        const appliedTitle = createElement('span', {
          textContent: 'Applied codes: ',
          className: 'promo-applied__title',
        });
        codesContaner.append(appliedTitle, createAppliedPromo(inputText, codesContaner));
        countOfCodes++;
      } else if (countOfCodes >= 1) {
        codesContaner.append(createAppliedPromo(inputText, codesContaner));
        countOfCodes++;
      }
    } else {
      target.textContent = 'Wrong code';
    }
    inputEl.value = '';
    setTimeout(() => (target.textContent = 'Apply now'), 850);
  }
};

const createAppliedPromo = (promoName: string, codesContaner: HTMLElement): HTMLElement => {
  const codeContainer = createElement('p', { textContent: `-10% ${promoName}`, className: 'promo-applied__code' });

  const crossSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  crossSvg.classList.add('icon-svg', 'cross-svg', 'cross-svg__promo');
  const useSvg = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `${sprite}#cross`);
  crossSvg.appendChild(useSvg);
  const removeButton = createElement('button', { className: 'prodcut-card__remove-button promo__remove-button' });
  removeButton.appendChild(crossSvg);
  removeButton.addEventListener('click', () => deleteAppliedPromo(codeContainer, codesContaner));
  codeContainer.appendChild(removeButton);
  return codeContainer;
};

const deleteAppliedPromo = (parentEl: HTMLElement, codesContaner: HTMLElement): void => {
  if (countOfCodes > 1) {
    countOfCodes--;
    parentEl.remove();
  } else if (countOfCodes <= 1) {
    countOfCodes--;
    codesContaner.replaceChildren();
  }
};

function createDeliveryDate(): string {
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const thisDate = new Date();
  thisDate.setDate(thisDate.getDate() + 3);
  return `${month[thisDate.getMonth()]} ${thisDate.getDate()} ${thisDate.getFullYear()}`;
}

function findProduct(products: IProduct[], id: number): undefined | IProduct {
  return products.find((item) => item.id === id);
}
