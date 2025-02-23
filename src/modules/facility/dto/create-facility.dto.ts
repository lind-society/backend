import { HttpStatus } from '@nestjs/common';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { FacilityWithRelationsDto } from './facility.dto';

export class CreateFacilityDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsOptional()
  readonly icon?: string | null;

  @IsNumber()
  @IsOptional()
  readonly additionalPrice?: number | null;

  // fill with json
  @IsOptional()
  readonly description?: any | null;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  readonly categoryIds?: string[] | null;
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
