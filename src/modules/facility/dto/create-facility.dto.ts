import { HttpStatus } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import { FacilityType } from 'src/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  IconDto,
} from 'src/modules/shared/dto';
import { FacilityDto } from './facility.dto';

export class CreateFacilityDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @ValidateNested()
  @Type(() => IconDto)
  @IsOptional()
  readonly icon?: IconDto | null;

  @IsEnum(FacilityType, {
    message: `facility type must be one of: ${Object.values(FacilityType).join(', ')}`,
  })
  @IsNotEmpty()
  @Transform(({ value }) =>
    value === undefined ? FacilityType.Optional : value,
  )
  readonly type?: FacilityType | null;
}

export class CreateFacilitySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<FacilityDto>
{
  readonly data: FacilityDto;

  constructor(data: FacilityDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create facility success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
