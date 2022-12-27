import { createElement } from './utils';
import { store } from '../store';
import { Checkout } from './Checkout';
import { showModal } from './modal';
import sprite from '../../assets/svg/sprite.svg';
import { onCartChange, onPromoChange, untilReload } from '../events';
import { checkPromo, IPromoCode } from '../testApi';

export function createPromo(): HTMLElement {
  const totalContainer = createElement('div', { className: 'total-container' });

  const titleOrder = createElement('h4', { className: 'total-container__title', textContent: 'Order Summary' });
  const products = createElement('p', { className: 'total-container__producs', textContent: 'Products: ' });
  const productsCount = createElement('span', { textContent: `${store.cart.getCountAll()}` });
  untilReload(onCartChange.subscribe(() => (productsCount.textContent = `${store.cart.getCountAll()}`)));
  products.append(productsCount);

  let cartTotal = store.cart.getPriceAll();
  const subTotal = createElement('p', { textContent: 'Subtotal price: ', className: 'total-container__price-full' });
  const subTotalSum = createElement('span', { textContent: `${cartTotal.toFixed(2)} USD` }); // цена без скидок
  subTotal.append(subTotalSum);

  const promoInputContainer = createElement('div', { className: 'total-container__promo-container' });
  const aplliedPromos = createElement('div', { className: 'total-container__promo-applied' });
  if (store.promos.getCount()) {
    aplliedPromos.append(
      AppliedTitle(),
      ...store.promos.getAll().map((code) => createAppliedPromo(code, aplliedPromos)),
    );
  }

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
  const checkoutButton = createElement('button', {
    className: 'buy-container__button primary-button',
    textContent: 'Checkout',
  });
  checkoutButton.addEventListener('click', () => showModal(Checkout));

  const totalSum = createElement('h3', {
    className: 'card-pricing__discounted prices-container__discount',
    textContent: `${(cartTotal * (1 - store.promos.getDiscountTotal())).toFixed(2)} USD`, // итоговая цена со всеми скидками
  });

  buyContainer.append(checkoutButton, totalSum);

  untilReload(
    onCartChange.subscribe(() => {
      cartTotal = store.cart.getPriceAll();
      subTotalSum.textContent = cartTotal.toFixed(2);
      totalSum.textContent = `${(cartTotal * (1 - store.promos.getDiscountTotal())).toFixed(2)} USD`;
    }),
  );

  untilReload(
    onPromoChange.subscribe(
      () => (totalSum.textContent = `${(cartTotal * (1 - store.promos.getDiscountTotal())).toFixed(2)} USD`),
    ),
  );

  totalContainer.append(
    titleOrder,
    products,
    subTotal,
    promoInputContainer,
    aplliedPromos,
    totalOrderContainer,
    buyContainer,
  );
  return totalContainer;
}

const applyEvent = (e: MouseEvent, inputEl: HTMLInputElement, codesContaner: HTMLElement): void => {
  if (e.target instanceof HTMLElement) {
    const { target } = e;
    const promoCode = checkPromo(inputEl.value.toUpperCase().trim());
    if (promoCode) {
      const isAdded = store.promos.add(promoCode);
      if (isAdded) {
        target.textContent = 'Success';
        if (store.promos.getCount() === 1) codesContaner.append(AppliedTitle());
        codesContaner.append(createAppliedPromo(promoCode, codesContaner));
      } else target.textContent = 'Already applied';
    } else target.textContent = 'Wrong code';

    inputEl.value = '';
    setTimeout(() => (target.textContent = 'Apply now'), 850);
  }
};

const AppliedTitle = (): HTMLElement => {
  return createElement('span', {
    textContent: 'Applied codes: ',
    className: 'promo-applied__title',
  });
};

const createAppliedPromo = (promoCode: IPromoCode, codesContaner: HTMLElement): HTMLElement => {
  const codeContainer = createElement('p', {
    textContent: `-${promoCode.discount * 100}% ${promoCode.name}`,
    className: 'promo-applied__code',
  });

  const crossSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  crossSvg.classList.add('icon-svg', 'cross-svg', 'cross-svg__promo');
  const useSvg = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  useSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `${sprite}#cross`);
  crossSvg.appendChild(useSvg);
  const removeButton = createElement('button', { className: 'prodcut-card__remove-button promo__remove-button' });
  removeButton.appendChild(crossSvg);
  removeButton.addEventListener('click', () => deleteAppliedPromo(promoCode, codeContainer, codesContaner));
  codeContainer.appendChild(removeButton);
  return codeContainer;
};

const deleteAppliedPromo = (promoCode: IPromoCode, element: HTMLElement, container: HTMLElement): void => {
  store.promos.remove(promoCode.name);
  if (store.promos.getCount() > 0) {
    element.remove();
  } else container.replaceChildren();
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
