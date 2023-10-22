import { onCartChange } from '../events';
import { CartEventStatus, ICartItem } from '../interfaces';

function isCartItems(data: unknown): data is ICartItem[] {
  if (!Array.isArray(data)) return false;
  return data.every((element) => {
    if (element instanceof Object) {
      return ['id', 'count', 'price'].every((key) => typeof element[key] === 'number');
    }
  });
}

export class Cart {
  private cartItems: ICartItem[];

  constructor() {
    try {
      const storedItems = JSON.parse(localStorage.getItem('ferka123-kostili-cart') ?? '[]');
      this.cartItems = isCartItems(storedItems) ? storedItems : [];
    } catch {
      this.cartItems = [];
    }
  }

  public saveToStorage(): void {
    localStorage.setItem('ferka123-kostili-cart', JSON.stringify(this.cartItems));
  }

  public add(id: number, price: number): void {
    const cartItem = this.cartItems.find((item) => item.id === id);
    if (cartItem) {
      cartItem.count += 1;
      onCartChange.emit(CartEventStatus.updated);
    } else {
      const newItem = { id, price, count: 1 };
      this.cartItems.push(newItem);
      onCartChange.emit(CartEventStatus.added);
    }
  }

  public deleteOne(id: number): void {
    const cartItem = this.cartItems.find((item) => item.id === id);
    if (cartItem) {
      cartItem.count -= 1;
      if (cartItem.count === 0) this.delete(id);
      else onCartChange.emit(CartEventStatus.updated);
    }
  }

  public delete(id: number): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== id);
    if (this.cartItems.length === 0) onCartChange.emit(CartEventStatus.cleared);
    else onCartChange.emit(CartEventStatus.deleted);
  }

  public clear(): void {
    this.cartItems = [];
    onCartChange.emit(CartEventStatus.cleared);
  }

  public getCountById(id: number): number | null {
    const cartItem = this.cartItems.find((item) => item.id === id);
    return cartItem ? cartItem.count : null;
  }

  public getCountAll(): number {
    return this.cartItems.reduce((sum, item) => sum + item.count, 0);
  }

  public getPriceAll(): number {
    return this.cartItems.reduce((sum, item) => sum + item.count * item.price, 0);
  }

  public getItemById(id: number): ICartItem | undefined {
    const cartItem = this.cartItems.find((item) => item.id === id);
    if (cartItem) return { ...cartItem };
  }

  public getItemsAll(): ICartItem[] {
    return [...this.cartItems];
  }
}
