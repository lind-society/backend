import { HttpStatus } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import { FacilityType } from 'src/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { FacilityDto } from './facility.dto';

export class CreateFacilityDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsOptional()
  readonly icon?: string | null;

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
