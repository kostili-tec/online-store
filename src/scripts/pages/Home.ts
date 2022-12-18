import { IQueryParameters } from '../router';
import { getProducts, IProducts, IProduct, searchableParams } from '../testApi';
import { createFilters } from '../components/filters';
import { ProductCard } from '../components/ProductCard';
import { ProductsTopbar } from '../components/ProductsTopbar';

export async function Home(container: HTMLElement, query: Partial<IQueryParameters>) {
  const data: IProducts = await getProducts();
  if (!data.products) {
    console.log('shit no products');
    return;
  }
  const mainSection = document.createElement('div');
  mainSection.className = 'home-page__main';

  const productsContainer = document.createElement('div');
  productsContainer.className = 'products-container';
  const filteredProducts = filterAndSort(data.products, query);
  productsContainer.replaceChildren(
    ...filteredProducts.map((product) => ProductCard(product, !query.view || query.view === 'grid')),
  );

  const topbar = ProductsTopbar();

  mainSection.append(topbar, productsContainer);
  const leftFilters = createFilters(data);

  const div = document.createElement('div');
  div.style.display = 'flex';
  div.append(leftFilters, mainSection);
  container.replaceChildren(div);
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
          (tally, key) => tally || product[key].includes(query.search as string),
          false,
        );
      }
      return true;
    })
    .sort((a, b) => {
      const sortParam = query.sort ? query.sort : 'rating-desc';
      const [key, comparator] = sortParam.split('-');
      //if (comparator === 'asc') return a[key] - b[key];
      //else if (comparator === 'desc') return b[key] - a[key];
      return 0;
    });
}
