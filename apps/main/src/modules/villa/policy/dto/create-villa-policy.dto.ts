import { DefaultHttpStatus } from '@apps/main/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
  IconDto,
} from '@apps/main/modules/shared/dto';
import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { VillaPolicyWithRelationsDto } from './villa-policy.dto';

export class CreateVillaPolicyDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsUUID()
  @IsNotEmpty()
  readonly typeId!: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @ValidateNested()
  @Type(() => IconDto)
  @IsOptional()
  readonly icon?: IconDto;
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
