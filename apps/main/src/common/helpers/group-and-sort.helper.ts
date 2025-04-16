import { groupBy } from 'lodash';

export function groupAndSort<T>(
  items: T[],
  groupKey: keyof T, // Key to group by
  sortKey?: keyof T, // Optional key to sort by
): Record<string, T[]> {
  return Object.fromEntries(
    Object.entries(groupBy(items, groupKey as string)).map(
      ([key, groupedItems]) => [
        key,
        sortKey
          ? groupedItems.sort((a, b) =>
              String(a[sortKey]).localeCompare(String(b[sortKey])),
            )
          : groupedItems,
      ],
    ),
  );
}
