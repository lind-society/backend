import { HttpStatus } from '@nestjs/common';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginateQuery } from 'nestjs-paginate';
import { FacilityDto } from './facility.dto';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';

export class GetFacilityParamsDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}

export class GetFacilitiesDto {
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  categoryIds!: string[];
}

export class GetFacilityPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: FacilityDto[];
}

export class GetFacilitiesSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<GetFacilityPaginateDto>
{
  readonly data: GetFacilityPaginateDto;

  constructor(data: GetFacilityPaginateDto) {
    super({
      code: HttpStatus.OK,
      message: 'get facilities success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}

export class GetFacilitySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<FacilityDto>
{
  readonly data: FacilityDto;

  constructor(data: FacilityDto) {
    super({
      code: HttpStatus.OK,
      message: 'get facility success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
