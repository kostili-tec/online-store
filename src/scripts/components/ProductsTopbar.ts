import { onFilteredProducts, onQueryChange, untilReload } from '../events';
import { queryParams } from '../router';

export function ProductsTopbar(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'products-topbar';

  const selectContainer = document.createElement('div');
  selectContainer.classList.add('custom-select');

  const select = document.createElement('select');
  select.classList.add('products-topbar__sort', 'top-container__control-select');
  const options = [
    { name: 'Sort by rating ↓', val: 'rating-desc' },
    { name: 'Sort by rating ↑', val: 'rating-asc' },
    { name: 'Sort by price ↓', val: 'price-desc' },
    { name: 'Sort by price ↑', val: 'price-asc' },
    { name: 'Sort by discount ↓', val: 'discount-desc' },
    { name: 'Sort by discount ↑', val: 'discount-asc' },
  ];
  options.forEach((option) => {
    const sortOption = document.createElement('option');
    sortOption.textContent = option.name;
    sortOption.value = option.val;
    if (option.val === queryParams.get('sort')) sortOption.selected = true;
    select.append(sortOption);
  });
  select.oninput = (e) => {
    const target = e.target as HTMLSelectElement;
    queryParams.set('sort', target.value);
  };
  selectContainer.append(select);

  const viewContainer = document.createElement('div');
  viewContainer.className = 'products-topbar__view';

  const gridview = document.createElement('input');
  gridview.type = 'radio';
  gridview.name = 'view-picker';
  gridview.value = 'grid';
  gridview.className = 'topbar-view-option grid';
  gridview.oninput = () => queryParams.set('view', 'grid');
  const listView = document.createElement('input');
  listView.type = 'radio';
  listView.name = 'view-picker';
  listView.value = 'list';
  listView.className = 'topbar-view-option list';
  listView.oninput = () => queryParams.set('view', 'list');
  if (queryParams.get('view') === 'list') listView.checked = true;
  else gridview.checked = true;

  untilReload(
    onQueryChange.subscribe((query) => {
      if (query.view === 'list') listView.checked = true;
      else gridview.checked = true;
      const index = options.findIndex((option) => option.val === query.sort);
      select.selectedIndex = index === -1 ? 0 : index;
    }),
  );

  const productCount = document.createElement('div');
  const tag = document.createElement('span');
  tag.style.marginRight = '4px';
  tag.className = 'count-tag';
  untilReload(
    onFilteredProducts.subscribe((products) => {
      tag.textContent = products.length.toString();
    }),
  );
  productCount.append(tag, 'Products');

  viewContainer.append(gridview, listView, productCount);

  container.append(selectContainer, viewContainer);
  return container;
}
