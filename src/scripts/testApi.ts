export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface IProducts {
  products?: IProduct[];
}

export async function getProducts() {
  try {
    const res: Response = await fetch('https://dummyjson.com/products?limit=100');
    const data: IProducts = await res.json();
    return data;
  } catch {
    return {};
  }
}
