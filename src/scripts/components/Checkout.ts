import { processOrder } from '../testApi';
import { navigate } from '../router';
import { Spinner } from './Spinner';
import { store } from '../store';
import { createElement, createSvg } from './utils';
import { InputsInterface, InputDataInterface } from '../interfaces';

const inputs: InputsInterface = {
  name: {
    pattern: /^[a-zA-Z]{4,}(?: [a-zA-Z]{4,}){1,2}$/,
    caption: 'Name',
    autocomplete: 'name',
    errorMsg: 'Please enter your full name',
  },
  phone: {
    pattern: /^\+[0-9]{10,13}$/,
    caption: 'Phone',
    autocomplete: 'tel',
    errorMsg: 'Please use +1234567890 format',
  },
  email: {
    pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    caption: 'Email',
    autocomplete: 'email',
    errorMsg: 'Please use name@website.com format',
    type: 'email',
  },
  address: {
    pattern: /^.{5,}(\s\S{5,}){2,}$/, //3 or more words with 5 or more chars
    caption: 'Address',
    autocomplete: 'street-address',
    errorMsg: 'Please enter correct address',
  },
  ccNumber: {
    className: 'ccnumber-input',
    pattern: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})/,
    caption: 'Card number',
    autocomplete: 'cc-number',
    errorMsg: 'Please enter a valid visa/mastercard number',
    formatter: {
      deformat: (str) => str.replace(/[^0-9.]/g, ''),
      format: (str) =>
        str
          .replace(/(.{4})/g, '$1 ')
          .trim()
          .slice(0, 19),
    },
  },
  cardholder: {
    pattern: /^[a-zA-Z]{4,}(?: [a-zA-Z]{4,}){1,2}$/,
    caption: 'Card holder',
    autocomplete: 'cc-name',
    errorMsg: 'Please enter your full name',
  },
  expDate: {
    className: 'expdate-input',
    pattern: /^(0[1-9]|1[0-2])+[2-9]{1}[3-9]{1}/,
    caption: 'Valid through',
    autocomplete: 'cc-exp',
    errorMsg: 'Use MM/YY format',
    formatter: {
      deformat: (str) => str.replace(/[^0-9.]/g, ''),
      format: (str) =>
        str
          .replace(/(.{2}(?!$))/g, '$1 / ')
          .trim()
          .slice(0, 7),
    },
  },
  cvc: {
    className: 'cvc-input',
    pattern: /^\d{3}$/,
    caption: 'CVC',
    autocomplete: 'cc-csc',
    errorMsg: 'Enter 3 digits',
    type: 'password',
  },
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
      store.promos.clear();
      navigate('/');
      close();
    });
  };

  const title = createElement('h2', { className: 'checkout-modal__title', textContent: 'Checkout' });

  const shippingSubtitle = createSubtitle('shipping', 1, 2);
  const shippingInfo = createElement('div', { className: 'checkout-modal__inputs' });
  shippingInfo.append(
    createValidatedInput(inputs.name),
    createValidatedInput(inputs.phone),
    createValidatedInput(inputs.email),
    createValidatedInput(inputs.address),
  );

  const ccSubtitle = createSubtitle('credit card', 2, 2);
  const ccInfo = createElement('div', { className: 'checkout-modal__inputs ccard-inputs' });
  ccInfo.append(
    createCCNumber(inputs.ccNumber),
    createValidatedInput(inputs.cardholder),
    createValidatedInput(inputs.expDate),
    createValidatedInput(inputs.cvc),
  );

  const placeOrder = createButton({
    className: 'checkout-modal__submit primary-button',
    type: 'submit',
    textContent: 'Place order',
  });

  const closeButton = createSvg('cross-svg checkout-modal__close', 'cross');
  closeButton.onclick = close;

  form.append(title, shippingSubtitle, shippingInfo, ccSubtitle, ccInfo, placeOrder, closeButton);
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

const ValidatedInput = (data: InputDataInterface): { container: HTMLElement; input: HTMLInputElement } => {
  const type = data.type ? data.type : 'text';
  const className = data.className ? `modal-input ${data.className}` : 'modal-input';
  const container = createElement('div', { className });
  const title = createElement('span', { textContent: data.caption, className: 'modal-input__caption' });
  const input = createInput({
    placeholder: data.caption,
    autocomplete: data.autocomplete,
    type,
    className: 'modal-input__field',
  });
  input.setCustomValidity(data.errorMsg);
  const errorOutput = createElement('span', { className: 'modal-input__error' });
  input.oninput = () => {
    const value = data.formatter ? data.formatter.deformat(input.value) : input.value;
    if (data.pattern.test(value)) {
      errorOutput.textContent = '';
      input.setCustomValidity('');
    } else {
      input.setCustomValidity(data.errorMsg);
    }
    if (data.formatter) input.value = data.formatter.format(value);
  };
  input.onblur = () => (errorOutput.textContent = input.validationMessage);
  container.append(title, errorOutput, input);
  return { container, input };
};

const createValidatedInput = (data: InputDataInterface) => ValidatedInput(data).container;

const createCCNumber = (data: InputDataInterface): DocumentFragment => {
  const { container, input } = ValidatedInput(data);
  const ccLogos = createElement('div', { className: 'ccard-logos' });
  ccLogos.append(
    createElement('div', { className: 'ccard-logos__visa' }),
    createElement('div', { className: 'ccard-logos__master' }),
    createElement('div', { className: 'ccard-logos__amex' }),
  );
  input.addEventListener('input', () => {
    if (input.value.startsWith('5')) ccLogos.className = 'ccard-logos master-active';
    else if (input.value.startsWith('4')) ccLogos.className = 'ccard-logos visa-active';
    else if (input.value.startsWith('3')) ccLogos.className = 'ccard-logos amex-active';
    else ccLogos.className = 'ccard-logos';
  });
  const fragment = document.createDocumentFragment();
  fragment.append(container, ccLogos);
  return fragment;
};

const createInput = (options?: Partial<HTMLInputElement>) => createElement('input', options) as HTMLInputElement;

const createForm = (options?: Partial<HTMLFormElement>) => createElement('form', options) as HTMLFormElement;

const createButton = (options?: Partial<HTMLFormElement>) => createElement('button', options) as HTMLButtonElement;
