import { describe, expect } from '@jest/globals';
import { IPromoCode } from '../src/scripts/testApi';
import { Cart, ICartItem } from '../src/scripts/store/cart';
import { Promos } from '../src/scripts/store/promos';

describe('Cart methods tests', () => {
  const cart = new Cart();
  cart.add(1, 128);
  cart.add(2, 256);
  cart.add(3, 512);
  it('getPriceAll method', () => {
    expect(cart.getPriceAll()).toBe(896);
  });
  it('getCountAll method', () => {
    expect(cart.getCountAll()).toBe(3);
  });
  it('getCountById method', () => {
    expect(cart.getCountById(1)).toBe(1);
  });
  it('getCountById method with added elements', () => {
    cart.add(1, 128);
    cart.add(1, 128);
    cart.add(1, 128);
    expect(cart.getCountById(1)).toBe(4);
  });
  it('getCountById method with null', () => {
    expect(cart.getCountById(666)).toBeNull();
  });
  it('getCountAll method', () => {
    expect(cart.getCountAll()).toBe(6);
  });
  it('getItemsAll method', () => {
    const cartItems: ICartItem[] = [
      { id: 1, count: 4, price: 128 },
      { id: 2, count: 1, price: 256 },
      { id: 3, count: 1, price: 512 },
    ];
    expect(cart.getItemsAll()).toEqual(cartItems);
  });
});

describe('Promos methods test', () => {
  const promos = new Promos();
  const testPromoCode: IPromoCode = { name: 'test-promo', discount: 300 };
  const promocode1: IPromoCode = { name: 'first-promo', discount: 300 };
  const promocode2: IPromoCode = { name: 'second-promo', discount: 666 };
  it('add method', () => {
    expect(promos.add(testPromoCode)).toBeTruthy();
  });
  it('add method with the previously added code', () => {
    expect(promos.add(testPromoCode)).toBeFalsy();
  });
  it('remove method with the previously added code', () => {
    expect(promos.remove('test-promo')).toBeTruthy();
  });
  it('remove method with the non existent code', () => {
    expect(promos.remove('biba-boba')).toBeFalsy();
  });
  it('getDiscountTotal', () => {
    promos.add(promocode1);
    promos.add(promocode2);
    expect(promos.getDiscountTotal()).toBe(966);
  });
  it('getCount method', () => {
    expect(promos.getCount()).toBe(2);
  });
  it('getAll method', () => {
    expect(promos.getAll()).toEqual([promocode1, promocode2]);
  });
});
