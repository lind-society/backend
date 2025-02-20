export class PaginateResponseMetaProps {
  readonly itemsPerPage!: number;
  readonly totalItems!: number;
  readonly currentPage!: number;
  readonly totalPages!: number;
}

export class PaginateResponseLinksProps {
  readonly first!: string | null;
  readonly previous!: string | null;
  readonly current!: string;
  readonly next!: string | null;
  readonly last!: string | null;
}

export class PaginateResponseDefaultDataProps {
  readonly meta!: PaginateResponseMetaProps;
  readonly links!: PaginateResponseLinksProps;
}

export class PaginateResponseDataProps<
  T extends Array<unknown>,
> extends PaginateResponseDefaultDataProps {
  readonly data!: T;
}
