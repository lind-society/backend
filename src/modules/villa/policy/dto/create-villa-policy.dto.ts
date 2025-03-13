import { HttpStatus } from '@nestjs/common';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import { VillaPolicyType } from 'src/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { VillaPolicyWithRelationsDto } from './villa-policy.dto';

export class CreateVillaPolicyDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsEnum(VillaPolicyType)
  @IsNotEmpty()
  readonly type!: VillaPolicyType;

  @IsString()
  @IsOptional()
  readonly description?: string | null;

  @IsString()
  @IsOptional()
  readonly icon?: string | null;
}

export class CreateVillaPolicySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaPolicyWithRelationsDto>
{
  readonly data: VillaPolicyWithRelationsDto;

  constructor(data: VillaPolicyWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create villa policy success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
