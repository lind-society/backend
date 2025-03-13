import { HttpStatus } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  PaginateResponseDefaultDataProps,
} from 'src/modules/shared/dto';
import { FacilityDto } from './facility.dto';

export class GetFacilityParamsDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}

export class GetFacilitiesDto {
  @IsUUID()
  @IsOptional()
  propertyId?: string;

  @IsUUID()
  @IsOptional()
  villaId?: string;
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
