import { Page404 } from './pages/Page404';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { onPageReload, onQueryChange } from './events';

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
  view: string;
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

class SearchParams {
  private updateHistory(query: URLSearchParams) {
    const path = window.location.pathname;
    const params = query.toString();
    window.history.pushState(path, '', `${path}${params && '?'}${params}`);
    onQueryChange.emit(Object.fromEntries(query));
  }
  public set(param: keyof IQueryParameters, value: string): void {
    const query = new URLSearchParams(window.location.search);
    query.set(param, value);
    this.updateHistory(query);
  }
  public append(param: keyof IQueryParameters, value: string): void {
    const query = new URLSearchParams(window.location.search);
    const items = query.get(param)?.split(',') ?? [];
    if (!items.includes(value)) {
      query.set(param, [...items, value].join(','));
      this.updateHistory(query);
    }
  }
  public delete(param: keyof IQueryParameters, value = ''): void {
    const query = new URLSearchParams(window.location.search);
    if (!value) {
      query.delete(param);
    } else {
      const items =
        query
          .get(param)
          ?.split(',')
          .filter((el) => el !== value) ?? [];
      if (items.length > 0) query.set(param, items.join(','));
      else query.delete(param);
    }
    this.updateHistory(query);
  }
  public clear() {
    this.updateHistory(new URLSearchParams());
  }
  public get(param: keyof IQueryParameters): string {
    const query = new URLSearchParams(window.location.search);
    return query.get(param) ?? '';
  }
  public split(param: keyof IQueryParameters): string[] | undefined {
    const query = new URLSearchParams(window.location.search);
    return query.get(param)?.split(',');
  }
}

export const queryParams = new SearchParams();

export const navigate = (href: string, e?: Event) => {
  if (e instanceof Event) e.preventDefault();
  window.history.pushState({}, '', href);
  handleLocation();
};

const handleLocation = () => {
  const path = window.location.pathname;
  const query = new URLSearchParams(window.location.search);
  const route = routes[path] || routes['page404'];
  onPageReload.emit(route.name);
  route.page(root, Object.fromEntries(query));
  document.title = `Online Store - ${route.name}`;
};

window.onpopstate = handleLocation;

handleLocation();
