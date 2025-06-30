import { DefaultHttpStatus } from '@apps/main/common/enums';
import { HttpStatus } from '@nestjs/common';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import {
  CustomPaginateResponseDefaultDataProps,
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginationQueryDto,
} from '../../shared/dto';
import { SearchEntityDto } from './search-entity.dto';

export interface ICustomMeta {
  limit: number;
  page: number;
}

export interface IGetSearchEntitiesQuery {
  name?: string;
  highlight?: string;
  country?: string;
  city?: string;
  state?: string;
  isFavorite?: boolean;
}

export class GetSearchEntitiesQueryDto
  extends PaginationQueryDto
  implements IGetSearchEntitiesQuery
{
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  highlight?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;
}

export class GetSearchEntitiesPaginateDto extends CustomPaginateResponseDefaultDataProps {
  readonly data!: SearchEntityDto[];
}

export class GetSearchEntitiesSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetSearchEntitiesPaginateDto>
{
  readonly data: GetSearchEntitiesPaginateDto;

  constructor(data: GetSearchEntitiesPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'search success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
