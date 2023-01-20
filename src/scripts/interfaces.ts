export type TCallback<DataType> = (data: DataType) => void;

export interface IListner<DataType> {
  callback: TCallback<DataType>;
  once?: boolean;
}

export interface IQueryParameters {
  id: string;
  category: string;
  brand: string;
  sort: string;
  search: string;
  price: string;
  stock: string;
  view: string;
  page: string;
  limit: string;
}

export interface IRoutes {
  [key: string]: {
    name: string;
    page: (container: HTMLElement, params: Partial<IQueryParameters>) => void;
  };
}

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

interface IFormatter {
  format: (arg: string) => string;
  deformat: (arg: string) => string;
}

export interface InputDataInterface {
  pattern: RegExp;
  caption: string;
  autocomplete: string;
  errorMsg: string;
  type?: string;
  formatter?: IFormatter;
  className?: string;
}

export interface InputsInterface {
  name: InputDataInterface;
  phone: InputDataInterface;
  email: InputDataInterface;
  address: InputDataInterface;
  ccNumber: InputDataInterface;
  cardholder: InputDataInterface;
  expDate: InputDataInterface;
  cvc: InputDataInterface;
}

export interface ICategory {
  title: string;
  count: number;
}

export interface IPromoBanner {
  code: string;
  src: string;
}

export enum SliderButtons {
  left,
  right,
}

export enum CartEventStatus {
  added = 'added',
  deleted = 'deleted',
  updated = 'updated',
  cleared = 'cleared',
}

export interface ICartItem {
  id: number;
  count: number;
  price: number;
}
