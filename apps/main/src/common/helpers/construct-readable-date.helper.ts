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

export function constructReadableDateTime(dateInput: Date | string): string {
  const date = new Date(dateInput);

  const datePart = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);

  const timePart = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  return `${datePart}, ${timePart}`;
}
