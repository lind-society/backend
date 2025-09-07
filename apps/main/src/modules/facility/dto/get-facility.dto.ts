import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { IsOptional, IsUUID } from 'class-validator';
import { FacilityDto, FacilityPaginationDto } from './facility.dto';

export class GetFacilitiesDto {
  @IsUUID()
  @IsOptional()
  propertyId?: string;

  @IsUUID()
  @IsOptional()
  villaId?: string;
}

export class GetFacilityPaginateDto extends PaginateResponseDefaultDataProps {
  readonly data!: FacilityPaginationDto[];
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
