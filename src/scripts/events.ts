import { CartEventStatus } from './interfaces';
import { TCallback, IListner, IQueryParameters, IProduct } from './interfaces';

class EventManager<DataType> {
  private listners: IListner<DataType>[] = [];

  public emit(data: DataType) {
    this.listners = this.listners.filter((listner) => {
      listner.callback(data);
      return !listner.once;
    });
  }
  public subscribe(callback: TCallback<DataType>, once = false): () => void {
    const listner = { callback, once };
    this.listners.push(listner);
    return () => this.unsubscribe(listner);
  }
  private unsubscribe(listner: IListner<DataType>): void {
    this.listners = this.listners.filter((value) => value !== listner);
  }
}

export const onQueryChange = new EventManager<Partial<IQueryParameters>>();
export const onFilteredProducts = new EventManager<IProduct[]>();
export const onPageReload = new EventManager<string>();
export const onCartChange = new EventManager<CartEventStatus>();
export const onPromoChange = new EventManager<void>();

export function untilReload(unsubscribe: () => void): void {
  onPageReload.subscribe(unsubscribe, true);
}
