import { Page404 } from './pages/Page404';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';

export const root = document.createElement('main');
root.className = 'main';

export interface IQueryParameters {
  id: string;
  category: string;
  brand: string;
  sort: string;
  search: string;
  price: string;
  stock: string;
  view: 'grid' | 'list';
}
interface IRoutes {
  [key: string]: {
    name: string;
    page: (container: HTMLElement, params: Partial<IQueryParameters>) => void;
  };
}

export const routes: IRoutes = {
  page404: {
    name: 'Error 404',
    page: Page404,
  },
  '/': {
    name: 'Home',
    page: Home,
  },
  '/product': {
    name: 'Product details',
    page: ProductDetails,
  },
  '/cart': {
    name: 'Cart',
    page: Cart,
  },
};

export const updateQueryParams = (query: Partial<IQueryParameters>) => {
  const path = window.location.pathname;
  const queryString = new URLSearchParams(query).toString();
  window.history.pushState({}, '', `${path}?${queryString}`);
};

export const navigate = (href: string, e?: Event) => {
  if (e instanceof Event) e.preventDefault();
  window.history.pushState({}, '', href);
  handleLocation();
};

const handleLocation = () => {
  const path = window.location.pathname;
  const query = new URLSearchParams(window.location.search);
  const route = routes[path] || routes['page404'];
  route.page(root, Object.fromEntries(query));
  document.title = `Online Store - ${route.name}`;
};

window.onpopstate = handleLocation;

handleLocation();
