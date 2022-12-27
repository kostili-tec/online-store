import { Cart } from './cart';
import { Promos } from './promos';

export const store = {
  cart: new Cart(),
  promos: new Promos(),
};

window.addEventListener('beforeunload', () => store.cart.saveToStorage());
