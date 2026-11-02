import { PaginateQuery } from 'nestjs-paginate';


export function getFilterValue<T = string>(
  query: PaginateQuery,
  filterKey: string,
): T | undefined {
  if (!query.filter || !query.filter[filterKey]) {
    return undefined;
  }

  const filterValue = query.filter[filterKey];
  
  // If it's an array, return the first element
  if (Array.isArray(filterValue)) {
    return filterValue[0] as T;
  }
  
  // Otherwise return the string
  return filterValue as T;
}
