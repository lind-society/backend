export function calculateDiscountedPrice(
  actualPrice?: number,
  discount?: number,
): number {
  return actualPrice - (actualPrice * discount) / 100;
}
