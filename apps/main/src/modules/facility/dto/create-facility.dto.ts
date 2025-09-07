import { DefaultHttpStatus } from '@apps/main/common/enums';
import { FacilityType } from '@apps/main/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  IconDto,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FacilityWithRelationsDto } from './facility.dto';

export class CreateFacilityDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @ValidateNested()
  @Type(() => IconDto)
  @IsOptional()
  readonly icon?: IconDto;

  @IsEnum(FacilityType, {
    message: `facility type must be one of: ${Object.values(FacilityType).join(', ')}`,
  })
  @IsNotEmpty()
  @Transform(({ value }) =>
    value === undefined ? FacilityType.Optional : value,
  )
  readonly type?: FacilityType;
}

export class CreateFacilitySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<FacilityWithRelationsDto>
{
  readonly data: FacilityWithRelationsDto;

  constructor(data: FacilityWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create facility success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
