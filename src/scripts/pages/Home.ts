import { IQueryParameters } from '../router';
import { getProducts, IProducts, IProduct, searchableParams } from '../testApi';
import { createFilters } from '../components/filters';
import { ProductCard } from '../components/ProductCard';
import { ProductsTopbar } from '../components/ProductsTopbar';
import { onFilteredProducts, onQueryChange, untilReload } from '../events';
import { Spinner } from '../components/Spinner';
import { PromoBanner } from '../components/PromoBanner';
import { createElement } from '../components/utils';

export async function Home(container: HTMLElement, query: Partial<IQueryParameters>) {
  container.replaceChildren(Spinner());

  const data: IProducts | null = await getProducts();
  if (!data?.products) {
    console.log('shit no products');
    return;
  }
  const leftFilters = createFilters(data.products);

  const mainSection = document.createElement('div');
  mainSection.className = 'home-page__main';

  const topbar = ProductsTopbar();

  const productsContainer = document.createElement('div');
  productsContainer.className = 'products-container';

  untilReload(
    onQueryChange.subscribe((query) => {
      updateProducts(productsContainer, data.products, query);
    }),
  );
  updateProducts(productsContainer, data.products, query);

  mainSection.append(topbar, productsContainer);

  const div = document.createElement('div');
  div.className = 'home-page';
  div.append(leftFilters, mainSection);
  container.replaceChildren(PromoBanner(), div);
}

function updateProducts(container: HTMLElement, products: IProduct[], query: Partial<IQueryParameters>) {
  const filteredProducts = filterAndSort(products, query);
  onFilteredProducts.emit([...filteredProducts]);
  container.replaceChildren();
  const loadMoreBtn = createElement('button', {
    textContent: 'Load more',
    className: 'products-container__load secondary-button',
  });
  const loadChunk = () => {
    const chunk = filteredProducts.splice(0, 15);
    container.append(...chunk.map((product) => ProductCard(product, !query.view || query.view === 'grid')));
    if (filteredProducts.length === 0) loadMoreBtn.remove();
    else container.append(loadMoreBtn);
  };
  loadMoreBtn.onclick = loadChunk;
  loadChunk();
}

function filterAndSort(products: IProduct[], query: Partial<IQueryParameters>): IProduct[] {
  return products
    .filter((product) => {
      if (query.category) {
        if (!query.category.split(',').includes(product.category)) return false;
      }
      if (query.brand) {
        if (!query.brand.split(',').includes(product.brand)) return false;
      }
      if (query.price) {
        const [min, max] = query.price.split(',').map(Number);
        if (product.price < min || product.price > max) return false;
      }
      if (query.stock) {
        const [min, max] = query.stock.split(',').map(Number);
        if (product.stock < min || product.stock > max) return false;
      }
      if (query.search) {
        return Object.values(searchableParams).reduce(
          (tally, key) => tally || product[key].toLowerCase().includes(query.search?.toLowerCase() ?? ''),
          false,
        );
      }
      return true;
    })
    .sort((a, b) => {
      const sortParam = query.sort ? query.sort : 'rating-desc';
      const [key, comparator] = sortParam.split('-');
      let comparison = 0;
      if (key === 'rating') comparison = a.rating - b.rating;
      if (key === 'price') comparison = a.price - b.price;
      if (key === 'discount') comparison = a.discountPercentage - b.discountPercentage;
      if (comparator === 'desc') comparison = -comparison;
      return comparison;
    });
}
