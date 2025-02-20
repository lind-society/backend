import { Paginated } from 'nestjs-paginate';
import { PaginateResponseDataProps } from 'src/modules/shared/dto/paginated-response.dto';

export function paginateResponseMapper<T, U extends Array<any> | undefined>(
  data: Paginated<T>,
  modifiedData?: U,
): PaginateResponseDataProps<
  U extends Array<any> ? Paginated<U[number]>['data'] : Paginated<T>['data']
> {
  return {
    data: (modifiedData as any) || data.data,
    links: {
      current: data.links.current,
      first: data.links.first ?? null,
      last: data.links.last ?? null,
      next: data.links.next ?? null,
      previous: data.links.previous ?? null,
    },
    meta: {
      currentPage: data.meta.currentPage,
      itemsPerPage: data.meta.itemsPerPage,
      totalItems: data.meta.totalItems,
      totalPages: data.meta.totalPages,
    },
  };
}
