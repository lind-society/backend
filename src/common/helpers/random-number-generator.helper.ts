export function generateRandomSixDigitNumber(): number {
  const MIN = 100000;
  const MAX = 900000;

  return Math.floor(MIN + Math.random() * MAX);
}
