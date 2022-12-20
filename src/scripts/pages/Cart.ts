import { Spinner } from '../components/Spinner';
import { showError } from '../components/errors';
import { store } from '../store';
import { getProducts } from '../testApi';
import { IProduct } from '../testApi';
import { navigate } from '../router';
import { createProductSpec } from './ProductDetails';

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

  container.replaceChildren(button, div);
}

function cartProductCard(product: IProduct): HTMLElement {
  const container = document.createElement('div');
  container.className = 'product-card';

  const discountPercentage = Math.round(product.discountPercentage);
  if (discountPercentage) {
    const discount = document.createElement('span');
    discount.className = 'product-card__discount count-tag';
    discount.textContent = ` - ${Math.round(discountPercentage)} %`;
    container.append(discount);
  }

  const leftContainer = document.createElement('div');

  const productImage = document.createElement('img');
  productImage.className = 'product-card__image';
  productImage.src = product.thumbnail;
  productImage.alt = product.title;
  productImage.onclick = (e) => navigate('/product?=' + product.id, e);

  const removeButton = document.createElement('a');
  removeButton.textContent = 'x Remove';

  leftContainer.append(productImage, removeButton);

  const productInfo = document.createElement('div');
  productInfo.className = 'product-card__info';
  const title = document.createElement('h4');
  title.className = 'card-info__title';
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
  discountedPrice.className = 'card-pricing__discounted';
  discountedPrice.textContent = `${(product.price * ((100 - product.discountPercentage) / 100)).toFixed(2)} USD`;
  priceContainer.append(discountedPrice);
  if (discountPercentage) {
    const originalPrice = document.createElement('p');
    originalPrice.className = 'card-pricing__original';
    originalPrice.textContent = product.price.toFixed(2) + ' USD';
    priceContainer.append(originalPrice);
  }
  const plusMinus = createPlusMinusButtons();
  buyOptions.append(priceContainer, plusMinus);

  container.append(leftContainer, productInfo, buyOptions);
  return container;
}

function createPlusMinusButtons() {
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('plus-minus__container');
  const minusButton = document.createElement('button');
  minusButton.textContent = '-';
  const countSpan = document.createElement('span');
  countSpan.textContent = '1';
  const plusButton = document.createElement('button');
  plusButton.textContent = '+';

  buttonsContainer.append(minusButton, countSpan, plusButton);
  return buttonsContainer;
}

function findProduct(products: IProduct[], id: number): undefined | IProduct {
  return products.find((item) => item.id === id);
}
