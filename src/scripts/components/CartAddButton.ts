import { store } from '../store';
import { IProduct } from '../interfaces';

export function CartAddButton(product: IProduct): HTMLElement {
  const cartButton = document.createElement('button');
  if (!product.stock) {
    cartButton.disabled = true;
    cartButton.textContent = 'Out of stock';
  } else {
    if (store.cart.getItemById(product.id)) cartButton.textContent = 'Drop from cart';
    else cartButton.textContent = 'Add to cart';
  }
  cartButton.onclick = () => {
    if (product.stock) {
      if (store.cart.getItemById(product.id)) {
        store.cart.delete(product.id);
        cartButton.textContent = 'Add to cart';
      } else {
        store.cart.add(product.id, product.price * ((100 - product.discountPercentage) / 100));
        cartButton.textContent = 'Drop from cart';
      }
    }
  };
  return cartButton;
}
