export function getProductPrice(mRP: number, discountPercentage: number) {
  return Math.round(mRP - mRP * (discountPercentage / 100));
}
