import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import { IProducts, IProduct } from '../testApi';

export function createFilters(data: IProducts) {
  const filtersContainer = document.createElement('div');
  filtersContainer.classList.add('filters-container');

  const categoriesContainer = document.createElement('div');
  categoriesContainer.classList.add('filters__categories-container');

  const headCatogory = document.createElement('h4');
  headCatogory.textContent = 'Categories';

  getCategories(data, 'category').forEach((el) => {
    categoriesContainer.append(createInputCategory(el));
  });

  const headBrand = document.createElement('h4');
  headBrand.textContent = 'Brands';

  const brandsContainer = document.createElement('div');
  brandsContainer.classList.add('filters__brands-container');

  getCategories(data, 'brand').forEach((el) => {
    brandsContainer.append(createInputCategory(el));
  });

  const priceSlider = createRangeInput('price', 10, 2000);
  const stockSlider = createRangeInput('stock', 10, 150);

  filtersContainer.append(headCatogory, categoriesContainer, headBrand, brandsContainer, priceSlider, stockSlider);
  return filtersContainer;
}

function createInputCategory(name: string): HTMLDivElement {
  const categoryContainer = document.createElement('div');
  categoryContainer.classList.add('item-container');

  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.id = name;
  const labelForCheckBox = document.createElement('label');
  labelForCheckBox.textContent = name;
  labelForCheckBox.setAttribute('for', name);
  labelForCheckBox.classList.add('item-container__label');
  const spanCheckBox = document.createElement('span');
  spanCheckBox.classList.add('checkmark');

  const countSpan = document.createElement('span');
  countSpan.classList.add('label__span-count');
  countSpan.textContent = '(4/5)';

  labelForCheckBox.append(checkBox, spanCheckBox);

  categoryContainer.append(labelForCheckBox, countSpan);
  return categoryContainer;
}

function createRangeInput(prefix: string, minValue: number, maxValue: number): HTMLDivElement {
  const inputsContainer = document.createElement('div');
  inputsContainer.classList.add('noUiSlider-container');
  const headSlider = document.createElement('h4');
  headSlider.textContent = `${prefix}`;
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
  inputMin.id = `${prefix}-slider__value-lower`;
  inputMax.id = `${prefix}-slider__value-upper`;

  inputMinContainer.append(pMin, inputMin);
  inputMaxContainer.append(pMax, inputMax);

  const inputsArr = [inputMin, inputMax];
  const slider = createNoUiSlider(minValue, maxValue, inputsArr);

  valuesContainer.append(inputMinContainer, inputMaxContainer);
  inputsContainer.append(headSlider, slider, valuesContainer);
  return inputsContainer;
}

function createNoUiSlider(minRange: number, maxRange: number, inputs: Array<HTMLInputElement>) {
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

  return snapSlider;
}

function getCategories(data: IProducts, dataKey: IProduct['category'] | IProduct['brand']): string[] {
  if (dataKey === 'category' || dataKey === 'brand') {
    const categories = data.products?.map((product) => product[dataKey]) ?? [];
    return categories.filter((value, index, self) => self.indexOf(value) === index);
  } else throw new Error('Incorrect data or data is null');
}
