export function calculatePrice(ammount: number, discountPercentage: number) {
  return ammount - ammount * (discountPercentage / 100);
}
