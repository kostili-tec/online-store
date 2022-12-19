import { onFilteredProducts, untilReload } from '../events';
import { queryParams } from '../router';

export function ProductsTopbar(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'products-topbar';

  const select = document.createElement('select');
  select.className = 'products-sort';
  [
    { name: 'Sort by rating ↓', val: 'rating-desc' },
    { name: 'Sort by rating ↑', val: 'rating-asc' },
    { name: 'Sort by price ↓', val: 'price-desc' },
    { name: 'Sort by price ↑', val: 'price-asc' },
    { name: 'Sort by discount ↓', val: 'discount-desc' },
    { name: 'Sort by discount ↑', val: 'discount-asc' },
  ].forEach((option) => {
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

  container.append(select, viewContainer);
  return container;
}
