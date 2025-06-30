import { generalPaginationLink } from '@apps/main/common/helpers';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import {
  CustomPaginateResponseDataProps,
  CustomPaginateResponseLinksProps,
  CustomPaginateResponseMetaProps,
} from '../shared/dto';
import { GetSearchEntitiesQueryDto, SearchEntityDto } from './dto';

@Injectable()
export class SearchService {
  private readonly allowedSortColumns = new Map<string, string>([
    ['name', 'name'],
    ['isFavorite', '"isFavorite"'],
  ]);

  constructor(
    @InjectDataSource()
    private datasource: DataSource,
  ) {}

  async findMany(
    req: Request,
    filters: GetSearchEntitiesQueryDto,
  ): Promise<CustomPaginateResponseDataProps<SearchEntityDto[]>> {
    const field = `
      id,  
      name,
      secondary_name AS "secondaryName",
      highlight,
      country,
      city,
      state,
      is_favorite AS "isFavorite"
    `;
    const tables = ['activities', 'properties', 'villas'];

    const availableFilters: (keyof GetSearchEntitiesQueryDto)[] = [
      'name',
      'highlight',
      'country',
      'city',
      'state',
      'isFavorite',
    ];

    // arrays to build dynamic SQL
    const queryParts: string[] = [];
    const countParts: string[] = [];

    // parameter holders
    const filterParams: any[] = []; // only WHERE‑clause params
    let paramIndex = 1; // $1, $2, …

    // pagination
    const limit = filters.limit ?? 10;
    const page = filters.page ?? 1;
    const offset = (page - 1) * limit;

    // build SELECT & COUNT per table
    for (const table of tables) {
      const conditions: string[] = [];

      if (filters.name) {
        conditions.push(`name ILIKE $${paramIndex++}`);
        filterParams.push(`%${filters.name}%`);
      }
      if (filters.highlight) {
        conditions.push(`highlight ILIKE $${paramIndex++}`);
        filterParams.push(`%${filters.highlight}%`);
      }
      if (filters.country) {
        conditions.push(`country ILIKE $${paramIndex++}`);
        filterParams.push(`%${filters.country}%`);
      }
      if (filters.city) {
        conditions.push(`city ILIKE $${paramIndex++}`);
        filterParams.push(`%${filters.city}%`);
      }
      if (filters.state) {
        conditions.push(`state ILIKE $${paramIndex++}`);
        filterParams.push(`%${filters.state}%`);
      }
      if (typeof filters.isFavorite === 'boolean') {
        conditions.push(`is_favorite = $${paramIndex++}`);
        filterParams.push(filters.isFavorite);
      }

      const whereClause =
        conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      queryParts.push(
        `SELECT ${field}, '${table.slice(0, -1)}' AS type FROM ${table} ${whereClause}`,
      );

      countParts.push(`SELECT COUNT(*) FROM ${table} ${whereClause}`);
    }

    // final SQL strings
    const sortByArr = this._parseSortBy(filters.sortBy as any);
    const orderClause = this._buildOrderClause(sortByArr);

    const dataQuery = `
      ${queryParts.join(' UNION ALL ')}
      ${orderClause}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    const countQuery = countParts.join(' UNION ALL ');

    /* build param arrays
      - dataQuery  => WHERE params + limit + offset
      - countQuery => only WHERE params (no pagination)
  */
    const dataParams = [...filterParams, limit, offset];
    const countParams = filterParams; // may be []

    // execute in parallel
    const [rows, countRows] = await Promise.all([
      this.datasource.query(dataQuery, dataParams),
      this.datasource.query(countQuery, countParams),
    ]);

    // aggregate counts
    const totalItems = countRows.reduce(
      (acc, row) => acc + Number(Object.values(row)[0]),
      0,
    );
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    // generate meta & links
    const meta: CustomPaginateResponseMetaProps = {
      itemsPerPage: limit,
      currentPage: page,
      totalItems,
      totalPages,
      sortBy: filters.sortBy,
      searchBy: filters.searchBy,
      search: filters.search,
      select: filters.select,
      filter: this._extractDefinedFilters(filters, availableFilters),
    };

    const links: CustomPaginateResponseLinksProps = {
      current: generalPaginationLink(req, page),
      first: page > 1 ? generalPaginationLink(req, 1) : null,
      previous: page > 1 ? generalPaginationLink(req, page - 1) : null,
      next: page < totalPages ? generalPaginationLink(req, page + 1) : null,
      last: totalPages > 1 ? generalPaginationLink(req, totalPages) : null,
    };

    return { data: rows, meta, links };
  }

  private _extractDefinedFilters<T extends Record<string, any>>(
    input: T,
    fields: (keyof T)[],
  ): Record<string, string> {
    const result: Record<string, string> = {};

    for (const key of fields) {
      const value = input[key];

      if (typeof value === 'string' || typeof value === 'boolean') {
        result[key as string] = String(value);
      }
    }

    return result;
  }

  private _buildOrderClause(sortBy?: [string, string][]): string {
    if (!Array.isArray(sortBy) || !sortBy.length) {
      return 'ORDER BY "isFavorite" DESC, name ASC';
    }

    const clauses: string[] = [];

    for (const [field, directionRaw] of sortBy) {
      const col = this.allowedSortColumns.get(field);
      const direction = directionRaw?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      if (col) {
        clauses.push(`${col} ${direction}`);
      }
    }

    if (!clauses.length) {
      return 'ORDER BY "isFavorite" DESC, name ASC';
    }

    return `ORDER BY "isFavorite" DESC, ${clauses.join(', ')}`;
  }

  private _parseSortBy(
    sortBy?: string | [string, string][],
  ): [string, string][] | undefined {
    if (Array.isArray(sortBy)) return sortBy;
    if (typeof sortBy === 'string') {
      // Support multiple sorts: sortBy=name:DESC,isFavorite:ASC
      return sortBy.split(',').map((part) => {
        const [field, dir] = part.split(':');
        return [field, (dir || 'ASC').toUpperCase()];
      });
    }
    return undefined;
  }
}

/*
async findMany(filters: SearchFilter): Promise<SearchEntityDto[]> {
  const { keyword, isFavorite } = filters;

  const field = `
    id,  
    name,
    secondary_name AS "secondaryName",
    highlight,
    country,
    city,
    state,
    is_favorite AS "isFavorite"
  `;

  // Common search condition across fields
  const searchConditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (keyword) {
    const likeParam = `%${keyword}%`;

    searchConditions.push(`
      (
        name ILIKE $${paramIndex++} OR
        secondary_name ILIKE $${paramIndex++} OR
        highlight ILIKE $${paramIndex++} OR
        country ILIKE $${paramIndex++} OR
        city ILIKE $${paramIndex++} OR
        state ILIKE $${paramIndex++}
      )
    `);

    // Add 6 keyword values
    params.push(likeParam, likeParam, likeParam, likeParam, likeParam, likeParam);
  }

  if (typeof isFavorite === 'boolean') {
    searchConditions.push(`is_favorite = $${paramIndex++}`);
    params.push(isFavorite);
  }

  const whereClause = searchConditions.length > 0 ? `WHERE ${searchConditions.join(' AND ')}` : '';

  const query = `
    SELECT ${field}, 'activity' AS type FROM activities ${whereClause}
    UNION
    SELECT ${field}, 'property' AS type FROM properties ${whereClause}
    UNION
    SELECT ${field}, 'villa' AS type FROM villas ${whereClause}
    ORDER BY 
      "isFavorite" DESC,
      name ASC
    LIMIT 20
  `;

  return this.datasource.query(query, params);
}
*/
