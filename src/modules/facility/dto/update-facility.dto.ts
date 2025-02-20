import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { CreateFacilityDto } from './create-facility.dto';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { DefaultHttpStatus } from 'src/common/enums';
import { FacilityWithRelationsDto } from './facility.dto';

export class UpdateFacilityDto extends PartialType(CreateFacilityDto) {
  @IsString()
  @IsOptional()
  readonly name?: string | null;

  @IsString()
  @IsOptional()
  readonly icon?: string | null;

  @IsNumber()
  @IsOptional()
  readonly additionalPrice?: number | null;

  // fill with json
  @IsOptional()
  readonly description?: any | null;
}

export class UpdateRoleSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<FacilityWithRelationsDto>
{
  readonly data: FacilityWithRelationsDto;

  constructor(data: FacilityWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update facility success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
