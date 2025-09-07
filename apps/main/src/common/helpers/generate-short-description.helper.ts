export function generateShortDescription(description: string): string {
  return description ? `${description.slice(0, 100)}...` : '';
}
