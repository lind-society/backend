export function convertDatetimeToDate(datetime: string): string {
  return new Date(datetime).toISOString().split('T')[0];
}
