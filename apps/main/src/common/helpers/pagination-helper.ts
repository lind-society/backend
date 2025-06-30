import { Request } from 'express';

export function generalPaginationLink(
  req: Request,
  targetPage: number,
): string {
  const link = new URL(
    `${req.protocol}://${req.get('host')}${req.originalUrl}`,
  );

  // Remove existing `page` and `limit` to avoid duplication
  link.searchParams.delete('page');
  link.searchParams.delete('limit');

  // Add back all params from req.query
  for (const [key, value] of Object.entries(req.query)) {
    if (key !== 'page' && key !== 'limit') {
      if (Array.isArray(value)) {
        value.forEach((v) => link.searchParams.append(key, String(v)));
      } else {
        link.searchParams.set(key, String(value));
      }
    }
  }

  // Set correct page and limit
  link.searchParams.set('page', String(targetPage));
  link.searchParams.set('limit', String(req.query.limit ?? 10));

  return link.toString();
}
