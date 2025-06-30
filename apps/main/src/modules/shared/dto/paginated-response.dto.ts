import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { PaginateQuery } from 'nestjs-paginate';

export class PaginationQueryDto implements PaginateQuery {
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  sortBy?: [string, string][];

  @IsOptional()
  @IsArray()
  searchBy?: string[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  filter?: {
    [column: string]: string | string[];
  };

  @IsOptional()
  @IsArray()
  select?: string[];

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsString()
  cursorColumn?: string;

  @IsOptional()
  @IsString()
  cursorDirection?: 'before' | 'after';

  @IsOptional()
  @IsString()
  path: string = ''; // Default value to satisfy the required property
}

export class PaginateResponseMetaProps {
  readonly itemsPerPage!: number;
  readonly totalItems!: number;
  readonly currentPage!: number;
  readonly totalPages!: number;
  readonly sortBy!: unknown;
  readonly searchBy!: unknown;
  readonly search!: string;
  readonly select!: string[];
  readonly filter?: {
    [column: string]: string | string[];
  };
}

export class PaginateResponseLinksProps {
  readonly first?: string | null;
  readonly previous?: string | null;
  readonly current!: string;
  readonly next?: string | null;
  readonly last?: string | null;
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

// custom pagination
export class CustomPaginateResponseMetaProps {
  readonly itemsPerPage?: number;
  readonly totalItems?: number;
  readonly currentPage?: number;
  readonly totalPages?: number;
  readonly sortBy?: unknown;
  readonly searchBy?: unknown;
  readonly search?: string;
  readonly select?: string[];
  readonly filter?: {
    [column: string]: string | string[];
  };
}

export class CustomPaginateResponseLinksProps {
  readonly first?: string | null;
  readonly previous?: string | null;
  readonly current?: string;
  readonly next?: string | null;
  readonly last?: string | null;
}

export class CustomPaginateResponseDefaultDataProps {
  readonly meta!: CustomPaginateResponseMetaProps;
  readonly links!: CustomPaginateResponseLinksProps;
}

export class CustomPaginateResponseDataProps<
  T extends Array<unknown>,
> extends CustomPaginateResponseDefaultDataProps {
  readonly data!: T;
}
