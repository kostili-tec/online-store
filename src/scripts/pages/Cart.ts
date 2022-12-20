import { ProductCard } from '../components/ProductCard';
import { Spinner } from '../components/Spinner';
import { showError } from '../components/errors';
import { store } from '../store';
import { getProducts } from '../testApi';
import { IProduct } from '../testApi';

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
    if (product) div.append(ProductCard(product, false));
  });

  const button = document.createElement('button');
  button.className = 'secondary-button';
  button.textContent = 'Test checkout';

  container.replaceChildren(button, div);
}

function findProduct(products: IProduct[], id: number): undefined | IProduct {
  return products.find((item) => item.id === id);
}
