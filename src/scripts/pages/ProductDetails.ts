import { IQueryParameters } from '../router';
import { getProducts, IProducts, IProduct } from '../testApi';

export async function ProductDetails(container: HTMLElement, product: IQueryParameters) {
  const div = document.createElement('div');
  div.textContent = `This is product info for ${product.id}`;

  const productEl = await manageProductDetails(Number(product.id));

  container.replaceChildren(productEl);
}

async function manageProductDetails(id: number) {
  const data = await getProducts();
  if (!data.products) throw new Error('can not get data');

  const product = findProduct(data, id);
  if (!product) throw new Error('product is not exist'); // переделать
  const productContainer = createProductDetails(product);
  console.log(product);
  return productContainer;
}

function createProductDetails(product: IProduct) {
  const productContainer = document.createElement('div');
  productContainer.classList.add('product-details__container');
  const imagesContainer = document.createElement('div');
  imagesContainer.classList.add('details__img-container');
  product.images.forEach((el) => {
    const imgProduct = document.createElement('img');
    imgProduct.src = el;
    imagesContainer.append(imgProduct);
  });
  if (product.discountPercentage !== 0) {
    const discountP = document.createElement('p');
    discountP.textContent = `- ${product.discountPercentage} %`;
    discountP.classList.add('img-container__discount');
    imagesContainer.append(discountP);
  }

  const detailsInfoContainer = document.createElement('div');
  detailsInfoContainer.classList.add('details__info-container');

  const headerProduct = document.createElement('h2');
  headerProduct.textContent = product.title;

  const ratingP = document.createElement('p');
  ratingP.textContent = `${product.rating}/5`;

  const descriptionP = document.createElement('p');
  descriptionP.textContent = product.description;

  const brand = createProductSpec('Brand', product.brand);
  const category = createProductSpec('Category', product.category);
  const stock = createProductSpec('Stock', product.stock);

  detailsInfoContainer.append(headerProduct, ratingP, descriptionP, brand, category, stock);
  productContainer.append(imagesContainer, detailsInfoContainer);
  return productContainer;
}

function createProductSpec(specTitle: string, specValue: string | number): HTMLDivElement {
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

function createProductBuy(price: number, discount: number | null) {
  const buyContainer = document.createElement('div');
  buyContainer.classList.add('info-container__buy-container');

  const priceContainer = document.createElement('div');
  priceContainer.classList.add('buy-container__prices-container');
}

/* function createError() {} */

function findProduct(data: IProducts, id: number): undefined | IProduct {
  if (data.products) {
    const result = data.products.find((item) => item.id === id);
    return result;
  }
}
