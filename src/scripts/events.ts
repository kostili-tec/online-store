import { IQueryParameters } from './router';
import { IProduct } from './testApi';

type TCallback<DataType> = (data?: DataType) => void;

interface IListner<DataType> {
  callback: TCallback<DataType>;
  once?: boolean;
}

class EventManager<DataType> {
  private listners: IListner<DataType>[] = [];

  public emit(data?: DataType) {
    this.listners = this.listners.filter((listner) => {
      listner.callback(data);
      return !listner.once;
    });
  }
  public subscribe(callback: TCallback<DataType>, once?: boolean): () => void {
    const index = this.listners.push({ callback, once }) - 1;
    return () => this.unsubscribe(index);
  }
  public unsubscribe(index: number): void {
    this.listners.splice(index, 1);
  }
}

export const onQueryChange = new EventManager<IQueryParameters>();
export const onFilteredProducts = new EventManager<IProduct[]>();
export const onPageReload = new EventManager<string>();
