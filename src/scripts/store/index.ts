import { Cart } from './cart';

export const store = {
  cart: new Cart(),
};

window.addEventListener('beforeunload', () => store.cart.saveToStorage());
