export enum searchableParams {
  category = 'category',
  brand = 'brand',
  title = 'title',
  description = 'description',
}

export interface IProduct {
  id: number;
  [searchableParams.title]: string;
  [searchableParams.description]: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  [searchableParams.brand]: string;
  [searchableParams.category]: string;
  thumbnail: string;
  images: string[];
}

export interface IProducts {
  products: IProduct[];
}

export interface IPromoCode {
  name: string;
  discount: number;
}

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
    const res: Response = await fetch('https://dummyjson.com/products?limit=100');
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
