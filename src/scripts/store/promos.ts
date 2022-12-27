import { onPromoChange } from '../events';
import { IPromoCode } from '../testApi';

export class Promos {
  private appliedPromos: IPromoCode[] = [];
  public add(promoCode: IPromoCode): boolean {
    if (this.appliedPromos.find((code) => code.name === promoCode.name)) {
      return false;
    } else {
      this.appliedPromos.push({ ...promoCode });
      onPromoChange.emit();
      return true;
    }
  }
  public remove(promoCodeName: string): boolean {
    const prevLength = this.appliedPromos.length;
    this.appliedPromos = this.appliedPromos.filter((code) => code.name !== promoCodeName);
    if (prevLength !== this.appliedPromos.length) {
      onPromoChange.emit();
      return true;
    }
    return false;
  }
  public clear(): void {
    this.appliedPromos = [];
    onPromoChange.emit();
  }
  public getDiscountTotal(): number {
    return this.appliedPromos.reduce((sum, code) => sum + code.discount, 0);
  }
  public getCount(): number {
    return this.appliedPromos.length;
  }
  public getAll(): IPromoCode[] {
    return [...this.appliedPromos];
  }
}
