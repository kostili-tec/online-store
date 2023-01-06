import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { IProduct } from '../testApi';
import { IQueryParameters, queryParams } from '../router';
import { onFilteredProducts, onQueryChange, untilReload } from '../events';
import { createElement } from './utils';
import { toaster } from './toast';

export function createFilters(products: IProduct[]) {
  const filtersContainer = document.createElement('div');
  filtersContainer.classList.add('filters-container');

  const buttons = createElement('div', { className: 'filters-buttons' });
  buttons.append(
    createElement('button', {
      textContent: 'Copy link',
      className: 'secondary-button',
      onclick: (e) => {
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => toaster.show('Link copied to clipboard!', 0, { left: e.pageX, top: e.pageY }));
      },
    }),
    createElement('button', {
      textContent: 'Reset filter',
      className: 'secondary-button',
      onclick: () => queryParams.clear(),
    }),
  );

  const categoriesContainer = document.createElement('div');
  categoriesContainer.classList.add('filters__categories-container');

  const headCatogory = document.createElement('h4');
  headCatogory.textContent = 'Categories';

  getCategories(products, 'category').forEach((el) => {
    categoriesContainer.append(createInputCategory(el, 'category'));
  });

  const headBrand = document.createElement('h4');
  headBrand.textContent = 'Brands';

  const brandsContainer = document.createElement('div');
  brandsContainer.classList.add('filters__brands-container');

  getCategories(products, 'brand').forEach((el) => {
    brandsContainer.append(createInputCategory(el, 'brand'));
  });

  const priceSlider = createRangeInput('price', getMinValue('price', products), getMaxValue('price', products));
  const stockSlider = createRangeInput('stock', getMinValue('stock', products), getMaxValue('stock', products));

  filtersContainer.append(
    buttons,
    headCatogory,
    categoriesContainer,
    headBrand,
    brandsContainer,
    priceSlider,
    stockSlider,
  );
  return filtersContainer;
}

function createInputCategory(category: ICategory, key: 'brand' | 'category'): HTMLDivElement {
  const categoryContainer = document.createElement('div');
  categoryContainer.classList.add('categories-item');

  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.id = 'filter' + category.title;
  if (queryParams.split(key)?.includes(category.title)) checkBox.checked = true;
  untilReload(
    onQueryChange.subscribe(() => (checkBox.checked = queryParams.split(key)?.includes(category.title) ?? false)),
  );

  const labelForCheckBox = document.createElement('label');
  labelForCheckBox.textContent = category.title;
  labelForCheckBox.setAttribute('for', 'filter' + category.title);
  labelForCheckBox.classList.add('categories-item__label');
  const spanCheckBox = document.createElement('span');
  spanCheckBox.classList.add('checkmark');

  const countSpan = document.createElement('span');
  countSpan.classList.add('label__span-count', 'count-tag');
  const countCurrent = document.createElement('span');
  countCurrent.textContent = '0';
  countSpan.append(countCurrent, `/${category.count}`);

  labelForCheckBox.append(checkBox, spanCheckBox);

  categoryContainer.append(labelForCheckBox, countSpan);

  checkBox.oninput = () => {
    if (checkBox.checked) queryParams.append(key, category.title);
    else queryParams.delete(key, category.title);
  };

  untilReload(
    onFilteredProducts.subscribe((products) => {
      const count = products.reduce((sum, product) => {
        return product[key] === category.title ? sum + 1 : sum;
      }, 0);
      countCurrent.textContent = count.toString();
      if (count === 0) categoryContainer.classList.add('category-no-products');
      else categoryContainer.classList.remove('category-no-products');
    }),
  );

  return categoryContainer;
}

function createRangeInput(rangeName: keyof IQueryParameters, minValue: number, maxValue: number): HTMLDivElement {
  const inputsContainer = document.createElement('div');
  inputsContainer.classList.add('noUiSlider-container');
  const headSlider = document.createElement('h4');
  headSlider.textContent = `${rangeName}`;
  const valuesContainer = document.createElement('div');
  valuesContainer.classList.add('noUiSlider-container__inputs');

  const inputMinContainer = document.createElement('div');
  const inputMaxContainer = document.createElement('div');
  inputMinContainer.classList.add('noUiSlider-container__input-container');
  inputMaxContainer.classList.add('noUiSlider-container__input-container');
  const pMin = document.createElement('p');
  const pMax = document.createElement('p');
  pMin.textContent = 'Min';
  pMax.textContent = 'Max';
  const inputMin = document.createElement('input');
  const inputMax = document.createElement('input');
  inputMin.type = 'text';
  inputMax.type = 'text';
  inputMin.id = `${rangeName}-slider__value-lower`;
  inputMax.id = `${rangeName}-slider__value-upper`;

  inputMinContainer.append(pMin, inputMin);
  inputMaxContainer.append(pMax, inputMax);

  const inputsArr = [inputMin, inputMax];
  const slider = createNoUiSlider(rangeName, minValue, maxValue, inputsArr);

  valuesContainer.append(inputMinContainer, inputMaxContainer);
  inputsContainer.append(headSlider, slider, valuesContainer);
  return inputsContainer;
}

function createNoUiSlider(
  rangeName: keyof IQueryParameters,
  minRange: number,
  maxRange: number,
  inputs: Array<HTMLInputElement>,
) {
  const snapSlider = document.createElement('div');
  snapSlider.id = `${rangeName}-slider`;
  noUiSlider.cssClasses.target += ' range-slider';
  noUiSlider.create(snapSlider, {
    range: {
      min: minRange,
      max: maxRange,
    },
    start: queryParams.split(rangeName) ?? [minRange, maxRange],
    connect: true,
  });

  inputs[0].addEventListener('change', function () {
    (snapSlider as noUiSlider.target).noUiSlider?.set([inputs[0].value, inputs[1].value], false);
    queryParams.set(rangeName, `${inputs[0].value},${inputs[1].value}`);
  });
  inputs[1].addEventListener('change', function () {
    (snapSlider as noUiSlider.target).noUiSlider?.set([inputs[0].value, inputs[1].value], false);
    queryParams.set(rangeName, `${inputs[0].value},${inputs[1].value}`);
  });

  untilReload(
    onQueryChange.subscribe((query) => {
      if (!query[rangeName]) (snapSlider as noUiSlider.target).noUiSlider?.set([minRange, maxRange], false);
    }),
  );

  untilReload(
    onFilteredProducts.subscribe((products) => {
      const minVal = getMinValue(rangeName as keyof IProduct, products);
      const maxVal = getMaxValue(rangeName as keyof IProduct, products);
      (snapSlider as noUiSlider.target).noUiSlider?.set([minVal, maxVal], false);
    }),
  );

  (snapSlider as noUiSlider.target).noUiSlider?.on('update', (values, handle) => {
    const roundVal = Math.round(Number(values[handle])).toString();
    inputs[handle].value = roundVal;
  });

  (snapSlider as noUiSlider.target).noUiSlider?.on('set', (values, handle) => {
    const roundVal = Math.round(Number(values[handle])).toString();
    const rangeValues = queryParams.split(rangeName) ?? [minRange, maxRange];
    rangeValues[handle] = roundVal;
    queryParams.set(rangeName, rangeValues.join(','));
  });

  return snapSlider;
}

interface ICategory {
  title: string;
  count: number;
}
function getCategories(products: IProduct[], dataKey: IProduct['category'] | IProduct['brand']): ICategory[] {
  if (dataKey === 'category' || dataKey === 'brand') {
    const categories = products.map((product) => product[dataKey]);
    const uniqueCategories = categories.filter((value, index, self) => self.indexOf(value) === index);
    return uniqueCategories.map((title) => {
      const count = categories.reduce((sum, el) => (el === title ? sum + 1 : sum), 0);
      return { title, count };
    });
  }
  return [];
}

function getMinValue(key: keyof IProduct, products: IProduct[]): number {
  return Math.min(...products.map((el) => Number(el[key])));
}

function getMaxValue(key: keyof IProduct, products: IProduct[]): number {
  return Math.max(...products.map((el) => Number(el[key])));
}
