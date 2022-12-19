import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { IProduct } from '../testApi';
import { IQueryParameters, updateQueryParams } from '../router';
import { onFilteredProducts, onPageReload } from '../events';

export function createFilters(products: IProduct[], query: Partial<IQueryParameters>) {
  const filtersContainer = document.createElement('div');
  filtersContainer.classList.add('filters-container');

  const categoriesContainer = document.createElement('div');
  categoriesContainer.classList.add('filters__categories-container');

  const headCatogory = document.createElement('h4');
  headCatogory.textContent = 'Categories';

  getCategories(products, 'category').forEach((el) => {
    categoriesContainer.append(createInputCategory(el, 'category', query));
  });

  const headBrand = document.createElement('h4');
  headBrand.textContent = 'Brands';

  const brandsContainer = document.createElement('div');
  brandsContainer.classList.add('filters__brands-container');

  getCategories(products, 'brand').forEach((el) => {
    brandsContainer.append(createInputCategory(el, 'brand', query));
  });

  const priceSlider = createRangeInput('price', 10, 2000, query);
  const stockSlider = createRangeInput('stock', 10, 150, query);

  filtersContainer.append(headCatogory, categoriesContainer, headBrand, brandsContainer, priceSlider, stockSlider);
  return filtersContainer;
}

function createInputCategory(
  category: ICategory,
  key: 'brand' | 'category',
  query: Partial<IQueryParameters>,
): HTMLDivElement {
  const categoryContainer = document.createElement('div');
  categoryContainer.classList.add('categories-item');

  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.id = 'filter' + category.title;
  if (query[key]?.includes(category.title)) checkBox.checked = true;

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
    const currentCategories = query[key]?.split(',') ?? [];
    if (checkBox.checked) {
      query[key] = [...currentCategories, category.title].join(',');
    } else query[key] = currentCategories.filter((cat) => cat !== category.title).join(',');
    updateQueryParams(query);
  };

  const unsubscribe = onFilteredProducts.subscribe((products) => {
    const count = products.reduce((sum, product) => {
      return product[key] === category.title ? sum + 1 : sum;
    }, 0);
    countCurrent.textContent = count.toString();
    if (count === 0) categoryContainer.classList.add('category-no-products');
    else categoryContainer.classList.remove('category-no-products');
  });
  onPageReload.subscribe(unsubscribe, true);

  return categoryContainer;
}

function createRangeInput(
  rangeName: keyof IQueryParameters,
  minValue: number,
  maxValue: number,
  query: Partial<IQueryParameters>,
): HTMLDivElement {
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
  const slider = createNoUiSlider(rangeName, minValue, maxValue, inputsArr, query);

  valuesContainer.append(inputMinContainer, inputMaxContainer);
  inputsContainer.append(headSlider, slider, valuesContainer);
  return inputsContainer;
}

function createNoUiSlider(
  rangeName: keyof IQueryParameters,
  minRange: number,
  maxRange: number,
  inputs: Array<HTMLInputElement>,
  query: Partial<IQueryParameters>,
) {
  const snapSlider = document.createElement('div');
  snapSlider.id = 'priceSlider';
  noUiSlider.cssClasses.target += ' range-slider';
  noUiSlider.create(snapSlider, {
    range: {
      min: minRange,
      max: maxRange,
    },
    start: [minRange, maxRange],
    connect: true,
  });

  (snapSlider as noUiSlider.target).noUiSlider?.on('update', (values, handle) => {
    const roundVal = Math.round(Number(values[handle])).toString();
    inputs[handle].value = roundVal;
  });

  (snapSlider as noUiSlider.target).noUiSlider?.on('change', (values, handle) => {
    const roundVal = Math.round(Number(values[handle])).toString();
    const rangeValues = query[rangeName]?.split(',') ?? [minRange, maxRange];
    rangeValues[handle] = roundVal;
    query[rangeName] = rangeValues.join(',');
    updateQueryParams(query);
  });

  return snapSlider;
}

interface ICategory {
  title: string;
  count: number;
}

function getCategories(products: IProduct[], dataKey: IProduct['category'] | IProduct['brand']): ICategory[] {
  if (dataKey === 'category' || dataKey === 'brand') {
    //   const categories: Record<string, number> = products.reduce((prev, cur) => {
    //     prev[cur[dataKey]] = (prev[cur[dataKey]] || 0) + 1;
    //     return prev;
    //   }, {});
    //   return Object.entries(categories).map(([title, count]) => {
    //     return { title, count: count.toString() };
    //   });
    const categories = products.map((product) => product[dataKey]);
    const uniqueCategories = categories.filter((value, index, self) => self.indexOf(value) === index);
    return uniqueCategories.map((title) => {
      const count = categories.reduce((sum, el) => (el === title ? sum + 1 : sum), 0);
      return { title, count };
    });
  }
  return [];
}
