export function formatPrice(
  price: number,
  allowDecimal: boolean,
  allowRound: boolean,
): string {
  if (allowDecimal) {
    return allowRound
      ? price.toFixed(2)
      : (Math.floor(price * 100) / 100).toFixed(2);
  }

  return allowRound
    ? roundToNearestHundred(Math.round(price))
    : Math.floor(price).toString();
}

export function roundToNearestHundred(price: number): string {
  const remainder = price % 100;

  const roundedPrice = price - remainder + (remainder >= 50 ? 100 : 0);

  return roundedPrice.toString();
}
