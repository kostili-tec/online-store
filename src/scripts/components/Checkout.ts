import { processOrder } from '../testApi';
import { navigate } from '../router';
import { Spinner } from './Spinner';
import { store } from '../store';

const patterns = {
  name: /^[a-zA-Z]{4,}(?: [a-zA-Z]{4,}){1,2}$/,
  phone: /^\+[0-9]{10,13}$/,
  email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  address: /\d{1,5}\s(\b\w*\b\s){1,2}\w*\./,
  ccNumber: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/,
  expDate: /^0[1-9]|1[0-2]?[0-9]{2}$/,
  cvc: /^\d{3}$/,
};

export function Checkout(close: () => void): HTMLElement {
  const form = createForm({ className: 'checkout-modal' });
  form.onsubmit = (e: Event) => {
    e.preventDefault();
    const processing = createElement('div', { className: 'checkout-modal__processing' });
    processing.append('Processing your order...', Spinner());
    form.replaceChildren(processing);
    form.classList.add('modal-nonclosable');
    processOrder(3000).then(() => {
      store.cart.clear();
      navigate('/');
      close();
    });
  };

  const title = createElement('h2', { className: 'checkout-modal__title', textContent: 'Checkout' });

  const billingSubtitle = createSubtitle('billing', 1, 2);
  const billingInfo = createElement('div', { className: 'checkout-modal__inputs' });
  billingInfo.append(
    createValidatedInput(patterns.name, 'Name', 'Please enter your full name'),
    createValidatedInput(patterns.phone, 'Phone number', 'Please use +1234567890 format'),
    createValidatedInput(patterns.email, 'Email', 'Please use name@website.com format', 'email'),
    createValidatedInput(patterns.address, 'Address', 'Address must have atleast 3 words'),
  );

  const ccSubtitle = createSubtitle('credit card', 2, 2);
  const ccInfo = createElement('div', { className: 'checkout-modal__inputs ccard-inputs' });
  const ccLogos = createElement('div', { className: 'ccard-logos' });
  ccLogos.append(
    createElement('div', { className: 'ccard-logos__visa' }),
    createElement('div', { className: 'ccard-logos__master' }),
  );
  ccInfo.append(
    createValidatedInput(patterns.ccNumber, 'Card number', 'Please enter a valid visa/mastercard number'),
    ccLogos,
    createValidatedInput(patterns.name, 'Card holder', 'Please enter your full name'),
    createValidatedInput(patterns.expDate, 'Expiration date', 'Please use MM/YY format'),
    createValidatedInput(patterns.cvc, 'CVC', 'Please enter 3 digits code', 'password'),
  );

  const placeOrder = createButton({
    className: 'checkout-modal__submit primary-button',
    type: 'submit',
    textContent: 'Place order',
  });

  form.append(title, billingSubtitle, billingInfo, ccSubtitle, ccInfo, placeOrder);
  return form;
}

const createSubtitle = (title: string, step: number, overall: number): DocumentFragment => {
  const fragment = document.createDocumentFragment();
  const subtitle = createElement('h2', { className: 'checkout-modal__subtitle', textContent: `${title} info` });
  const caption = createElement('p', { className: 'checkout-modal__caption' });
  caption.append(
    createElement('span', { textContent: `Please enter your ${title} info` }),
    createElement('span', { textContent: `Step ${step} of ${overall}` }),
  );
  fragment.append(subtitle, caption);
  return fragment;
};

const createValidatedInput = (pattern: RegExp, caption: string, errorMsg: string, type = 'text'): HTMLElement => {
  const container = createElement('div', { className: 'modal-input' });
  const title = createElement('span', { textContent: caption, className: 'modal-input__caption' });
  const input = createInput({ placeholder: caption, type, className: 'modal-input__field' });
  input.setCustomValidity(errorMsg);
  const errorOutput = createElement('span', { className: 'modal-input__error' });
  input.oninput = () => {
    if (pattern.test(input.value)) {
      errorOutput.textContent = '';
      input.setCustomValidity('');
    } else {
      errorOutput.textContent = errorMsg;
      input.setCustomValidity(errorMsg);
    }
  };
  container.append(title, errorOutput, input);
  return container;
};

const createElement = (tagName: string, options?: Partial<HTMLElement>): HTMLElement => {
  const element = document.createElement(tagName);
  if (options) {
    Object.assign(element, options);
  }
  return element;
};

const createInput = (options?: Partial<HTMLInputElement>) => createElement('input', options) as HTMLInputElement;

const createForm = (options?: Partial<HTMLFormElement>) => createElement('form', options) as HTMLFormElement;

const createButton = (options?: Partial<HTMLFormElement>) => createElement('button', options) as HTMLButtonElement;
