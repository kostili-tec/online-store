import { navigate } from '../router';
import { getProducts } from '../testApi';
import { CartAddButton } from '../components/CartAddButton';
import { showError } from '../components/errors';
import { Spinner } from '../components/Spinner';
import { Slider } from '../components/imageSlider';
import { showModal } from '../components/modal';
import { Checkout } from '../components/Checkout';
import { store } from '../store';
import { IQueryParameters, IProducts, IProduct } from '../interfaces';

export async function ProductDetails(container: HTMLElement, product: Partial<IQueryParameters>) {
  container.replaceChildren(Spinner());
  const productEl = await manageProductDetails(Number(Object.values(product)));
  container.replaceChildren(...productEl);
}

async function manageProductDetails(id: number): Promise<Array<HTMLDivElement>> {
  const data = await getProducts();
  if (!data) {
    return [showError('Cannot get data', true)];
  }
  const product = findProduct(data, id);
  if (!product) {
    return [showError('Product not found', true, id)]; // костыль из за того что навигация и детали приходят в разных функциях
  } else {
    const productContainer = createProductDetails(product);
    const navigation = createNavigation(product);
    return [navigation, productContainer];
  }
}

function createNavigation(product: IProduct) {
  const navigation = document.createElement('div');
  navigation.classList.add('product-details__navigation');

  const homeLink = document.createElement('a');
  homeLink.textContent = 'home';
  homeLink.href = '/';
  homeLink.addEventListener('click', (e) => navigate('/?', e));
  const categoryLink = document.createElement('a');
  categoryLink.textContent = product.category;
  categoryLink.addEventListener('click', (e) => navigate(`/?category=${product.category}`, e));
  const brandLink = document.createElement('a');
  brandLink.textContent = product.brand;
  brandLink.addEventListener('click', (e) => navigate(`/?brand=${product.brand}`, e));
  const titleLink = document.createElement('a');
  titleLink.textContent = product.title;

  const navArr = [homeLink, categoryLink, brandLink, titleLink];
  navArr.forEach((el, ind) => {
    navigation.append(el);
    if (ind !== navArr.length - 1) {
      const slash = document.createElement('span');
      slash.textContent = '/';
      navigation.append(slash);
    }
  });
  return navigation;
}

function createProductDetails(product: IProduct) {
  const productContainer = document.createElement('div');
  productContainer.classList.add('product-details__container');
  const imagesContainer = document.createElement('div');
  imagesContainer.classList.add('details__img-container');

  const sliderEl = new Slider(product.images);
  imagesContainer.append(sliderEl.createSlider());
  if (product.discountPercentage !== 0) {
    const discountP = document.createElement('p');
    discountP.textContent = `- ${product.discountPercentage} %`;
    discountP.classList.add('img-container__discount');
    imagesContainer.append(discountP);
  }

  const detailsInfoContainer = document.createElement('div');
  detailsInfoContainer.classList.add('details__info-container', 'info-container');

  const headerProduct = document.createElement('h2');
  headerProduct.classList.add('info-container__title-h2');
  headerProduct.textContent = product.title;

  const rating = document.createElement('div');
  rating.classList.add('info-container__rating', 'card-info__rating');
  const ratingPercent = product.rating ? (product.rating * 100) / 5 : 0;
  rating.style.backgroundImage = `linear-gradient(to right, #151515 0%, #151515 ${ratingPercent}%, #ccc ${ratingPercent}%)`;
  rating.title = product.rating.toString();

  const descriptionP = document.createElement('p');
  descriptionP.classList.add('info-container__description');
  descriptionP.textContent = product.description;

  const brand = createProductSpec('Brand', product.brand);
  const category = createProductSpec('Category', product.category);
  const stock = createProductSpec('Stock', product.stock);

  const productBuy = createProductBuy(product);

  detailsInfoContainer.append(headerProduct, rating, descriptionP, brand, category, stock, productBuy);
  productContainer.append(imagesContainer, detailsInfoContainer);
  return productContainer;
}

export function createProductSpec(specTitle: string, specValue: string | number): HTMLDivElement {
  const container = document.createElement('div');
  container.classList.add('info-container__spec-container');
  const titleSpan = document.createElement('span');
  titleSpan.classList.add('spec-container__title');
  const valueSpan = document.createElement('span');
  valueSpan.classList.add('spec-container__value');

  titleSpan.textContent = `${specTitle}:`;
  valueSpan.textContent = String(specValue);
  container.append(titleSpan, valueSpan);
  return container;
}

function createProductBuy(product: IProduct): HTMLDivElement {
  const buyContainer = document.createElement('div');
  buyContainer.classList.add('info-container__buy-container');

  const priceContainer = document.createElement('div');
  priceContainer.classList.add('buy-container__prices-container');

  const priceWithDiscount = document.createElement('p');
  priceWithDiscount.classList.add('card-pricing__discounted', 'prices-container__discount');
  const priceOriginal = document.createElement('p');
  priceOriginal.classList.add('card-pricing__original', 'prices-container__original');
  priceOriginal.textContent = `${product.price} USD`;
  if (product.discountPercentage) {
    priceWithDiscount.textContent = `${(product.price * ((100 - product.discountPercentage) / 100)).toFixed(2)} USD`;
    priceContainer.append(priceWithDiscount);
  }
  priceContainer.append(priceOriginal);

  const buyButtonsContainer = document.createElement('div');
  buyButtonsContainer.classList.add('buy-container__buttons-container');

  const buyNowButton = document.createElement('button');
  buyNowButton.classList.add('buttons-container__button', 'primary-button');
  buyNowButton.textContent = 'Buy Now';
  buyNowButton.addEventListener('click', (e) => {
    !store.cart.getCountById(product.id) && store.cart.add(product.id, product.price);
    navigate('/cart', e);
    showModal(Checkout);
  });

  const addButton = CartAddButton(product);
  addButton.classList.add('buttons-container__button', 'secondary-button');

  buyButtonsContainer.append(buyNowButton, addButton);

  buyContainer.append(priceContainer, buyButtonsContainer);
  return buyContainer;
}

function findProduct(data: IProducts, id: number): undefined | IProduct {
  if (data.products) {
    const result = data.products.find((item) => item.id === id);
    return result;
  }
}
