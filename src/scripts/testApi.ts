import { IPromoCode, IProducts } from './interfaces';

const promoCodes: IPromoCode[] = [
  {
    name: 'NEWCOMER',
    discount: 0.05,
  },
  {
    name: 'HAPPY-NY',
    discount: 0.1,
  },
  {
    name: 'RS-STUDENT',
    discount: 0.15,
  },
];

export async function getProducts() {
  try {
    const res: Response = await fetch('./data/products.json');
    const data: IProducts = await res.json();
    return data;
  } catch {
    return null;
  }
}

export function processOrder(time: number): Promise<void> {
  return new Promise((res) => setTimeout(res, time));
}

export function checkPromo(promoCode: string): IPromoCode | undefined {
  return promoCodes.find((code) => code.name == promoCode);
}
