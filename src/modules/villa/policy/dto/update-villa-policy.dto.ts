import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreateVillaPolicyDto } from './create-villa-policy.dto';
import { VillaPolicyWithRelationsDto } from './villa-policy.dto';

export class UpdateVillaPolicyDto extends PartialType(CreateVillaPolicyDto) {
  @IsString()
  @IsOptional()
  readonly name?: string | null;

  @IsString()
  @IsOptional()
  readonly icon?: string | null;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly list?: string[] | null;
}

export class UpdateVillaPolicySuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<VillaPolicyWithRelationsDto>
{
  readonly data: VillaPolicyWithRelationsDto;

  constructor(data: VillaPolicyWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'update villa policy success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
