import { getProducts, IProducts } from '../testApi';
import { createFilters } from '../components/filters';

export async function Home(container: HTMLElement) {
  const data: IProducts = await getProducts();
  if (!data.products) {
    console.log('shit no products');
    return;
  }
  const leftFilters = createFilters(data);
  container.replaceChildren(leftFilters);
}
