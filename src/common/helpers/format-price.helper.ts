export function formatPrice(
  price: number,
  allowDecimal: boolean,
  allowRound: boolean,
): string {
  if (allowDecimal) {
    return allowRound
      ? roundToNearestHundred(price).toFixed(2)
      : (Math.floor(price * 100) / 100).toFixed(2);
  }

  return allowRound
    ? roundToNearestHundred(Math.round(price)).toString()
    : Math.floor(price).toString();
}

export function roundToNearestHundred(price: number): number {
  const remainder = price % 100;

  const roundedPrice = price - remainder + (remainder >= 50 ? 100 : 0);

  return roundedPrice;
}
