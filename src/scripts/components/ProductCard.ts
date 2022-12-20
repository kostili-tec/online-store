//import '@/styles/components/ProductCard.scss';
import { IProduct } from '../testApi';
import { navigate } from '../router';
import { store } from '../store';

export function ProductCard(product: IProduct, grid: boolean): HTMLElement {
  const container = document.createElement('div');
  container.className = 'product-card';
  if (grid) container.classList.add('card-grid');

  const discountPercentage = Math.round(product.discountPercentage);
  if (discountPercentage) {
    const discount = document.createElement('span');
    discount.className = 'product-card__discount count-tag';
    discount.textContent = ` - ${Math.round(discountPercentage)} %`;
    container.append(discount);
  }

  const productImage = document.createElement('img');
  productImage.className = 'product-card__image';
  productImage.src = product.thumbnail;
  productImage.alt = product.title;
  productImage.onclick = (e) => navigate('/product?=' + product.id, e);

  const productInfo = document.createElement('div');
  productInfo.className = 'product-card__info';
  const title = document.createElement('h4');
  title.className = 'card-info__title';
  title.textContent = product.title;
  title.onclick = (e) => navigate('/product?=' + product.id, e);
  const desc = document.createElement('p');
  desc.className = 'card-info__desc';
  desc.textContent = product.description;
  desc.title = product.description;
  const rating = document.createElement('div');
  rating.className = 'card-info__rating ';
  const ratingPercent = product.rating ? (product.rating * 100) / 5 : 0;
  rating.style.backgroundImage = `linear-gradient(to right, #151515 0%, #151515 ${ratingPercent}%, #ccc ${ratingPercent}%)`;
  rating.title = product.rating.toString();
  productInfo.append(title, desc, rating);

  if (!grid && product.stock <= 5 && product.stock > 0) {
    const lowStock = document.createElement('p');
    lowStock.className = 'card-info__lowstock';
    lowStock.textContent = `Hurry up! Only ${product.stock} item(s) left in stock!`;
    productInfo.append(lowStock);
  }

  const buyOptions = document.createElement('div');
  buyOptions.className = 'product-card__options';

  const priceContainer = document.createElement('div');
  priceContainer.className = 'card-pricing';
  const discountedPrice = document.createElement('p');
  discountedPrice.className = 'card-pricing__discounted';
  discountedPrice.textContent = product.price.toFixed(2) + ' USD';
  priceContainer.append(discountedPrice);
  if (discountPercentage) {
    const originalPrice = document.createElement('p');
    originalPrice.className = 'card-pricing__original';
    originalPrice.textContent = (product.price / ((100 - product.discountPercentage) / 100)).toFixed(2);
    priceContainer.append(originalPrice);
  }

  const buttons = document.createElement('div');
  buttons.className = 'card-buttons';
  if (!grid) {
    const detailsButton = document.createElement('button');
    detailsButton.className = 'secondary-button';
    detailsButton.textContent = 'Product details';
    detailsButton.onclick = (e) => navigate('/product?=' + product.id, e);
    buttons.append(detailsButton);
  }
  const cartButton = document.createElement('button');
  cartButton.className = 'primary-button';
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
        store.cart.add(product.id, (product.price / 100) * product.discountPercentage);
        cartButton.textContent = 'Drop from cart';
      }
    }
  };
  buttons.append(cartButton);

  buyOptions.append(priceContainer, buttons);

  container.append(productImage, productInfo, buyOptions);
  return container;
}
