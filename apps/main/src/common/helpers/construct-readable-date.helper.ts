export function constructReadableDate(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value;

  return `${get('weekday')}, ${get('day')} ${get('month')} ${get('year')}`;
}
