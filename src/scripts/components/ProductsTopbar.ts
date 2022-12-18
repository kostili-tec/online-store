import { IQueryParameters } from '../router';

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
    select.append(sortOption);
  });

  const viewContainer = document.createElement('div');
  viewContainer.className = 'products-topbar__view';

  const gridview = document.createElement('input');
  gridview.type = 'radio';
  gridview.name = 'view-picker';
  gridview.value = 'grid';
  gridview.checked = true;
  gridview.className = 'topbar-view-option grid';
  const listView = document.createElement('input');
  listView.type = 'radio';
  listView.name = 'view-picker';
  listView.value = 'list';
  listView.className = 'topbar-view-option list';

  const productCount = document.createElement('div');
  const tag = document.createElement('span');
  tag.style.marginRight = '4px';
  tag.className = 'count-tag';
  tag.textContent = '100';
  productCount.append(tag, 'Products');

  viewContainer.append(gridview, listView, productCount);

  container.append(select, viewContainer);
  return container;
}
