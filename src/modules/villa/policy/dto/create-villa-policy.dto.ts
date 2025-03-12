import { HttpStatus } from '@nestjs/common';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { VillaPolicyWithRelationsDto } from './villa-policy.dto';

export class CreateVillaPolicyDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsOptional()
  readonly icon?: string | null;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly list?: string[] | null;
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
