import { HttpStatus } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { DefaultHttpStatus } from 'src/common/enums';
import {
  HttpResponseDefaultProps,
  HttpResponseOptions,
} from 'src/modules/shared/dto';
import { CreateMediaDto } from './create-media.dto';
import { MediaWithRelationsDto } from './media.dto';

export class UpdateMediaDto extends PartialType(CreateMediaDto) {
  @IsString()
  @IsOptional()
  readonly photo?: string | null;

  @IsString()
  @IsOptional()
  readonly video?: string | null;

  @IsString()
  @IsOptional()
  readonly video360?: string | null;

  @IsUUID()
  @IsOptional()
  readonly additionalId?: string | null;
}

export class UpdateBlogSuccessResponse
  extends HttpResponseDefaultProps
  implements HttpResponseOptions<MediaWithRelationsDto>
{
  readonly data: MediaWithRelationsDto;

  constructor(data: MediaWithRelationsDto) {
    super({
      code: HttpStatus.OK,
      message: 'update media success',
      status: DefaultHttpStatus.Success,
    });

    this.data = data;
  }
}
