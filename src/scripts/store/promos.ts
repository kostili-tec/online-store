import { IPromoCode } from '../testApi';

export class Promos {
  private appliedPromos: IPromoCode[] = [];
  public add(promoCode: IPromoCode): boolean {
    if (this.appliedPromos.find((code) => code.name === promoCode.name)) {
      return false;
    } else {
      this.appliedPromos.push({ ...promoCode });
      return true;
    }
  }
  public remove(promoCodeName: string): boolean {
    const prevLength = this.appliedPromos.length;
    this.appliedPromos = this.appliedPromos.filter((code) => code.name !== promoCodeName);
    return prevLength !== this.appliedPromos.length;
  }
  public getDiscountTotal(): number {
    return this.appliedPromos.reduce((sum, code) => sum + code.discount, 0);
  }
  public getCount(): number {
    return this.appliedPromos.length;
  }
}
