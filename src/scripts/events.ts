import { IQueryParameters } from './router';
import { IProduct } from './testApi';
import { CartEventStatus } from './store/cart';

type TCallback<DataType> = (data: DataType) => void;

interface IListner<DataType> {
  callback: TCallback<DataType>;
  once?: boolean;
}

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

export function untilReload(unsubscribe: () => void): void {
  onPageReload.subscribe(unsubscribe, true);
}
