import { HttpStatus } from '@nestjs/common';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginateQuery } from 'nestjs-paginate';
import { PaginateResponseDefaultDataProps } from 'src/modules/shared/dto/paginated-response.dto';
import { FacilityCategoryDto } from './facility-category.dto';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { DefaultHttpStatus } from 'src/common/enums';
import { Type } from 'class-transformer';

export class FacilityCategoryIdDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}

export interface IGetFacilityCategoryDtoPaginateQuery
  extends Pick<PaginateQuery, 'limit' | 'page' | 'search'> {}

export class GetFacilityCategorysDtoPaginateQuery
  implements IGetFacilityCategoryDtoPaginateQuery
{
  @IsInt()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  readonly limit?: number = 10;

  @IsPositive()
  @IsInt()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  readonly page?: number = 1;

  @IsString()
  @IsOptional()
  readonly search?: string;
}

export class GetFacilityCategoryPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: FacilityCategoryDto[];
}

export class GetFacilityCategoriesSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetFacilityCategoryPaginateDto>
{
  readonly data: GetFacilityCategoryPaginateDto;

  constructor(data: GetFacilityCategoryPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get facility categories success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetFacilityCategorySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<FacilityCategoryDto>
{
  readonly data: FacilityCategoryDto;

  constructor(data: FacilityCategoryDto) {
    super({
      code: HttpStatus.OK,
      message: 'get facility category success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
