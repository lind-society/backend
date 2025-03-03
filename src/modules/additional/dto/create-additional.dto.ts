import { HttpStatus } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import { AdditionalType } from 'src/database/entities';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreateMediaDto } from '../media/dto/create-media.dto';
import { AdditionalWithRelationsDto } from './additional.dto';

export class CreateAdditionalDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsEnum(AdditionalType)
  @IsNotEmpty()
  readonly type!: AdditionalType;

  @IsString()
  @IsOptional()
  readonly description?: string | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateMediaDto)
  readonly medias?: CreateMediaDto[];
}

export class CreateAdditionalSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<AdditionalWithRelationsDto>
{
  readonly data: AdditionalWithRelationsDto;

  constructor(data: AdditionalWithRelationsDto) {
    super({
      code: HttpStatus.CREATED,
      message: 'create additional success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
