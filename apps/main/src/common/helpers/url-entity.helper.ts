export function replaceUrlEntity(path: string, newEntity: string): string {
  const segments = path.split('/');
  if (segments.length > 3) {
    segments[3] = newEntity.split('?')[0];
  }
  return segments.join('/');
}

export function getOriginalUrlEntity(path: string): string {
  const segments = path.split('/');
  if (segments.length > 3) {
    return segments[3].split('?')[0];
  }
}
