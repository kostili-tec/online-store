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
